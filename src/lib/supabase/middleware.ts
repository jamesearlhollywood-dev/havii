import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

function isValidSupabaseConfig(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  if (!isValidSupabaseConfig()) {
    return supabaseResponse;
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  const isAuthRoute =
    pathname.startsWith("/auth/login") ||
    pathname.startsWith("/auth/sign-up") ||
    pathname.startsWith("/auth/forgot-password") ||
    pathname.startsWith("/auth/reset-password") ||
    pathname.startsWith("/auth/verify");

  const isPublicRoute =
    pathname === "/" ||
    pathname.startsWith("/help") ||
    pathname.startsWith("/auth/callback") ||
    pathname.startsWith("/verify-certificate") ||
    isAuthRoute;

  const isProtected =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/onboarding") ||
    pathname.startsWith("/course") ||
    pathname.startsWith("/blueprint") ||
    pathname.startsWith("/progress") ||
    pathname.startsWith("/resources") ||
    pathname.startsWith("/certificates") ||
    pathname.startsWith("/profile") ||
    pathname.startsWith("/support") ||
    pathname.startsWith("/instructor") ||
    pathname.startsWith("/org-manager") ||
    pathname.startsWith("/admin");

  if (!user && isProtected) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/auth/login";
    redirectUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  if (user && isAuthRoute) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/dashboard";
    return NextResponse.redirect(redirectUrl);
  }

  if (user && isProtected) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role, onboarding_completed, account_status")
      .eq("user_id", user.id)
      .maybeSingle();

    if (profile) {
      if (
        !profile.onboarding_completed &&
        !pathname.startsWith("/onboarding") &&
        !pathname.startsWith("/help") &&
        !pathname.startsWith("/support")
      ) {
        const redirectUrl = request.nextUrl.clone();
        redirectUrl.pathname = "/onboarding";
        return NextResponse.redirect(redirectUrl);
      }

      if (
        profile.onboarding_completed &&
        pathname.startsWith("/onboarding")
      ) {
        const redirectUrl = request.nextUrl.clone();
        redirectUrl.pathname = "/dashboard";
        return NextResponse.redirect(redirectUrl);
      }

      // Role-based route protection
      if (
        pathname.startsWith("/admin") &&
        profile.role !== "admin"
      ) {
        const redirectUrl = request.nextUrl.clone();
        redirectUrl.pathname = "/forbidden";
        return NextResponse.redirect(redirectUrl);
      }

      if (
        pathname.startsWith("/instructor") &&
        profile.role !== "admin" &&
        profile.role !== "instructor"
      ) {
        const redirectUrl = request.nextUrl.clone();
        redirectUrl.pathname = "/forbidden";
        return NextResponse.redirect(redirectUrl);
      }

      if (
        pathname.startsWith("/org-manager") &&
        profile.role !== "admin" &&
        profile.role !== "org_manager"
      ) {
        const redirectUrl = request.nextUrl.clone();
        redirectUrl.pathname = "/forbidden";
        return NextResponse.redirect(redirectUrl);
      }
    }
  }

  void isPublicRoute;

  return supabaseResponse;
}
