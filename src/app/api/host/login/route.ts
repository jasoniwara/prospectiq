import { NextRequest, NextResponse } from "next/server";
import { createHostSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const password = typeof body?.password === "string" ? body.password : "";

  const hostPassword = process.env.HOST_PASSWORD;
  if (!hostPassword) {
    return NextResponse.json({ error: "Host password is not configured." }, { status: 500 });
  }

  if (password !== hostPassword) {
    return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
  }

  await createHostSession();
  return NextResponse.json({ ok: true });
}
