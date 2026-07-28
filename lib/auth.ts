import { SignJWT, jwtVerify } from "jose";

const secret = () => new TextEncoder().encode(process.env.AUTH_SECRET);

const ACCESS_TOKEN_TTL = "15m";
const REFRESH_TOKEN_TTL = "30d";
const SESSION_COOKIE_NAME = "session";

export type AuthPayload = {
  userId: string;
  email: string;
};

// --- Token issuance -------------------------------------------------------
// Used by /api/v1/auth/login and /api/v1/auth/refresh. The mobile app stores
// these tokens itself (e.g. Keychain/Keystore); the web app can store the
// access token in the `session` cookie instead (see setSessionCookie below).

export async function signAccessToken(payload: AuthPayload) {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(ACCESS_TOKEN_TTL)
    .sign(secret());
}

export async function signRefreshToken(payload: AuthPayload) {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(REFRESH_TOKEN_TTL)
    .sign(secret());
}

// --- Verification -----------------------------------------------------------
// One function, two callers: the web app (cookie) and the mobile app
// (Authorization: Bearer <token> header) both end up calling this.

export async function verifyToken(token: string): Promise<AuthPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret());
    return { userId: payload.userId as string, email: payload.email as string };
  } catch {
    return null;
  }
}

/**
 * Authenticates an incoming Route Handler request from either client type:
 *  - Mobile / third-party clients: `Authorization: Bearer <accessToken>`
 *  - Web app: the httpOnly `session` cookie set at login
 */
export async function authenticate(request: Request): Promise<AuthPayload | null> {
  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return verifyToken(authHeader.slice("Bearer ".length));
  }

  const cookieHeader = request.headers.get("cookie");
  const sessionToken = parseCookie(cookieHeader, SESSION_COOKIE_NAME);
  if (sessionToken) {
    return verifyToken(sessionToken);
  }

  return null;
}

function parseCookie(cookieHeader: string | null, name: string): string | null {
  if (!cookieHeader) return null;
  const match = cookieHeader
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.slice(name.length + 1)) : null;
}

export { SESSION_COOKIE_NAME };
