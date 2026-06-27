import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { normalizeCode } from "@/lib/code";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const code = typeof body?.code === "string" ? normalizeCode(body.code) : "";

  if (!code) {
    return NextResponse.json({ valid: false, message: "Please enter a code." }, { status: 400 });
  }

  const record = await prisma.code.findUnique({ where: { code } });

  if (!record) {
    return NextResponse.json({ valid: false, message: "That code isn't recognized. Double-check it and try again." }, { status: 404 });
  }

  if (record.usedAt) {
    return NextResponse.json({ valid: false, message: "This code has already been used." }, { status: 410 });
  }

  if (record.expiresAt < new Date()) {
    return NextResponse.json({ valid: false, message: "This code has expired. Ask your host for a new one." }, { status: 410 });
  }

  return NextResponse.json({ valid: true, codeId: record.id });
}
