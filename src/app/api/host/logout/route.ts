import { NextResponse } from "next/server";
import { destroyHostSession } from "@/lib/auth";

export async function POST() {
  await destroyHostSession();
  return NextResponse.json({ ok: true });
}
