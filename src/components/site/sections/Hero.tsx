import Link from "next/link";
import { PhotoPlaceholder } from "../PhotoPlaceholder";

const QUICK_LINKS = [
  { label: "For Families", href: "/programs", desc: "Support, resources & care" },
  { label: "For Donors", href: "/donate", desc: "Fuel the mission" },
  { label: "For Partners", href: "/get-involved", desc: "Collaborate with us" },
];

export function Hero() {
  return (
    <section className="relative min-h-[100svh] overflow-hidden pt-20">
      <div className="mx-auto grid min-h-[calc(100svh-5rem)] max-w-[1400px] grid-cols-1 gap-8 px-5 pb-12 sm:px-8 lg:grid-cols-12 lg:items-center lg:gap-12">
        {/* Left — image (60%) */}
        <div className="lg:col-span-7 reveal">
          <PhotoPlaceholder
            label="Hero — mentor & young adult in a bright Maryland community space"
            tone="warm"
            className="aspect-[4/5] w-full support-arch shadow-2xl lg:aspect-[5/6]"
          />
        </div>

        {/* Right — content (40%) */}
        <div className="flex flex-col justify-center lg:col-span-5">
          <p className="meta-label text-tfy-clay reveal delay-1">
            Together For You, Inc.
          </p>
          <h1 className="mt-5 font-display text-[2.75rem] leading-[1.05] text-tfy-navy sm:text-5xl lg:text-[3.5rem] reveal delay-1">
            Together, we build the foundations for a thriving Maryland.
          </h1>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-tfy-muted reveal delay-2">
            TFY partners with young people, families, and communities to create
            lasting opportunity — through mentorship, family support, community
            programs, and policy grounded in real lives.
          </p>

          <div className="mt-9 flex flex-wrap gap-4 reveal delay-3">
            <Link
              href="/impact"
              className="rounded-full bg-tfy-clay px-7 py-3.5 text-sm font-semibold text-white shadow-[0_6px_20px_-6px_rgba(226,125,96,0.6)] transition-all hover:bg-tfy-clay-dark hover:shadow-[0_8px_26px_-6px_rgba(226,125,96,0.7)]"
            >
              Our Impact
            </Link>
            <Link
              href="/programs"
              className="rounded-full border border-tfy-navy/20 bg-tfy-parchment px-7 py-3.5 text-sm font-semibold text-tfy-navy transition-all hover:border-tfy-navy/40 hover:bg-white"
            >
              Current Initiatives
            </Link>
          </div>

          {/* Quick-link cluster */}
          <div className="mt-12 border-t border-tfy-line pt-6 reveal delay-4">
            <div className="grid grid-cols-3 gap-4">
              {QUICK_LINKS.map((q) => (
                <Link
                  key={q.label}
                  href={q.href}
                  className="group flex flex-col gap-1"
                >
                  <span className="text-sm font-semibold text-tfy-navy transition-colors group-hover:text-tfy-clay">
                    {q.label}
                  </span>
                  <span className="text-xs text-tfy-muted">{q.desc}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
