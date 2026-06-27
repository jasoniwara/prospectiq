import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const baseline = await prisma.guest.findFirst({
    where: { isBaseline: true },
    include: { answers: true },
  });

  if (!baseline) {
    return NextResponse.json({ baseline: null });
  }

  return NextResponse.json({
    baseline: {
      firstName: baseline.firstName,
      answers: baseline.answers.map((a) => ({ questionId: a.questionId, value: a.value })),
    },
  });
}
