import Link from "next/link";

const PUBLICATIONS = [
  {
    date: "[Month YYYY]",
    type: "Report",
    title: "[Publication Title Placeholder]",
    desc: "A brief description of the research focus and key findings will appear here.",
  },
  {
    date: "[Month YYYY]",
    type: "Brief",
    title: "[Publication Title Placeholder]",
    desc: "A brief description of the research focus and key findings will appear here.",
  },
  {
    date: "[Month YYYY]",
    type: "White Paper",
    title: "[Publication Title Placeholder]",
    desc: "A brief description of the research focus and key findings will appear here.",
  },
];

export function LatestResearch() {
  return (
    <section className="bg-tfy-parchment-warm">
      <div className="mx-auto max-w-[1400px] px-5 py-24 sm:px-8 lg:py-32">
        <div className="mb-14 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="meta-label text-tfy-forest">Thought Leadership</p>
            <h2 className="mt-3 font-display text-4xl text-tfy-navy sm:text-5xl">
              Latest Research & Publications
            </h2>
          </div>
          <Link
            href="/research"
            className="meta-label text-tfy-navy transition-colors hover:text-tfy-clay"
          >
            <span className="border-b border-tfy-navy/30 pb-0.5 hover:border-tfy-clay">
              View all publications →
            </span>
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-px overflow-hidden rounded-3xl border border-tfy-forest/15 bg-tfy-forest/15 md:grid-cols-3">
          {PUBLICATIONS.map((pub, i) => (
            <article
              key={i}
              className="group flex flex-col bg-tfy-parchment p-8 transition-colors hover:bg-white"
            >
              <div className="flex items-center justify-between">
                <span className="meta-label text-tfy-forest">{pub.type}</span>
                <span className="text-xs text-tfy-muted">{pub.date}</span>
              </div>
              <h3 className="mt-5 font-display text-2xl leading-snug text-tfy-navy">
                {pub.title}
              </h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-tfy-muted">
                {pub.desc}
              </p>
              <Link
                href="/research"
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-tfy-forest transition-colors hover:text-tfy-clay"
              >
                Download PDF
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M12 4v12m0 0l-4-4m4 4l4-4M4 20h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
