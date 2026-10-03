import { type NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE } from "@/lib/auth";

const AUTH_ROUTES = ["/auth/login", "/auth/sign-up", "/auth/forgot-password", "/auth/reset-password"];
const PROTECTED_PREFIXES = ["/app", "/onboarding", "/caregiver", "/consent/review"];
const PUBLIC_PREFIXES = ["/help"];

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const token = request.cookies.get(SESSION_COOKIE)?.value;

  const isAuthRoute = AUTH_ROUTES.some((r) => pathname.startsWith(r));
  const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));
  const isPublic = pathname === "/" || PUBLIC_PREFIXES.some((p) => pathname.startsWith(p));

  // Logged-in users visiting auth pages → go to app
  if (token && isAuthRoute) {
    return NextResponse.redirect(new URL("/app", request.url));
  }

  // Not logged in visiting protected pages → go to login
  if (!token && isProtected) {
    const url = new URL("/auth/login", request.url);
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  // Avoid unused warning
  void isPublic;
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
