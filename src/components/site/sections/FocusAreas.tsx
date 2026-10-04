import Link from "next/link";

const FOCUS_AREAS = [
  {
    title: "Youth",
    desc: "Mentorship, wellness, and skill-building for young people ages 13–24.",
    icon: "M12 14l9-5-9-5-9 5 9 5zm0 0v7",
    href: "/programs",
  },
  {
    title: "Families",
    desc: "Support, resources, and connection for caregivers and family systems.",
    icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2l-7 7m7-7v10a1 1 0 01-1 1h-3",
    href: "/programs",
  },
  {
    title: "Community",
    desc: "Local programs, gardens, classrooms, and gathering spaces that strengthen neighborhoods.",
    icon: "M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m6 5.87V18a3 3 0 00-3-3H9a3 3 0 00-3 3v2m13-10a4 4 0 11-8 0 4 4 0 018 0z",
    href: "/programs",
  },
  {
    title: "Policy",
    desc: "Research and advocacy that turn lived experience into systemic change.",
    icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
    href: "/research",
  },
];

export function FocusAreas() {
  return (
    <section className="bg-tfy-parchment">
      <div className="mx-auto max-w-[1400px] px-5 py-24 sm:px-8 lg:py-32">
        <div className="mb-14 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="meta-label text-tfy-clay">What We Do</p>
            <h2 className="mt-3 font-display text-4xl text-tfy-navy sm:text-5xl">
              Our Focus Areas
            </h2>
          </div>
          <p className="max-w-sm text-base text-tfy-muted">
            Four interconnected pillars that shape every program, partnership,
            and investment we make.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FOCUS_AREAS.map((area, i) => (
            <Link
              key={area.title}
              href={area.href}
              className={`group flex flex-col justify-between support-arch border border-tfy-line bg-white p-8 transition-all duration-300 hover:-translate-y-1 hover:border-tfy-clay/30 hover:shadow-xl reveal delay-${i + 1}`}
            >
              <div>
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-tfy-forest-tint text-tfy-forest transition-colors group-hover:bg-tfy-clay-tint group-hover:text-tfy-clay">
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path
                      d={area.icon}
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <h3 className="mt-6 font-display text-2xl text-tfy-navy">
                  {area.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-tfy-muted">
                  {area.desc}
                </p>
              </div>
              <span className="mt-8 meta-label text-tfy-navy transition-colors group-hover:text-tfy-clay">
                Learn more →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
