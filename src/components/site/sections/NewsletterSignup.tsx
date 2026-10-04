export function NewsletterSignup() {
  return (
    <section className="bg-tfy-parchment-warm">
      <div className="mx-auto max-w-[900px] px-5 py-24 text-center sm:px-8 lg:py-32">
        <p className="meta-label text-tfy-blue">Stay Connected</p>
        <h2 className="mt-4 font-display text-4xl text-tfy-navy sm:text-5xl">
          Join the Movement
        </h2>
        <p className="mx-auto mt-5 max-w-md text-lg text-tfy-muted">
          Get updates on programs, impact, and ways to get involved — delivered
          occasionally. No spam, ever.
        </p>

        <form className="mx-auto mt-10 flex max-w-md flex-col gap-3 sm:flex-row">
          <label htmlFor="newsletter-email" className="sr-only">
            Email address
          </label>
          <input
            id="newsletter-email"
            type="email"
            required
            placeholder="you@example.com"
            className="flex-1 rounded-full border border-tfy-line bg-white px-6 py-3.5 text-base text-tfy-navy outline-none transition focus:border-tfy-blue focus:ring-2 focus:ring-tfy-blue/20"
          />
          <button
            type="submit"
            className="rounded-full bg-tfy-navy px-8 py-3.5 text-sm font-semibold text-tfy-parchment transition-all hover:bg-tfy-navy-soft"
          >
            Subscribe
          </button>
        </form>
        <p className="mt-5 text-xs text-tfy-muted">
          [Newsletter signup is a placeholder — backend integration coming soon.]
        </p>
      </div>
    </section>
  );
}
