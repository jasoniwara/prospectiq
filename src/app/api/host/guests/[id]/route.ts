import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isHostAuthenticated } from "@/lib/auth";
import { computeScores } from "@/lib/scoring";
import { CATEGORIES, SUBCATEGORIES } from "@/lib/questions";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isHostAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const guest = await prisma.guest.findUnique({
    where: { id },
    include: { answers: true },
  });

  if (!guest) {
    return NextResponse.json({ error: "Guest not found" }, { status: 404 });
  }

  const result = computeScores(guest.answers);

  const otherGuests = await prisma.guest.findMany({
    where: { id: { not: id } },
    include: { answers: true },
  });

  const categoryAverages: Record<string, number | null> = {};
  const subcategoryAverages: Record<string, number | null> = {};

  for (const category of CATEGORIES) {
    if (otherGuests.length === 0) {
      categoryAverages[category] = null;
    } else {
      const scores = otherGuests.map((g) => computeScores(g.answers).categories.find((c) => c.category === category)!.score);
      categoryAverages[category] = Math.round((scores.reduce((s, v) => s + v, 0) / scores.length) * 10) / 10;
    }

    for (const sub of SUBCATEGORIES[category]) {
      const values = otherGuests
        .map((g) => g.answers.find((a) => a.category === category && a.subcategory === sub)?.value)
        .filter((v): v is number => typeof v === "number");
      subcategoryAverages[sub] = values.length
        ? Math.round((values.reduce((s, v) => s + v, 0) / values.length) * 10) / 10
        : null;
    }
  }

  return NextResponse.json({
    guest: {
      id: guest.id,
      firstName: guest.firstName,
      lastName: guest.lastName,
      submittedAt: guest.submittedAt,
      answers: guest.answers.map((a) => ({
        questionId: a.questionId,
        category: a.category,
        subcategory: a.subcategory,
        value: a.value,
      })),
    },
    result,
    averages: {
      categories: categoryAverages,
      subcategories: subcategoryAverages,
    },
    sampleSize: otherGuests.length,
  });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isHostAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const guest = await prisma.guest.findUnique({ where: { id } });
  if (!guest) {
    return NextResponse.json({ error: "Guest not found" }, { status: 404 });
  }

  await prisma.$transaction([
    prisma.answer.deleteMany({ where: { guestId: id } }),
    prisma.guest.delete({ where: { id } }),
    prisma.code.delete({ where: { id: guest.codeId } }),
  ]);

  return NextResponse.json({ ok: true });
}
