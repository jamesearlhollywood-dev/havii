import Link from "next/link";

const COMMUNITY_STATS = [
  { value: "[—]", label: "Community members reached", desc: "Through programs, events, and community partnerships across Maryland." },
  { value: "[—]", label: "Community partnerships", desc: "Schools, organizations, and local leaders working alongside us." },
  { value: "[—]", label: "Community programs delivered", desc: "Across mentorship, wellness, education, and family support." },
];

const YOUTH_STATS = [
  { value: "[—]", label: "Young people supported", desc: "Through mentorship, wellness, and skill-building programs." },
  { value: "[—]", label: "Mentorship connections", desc: "Trusted relationships built between mentors and young people." },
  { value: "[—]", label: "Program participants", desc: "Engaged in HAVII, Tomorrow Together, career readiness, and more." },
];

const PROGRAM_OUTCOMES = [
  { name: "HAVII", outcome: "[Outcome data will be displayed here once verified.]" },
  { name: "Tomorrow, Together", outcome: "[Outcome data will be displayed here once verified.]" },
  { name: "Mentorship & Leadership", outcome: "[Outcome data will be displayed here once verified.]" },
  { name: "Career Readiness & Workforce", outcome: "[Outcome data will be displayed here once verified.]" },
  { name: "Digital Education & AI Literacy", outcome: "[Outcome data will be displayed here once verified.]" },
  { name: "Family & Community Support", outcome: "[Outcome data will be displayed here once verified.]" },
];

const STORIES = [
  { type: "Program Participant", text: "[Story placeholder — a firsthand account from a program participant will appear here once shared with consent.]" },
  { type: "Community Partner", text: "[Story placeholder — a community partner testimonial will appear here once shared with consent.]" },
  { type: "Volunteer & Mentor", text: "[Story placeholder — a volunteer or mentor story will appear here once shared with consent.]" },
];

const HIGHLIGHTS = [
  "[Highlight placeholder — key achievement from the past year.]",
  "[Highlight placeholder — program milestone or expansion.]",
  "[Highlight placeholder — new community partnership formed.]",
  "[Highlight placeholder — organizational growth or recognition.]",
];

const GOALS = [
  "[Goal placeholder — expansion of mentorship programs to reach more young people.]",
  "[Goal placeholder — launch of new career readiness and workforce initiatives.]",
  "[Goal placeholder — deepened community partnerships across Maryland.]",
  "[Goal placeholder — growth of research, publications, and advocacy efforts.]",
];

export function ImpactContent() {
  return (
    <>
      {/* Community Impact */}
      <section className="bg-tfy-parchment">
        <div className="mx-auto max-w-[1400px] px-5 py-20 sm:px-8 lg:py-28">
          <div className="mb-14 max-w-2xl">
            <p className="meta-label text-tfy-gold">Community Impact</p>
            <h2 className="mt-3 font-display text-4xl text-tfy-navy sm:text-5xl">
              Strengthening communities across Maryland
            </h2>
            <p className="mt-4 text-lg text-tfy-muted">
              TFY works alongside schools, organizations, and local leaders to
              strengthen communities. Verified metrics will appear here once
              data is confirmed.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-px overflow-hidden rounded-3xl border border-tfy-line bg-tfy-line md:grid-cols-3">
            {COMMUNITY_STATS.map((s) => (
              <div key={s.label} className="bg-tfy-parchment p-8">
                <p className="font-display text-[4rem] leading-none text-tfy-navy">{s.value}</p>
                <p className="mt-4 text-base font-semibold text-tfy-navy">{s.label}</p>
                <p className="mt-2 text-sm leading-relaxed text-tfy-muted">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Youth Impact */}
      <section className="bg-tfy-parchment-warm">
        <div className="mx-auto max-w-[1400px] px-5 py-20 sm:px-8 lg:py-28">
          <div className="mb-14 max-w-2xl">
            <p className="meta-label text-tfy-gold">Youth Impact</p>
            <h2 className="mt-3 font-display text-4xl text-tfy-navy sm:text-5xl">
              Supporting young people
            </h2>
            <p className="mt-4 text-lg text-tfy-muted">
              Through mentorship, wellness support, and skill-building
              programs, we help young people build confidence, connections, and
              pathways forward.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-px overflow-hidden rounded-3xl border border-tfy-line bg-tfy-line md:grid-cols-3">
            {YOUTH_STATS.map((s) => (
              <div key={s.label} className="bg-tfy-parchment-warm p-8">
                <p className="font-display text-[4rem] leading-none text-tfy-navy">{s.value}</p>
                <p className="mt-4 text-base font-semibold text-tfy-navy">{s.label}</p>
                <p className="mt-2 text-sm leading-relaxed text-tfy-muted">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Program Outcomes */}
      <section className="bg-tfy-parchment">
        <div className="mx-auto max-w-[1400px] px-5 py-20 sm:px-8 lg:py-28">
          <div className="mb-14 max-w-2xl">
            <p className="meta-label text-tfy-gold">Program Outcomes</p>
            <h2 className="mt-3 font-display text-4xl text-tfy-navy sm:text-5xl">
              Results across our programs
            </h2>
            <p className="mt-4 text-lg text-tfy-muted">
              Outcome data for each program area will be displayed here once
              verified.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {PROGRAM_OUTCOMES.map((p) => (
              <div key={p.name} className="rounded-3xl border border-tfy-line bg-white p-7">
                <h3 className="font-display text-xl text-tfy-navy">{p.name}</h3>
                <p className="mt-3 text-sm leading-relaxed text-tfy-muted">{p.outcome}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stories of Impact */}
      <section className="bg-tfy-parchment-warm">
        <div className="mx-auto max-w-[1400px] px-5 py-20 sm:px-8 lg:py-28">
          <div className="mb-14 max-w-2xl">
            <p className="meta-label text-tfy-gold">Stories of Impact</p>
            <h2 className="mt-3 font-display text-4xl text-tfy-navy sm:text-5xl">
              Voices from our community
            </h2>
            <p className="mt-4 text-lg text-tfy-muted">
              Real stories from participants, partners, and volunteers will
              appear here once shared with consent.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {STORIES.map((s) => (
              <div key={s.type} className="rounded-3xl border border-tfy-line bg-white p-7">
                <p className="meta-label text-tfy-gold">{s.type}</p>
                <p className="mt-4 text-sm leading-relaxed text-tfy-muted">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Annual Highlights */}
      <section className="bg-tfy-parchment">
        <div className="mx-auto max-w-[1100px] px-5 py-20 sm:px-8 lg:py-28">
          <div className="mb-14 max-w-2xl">
            <p className="meta-label text-tfy-gold">Annual Highlights</p>
            <h2 className="mt-3 font-display text-4xl text-tfy-navy sm:text-5xl">
              A year in review
            </h2>
            <p className="mt-4 text-lg text-tfy-muted">
              Key milestones and achievements from the past year. Highlights
              will be updated as data is confirmed.
            </p>
          </div>
          <ol className="space-y-5">
            {HIGHLIGHTS.map((h, i) => (
              <li key={i} className="flex gap-5 rounded-2xl border border-tfy-line bg-white p-6">
                <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-tfy-gold-tint font-display text-lg font-semibold text-tfy-gold-dark">
                  {i + 1}
                </span>
                <p className="pt-1.5 text-sm leading-relaxed text-tfy-muted">{h}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Future Goals */}
      <section className="bg-tfy-parchment-warm">
        <div className="mx-auto max-w-[1100px] px-5 py-20 sm:px-8 lg:py-28">
          <div className="mb-14 max-w-2xl">
            <p className="meta-label text-tfy-gold">Future Goals</p>
            <h2 className="mt-3 font-display text-4xl text-tfy-navy sm:text-5xl">
              Where we&apos;re headed
            </h2>
            <p className="mt-4 text-lg text-tfy-muted">
              Our priorities for the coming year and beyond.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {GOALS.map((g, i) => (
              <div key={i} className="flex gap-5 rounded-2xl border border-tfy-line bg-white p-6">
                <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-tfy-blue-tint font-display text-lg font-semibold text-tfy-blue">
                  {i + 1}
                </span>
                <p className="pt-1.5 text-sm leading-relaxed text-tfy-muted">{g}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact CTA */}
      <section className="bg-tfy-navy text-tfy-parchment">
        <div className="mx-auto max-w-[1100px] px-5 py-24 text-center sm:px-8 lg:py-28">
          <p className="meta-label text-tfy-gold">Join Us</p>
          <h2 className="mx-auto mt-4 max-w-3xl font-display text-4xl leading-tight sm:text-5xl">
            Be part of the impact
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg text-tfy-parchment/75">
            Every contribution — time, expertise, or resources — helps young
            people, families, and communities move forward.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link href="/get-involved" className="rounded-full bg-tfy-gold px-8 py-3.5 text-sm font-semibold text-tfy-navy transition-all hover:bg-tfy-gold-dark hover:text-white">
              Get Involved
            </Link>
            <Link href="/donate" className="rounded-full border border-tfy-parchment/30 px-8 py-3.5 text-sm font-semibold text-tfy-parchment transition-all hover:border-tfy-gold hover:text-tfy-gold">
              Donate
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
