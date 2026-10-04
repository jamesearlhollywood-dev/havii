import Link from "next/link";

export function MissionIntro() {
  return (
    <section className="bg-tfy-parchment-warm">
      <div className="mx-auto max-w-[1400px] px-5 py-24 sm:px-8 lg:py-32">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-3">
            <p className="meta-label text-tfy-forest">Our Mission</p>
          </div>
          <div className="lg:col-span-9">
            <p className="font-display text-[1.875rem] leading-[1.25] text-tfy-navy sm:text-3xl lg:text-[3rem] lg:leading-[1.2]">
              We exist so that every young person, every family, and every
              community in Maryland has the relationships, resources, and
              resilience to thrive — not by chance, but by design.
            </p>
            <div className="mt-10 flex items-center gap-4">
              <span className="h-px w-12 bg-tfy-clay" />
              <Link
                href="/about"
                className="meta-label text-tfy-navy transition-colors hover:text-tfy-clay"
              >
                <span className="border-b border-tfy-navy/30 pb-0.5 hover:border-tfy-clay">
                  Read our full story →
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
