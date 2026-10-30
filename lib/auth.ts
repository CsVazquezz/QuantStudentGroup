import type { NextRequest } from "next/server";

export const ADMIN_COOKIE = "admin_token";

// SHA-256 of ADMIN_PASSWORD, so the cookie never holds the password itself.
// Web Crypto keeps this usable from both middleware (edge) and route handlers.
export async function adminToken(): Promise<string | null> {
  const pw = process.env.ADMIN_PASSWORD;
  if (!pw) return null;
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(pw));
  return Array.from(new Uint8Array(digest), b => b.toString(16).padStart(2, "0")).join("");
}

export async function isAdmin(req: NextRequest): Promise<boolean> {
  const token = req.cookies.get(ADMIN_COOKIE)?.value;
  const expected = await adminToken();
  return !!token && !!expected && token === expected;
}
