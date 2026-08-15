import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { authenticate } from "@/lib/auth";

// Routes that do not require authentication
const PUBLIC_PATHS = [
  "/",
  "/login",
  "/api/v1/auth/login",
  "/sitemap.xml",
  "/robots.txt",
];

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // 1. If it's a public path, allow it immediately
  if (PUBLIC_PATHS.includes(pathname)) {
    return NextResponse.next();
  }

  // 2. Otherwise, check authentication
  const user = await authenticate(request);

  if (!user) {

    // 3. Unauthorized access handling
    // If it's an API route, return 401 JSON
    if (pathname.startsWith("/api")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // If it's a web route, redirect to login page
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  // User is authenticated, proceed
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * We purposefully DO match `/api` now so we can protect API routes
     * globally, except for the login API (handled via PUBLIC_PATHS).
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
