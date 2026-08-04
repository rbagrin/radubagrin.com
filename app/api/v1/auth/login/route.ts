import { db } from "@/lib/db";
import { signAccessToken, signRefreshToken, SESSION_COOKIE_NAME } from "@/lib/auth";
import bcrypt from "bcryptjs";

/**
 * POST /api/v1/auth/login
 * Body: { "email": string }
 *
 * PLACEHOLDER AUTH: this only checks that an email was provided and
 * finds-or-creates a matching user — there's no password/OAuth check yet,
 * since this is a personal app with a single owner. Before exposing this
 * publicly, replace the body of this function with real verification
 * (password hash comparison, magic link, or an OAuth provider via Auth.js).
 *
 * Response is shaped the same for both callers:
 *  - Mobile app: store `accessToken` + `refreshToken` itself (Keychain/Keystore),
 *    send `Authorization: Bearer <accessToken>` on future requests.
 *  - Web app: this route also sets an httpOnly `session` cookie, so the
 *    browser doesn't need to manage tokens manually.
 */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const email = body?.email;
  const password = body?.password;

  if (!email || typeof email !== "string") {
    return Response.json({ error: "email is required" }, { status: 400 });
  }
  
  if (!password || typeof password !== "string") {
    return Response.json({ error: "password is required" }, { status: 400 });
  }

  // Verify the password matches the hash stored in the environment variable
  const adminHash = process.env.ADMIN_PASSWORD_HASH;
  if (!adminHash) {
    console.error("ADMIN_PASSWORD_HASH is not set in environment variables");
    return Response.json({ error: "Server configuration error" }, { status: 500 });
  }

  const isPasswordValid = bcrypt.compareSync(password, adminHash);
  if (!isPasswordValid) {
    return Response.json({ error: "Invalid email or password" }, { status: 401 });
  }

  const user = await db.user.upsert({
    where: { email },
    update: {},
    create: { email },
  });

  const payload = { userId: user.id, email: user.email };
  const accessToken = await signAccessToken(payload);
  const refreshToken = await signRefreshToken(payload);

  const response = Response.json({
    user: { id: user.id, email: user.email },
    accessToken,
    refreshToken,
  });

  response.headers.append(
    "Set-Cookie",
    `${SESSION_COOKIE_NAME}=${accessToken}; Path=/; HttpOnly; SameSite=Lax; Max-Age=900${
      process.env.NODE_ENV === "production" ? "; Secure" : ""
    }`
  );

  return response;
}
