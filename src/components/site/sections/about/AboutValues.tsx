const VALUES = [
  {
    title: "Dignity",
    desc: "We treat every person with respect, recognizing their inherent worth and potential.",
  },
  {
    title: "Connection",
    desc: "We believe meaningful relationships are the foundation of growth and change.",
  },
  {
    title: "Equity",
    desc: "We work to ensure that all young people and families have access to the opportunities they deserve.",
  },
  {
    title: "Growth",
    desc: "We support continuous learning, development, and the pursuit of each person's full potential.",
  },
  {
    title: "Accountability",
    desc: "We hold ourselves to high standards of transparency, integrity, and responsibility.",
  },
  {
    title: "Community",
    desc: "We strengthen communities by listening, collaborating, and building together.",
  },
];

export function AboutValues() {
  return (
    <section className="bg-tfy-parchment">
      <div className="mx-auto max-w-[1400px] px-5 py-20 sm:px-8 lg:py-28">
        <div className="mb-14 max-w-2xl">
          <p className="meta-label text-tfy-gold">Our Values</p>
          <h2 className="mt-3 font-display text-4xl text-tfy-navy sm:text-5xl">
            What guides us
          </h2>
          <p className="mt-4 text-lg text-tfy-muted">
            Six values shape our decisions, our programs, and our
            relationships.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {VALUES.map((value, i) => (
            <div
              key={value.title}
              className={`group rounded-3xl border border-tfy-line bg-white p-8 transition-all duration-300 hover:border-tfy-gold/40 hover:shadow-md reveal delay-${(i % 3) + 1}`}
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-tfy-gold-tint font-display text-lg font-semibold text-tfy-gold-dark">
                {i + 1}
              </span>
              <h3 className="mt-5 font-display text-2xl text-tfy-navy">
                {value.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-tfy-muted">
                {value.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
