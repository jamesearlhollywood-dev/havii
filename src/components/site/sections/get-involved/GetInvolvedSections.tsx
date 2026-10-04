import Link from "next/link";
import { PhotoPlaceholder } from "../../PhotoPlaceholder";

const OPPORTUNITIES = [
  {
    title: "Volunteer",
    desc: "Walk alongside young people as a mentor, program lead, or community volunteer. Your time and presence create real, lasting connection.",
    cta: "Become a Volunteer",
    imageTone: "warm" as const,
    imageLabel: "Volunteers collaborating in a community space",
  },
  {
    title: "Internships",
    desc: "Gain hands-on experience in nonprofit operations, program management, community engagement, and youth development while contributing to meaningful work.",
    cta: "Apply for an Internship",
    imageTone: "navy" as const,
    imageLabel: "Interns working on program development in an office setting",
  },
  {
    title: "Mentorship",
    desc: "Become a mentor and build a meaningful relationship with a young person who can benefit from your guidance, experience, and consistent support.",
    cta: "Become a Mentor",
    imageTone: "forest" as const,
    imageLabel: "Mentor and mentee meeting in a supportive environment",
  },
  {
    title: "Partnerships",
    desc: "Schools, foundations, and organizations — collaborate with TFY to expand reach, share resources, and deepen community impact together.",
    cta: "Explore Partnerships",
    imageTone: "clay" as const,
    imageLabel: "Community partners meeting around a table",
  },
  {
    title: "Community Collaboration",
    desc: "Community organizations and local leaders — work alongside TFY to strengthen neighborhoods, connect families with resources, and build together.",
    cta: "Connect with Us",
    imageTone: "warm" as const,
    imageLabel: "Community members gathered at a collaborative event",
  },
  {
    title: "Corporate Engagement",
    desc: "Corporations and businesses — support TFY through corporate giving, employee volunteer programs, sponsorship, and strategic partnership.",
    cta: "Partner with TFY",
    imageTone: "navy" as const,
    imageLabel: "Corporate team volunteering at a TFY community event",
  },
];

export function GetInvolvedContent() {
  return (
    <>
      {OPPORTUNITIES.map((opp, i) => (
        <section
          key={opp.title}
          id={opp.title.toLowerCase().replace(/\s+/g, "-")}
          className={`scroll-mt-24 ${i % 2 === 0 ? "bg-tfy-parchment" : "bg-tfy-parchment-warm"}`}
        >
          <div className="mx-auto max-w-[1400px] px-5 py-16 sm:px-8 lg:py-24">
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
              <div className={i % 2 === 1 ? "lg:order-2" : ""}>
                <PhotoPlaceholder
                  label={opp.imageLabel}
                  tone={opp.imageTone}
                  className="aspect-[4/3] w-full rounded-[2rem] shadow-lg"
                />
              </div>
              <div className={i % 2 === 1 ? "lg:order-1" : ""}>
                <p className="meta-label text-tfy-gold">{`0${i + 1}`}</p>
                <h2 className="mt-3 font-display text-3xl leading-tight text-tfy-navy sm:text-4xl">
                  {opp.title}
                </h2>
                <p className="mt-5 text-base leading-relaxed text-tfy-muted">{opp.desc}</p>
                <Link
                  href="/contact"
                  className="mt-8 inline-flex items-center gap-2 rounded-full bg-tfy-navy px-7 py-3.5 text-sm font-semibold text-white transition-all hover:bg-tfy-navy-soft"
                >
                  {opp.cta}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path d="M5 12h14m0 0l-6-6m6 6l-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* Closing CTA */}
      <section className="bg-tfy-navy text-tfy-parchment">
        <div className="mx-auto max-w-[1100px] px-5 py-24 text-center sm:px-8 lg:py-28">
          <p className="meta-label text-tfy-gold">Ready to Start?</p>
          <h2 className="mx-auto mt-4 max-w-3xl font-display text-4xl leading-tight sm:text-5xl">
            There&apos;s a place for you here
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg text-tfy-parchment/75">
            Reach out and we&apos;ll help you find the role that fits your time,
            skills, and interests.
          </p>
          <Link href="/contact" className="mt-10 inline-flex rounded-full bg-tfy-gold px-8 py-3.5 text-sm font-semibold text-tfy-navy transition-all hover:bg-tfy-gold-dark hover:text-white">
            Contact Us
          </Link>
        </div>
      </section>
    </>
  );
}
