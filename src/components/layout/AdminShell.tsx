"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAction } from "@/actions/auth";
import { Waveform } from "@/components/visual/Waveform";

export const ADMIN_NAV = [
  { label: "Dashboard", href: "/admin", icon: "grid" },
  { label: "Shows", href: "/admin/shows", icon: "mic" },
  { label: "Episodes", href: "/admin/episodes", icon: "play" },
  { label: "Guests", href: "/admin/guests", icon: "users" },
  { label: "Production", href: "/admin/production", icon: "sliders" },
  { label: "Schedule", href: "/admin/schedule", icon: "calendar" },
  { label: "Sponsors", href: "/admin/sponsors", icon: "briefcase" },
  { label: "Messages", href: "/admin/messages", icon: "mail" },
  { label: "Analytics", href: "/admin/analytics", icon: "chart" },
  { label: "Settings", href: "/admin/settings", icon: "cog" },
] as const;

function NavIcon({ name }: { name: string }) {
  const common = {
    width: 18,
    height: 18,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.75,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
  switch (name) {
    case "grid":
      return (
        <svg {...common}>
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
      );
    case "mic":
      return (
        <svg {...common}>
          <rect x="9" y="2" width="6" height="12" rx="3" />
          <path d="M5 10a7 7 0 0 0 14 0M12 17v5" />
        </svg>
      );
    case "play":
      return (
        <svg {...common}>
          <polygon points="6 4 20 12 6 20 6 4" />
        </svg>
      );
    case "users":
      return (
        <svg {...common}>
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      );
    case "sliders":
      return (
        <svg {...common}>
          <path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6" />
        </svg>
      );
    case "calendar":
      return (
        <svg {...common}>
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <path d="M16 2v4M8 2v4M3 10h18" />
        </svg>
      );
    case "briefcase":
      return (
        <svg {...common}>
          <rect x="2" y="7" width="20" height="14" rx="2" />
          <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
        </svg>
      );
    case "mail":
      return (
        <svg {...common}>
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <path d="m2 7 10 6 10-6" />
        </svg>
      );
    case "chart":
      return (
        <svg {...common}>
          <path d="M3 3v18h18M7 16l4-4 3 3 5-6" />
        </svg>
      );
    case "cog":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      );
    default:
      return null;
  }
}

export function AdminShell({
  name,
  role,
  children,
}: {
  name: string;
  role: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-studio-black text-studio-ink">
      <a
        href="#admin-main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-studio-charcoal focus:px-3 focus:py-2 focus:text-studio-gold"
      >
        Skip to content
      </a>

      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 flex-col border-r border-studio-line bg-studio-charcoal lg:flex">
        <div className="flex items-center gap-3 border-b border-studio-line px-5 py-4">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-studio-gold/40 bg-studio-surface font-mono text-sm font-bold text-studio-gold">
            GH3
          </span>
          <div className="leading-tight">
            <p className="text-sm font-semibold text-studio-ink">Studios</p>
            <p className="text-[10px] uppercase tracking-[0.2em] text-studio-muted">
              Admin
            </p>
          </div>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto p-3" aria-label="Admin">
          {ADMIN_NAV.map((item) => (
            <AdminNavLink key={item.href} item={item} />
          ))}
        </nav>
        <div className="border-t border-studio-line p-3">
          <div className="mb-2 px-2 text-xs text-studio-muted">
            Signed in as <span className="text-studio-ink">{name}</span>
          </div>
          <Link
            href="/"
            className="block rounded-lg px-3 py-2 text-sm text-studio-muted hover:bg-studio-surface hover:text-studio-ink"
          >
            View public site
          </Link>
          <form action={logoutAction}>
            <button
              type="submit"
              className="w-full rounded-lg px-3 py-2 text-left text-sm text-studio-muted hover:bg-studio-surface hover:text-studio-ink"
            >
              Log out
            </button>
          </form>
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-studio-line bg-studio-charcoal px-4 py-3 lg:hidden">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-studio-gold/40 bg-studio-surface font-mono text-xs font-bold text-studio-gold">
            GH3
          </span>
          <span className="text-sm font-semibold">Studios Admin</span>
        </div>
        <details className="relative">
          <summary className="flex cursor-pointer list-none items-center justify-center rounded-lg border border-studio-line p-2 text-studio-ink">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
            </svg>
          </summary>
          <div className="absolute right-0 mt-2 w-60 rounded-xl border border-studio-line bg-studio-surface p-2 shadow-xl">
            {ADMIN_NAV.map((item) => (
              <AdminNavLink key={item.href} item={item} mobile />
            ))}
            <div className="my-1 border-t border-studio-line" />
            <Link
              href="/"
              className="block rounded-lg px-3 py-2.5 text-sm text-studio-muted hover:bg-studio-charcoal"
            >
              View public site
            </Link>
            <form action={logoutAction}>
              <button
                type="submit"
                className="w-full rounded-lg px-3 py-2.5 text-left text-sm text-studio-muted hover:bg-studio-charcoal"
              >
                Log out
              </button>
            </form>
          </div>
        </details>
      </header>

      <main
        id="admin-main"
        className="lg:pl-60"
      >
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
          {children}
        </div>
      </main>

      <div className="lg:pl-60">
        <div className="mx-auto max-w-6xl px-4 pb-8 sm:px-6 lg:px-10">
          <Waveform bars={80} className="h-6 w-full opacity-20" />
        </div>
      </div>
    </div>
  );
}

function AdminNavLink({
  item,
  mobile = false,
}: {
  item: { label: string; href: string; icon: string };
  mobile?: boolean;
}) {
  const pathname = usePathname();
  const active =
    item.href === "/admin"
      ? pathname === "/admin"
      : pathname.startsWith(item.href);

  return (
    <Link
      href={item.href}
      className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
        active
          ? "bg-studio-gold/10 text-studio-gold"
          : "text-studio-muted hover:bg-studio-surface hover:text-studio-ink"
      } ${mobile ? "block" : ""}`}
    >
      <NavIcon name={item.icon} />
      {item.label}
    </Link>
  );
}
