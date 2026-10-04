import Link from "next/link";
import { PhotoPlaceholder } from "../PhotoPlaceholder";

const ACTIONS = [
  {
    title: "Volunteer",
    desc: "Walk alongside young people as a mentor, program lead, or community volunteer. Your time creates real, lasting connection.",
    cta: "Become a Volunteer",
    href: "/get-involved",
    tone: "warm" as const,
    label: "Volunteers collaborating in a community space",
  },
  {
    title: "Partner",
    desc: "Schools, foundations, and organizations — collaborate with TFY to expand reach, share research, and deepen community impact.",
    cta: "Explore Partnerships",
    href: "/get-involved",
    tone: "forest" as const,
    label: "Community partners meeting around a table",
  },
];

export function GetInvolved() {
  return (
    <section className="bg-tfy-parchment-warm">
      <div className="mx-auto max-w-[1400px] px-5 py-20 sm:px-8 lg:py-28">
        <div className="mb-14 max-w-2xl">
          <p className="meta-label text-tfy-gold">Be Part of It</p>
          <h2 className="mt-3 font-display text-4xl text-tfy-navy sm:text-5xl">
            Get Involved
          </h2>
          <p className="mt-5 text-lg text-tfy-muted">
            Whether you have time, expertise, or resources to share — there's a
            place for you in this work.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {ACTIONS.map((a) => (
            <div
              key={a.title}
              className="group overflow-hidden rounded-[2rem] border border-tfy-line bg-white"
            >
              <PhotoPlaceholder
                label={a.label}
                tone={a.tone}
                className="aspect-[16/9] w-full"
              />
              <div className="p-8 lg:p-10">
                <h3 className="font-display text-3xl text-tfy-navy">{a.title}</h3>
                <p className="mt-4 text-base leading-relaxed text-tfy-muted">
                  {a.desc}
                </p>
                <Link
                  href={a.href}
                  className="mt-8 inline-flex items-center gap-2 rounded-full border border-tfy-navy/20 px-6 py-3 text-sm font-semibold text-tfy-navy transition-all hover:border-tfy-navy hover:bg-tfy-navy hover:text-white"
                >
                  {a.cta}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path d="M5 12h14m0 0l-6-6m6 6l-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
