import Link from "next/link";
import type { Profile } from "@/lib/types";
import { displayRoleName } from "@/lib/roles";
import { STAFF_ROLES } from "@/lib/types";
import { displayName } from "@/lib/utils";
import { logoutAction } from "@/actions/auth";
import { Button } from "@/components/ui/Button";
import { BottomNav } from "@/components/layout/BottomNav";

const isStaff = (role: string) => (STAFF_ROLES as string[]).includes(role);

export function AppShell({
  profile,
  children,
}: {
  profile: Profile;
  children: React.ReactNode;
}) {
  const name = displayName(profile);
  const staff = isStaff(profile.role);

  return (
    <div className="min-h-screen bg-havii-cream text-havii-ink">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-3 focus:py-2"
      >
        Skip to content
      </a>

      <header className="sticky top-0 z-40 border-b border-havii-mist/80 bg-white/90 backdrop-blur">
        <div className={`mx-auto flex items-center justify-between gap-4 px-4 py-3 ${staff ? "max-w-6xl" : "max-w-md"}`}>
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="group flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-havii-teal text-sm font-bold text-white">
                H
              </span>
              <span className="font-semibold tracking-tight text-havii-ink group-hover:text-havii-teal">
                HAVII
              </span>
            </Link>
            {staff && (
              <nav className="hidden items-center gap-4 text-sm md:flex" aria-label="Primary">
                <Link className="text-havii-muted hover:text-havii-teal rounded" href="/dashboard">
                  Dashboard
                </Link>
                <Link className="text-havii-muted hover:text-havii-teal rounded" href="/dashboard/staff">
                  Staff
                </Link>
                <Link className="text-havii-muted hover:text-havii-teal rounded" href="/dashboard/admin">
                  Admin
                </Link>
              </nav>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/help"
              className="rounded-full bg-havii-coral/10 px-3 py-1.5 text-xs font-semibold text-havii-coral-dark hover:bg-havii-coral/20"
            >
              Get Help
            </Link>
            <details className="relative">
              <summary className="flex cursor-pointer list-none items-center gap-2 rounded-xl border border-havii-mist bg-white px-2.5 py-1.5 text-sm hover:bg-havii-sand">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-havii-teal/15 text-xs font-semibold text-havii-teal-dark">
                  {name.slice(0, 1).toUpperCase()}
                </span>
                <span className={`max-w-[8rem] truncate ${staff ? "hidden sm:inline" : "hidden"}`}>{name}</span>
              </summary>
              <div className="absolute right-0 mt-2 w-56 rounded-xl border border-havii-mist bg-white p-2 shadow-lg">
                <p className="px-2 py-1 text-xs text-havii-muted">
                  {displayRoleName(profile.role)}
                </p>
                <Link
                  href="/dashboard"
                  className="block rounded-lg px-2 py-2 text-sm hover:bg-havii-sand"
                >
                  Dashboard
                </Link>
                <Link
                  href="/help"
                  className="block rounded-lg px-2 py-2 text-sm hover:bg-havii-sand"
                >
                  Get Help
                </Link>
                <form action={logoutAction}>
                  <button
                    type="submit"
                    className="w-full rounded-lg px-2 py-2 text-left text-sm text-red-700 hover:bg-red-50"
                  >
                    Log out
                  </button>
                </form>
              </div>
            </details>
          </div>
        </div>
      </header>

      <main id="main" className={`mx-auto w-full flex-1 px-4 py-6 ${staff ? "max-w-6xl" : "max-w-md"} pb-24 md:pb-8`}>
        {children}
      </main>

      {!staff && <BottomNav role={profile.role} />}

      <footer className={`border-t border-havii-mist bg-white ${staff ? "" : "hidden md:block"}`}>
        <div className={`mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 text-sm text-havii-muted sm:flex-row sm:items-center sm:justify-between`}>
          <p>
            HAVII by{" "}
            <span className="font-medium text-havii-ink">Together For You, Inc.</span>
          </p>
          <div className="flex gap-4">
            <Link href="/help" className="hover:text-havii-teal">
              Help &amp; safety
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

export function MarketingHeader() {
  return (
    <header className="border-b border-havii-mist/70 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-md items-center justify-between px-4 py-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-havii-teal text-sm font-bold text-white">
            H
          </span>
          <div>
            <p className="font-semibold leading-tight text-havii-ink">HAVII</p>
            <p className="text-[11px] text-havii-muted">by Together For You</p>
          </div>
        </Link>
        <div className="flex items-center gap-2">
          <Link href="/help">
            <Button variant="ghost" size="sm">
              Get Help
            </Button>
          </Link>
          <Link href="/auth/login">
            <Button variant="outline" size="sm">
              Log in
            </Button>
          </Link>
          <Link href="/auth/sign-up" className="hidden sm:inline-flex">
            <Button size="sm">Join</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
