"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { UserRole } from "@/lib/types";

type NavItem = {
  label: string;
  href: string;
  icon: (active: boolean) => React.ReactNode;
};

function isActive(pathname: string, href: string): boolean {
  if (href === "/dashboard") return pathname === "/dashboard";
  return pathname.startsWith(href);
}

function HomeIcon(active: boolean) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M3 10.5 12 3l9 7.5M5 9.5V20a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V9.5"
        stroke="currentColor" strokeWidth={active ? 2.2 : 1.8} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function GroupIcon(active: boolean) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M17 20v-1a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v1M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM23 20v-1a4 4 0 0 0-3-3.87M16 3.13A4 4 0 0 1 16 11"
        stroke="currentColor" strokeWidth={active ? 2.2 : 1.8} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function JournalIcon(active: boolean) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5v14ZM4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5"
        stroke="currentColor" strokeWidth={active ? 2.2 : 1.8} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 7h8M8 11h6" stroke="currentColor" strokeWidth={active ? 2.2 : 1.8} strokeLinecap="round" />
    </svg>
  );
}
function GoalsIcon(active: boolean) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth={active ? 2.2 : 1.8} />
      <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth={active ? 2.2 : 1.8} />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
    </svg>
  );
}
function SupportIcon(active: boolean) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M12 21s-7-4.5-9.5-9C1 9 2.5 5.5 6 5.5c2 0 3.5 1.5 4 2.5l1 1.5 1-1.5c.5-1 2-2.5 4-2.5 3.5 0 5 3.5 3.5 6.5C19 16.5 12 21 12 21Z"
        stroke="currentColor" strokeWidth={active ? 2.2 : 1.8} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const youthNav: NavItem[] = [
  { label: "Home", href: "/dashboard", icon: HomeIcon },
  { label: "My Group", href: "/dashboard/group", icon: GroupIcon },
  { label: "Journal", href: "/dashboard/journal", icon: JournalIcon },
  { label: "Goals", href: "/dashboard/goals", icon: GoalsIcon },
  { label: "Support", href: "/help", icon: SupportIcon },
];

const simplifiedNav: NavItem[] = [
  { label: "Home", href: "/dashboard", icon: HomeIcon },
  { label: "Support", href: "/help", icon: SupportIcon },
];

export function BottomNav({ role }: { role: UserRole }) {
  const pathname = usePathname();
  const items = role === "youth" ? youthNav : simplifiedNav;

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 border-t border-havii-mist bg-white/95 backdrop-blur-md md:hidden"
      aria-label="Primary"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div className="mx-auto flex max-w-md items-stretch justify-around px-1">
        {items.map((item) => {
          const active = isActive(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`flex flex-1 flex-col items-center gap-0.5 px-1 py-2 transition-colors ${
                active ? "text-havii-teal" : "text-havii-muted hover:text-havii-ink"
              }`}
            >
              {item.icon(active)}
              <span className={`text-[11px] leading-tight ${active ? "font-semibold" : "font-medium"}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
