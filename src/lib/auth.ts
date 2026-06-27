import crypto from "crypto";
import { cookies } from "next/headers";

const SESSION_COOKIE = "prospectiq_host_session";
const SESSION_VALUE = "host-authenticated";

function sign(value: string): string {
  const secret = process.env.SESSION_SECRET || "fallback-secret";
  const hmac = crypto.createHmac("sha256", secret).update(value).digest("hex");
  return `${value}.${hmac}`;
}

function verify(token: string): boolean {
  const secret = process.env.SESSION_SECRET || "fallback-secret";
  const [value, hmac] = token.split(".");
  if (!value || !hmac) return false;
  const expected = crypto.createHmac("sha256", secret).update(value).digest("hex");
  if (expected.length !== hmac.length) return false;
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(hmac)) && value === SESSION_VALUE;
}

export async function createHostSession() {
  const token = sign(SESSION_VALUE);
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function destroyHostSession() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

export async function isHostAuthenticated(): Promise<boolean> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return false;
  return verify(token);
}
