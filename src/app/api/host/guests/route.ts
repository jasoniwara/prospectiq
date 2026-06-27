import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isHostAuthenticated } from "@/lib/auth";
import { computeScores } from "@/lib/scoring";

export async function GET() {
  if (!(await isHostAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const guests = await prisma.guest.findMany({
    include: { answers: true },
    orderBy: { submittedAt: "desc" },
  });

  const list = guests.map((guest) => {
    const result = computeScores(guest.answers);
    return {
      id: guest.id,
      firstName: guest.firstName,
      lastName: guest.lastName,
      submittedAt: guest.submittedAt,
      archetype: result.archetype,
      primary: result.primary,
      isBaseline: guest.isBaseline,
    };
  });

  return NextResponse.json({ guests: list });
}
