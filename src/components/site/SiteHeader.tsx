"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Programs", href: "/programs" },
  { label: "Impact", href: "/impact" },
  { label: "Research & Publications", href: "/research" },
  { label: "Get Involved", href: "/get-involved" },
  { label: "Contact", href: "/contact" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-tfy-parchment/95 backdrop-blur-sm shadow-[0_1px_0_0_rgba(15,23,42,0.08)]"
          : "bg-tfy-parchment"
      }`}
    >
      <div
        className={`mx-auto flex max-w-[1400px] items-center justify-between px-5 transition-all duration-300 sm:px-8 ${
          scrolled ? "py-3" : "py-5"
        }`}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3" aria-label="Together For You, Inc. — Home">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-tfy-navy text-sm font-semibold tracking-tight text-tfy-parchment">
            TFY
          </span>
          <span className="hidden flex-col leading-none sm:flex">
            <span className="font-display text-lg text-tfy-navy">Together For You</span>
            <span className="meta-label text-[0.625rem] text-tfy-muted">Inc. · Maryland</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                data-active={active}
                className={`nav-underline text-[0.9375rem] font-medium transition-colors ${
                  active ? "text-tfy-navy" : "text-tfy-muted hover:text-tfy-navy"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Donate CTA + mobile toggle */}
        <div className="flex items-center gap-3">
          <Link
            href="/donate"
            className="hidden rounded-full bg-tfy-gold px-6 py-2.5 text-sm font-semibold text-tfy-navy transition-all hover:bg-tfy-gold-dark hover:text-white sm:inline-flex"
          >
            Donate
          </Link>

          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-tfy-line bg-tfy-parchment/60 text-tfy-navy lg:hidden"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            <span className="relative block h-4 w-5">
              <span
                className={`absolute left-0 block h-0.5 w-5 bg-current transition-all duration-300 ${
                  menuOpen ? "top-1.5 rotate-45" : "top-0"
                }`}
              />
              <span
                className={`absolute left-0 top-1.5 block h-0.5 w-5 bg-current transition-all duration-300 ${
                  menuOpen ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`absolute left-0 block h-0.5 w-5 bg-current transition-all duration-300 ${
                  menuOpen ? "top-1.5 -rotate-45" : "top-3"
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      {/* Mobile menu overlay */}
      <div
        className={`fixed inset-0 top-0 z-40 bg-tfy-navy/95 backdrop-blur-sm transition-all duration-300 lg:hidden ${
          menuOpen ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        <nav
          className="flex h-full flex-col items-center justify-center gap-2 px-6"
          aria-label="Mobile"
        >
          {NAV_ITEMS.map((item, i) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`font-display text-3xl transition-colors ${
                  active ? "text-tfy-gold" : "text-tfy-parchment hover:text-tfy-gold"
                } ${menuOpen ? "reveal" : ""}`}
                style={{ animationDelay: `${0.05 + i * 0.05}s` }}
              >
                {item.label}
              </Link>
            );
          })}
          <Link
            href="/donate"
            className="mt-8 rounded-full bg-tfy-gold px-10 py-3.5 text-base font-semibold text-tfy-navy transition hover:bg-tfy-gold-dark hover:text-white"
          >
            Donate
          </Link>
        </nav>
      </div>
    </header>
  );
}
