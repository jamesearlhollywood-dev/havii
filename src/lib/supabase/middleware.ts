import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Pass through when Supabase isn't configured with a valid URL — public
  // routes still render; protected routes handle auth at the layout level.
  if (!url || !anonKey || !/^https?:\/\//.test(url)) {
    return supabaseResponse;
  }

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
    pathname.startsWith("/shows") ||
    pathname.startsWith("/episodes") ||
    pathname.startsWith("/guests") ||
    pathname.startsWith("/about") ||
    pathname.startsWith("/partner") ||
    pathname.startsWith("/contact") ||
    pathname.startsWith("/help") ||
    pathname.startsWith("/auth/callback") ||
    isAuthRoute;

  const isProtected =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/onboarding") ||
    pathname.startsWith("/coming-next") ||
    pathname.startsWith("/app");

  if (!user && isProtected) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/auth/login";
    redirectUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  if (user && isAuthRoute) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/admin";
    return NextResponse.redirect(redirectUrl);
  }

  if (user && isProtected) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role, onboarding_completed, account_status")
      .eq("user_id", user.id)
      .maybeSingle();

    if (profile) {
      // Onboarding redirect applies to public-signup roles only;
      // staff/admin go straight to the studio dashboard.
      if (
        !profile.onboarding_completed &&
        profile.role !== "staff" &&
        profile.role !== "administrator" &&
        !pathname.startsWith("/onboarding") &&
        !pathname.startsWith("/help")
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

      if (
        pathname.startsWith("/admin") &&
        profile.role !== "staff" &&
        profile.role !== "administrator"
      ) {
        const redirectUrl = request.nextUrl.clone();
        redirectUrl.pathname = "/forbidden";
        return NextResponse.redirect(redirectUrl);
      }

      if (
        pathname.startsWith("/dashboard/admin") &&
        profile.role !== "administrator"
      ) {
        const redirectUrl = request.nextUrl.clone();
        redirectUrl.pathname = "/forbidden";
        return NextResponse.redirect(redirectUrl);
      }

      if (
        pathname.startsWith("/dashboard/staff") &&
        profile.role !== "staff" &&
        profile.role !== "administrator"
      ) {
        const redirectUrl = request.nextUrl.clone();
        redirectUrl.pathname = "/forbidden";
        return NextResponse.redirect(redirectUrl);
      }
    }
  }

  // Silence unused for future public-route branching
  void isPublicRoute;

  return supabaseResponse;
}
