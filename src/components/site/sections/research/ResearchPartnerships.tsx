import Link from "next/link";

const PARTNERS = [
  {
    title: "Colleges & Universities",
    desc: "Collaborate with academic institutions on research, evaluation, student projects, and joint publications.",
    icon: "M12 14l9-5-9-5-9 5 9 5zm0 0v6m0-6l6.16-3.42M12 14L5.84 10.58",
  },
  {
    title: "Faculty & Student Researchers",
    desc: "Support faculty-led research and student research opportunities, theses, dissertations, and practicum projects.",
    icon: "M12 14l9-5-9-5-9 5 9 5zm0 0v6m0-6l6.16-3.42M12 14L5.84 10.58",
  },
  {
    title: "Community Organizations",
    desc: "Partner with community-based organizations to ground research in lived experience and local knowledge.",
    icon: "M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m6 5.87V18a3 3 0 00-3-3H9a3 3 0 00-3 3v2m13-10a4 4 0 11-8 0 4 4 0 018 0z",
  },
  {
    title: "Government Agencies",
    desc: "Work with local, state, and federal agencies on policy research, program evaluation, and systems change.",
    icon: "M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9m6-9l3-1m-3 1l3 9a5.002 5.002 0 00-6.001 0",
  },
  {
    title: "Foundations",
    desc: "Partner with foundations to fund, shape, and evaluate research that advances shared goals.",
    icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z",
  },
  {
    title: "Evaluation Partners",
    desc: "Collaborate with evaluation professionals and firms on program evaluation, outcomes measurement, and learning.",
    icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
  },
];

export function ResearchPartnerships() {
  return (
    <section className="bg-tfy-parchment-warm">
      <div className="mx-auto max-w-[1400px] px-5 py-20 sm:px-8 lg:py-28">
        <div className="mb-14 max-w-2xl">
          <p className="meta-label text-tfy-gold">Research Partnerships</p>
          <h2 className="mt-3 font-display text-4xl leading-tight text-tfy-navy sm:text-5xl">
            We welcome collaboration
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-tfy-muted">
            TFY partners with a wide range of institutions and individuals to
            produce rigorous, community-informed research.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {PARTNERS.map((partner, i) => (
            <div
              key={partner.title}
              className="flex items-start gap-4 rounded-2xl border border-tfy-line bg-white p-6"
            >
              <span
                className={`flex h-11 w-11 flex-none items-center justify-center rounded-xl ${
                  i % 3 === 0
                    ? "bg-tfy-navy text-tfy-gold"
                    : i % 3 === 1
                    ? "bg-tfy-blue-tint text-tfy-blue"
                    : "bg-tfy-gold-tint text-tfy-gold-dark"
                }`}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path
                    d={partner.icon}
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <div>
                <h3 className="font-display text-lg leading-tight text-tfy-navy">
                  {partner.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-tfy-muted">
                  {partner.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-full bg-tfy-navy px-8 py-3.5 text-sm font-semibold text-white transition-all hover:bg-tfy-navy-soft"
          >
            Explore Research Partnerships
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M5 12h14m0 0l-6-6m6 6l-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
