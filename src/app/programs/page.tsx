import Link from "next/link";
import { SiteShell } from "@/components/site/SiteShell";
import { PhotoPlaceholder } from "@/components/site/PhotoPlaceholder";
import { PROGRAMS } from "@/components/site/programs-data";

export const metadata = {
  title: "Programs",
  description:
    "Explore TFY's programs — mentorship, wellness, career development, technology, and community support for young people and families.",
};

export default function ProgramsPage() {
  return (
    <SiteShell>
      {/* Page Header */}
      <section className="bg-tfy-parchment-warm">
        <div className="mx-auto max-w-[1400px] px-5 pt-16 pb-14 sm:px-8 lg:pt-24 lg:pb-20">
          <p className="meta-label text-tfy-gold">Our Programs</p>
          <h1 className="mt-4 max-w-4xl font-display text-4xl leading-tight text-tfy-navy sm:text-5xl lg:text-[3.25rem]">
            Programs Designed to Help People Move Forward
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-tfy-muted">
            Our programs combine mentorship, wellness, education, career
            development, technology, and community support to help young people
            and families build stronger futures.
          </p>
        </div>
      </section>

      {/* Program Sections */}
      {PROGRAMS.map((program, i) => (
        <section
          key={program.slug}
          id={program.slug}
          className={`scroll-mt-24 ${
            i % 2 === 0 ? "bg-tfy-parchment" : "bg-tfy-parchment-warm"
          }`}
        >
          <div className="mx-auto max-w-[1400px] px-5 py-16 sm:px-8 lg:py-24">
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
              {/* Image */}
              <div className={i % 2 === 1 ? "lg:order-2" : ""}>
                <PhotoPlaceholder
                  label={program.imageLabel}
                  tone={program.imageTone}
                  className="aspect-[4/3] w-full rounded-[2rem] shadow-lg"
                />
              </div>

              {/* Content */}
              <div className={i % 2 === 1 ? "lg:order-1" : ""}>
                <p className="meta-label text-tfy-gold">{program.tag}</p>
                <h2 className="mt-3 font-display text-3xl leading-tight text-tfy-navy sm:text-4xl">
                  {program.name}
                </h2>
                {program.tagline && (
                  <p className="mt-2 text-xl italic text-tfy-blue">
                    {program.tagline}
                  </p>
                )}

                <p className="mt-5 text-base leading-relaxed text-tfy-muted">
                  {program.overview}
                </p>

                {/* Who it serves */}
                <div className="mt-6">
                  <p className="meta-label text-tfy-navy">Who It Serves</p>
                  <p className="mt-2 text-sm leading-relaxed text-tfy-muted">
                    {program.whoItServes}
                  </p>
                </div>

                {/* What to expect */}
                <div className="mt-5">
                  <p className="meta-label text-tfy-navy">What Participants Can Expect</p>
                  <p className="mt-2 text-sm leading-relaxed text-tfy-muted">
                    {program.whatToExpect}
                  </p>
                </div>

                {/* Key features */}
                <div className="mt-5">
                  <p className="meta-label text-tfy-navy">Key Program Features</p>
                  <ul className="mt-3 grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2">
                    {program.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-2.5 text-sm text-tfy-muted"
                      >
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          className="mt-0.5 flex-none text-tfy-gold"
                          aria-hidden
                        >
                          <path
                            d="M5 13l4 4L19 7"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA */}
                <div className="mt-8">
                  <Link
                    href={program.ctaHref}
                    className="inline-flex items-center gap-2 rounded-full bg-tfy-navy px-7 py-3.5 text-sm font-semibold text-white transition-all hover:bg-tfy-navy-soft"
                  >
                    {program.pageCta}
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                      <path d="M5 12h14m0 0l-6-6m6 6l-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      ))}
    </SiteShell>
  );
}
