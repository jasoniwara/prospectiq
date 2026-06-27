import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isHostAuthenticated } from "@/lib/auth";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  if (!(await isHostAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { code } = await params;

  const record = await prisma.code.findUnique({ where: { code } });
  if (!record) {
    return NextResponse.json({ error: "Code not found" }, { status: 404 });
  }
  if (record.usedAt) {
    return NextResponse.json({ error: "Can't delete a code that's already been used." }, { status: 400 });
  }

  await prisma.code.delete({ where: { code } });

  return NextResponse.json({ ok: true });
}
