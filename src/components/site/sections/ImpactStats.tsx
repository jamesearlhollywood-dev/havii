import Link from "next/link";

const STATS = [
  {
    value: "[—]",
    label: "Young people supported",
    desc: "Through mentorship, wellness, and skill-building programs across Maryland.",
  },
  {
    value: "[—]",
    label: "Families engaged",
    desc: "Connected to resources, care, and community support networks.",
  },
  {
    value: "[—]",
    label: "Community partners",
    desc: "Schools, foundations, and local organizations working alongside us.",
  },
];

export function ImpactStats() {
  return (
    <section className="bg-tfy-parchment">
      <div className="mx-auto max-w-[1400px] px-5 py-24 sm:px-8 lg:py-32">
        <div className="mb-16 max-w-2xl">
          <p className="meta-label text-tfy-clay">Proof in Numbers</p>
          <h2 className="mt-3 font-display text-4xl text-tfy-navy sm:text-5xl">
            Our Impact
          </h2>
          <p className="mt-5 text-lg text-tfy-muted">
            Verified outcomes will be displayed here once data is confirmed.
            These placeholders mark where verified statistics will appear.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3">
          {STATS.map((s, i) => (
            <div
              key={s.label}
              className={`px-2 py-8 md:px-10 ${
                i > 0 ? "border-t border-tfy-line md:border-l md:border-t-0" : ""
              }`}
            >
              <p className="font-display text-[5rem] leading-none text-tfy-navy lg:text-[6rem]">
                {s.value}
              </p>
              <p className="mt-4 text-lg font-semibold text-tfy-navy">
                {s.label}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-tfy-muted">
                {s.desc}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-tfy-line pt-8">
          <Link
            href="/impact"
            className="meta-label text-tfy-navy transition-colors hover:text-tfy-clay"
          >
            <span className="border-b border-tfy-navy/30 pb-0.5 hover:border-tfy-clay">
              View research & full impact report →
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
