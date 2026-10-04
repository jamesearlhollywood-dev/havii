import Link from "next/link";

const SUPPORT_AREAS = [
  { title: "Youth Mentorship & Wellness", desc: "Supporting mentorship programs, wellness check-ins, peer support, and youth development initiatives." },
  { title: "Career Readiness & Education", desc: "Funding career exploration, professional development, work-based learning, and employment pathways." },
  { title: "Family & Community Programs", desc: "Strengthening families and communities through resources, connection, education, and support." },
  { title: "Research & Advocacy", desc: "Advancing research, publications, and advocacy on issues affecting young people and families." },
];

export function DonateContent() {
  return (
    <>
      {/* Why Give */}
      <section className="bg-tfy-parchment">
        <div className="mx-auto max-w-[1100px] px-5 py-20 sm:px-8 lg:py-28">
          <p className="meta-label text-tfy-gold">Why Give</p>
          <h2 className="mt-3 font-display text-4xl text-tfy-navy sm:text-5xl">
            Your gift moves people forward
          </h2>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-tfy-muted">
            Your support helps TFY connect young people, families, and
            communities with mentorship, wellness support, career readiness,
            education, and opportunities to move forward. Every contribution
            makes a difference.
          </p>
        </div>
      </section>

      {/* Where Support Goes */}
      <section className="bg-tfy-parchment-warm">
        <div className="mx-auto max-w-[1400px] px-5 py-20 sm:px-8 lg:py-28">
          <div className="mb-14 max-w-2xl">
            <p className="meta-label text-tfy-gold">Where Support Goes</p>
            <h2 className="mt-3 font-display text-4xl text-tfy-navy sm:text-5xl">
              How your donation is put to work
            </h2>
            <p className="mt-4 text-lg text-tfy-muted">
              Your generosity directly supports programs and initiatives across
              our focus areas. [Detailed allocation breakdown coming soon.]
            </p>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {SUPPORT_AREAS.map((area) => (
              <div key={area.title} className="rounded-3xl border border-tfy-line bg-white p-7">
                <h3 className="font-display text-lg leading-tight text-tfy-navy">{area.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-tfy-muted">{area.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Giving Options */}
      <section className="bg-tfy-parchment">
        <div className="mx-auto max-w-[1400px] px-5 py-20 sm:px-8 lg:py-28">
          <div className="mb-14 max-w-2xl">
            <p className="meta-label text-tfy-gold">Ways to Give</p>
            <h2 className="mt-3 font-display text-4xl text-tfy-navy sm:text-5xl">
              Choose what works for you
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* One-Time Giving */}
            <div className="rounded-[2rem] border border-tfy-line bg-white p-8">
              <h3 className="font-display text-2xl text-tfy-navy">One-Time Giving</h3>
              <p className="mt-4 text-base leading-relaxed text-tfy-muted">
                Make a single gift of any amount to support TFY&apos;s programs
                and initiatives across Maryland. Every gift makes a
                difference.
              </p>
              <Link href="#donate-now" className="mt-8 inline-flex items-center gap-2 rounded-full bg-tfy-navy px-7 py-3.5 text-sm font-semibold text-white transition-all hover:bg-tfy-navy-soft">
                Give Once
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M5 12h14m0 0l-6-6m6 6l-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>

            {/* Monthly Giving */}
            <div className="rounded-[2rem] border border-tfy-gold/30 bg-tfy-gold-tint/30 p-8">
              <h3 className="font-display text-2xl text-tfy-navy">Monthly Giving</h3>
              <p className="mt-4 text-base leading-relaxed text-tfy-muted">
                Become a monthly supporter and provide sustained, reliable
                funding for our work with young people and families. Monthly
                giving helps us plan ahead and deepen our impact.
              </p>
              <Link href="#donate-now" className="mt-8 inline-flex items-center gap-2 rounded-full bg-tfy-gold px-7 py-3.5 text-sm font-semibold text-tfy-navy transition-all hover:bg-tfy-gold-dark hover:text-white">
                Become a Monthly Supporter
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M5 12h14m0 0l-6-6m6 6l-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>

            {/* Sponsorship Opportunities */}
            <div className="rounded-[2rem] border border-tfy-line bg-white p-8">
              <h3 className="font-display text-2xl text-tfy-navy">Sponsorship Opportunities</h3>
              <p className="mt-4 text-base leading-relaxed text-tfy-muted">
                Sponsor a program, event, or initiative that aligns with your
                organization&apos;s mission and values. Sponsorship provides
                critical support for specific TFY programs.
              </p>
              <Link href="/contact" className="mt-8 inline-flex items-center gap-2 rounded-full border border-tfy-navy/20 px-7 py-3.5 text-sm font-semibold text-tfy-navy transition-all hover:border-tfy-navy hover:bg-tfy-navy hover:text-white">
                Explore Sponsorships
              </Link>
            </div>

            {/* Institutional Support */}
            <div className="rounded-[2rem] border border-tfy-line bg-white p-8">
              <h3 className="font-display text-2xl text-tfy-navy">Institutional Support</h3>
              <p className="mt-4 text-base leading-relaxed text-tfy-muted">
                Foundation grants, corporate giving, and institutional
                partnerships that advance our mission. We work with
                institutional partners to align support with shared goals.
              </p>
              <Link href="/contact" className="mt-8 inline-flex items-center gap-2 rounded-full border border-tfy-navy/20 px-7 py-3.5 text-sm font-semibold text-tfy-navy transition-all hover:border-tfy-navy hover:bg-tfy-navy hover:text-white">
                Partner with Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Donate Button Placeholder */}
      <section id="donate-now" className="scroll-mt-24 bg-tfy-navy text-tfy-parchment">
        <div className="mx-auto max-w-[1100px] px-5 py-24 text-center sm:px-8 lg:py-28">
          <p className="meta-label text-tfy-gold">Ready to Give?</p>
          <h2 className="mx-auto mt-4 max-w-3xl font-display text-4xl leading-tight sm:text-5xl">
            Make a difference today
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg text-tfy-parchment/75">
            Your generosity directly supports youth mentorship, wellness
            programs, career readiness, family support, and community
            initiatives across Maryland.
          </p>
          <button
            type="button"
            className="mt-10 rounded-full bg-tfy-gold px-12 py-4 text-base font-semibold text-tfy-navy transition-all hover:bg-tfy-gold-dark hover:text-white"
          >
            Donate Now
          </button>
          <p className="mt-6 text-xs text-tfy-parchment/50">
            [Donation processing integration coming soon. Together For You, Inc.
            is a registered 501(c)(3). Donations are tax-deductible to the
            extent allowed by law.]
          </p>
        </div>
      </section>
    </>
  );
}
