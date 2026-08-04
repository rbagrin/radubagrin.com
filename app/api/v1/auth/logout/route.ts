import { NextResponse } from "next/server";
import { SESSION_COOKIE_NAME } from "@/lib/auth";

/**
 * POST /api/v1/auth/logout
 * Clears the session cookie to log the user out.
 */
export async function POST(request: Request) {
  const response = NextResponse.json({ success: true });
  
  // Clear the cookie by setting max-age to 0
  response.headers.append(
    "Set-Cookie",
    `${SESSION_COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${
      process.env.NODE_ENV === "production" ? "; Secure" : ""
    }`
  );
  
  return response;
}
