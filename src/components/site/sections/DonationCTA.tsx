import Link from "next/link";

const TIERS = [
  { amount: "$25", desc: "Provides program materials for a young person." },
  { amount: "$50", desc: "Supports a family connection session." },
  { amount: "$100", desc: "Funds a mentorship match for a month." },
];

export function DonationCTA() {
  return (
    <section className="bg-tfy-clay text-white">
      <div className="mx-auto max-w-[1100px] px-5 py-24 text-center sm:px-8 lg:py-32">
        <p className="meta-label text-white/70">Fuel the Mission</p>
        <h2 className="mx-auto mt-4 max-w-3xl font-display text-4xl leading-tight sm:text-5xl lg:text-[3.5rem]">
          Your gift builds the foundation for a thriving Maryland.
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-lg text-white/85">
          Every donation directly supports youth mentorship, family programs,
          and community initiatives across Maryland.
        </p>

        {/* Suggested tiers */}
        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {TIERS.map((t) => (
            <button
              key={t.amount}
              type="button"
              className="group rounded-3xl border border-white/25 bg-white/10 p-7 text-left transition-all hover:bg-white/20 hover:scale-[1.02]"
            >
              <span className="font-display text-4xl text-white">{t.amount}</span>
              <p className="mt-3 text-sm text-white/80">{t.desc}</p>
            </button>
          ))}
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/donate"
            className="rounded-full bg-white px-8 py-4 text-sm font-semibold text-tfy-clay-dark shadow-lg transition-all hover:bg-tfy-parchment hover:shadow-xl"
          >
            Donate Now
          </Link>
          <Link
            href="/get-involved"
            className="rounded-full border border-white/40 px-8 py-4 text-sm font-semibold text-white transition-all hover:bg-white/10"
          >
            Other Ways to Give
          </Link>
        </div>

        <p className="mt-8 text-xs text-white/60">
          Together For You, Inc. is a registered 501(c)(3). Donations are
          tax-deductible to the extent allowed by law. [EIN Placeholder]
        </p>
      </div>
    </section>
  );
}
