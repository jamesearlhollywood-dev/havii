import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Sidebar, MobileNav } from "@/components/career/Sidebar";
import { NotificationBell } from "@/components/career/NotificationBell";

export const dynamic = "force-dynamic";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let userName = "User";
  let user = null;
  try {
    const supabase = await createClient();
    const result = await supabase.auth.getUser();
    user = result.data.user;

    if (!user) redirect("/auth/login?next=/app/dashboard");

    const { data: profile } = await supabase
      .from("profiles")
      .select("preferred_name, first_name, last_name")
      .eq("user_id", user.id)
      .maybeSingle();

    userName =
      profile?.preferred_name ||
      profile?.first_name ||
      user.email?.split("@")[0] ||
      "User";
  } catch {
    redirect("/auth/login?next=/app/dashboard");
  }

  return (
    <div className="min-h-screen bg-career-bg">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-3 focus:py-2"
      >
        Skip to content
      </a>
      <Sidebar userName={userName} />
      <div className="md:pl-64">
        <header className="sticky top-0 z-30 border-b border-career-border bg-white/90 backdrop-blur">
          {/* Mobile brand row */}
          <div className="flex items-center justify-between px-4 py-3 md:hidden">
            <Link href="/app/dashboard" className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-career-blue text-sm font-bold text-white">
                C
              </span>
              <span className="font-semibold text-career-navy">Career AI</span>
            </Link>
            <NotificationBell />
          </div>
          {/* Desktop notification bar */}
          <div className="hidden items-center justify-end px-6 py-2.5 md:flex">
            <NotificationBell />
          </div>
        </header>
        <main
          id="main"
          className="min-h-screen px-4 py-6 pb-20 sm:px-6 md:px-8 md:py-8 md:pb-8"
        >
          {children}
        </main>
      </div>
      <MobileNav />
    </div>
  );
}
