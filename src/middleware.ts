import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, SESSION_MAX_AGE, verifySessionToken } from "@/lib/auth";

export function middleware(req: NextRequest) {
  const res = NextResponse.next();

  const token = req.cookies.get(SESSION_COOKIE)?.value;
  if (token && verifySessionToken(token)) {
    res.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_MAX_AGE,
    });
  }

  return res;
}

export const config = {
  matcher: ["/host/:path*", "/api/host/:path*"],
};
