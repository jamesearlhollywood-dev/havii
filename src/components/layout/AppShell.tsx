"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import type { Profile } from "@/lib/types";
import { displayRoleName, dashboardPathForRole } from "@/lib/roles";
import { displayName, initials, cn } from "@/lib/utils";
import { logoutAction } from "@/actions/auth";

const STUDENT_NAV = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/course", label: "My Course" },
  { href: "/blueprint", label: "Financial Blueprint" },
  { href: "/progress", label: "Progress" },
  { href: "/resources", label: "Resources" },
  { href: "/certificates", label: "Certificates" },
  { href: "/profile", label: "Profile" },
  { href: "/support", label: "Support" },
];

const INSTRUCTOR_NAV = [
  { href: "/instructor", label: "Dashboard" },
  { href: "/course", label: "Course" },
  { href: "/resources", label: "Resources" },
  { href: "/profile", label: "Profile" },
  { href: "/support", label: "Support" },
];

const ORG_MANAGER_NAV = [
  { href: "/org-manager", label: "Dashboard" },
  { href: "/course", label: "Course" },
  { href: "/resources", label: "Resources" },
  { href: "/profile", label: "Profile" },
  { href: "/support", label: "Support" },
];

const ADMIN_NAV = [
  { href: "/admin", label: "Dashboard" },
  { href: "/course", label: "Course" },
  { href: "/resources", label: "Resources" },
  { href: "/certificates", label: "Certificates" },
  { href: "/profile", label: "Profile" },
  { href: "/support", label: "Support" },
];

function getNavItems(role: string) {
  switch (role) {
    case "instructor": return INSTRUCTOR_NAV;
    case "org_manager": return ORG_MANAGER_NAV;
    case "admin": return ADMIN_NAV;
    default: return STUDENT_NAV;
  }
}

export function AppShell({
  profile,
  children,
}: {
  profile: Profile;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const name = displayName(profile);
  const navItems = getNavItems(profile.role);

  return (
    <div className="min-h-screen bg-rise-sky text-rise-navy">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-3 focus:py-2"
      >
        Skip to content
      </a>

      {/* Top header */}
      <header className="sticky top-0 z-40 border-b border-rise-border bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
          <div className="flex items-center gap-3">
            {/* Mobile menu button */}
            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="rounded-lg border border-rise-border p-2 text-rise-navy hover:bg-rise-sky lg:hidden"
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                {mobileOpen ? (
                  <path d="M5 5l10 10M15 5L5 15" />
                ) : (
                  <path d="M3 6h14M3 10h14M3 14h14" />
                )}
              </svg>
            </button>

            <Link href={dashboardPathForRole(profile.role)} className="group flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-rise-navy text-sm font-bold text-white">
                R
              </span>
              <div className="flex flex-col leading-none">
                <span className="font-bold tracking-tight text-rise-navy group-hover:text-rise-blue-dark">
                  RISE USA
                </span>
                <span className="text-[10px] font-medium uppercase tracking-wider text-rise-red">
                  Build What Lasts
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
            {navItems.map((item) => {
              const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    active
                      ? "bg-rise-navy text-white"
                      : "text-rise-muted hover:bg-rise-sky hover:text-rise-navy"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* User menu */}
          <div className="flex items-center gap-2">
            <details className="relative">
              <summary className="flex cursor-pointer list-none items-center gap-2 rounded-xl border border-rise-border bg-white px-2.5 py-1.5 text-sm hover:bg-rise-sky">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-rise-navy text-xs font-semibold text-white">
                  {initials(profile)}
                </span>
                <span className="hidden max-w-[8rem] truncate sm:inline">{name}</span>
              </summary>
              <div className="absolute right-0 mt-2 w-56 rounded-xl border border-rise-border bg-white p-2 shadow-lg">
                <p className="px-2 py-1 text-xs text-rise-muted">
                  {displayRoleName(profile.role)}
                </p>
                <Link
                  href="/profile"
                  className="block rounded-lg px-2 py-1.5 text-sm hover:bg-rise-sky"
                >
                  Profile
                </Link>
                <Link
                  href="/support"
                  className="block rounded-lg px-2 py-1.5 text-sm hover:bg-rise-sky"
                >
                  Support
                </Link>
                <form action={logoutAction}>
                  <button
                    type="submit"
                    className="block w-full rounded-lg px-2 py-1.5 text-left text-sm text-rise-red hover:bg-rise-red/5"
                  >
                    Log out
                  </button>
                </form>
              </div>
            </details>
          </div>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <nav className="border-t border-rise-border bg-white px-4 py-3 lg:hidden" aria-label="Mobile">
            <div className="grid gap-1">
              {navItems.map((item) => {
                const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "rounded-lg px-3 py-2.5 text-sm font-medium",
                      active ? "bg-rise-navy text-white" : "text-rise-navy hover:bg-rise-sky"
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </nav>
        )}
      </header>

      {/* Main content */}
      <main id="main" className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-rise-border bg-white">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-2 px-4 py-6 text-sm text-rise-muted sm:flex-row sm:justify-between">
          <p className="flex items-center gap-2">
            <span className="font-semibold text-rise-navy">RISE USA</span>
            <span className="text-rise-red">·</span>
            <span>Build What Lasts</span>
          </p>
          <p>© {new Date().getFullYear()} RISE USA · Roadmap to Income, Savings, and Equity</p>
        </div>
      </footer>
    </div>
  );
}

export function MarketingHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-rise-border bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="group flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-rise-navy text-sm font-bold text-white">
            R
          </span>
          <div className="flex flex-col leading-none">
            <span className="font-bold tracking-tight text-rise-navy group-hover:text-rise-blue-dark">
              RISE USA
            </span>
            <span className="text-[10px] font-medium uppercase tracking-wider text-rise-red">
              Build What Lasts
            </span>
          </div>
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/auth/login" className="text-sm font-medium text-rise-navy hover:text-rise-blue-dark">
            Log in
          </Link>
          <Link
            href="/auth/sign-up"
            className="rounded-lg bg-rise-navy px-4 py-2 text-sm font-semibold text-white hover:bg-rise-navy-light"
          >
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
}
