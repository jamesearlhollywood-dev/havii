export function AboutMission() {
  return (
    <>
      {/* Mission */}
      <section className="bg-tfy-navy text-tfy-parchment">
        <div className="mx-auto max-w-[1100px] px-5 py-20 text-center sm:px-8 lg:py-28">
          <p className="meta-label text-tfy-gold">Our Mission</p>
          <p className="mx-auto mt-6 max-w-4xl font-display text-2xl leading-relaxed sm:text-3xl lg:text-[2.25rem] lg:leading-snug">
            Together For You, Inc. empowers young people, families, and
            communities through mentorship, wellness support, career readiness,
            education, digital literacy, family engagement, and advocacy.
          </p>
        </div>
      </section>

      {/* Vision */}
      <section className="bg-tfy-parchment-warm">
        <div className="mx-auto max-w-[1100px] px-5 py-20 text-center sm:px-8 lg:py-28">
          <p className="meta-label text-tfy-gold">Our Vision</p>
          <p className="mx-auto mt-6 max-w-4xl font-display text-2xl leading-relaxed text-tfy-navy sm:text-3xl lg:text-[2.25rem] lg:leading-snug">
            We envision communities where every young person has access to
            supportive relationships, meaningful opportunities, practical
            resources, and the confidence to build a healthy and successful
            future.
          </p>
        </div>
      </section>
    </>
  );
}
