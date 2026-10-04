import Link from "next/link";
import { PhotoPlaceholder } from "../PhotoPlaceholder";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-tfy-parchment pt-24 sm:pt-28">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-10 px-5 pb-16 sm:px-8 lg:grid-cols-2 lg:items-center lg:gap-16 lg:pb-24 lg:pt-12">
        {/* Content */}
        <div className="flex flex-col justify-center reveal">
          <p className="meta-label text-tfy-gold">Together For You, Inc.</p>
          <h1 className="mt-5 font-display text-[2.5rem] leading-[1.08] text-tfy-navy sm:text-5xl lg:text-[3.25rem] reveal delay-1">
            Helping Young People Build Stronger Futures
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-tfy-muted reveal delay-2">
            Together For You, Inc. connects young people, families, and
            communities with mentorship, wellness support, career preparation,
            education, and opportunities that help people move forward.
          </p>
          <div className="mt-8 flex flex-wrap gap-4 reveal delay-3">
            <Link
              href="/programs"
              className="rounded-full bg-tfy-navy px-7 py-3.5 text-sm font-semibold text-white transition-all hover:bg-tfy-navy-soft"
            >
              Explore Our Programs
            </Link>
            <Link
              href="/get-involved"
              className="rounded-full border border-tfy-navy/25 bg-transparent px-7 py-3.5 text-sm font-semibold text-tfy-navy transition-all hover:border-tfy-navy/50 hover:bg-tfy-navy hover:text-white"
            >
              Get Involved
            </Link>
          </div>
        </div>

        {/* Image */}
        <div className="reveal delay-2">
          <PhotoPlaceholder
            label="Youth mentorship & community program — diverse young people and mentors in a bright, welcoming space"
            tone="warm"
            className="aspect-[4/3] w-full rounded-[2rem] shadow-xl sm:aspect-[5/4] lg:aspect-[4/5]"
          />
        </div>
      </div>
    </section>
  );
}
