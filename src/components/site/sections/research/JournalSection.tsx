import Link from "next/link";
import { PubCover } from "./PubCover";

export function JournalSection() {
  return (
    <section className="bg-tfy-parchment">
      <div className="mx-auto max-w-[1400px] px-5 py-20 sm:px-8 lg:py-28">
        {/* Section heading */}
        <div className="mb-14 max-w-3xl">
          <p className="meta-label text-tfy-gold">TFY Journal</p>
          <h2 className="mt-3 font-display text-4xl leading-tight text-tfy-navy sm:text-5xl">
            A quarterly research publication
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-tfy-muted">
            A quarterly publication examining emerging issues, community
            experiences, program practice, and research related to youth
            development, family well-being, education, mental health,
            workforce readiness, technology, and community change.
          </p>
        </div>

        {/* Featured issue card */}
        <div className="grid grid-cols-1 gap-10 rounded-[2rem] border border-tfy-line bg-white p-6 sm:p-8 lg:grid-cols-[320px_1fr] lg:gap-14 lg:p-12">
          {/* Cover */}
          <div className="mx-auto w-full max-w-[320px] lg:mx-0">
            <PubCover
              type="TFY Journal · Featured Issue"
              title="Grief, Loss, and Isolation"
              tone="navy"
              className="aspect-[3/4] w-full shadow-lg"
            />
          </div>

          {/* Details */}
          <div className="flex flex-col">
            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-tfy-gold-tint px-4 py-1.5 meta-label text-tfy-gold-dark">
              Featured Issue
            </span>

            <h3 className="mt-5 font-display text-3xl leading-tight text-tfy-navy sm:text-4xl">
              Grief, Loss, and Isolation
            </h3>

            {/* Metadata strip */}
            <dl className="mt-6 grid grid-cols-2 gap-x-8 gap-y-4 border-y border-tfy-line py-5 sm:grid-cols-3">
              <div>
                <dt className="meta-label text-[0.6875rem] text-tfy-muted">
                  Volume &amp; Issue
                </dt>
                <dd className="mt-1 text-sm font-medium text-tfy-navy">
                  [Vol. —, No. —]
                </dd>
              </div>
              <div>
                <dt className="meta-label text-[0.6875rem] text-tfy-muted">
                  Publication Date
                </dt>
                <dd className="mt-1 text-sm font-medium text-tfy-navy">
                  [Month YYYY]
                </dd>
              </div>
              <div>
                <dt className="meta-label text-[0.6875rem] text-tfy-muted">
                  Authors
                </dt>
                <dd className="mt-1 text-sm font-medium text-tfy-navy">
                  [Author placeholders]
                </dd>
              </div>
            </dl>

            {/* Abstract */}
            <div className="mt-6">
              <p className="meta-label text-[0.6875rem] text-tfy-muted">
                Abstract
              </p>
              <p className="mt-2.5 text-base leading-relaxed text-tfy-muted">
                [Abstract placeholder — a summary of the issue&apos;s research
                focus, key themes, and scope will appear here once the
                publication is finalized.]
              </p>
            </div>

            {/* Actions */}
            <div className="mt-8 flex flex-wrap gap-4">
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-full bg-tfy-navy px-7 py-3.5 text-sm font-semibold text-white transition-all hover:bg-tfy-navy-soft"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M12 4v12m0 0l-4-4m4 4l4-4M4 20h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Download PDF
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-full border border-tfy-navy/20 px-7 py-3.5 text-sm font-semibold text-tfy-navy transition-all hover:border-tfy-navy hover:bg-tfy-navy hover:text-white"
              >
                Read Online
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M5 12h14m0 0l-6-6m6 6l-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>

            <p className="mt-5 text-xs text-tfy-muted">
              [Cover image, volume number, publication date, authors, and
              abstract are placeholders pending final publication.]
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
