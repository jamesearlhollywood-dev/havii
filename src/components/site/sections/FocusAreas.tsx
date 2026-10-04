const FOCUS_AREAS = [
  {
    title: "Mentorship & Leadership",
    desc: "Help young people build confidence, relationships, leadership skills, and supportive connections.",
    icon: "M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m6 5.87V18a3 3 0 00-3-3H9a3 3 0 00-3 3v2m13-10a4 4 0 11-8 0 4 4 0 018 0z",
  },
  {
    title: "Mental Health & Well-Being",
    desc: "Create accessible spaces, tools, and programs that support emotional wellness, grief support, connection, and resilience.",
    icon: "M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z",
  },
  {
    title: "Career Readiness & Workforce Development",
    desc: "Prepare young people and emerging professionals with career skills, professional development, work-based learning, and employment pathways.",
    icon: "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
  },
  {
    title: "Family & Community Support",
    desc: "Strengthen families and communities through resources, connection, education, and community-centered programming.",
    icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2l-7 7m7-7v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
  },
  {
    title: "Digital Education & AI Literacy",
    desc: "Help young people and communities build practical digital skills and understand emerging technology responsibly.",
    icon: "M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
  },
  {
    title: "Policy & Advocacy",
    desc: "Elevate community voices, research issues affecting young people and families, and support systems-level change.",
    icon: "M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9m6-9l3-1m-3 1l3 9a5.002 5.002 0 00-6.001 0M18 7l3 9m-3-9V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2z",
  },
];

export function FocusAreas() {
  return (
    <section className="bg-tfy-parchment">
      <div className="mx-auto max-w-[1400px] px-5 py-20 sm:px-8 lg:py-28">
        <div className="mb-14 max-w-2xl">
          <p className="meta-label text-tfy-gold">Our Focus</p>
          <h2 className="mt-3 font-display text-4xl text-tfy-navy sm:text-5xl">
            Six areas. One mission.
          </h2>
          <p className="mt-4 text-lg text-tfy-muted">
            We work across six interconnected areas to support young people,
            families, and communities in Maryland.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FOCUS_AREAS.map((area, i) => (
            <div
              key={area.title}
              className={`group rounded-3xl border border-tfy-line bg-white p-8 transition-all duration-300 hover:-translate-y-1 hover:border-tfy-blue/30 hover:shadow-lg reveal delay-${i + 1}`}
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-tfy-blue-tint text-tfy-blue transition-colors group-hover:bg-tfy-gold-tint group-hover:text-tfy-gold-dark">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path
                    d={area.icon}
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <h3 className="mt-6 font-display text-2xl leading-tight text-tfy-navy">
                {area.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-tfy-muted">
                {area.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
