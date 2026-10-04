import Link from "next/link";
import { PhotoPlaceholder } from "../PhotoPlaceholder";
import { PROGRAMS } from "../programs-data";

export function FeaturedPrograms() {
  const featured = PROGRAMS.filter((p) => p.featured);

  return (
    <section className="bg-tfy-navy text-tfy-parchment">
      <div className="mx-auto max-w-[1400px] px-5 py-20 sm:px-8 lg:py-28">
        <div className="mb-12 max-w-2xl">
          <p className="meta-label text-tfy-gold">Our Programs</p>
          <h2 className="mt-3 font-display text-4xl text-tfy-parchment sm:text-5xl">
            Featured Programs
          </h2>
          <p className="mt-5 text-lg text-tfy-parchment/70">
            Initiatives that connect young people, families, and communities
            with the support, skills, and relationships they need to move
            forward.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {featured.map((program, i) => (
            <article
              key={program.slug}
              className={`group flex flex-col overflow-hidden rounded-[1.75rem] border border-tfy-parchment/10 bg-white/5 transition-all duration-300 hover:border-tfy-gold/30 hover:bg-white/10 reveal delay-${i + 1}`}
            >
              <PhotoPlaceholder
                label={program.imageLabel}
                tone={program.imageTone}
                className="aspect-[16/9] w-full"
              />
              <div className="flex flex-1 flex-col p-7">
                <p className="meta-label text-tfy-gold">{program.tag}</p>
                <h3 className="mt-2 font-display text-2xl text-tfy-parchment">
                  {program.name}
                </h3>
                {program.tagline && (
                  <p className="mt-1 text-base italic text-tfy-gold-light">
                    {program.tagline}
                  </p>
                )}
                <p className="mt-3 flex-1 text-sm leading-relaxed text-tfy-parchment/65">
                  {program.cardDescription}
                </p>
                <Link
                  href={`/programs#${program.slug}`}
                  className="mt-6 inline-flex items-center gap-2 self-start rounded-full border border-tfy-parchment/25 px-6 py-3 text-sm font-semibold text-tfy-parchment transition-all hover:border-tfy-gold hover:bg-tfy-gold hover:text-tfy-navy"
                >
                  {program.cardCta}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path d="M5 12h14m0 0l-6-6m6 6l-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <Link
            href="/programs"
            className="rounded-full bg-tfy-gold px-8 py-3.5 text-sm font-semibold text-tfy-navy transition-all hover:bg-tfy-gold-dark hover:text-white"
          >
            View All Programs
          </Link>
        </div>
      </div>
    </section>
  );
}
