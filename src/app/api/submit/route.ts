import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ALL_QUESTIONS } from "@/lib/questions";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const { codeId, firstName, lastName, answers } = body ?? {};

  if (
    typeof codeId !== "string" ||
    typeof firstName !== "string" ||
    typeof lastName !== "string" ||
    !firstName.trim() ||
    !lastName.trim() ||
    !Array.isArray(answers)
  ) {
    return NextResponse.json({ error: "Missing or invalid fields." }, { status: 400 });
  }

  const code = await prisma.code.findUnique({ where: { id: codeId } });
  if (!code) {
    return NextResponse.json({ error: "Invalid code." }, { status: 404 });
  }
  if (code.usedAt) {
    return NextResponse.json({ error: "This code has already been used." }, { status: 410 });
  }
  if (code.expiresAt < new Date()) {
    return NextResponse.json({ error: "This code has expired." }, { status: 410 });
  }

  if (answers.length !== ALL_QUESTIONS.length) {
    return NextResponse.json({ error: "All questions must be answered." }, { status: 400 });
  }

  const questionMap = new Map(ALL_QUESTIONS.map((q) => [q.id, q]));

  const answerRows = answers.map((a: { questionId: string; value: number }) => {
    const question = questionMap.get(a.questionId);
    if (!question) throw new Error("Unknown question");
    const value = Math.round(Number(a.value));
    if (!Number.isFinite(value) || value < 1 || value > 10) throw new Error("Invalid value");
    return {
      questionId: question.id,
      category: question.category,
      subcategory: question.subcategory,
      value,
    };
  });

  try {
    await prisma.$transaction([
      prisma.guest.create({
        data: {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          codeId: code.id,
          answers: { create: answerRows },
        },
      }),
      prisma.code.update({ where: { id: code.id }, data: { usedAt: new Date() } }),
    ]);
  } catch {
    return NextResponse.json({ error: "Could not save your responses." }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
