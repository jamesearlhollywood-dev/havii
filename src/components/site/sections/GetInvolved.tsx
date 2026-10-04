import Link from "next/link";

export function GetInvolved() {
  return (
    <section className="bg-tfy-parchment-warm">
      <div className="mx-auto max-w-[1100px] px-5 py-20 text-center sm:px-8 lg:py-28">
        <p className="meta-label text-tfy-gold">Be Part of It</p>
        <h2 className="mx-auto mt-4 max-w-3xl font-display text-4xl leading-tight text-tfy-navy sm:text-5xl lg:text-[3.25rem]">
          Get Involved
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-tfy-muted">
          Whether you have time, expertise, or resources to share — there&apos;s
          a place for you in this work. Volunteer, mentor, partner, or
          collaborate with TFY to help young people, families, and communities
          thrive.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/get-involved"
            className="rounded-full bg-tfy-navy px-8 py-3.5 text-sm font-semibold text-white transition-all hover:bg-tfy-navy-soft"
          >
            Find Your Role
          </Link>
          <Link
            href="/contact"
            className="rounded-full border border-tfy-navy/25 px-8 py-3.5 text-sm font-semibold text-tfy-navy transition-all hover:border-tfy-navy hover:bg-tfy-navy hover:text-white"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </section>
  );
}
