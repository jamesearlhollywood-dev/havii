const APPROACH = [
  {
    title: "Relationship-Centered",
    desc: "We believe meaningful change begins with trusted relationships, mentorship, and consistent support.",
    icon: "M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z",
  },
  {
    title: "Whole-Person Support",
    desc: "Our programs consider emotional well-being, education, career development, family relationships, and community context.",
    icon: "M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.25a7.5 7.5 0 0115 0",
  },
  {
    title: "Opportunity & Access",
    desc: "We work to connect people with resources, knowledge, professional pathways, and experiences that can expand what is possible.",
    icon: "M3 17l6-6 4 4 8-8M21 7h-6M21 7v6",
  },
  {
    title: "Community-Driven",
    desc: "We listen to young people, families, educators, and community partners and use their experiences to shape our programs.",
    icon: "M12 21a9 9 0 100-18 9 9 0 000 18zM3 12h18M12 3a15 15 0 010 18 15 15 0 010-18",
  },
];

export function AboutApproach() {
  return (
    <section className="bg-tfy-parchment">
      <div className="mx-auto max-w-[1400px] px-5 py-20 sm:px-8 lg:py-28">
        <div className="mb-14 max-w-2xl">
          <p className="meta-label text-tfy-gold">Our Approach</p>
          <h2 className="mt-3 font-display text-4xl text-tfy-navy sm:text-5xl">
            How we work
          </h2>
          <p className="mt-4 text-lg text-tfy-muted">
            Four principles guide everything we do.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {APPROACH.map((item, i) => (
            <div
              key={item.title}
              className={`group rounded-3xl border border-tfy-line bg-white p-8 transition-all duration-300 hover:-translate-y-1 hover:border-tfy-blue/30 hover:shadow-lg reveal delay-${i + 1}`}
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-tfy-blue-tint text-tfy-blue transition-colors group-hover:bg-tfy-gold-tint group-hover:text-tfy-gold-dark">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path
                    d={item.icon}
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <h3 className="mt-6 font-display text-2xl leading-tight text-tfy-navy">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-tfy-muted">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
