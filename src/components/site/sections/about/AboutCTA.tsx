import Link from "next/link";

export function AboutCTA() {
  return (
    <section className="bg-tfy-navy text-tfy-parchment">
      <div className="mx-auto max-w-[1100px] px-5 py-24 text-center sm:px-8 lg:py-28">
        <p className="meta-label text-tfy-gold">Join Us</p>
        <h2 className="mx-auto mt-4 max-w-3xl font-display text-4xl leading-tight sm:text-5xl lg:text-[3.25rem]">
          Help Us Build What Comes Next
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-tfy-parchment/75">
          Whether you are a young person, parent, educator, community
          organization, funder, volunteer, or professional, there is a place
          for you to be part of the work.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/get-involved"
            className="rounded-full bg-tfy-gold px-8 py-3.5 text-sm font-semibold text-tfy-navy transition-all hover:bg-tfy-gold-dark hover:text-white"
          >
            Get Involved
          </Link>
          <Link
            href="/contact"
            className="rounded-full border border-tfy-parchment/30 px-8 py-3.5 text-sm font-semibold text-tfy-parchment transition-all hover:border-tfy-gold hover:text-tfy-gold"
          >
            Partner With Us
          </Link>
        </div>
      </div>
    </section>
  );
}
