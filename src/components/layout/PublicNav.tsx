import Link from "next/link";
import { Waveform } from "@/components/visual/Waveform";

export const PUBLIC_NAV = [
  { label: "Home", href: "/" },
  { label: "Shows", href: "/shows" },
  { label: "Episodes", href: "/episodes" },
  { label: "Guests", href: "/guests" },
  { label: "About", href: "/about" },
  { label: "Partner With Us", href: "/partner" },
  { label: "Contact", href: "/contact" },
] as const;

export function PublicHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-studio-line/80 bg-studio-black/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3.5">
        <Link href="/" className="group flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-studio-gold/40 bg-studio-charcoal font-mono text-sm font-bold text-studio-gold">
            GH3
          </span>
          <span className="hidden flex-col leading-tight sm:flex">
            <span className="text-sm font-semibold tracking-tight text-studio-ink">
              James Hollywood III
            </span>
            <span className="text-[10px] uppercase tracking-[0.22em] text-studio-muted">
              Studios
            </span>
          </span>
        </Link>

        <nav
          className="hidden items-center gap-1 lg:flex"
          aria-label="Primary"
        >
          {PUBLIC_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2 text-sm text-studio-muted transition hover:bg-studio-charcoal hover:text-studio-ink"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/auth/login"
            className="hidden rounded-lg border border-studio-line px-3 py-2 text-sm text-studio-ink transition hover:border-studio-gold/50 hover:text-studio-gold sm:inline-flex"
          >
            Admin
          </Link>
          <details className="relative lg:hidden">
            <summary className="flex cursor-pointer list-none items-center justify-center rounded-lg border border-studio-line p-2 text-studio-ink hover:border-studio-gold/50">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
              </svg>
            </summary>
            <div className="absolute right-0 mt-2 w-56 rounded-xl border border-studio-line bg-studio-charcoal p-2 shadow-xl">
              {PUBLIC_NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block rounded-lg px-3 py-2.5 text-sm text-studio-muted hover:bg-studio-surface hover:text-studio-ink"
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/auth/login"
                className="block rounded-lg px-3 py-2.5 text-sm text-studio-gold hover:bg-studio-surface"
              >
                Admin Login
              </Link>
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}

export function PublicFooter() {
  return (
    <footer className="border-t border-studio-line bg-studio-black">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <Waveform bars={64} className="mb-8 h-10 w-full opacity-30" />
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-xs">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-studio-gold/40 bg-studio-charcoal font-mono text-sm font-bold text-studio-gold">
                GH3
              </span>
              <div className="leading-tight">
                <p className="text-sm font-semibold text-studio-ink">
                  James Hollywood III Studios
                </p>
                <p className="text-[10px] uppercase tracking-[0.2em] text-studio-muted">
                  Podcast Network
                </p>
              </div>
            </div>
            <p className="mt-4 text-sm text-studio-muted">
              A premium podcast network and content studio. Home of the Grace
              Beyond Podcast Show.
            </p>
          </div>
          <nav className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm sm:grid-cols-3" aria-label="Footer">
            {PUBLIC_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-studio-muted transition hover:text-studio-gold"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="mt-8 border-t border-studio-line pt-6 text-xs text-studio-muted">
          © {new Date().getFullYear()} James Hollywood III Studios. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

/**
 * Shared layout wrapper for public interior pages.
 */
export function PublicPage({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-studio-black">
      <PublicHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-12 sm:py-16">
        {children}
      </main>
      <PublicFooter />
    </div>
  );
}
