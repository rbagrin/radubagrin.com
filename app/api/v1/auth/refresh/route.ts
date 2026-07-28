import { signAccessToken, verifyToken } from "@/lib/auth";

/**
 * POST /api/v1/auth/refresh
 * Body: { "refreshToken": string }
 *
 * Exchanges a valid (non-expired) refresh token for a new short-lived
 * access token. The mobile app calls this when it gets a 401 on a normal
 * request; the web app can call it silently before the session cookie expires.
 */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const refreshToken = body?.refreshToken;

  if (!refreshToken || typeof refreshToken !== "string") {
    return Response.json({ error: "refreshToken is required" }, { status: 400 });
  }

  const payload = await verifyToken(refreshToken);
  if (!payload) {
    return Response.json({ error: "invalid or expired refresh token" }, { status: 401 });
  }

  const accessToken = await signAccessToken(payload);
  return Response.json({ accessToken });
}
