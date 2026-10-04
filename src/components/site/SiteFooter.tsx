import Link from "next/link";

const FOOTER_NAV = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Programs", href: "/programs" },
  { label: "Impact", href: "/impact" },
  { label: "Research & Publications", href: "/research" },
  { label: "Get Involved", href: "/get-involved" },
  { label: "Donate", href: "/donate" },
  { label: "Contact", href: "/contact" },
];

export function SiteFooter() {
  return (
    <footer className="bg-tfy-navy text-tfy-parchment">
      <div className="mx-auto max-w-[1400px] px-5 py-16 sm:px-8 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-12">
          {/* TFY at a glance */}
          <div className="lg:col-span-4">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-tfy-gold text-sm font-semibold text-white">
                TFY
              </span>
              <span className="font-display text-xl text-tfy-parchment">
                Together For You
              </span>
            </div>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-tfy-parchment/70">
              A Maryland-based nonprofit helping young people, families, and
              communities thrive. Together, we build the foundations for a
              thriving Maryland.
            </p>
            <p className="mt-6 meta-label text-tfy-gold">
              501(c)(3) — [EIN Placeholder]
            </p>
          </div>

          {/* Navigation */}
          <div className="lg:col-span-3">
            <p className="meta-label text-tfy-parchment/50">Explore</p>
            <ul className="mt-5 space-y-3">
              {FOOTER_NAV.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-tfy-parchment/75 transition-colors hover:text-tfy-gold"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Maryland HQ Address */}
          <div className="lg:col-span-3">
            <p className="meta-label text-tfy-parchment/50">Headquarters</p>
            <address className="mt-5 space-y-1 text-sm not-italic text-tfy-parchment/75">
              <p>Together For You, Inc.</p>
              <p>[Street Address Placeholder]</p>
              <p>[City], Maryland [ZIP]</p>
              <p className="pt-2">
                <a
                  href="mailto:hello@togetherforyou.org"
                  className="transition-colors hover:text-tfy-gold"
                >
                  hello@togetherforyou.org
                </a>
              </p>
              <p>
                <a
                  href="tel:+10000000000"
                  className="transition-colors hover:text-tfy-gold"
                >
                  [Phone Placeholder]
                </a>
              </p>
            </address>
          </div>

          {/* Social / Legal */}
          <div className="lg:col-span-2">
            <p className="meta-label text-tfy-parchment/50">Connect</p>
            <ul className="mt-5 space-y-3">
              {["LinkedIn", "Instagram", "Facebook", "YouTube"].map((s) => (
                <li key={s}>
                  <Link
                    href="#"
                    className="text-sm text-tfy-parchment/75 transition-colors hover:text-tfy-gold"
                  >
                    {s}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Legal bar */}
        <div className="mt-16 flex flex-col gap-4 border-t border-tfy-parchment/10 pt-8 text-xs text-tfy-parchment/50 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} Together For You, Inc. All rights reserved.
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <Link href="#" className="transition-colors hover:text-tfy-gold">
              Privacy Policy
            </Link>
            <Link href="#" className="transition-colors hover:text-tfy-gold">
              Terms of Use
            </Link>
            <Link href="#" className="transition-colors hover:text-tfy-gold">
              Accessibility
            </Link>
            <Link href="/help" className="transition-colors hover:text-tfy-gold">
              Crisis Resources
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
