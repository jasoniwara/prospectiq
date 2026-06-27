import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isHostAuthenticated } from "@/lib/auth";
import { generateGuestCode } from "@/lib/code";

export async function GET() {
  if (!(await isHostAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const codes = await prisma.code.findMany({
    where: { usedAt: null, expiresAt: { gt: new Date() } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({
    codes: codes.map((c) => ({
      code: c.code,
      createdAt: c.createdAt,
      expiresAt: c.expiresAt,
    })),
  });
}

export async function POST() {
  if (!(await isHostAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

  let attempts = 0;
  while (attempts < 10) {
    const code = generateGuestCode();
    try {
      const record = await prisma.code.create({ data: { code, expiresAt } });
      return NextResponse.json({ code: record.code, expiresAt: record.expiresAt });
    } catch {
      attempts += 1;
    }
  }

  return NextResponse.json({ error: "Could not generate a unique code, please try again." }, { status: 500 });
}
