import Link from "next/link";
import { MarketingHeader } from "@/components/layout/AppShell";
import { course, modules } from "@/data/course";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-rise-sky">
      <MarketingHeader />
      <main>
        {/* Hero */}
        <section className="relative overflow-hidden bg-rise-navy">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(91,163,224,0.15),_transparent_50%),radial-gradient(circle_at_bottom_left,_rgba(200,16,46,0.1),_transparent_40%)]" />
          <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:py-24 lg:grid-cols-2 lg:items-center">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-rise-red/15 px-4 py-1.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-rise-red-light">
                  For High School Juniors & Seniors
                </span>
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
                Build What Lasts.
              </h1>
              <p className="mt-2 text-xl font-medium text-rise-blue-light">
                Roadmap to Income, Savings, and Equity
              </p>
              <p className="mt-6 max-w-xl text-lg text-white/80">
                RISE USA gives you the real-world financial knowledge you need to
                navigate income, banking, credit, education, investing, and
                independent living — with confidence.
              </p>
              <p className="mt-4 text-sm font-medium uppercase tracking-wider text-rise-blue">
                Start Small. Scale Smart. Stay Consistent.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/auth/sign-up"
                  className="rounded-xl bg-rise-red px-6 py-3 text-base font-semibold text-white shadow-lg shadow-rise-red/30 hover:bg-rise-red-dark"
                >
                  Start Learning
                </Link>
                <Link
                  href="/auth/login"
                  className="rounded-xl border border-white/20 bg-white/5 px-6 py-3 text-base font-semibold text-white hover:bg-white/10"
                >
                  Log in
                </Link>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="grid grid-cols-2 gap-4">
                {modules.slice(0, 4).map((m) => (
                  <div
                    key={m.id}
                    className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur"
                  >
                    <div className="mb-2 text-3xl">{m.icon}</div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-rise-blue-light">
                      Module {m.number}
                    </p>
                    <p className="mt-1 text-sm font-medium text-white/90">
                      {m.title.split("—")[0].trim()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Modules overview */}
        <section className="bg-white">
          <div className="mx-auto max-w-7xl px-4 py-16">
            <div className="mb-10 text-center">
              <h2 className="text-3xl font-bold text-rise-navy">Six Modules. Real Skills.</h2>
              <p className="mt-3 text-lg text-rise-muted">
                Each module includes lessons, a Decision Lab, knowledge checks, and
                builds your personal Financial Blueprint.
              </p>
            </div>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {modules.map((m) => (
                <div
                  key={m.id}
                  className="group rounded-2xl border border-rise-border bg-rise-sky/50 p-6 transition-shadow hover:shadow-lg"
                >
                  <div className="mb-3 flex items-center gap-3">
                    <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-2xl shadow-sm">
                      {m.icon}
                    </span>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-rise-red">
                        Module {m.number}
                      </p>
                      <p className="text-xs text-rise-muted">{m.estimatedTime}</p>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-rise-navy">
                    {m.title.split("—")[0].trim()}
                  </h3>
                  <p className="mt-1 text-sm text-rise-muted">
                    {m.title.split("—")[1]?.trim() || m.subtitle}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {m.objectives.slice(0, 3).map((obj, i) => (
                      <span
                        key={i}
                        className="rounded-full bg-white px-2.5 py-1 text-xs text-rise-muted"
                      >
                        {obj.length > 40 ? obj.slice(0, 40) + "…" : obj}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="bg-rise-sky">
          <div className="mx-auto max-w-7xl px-4 py-16">
            <div className="grid gap-8 md:grid-cols-3">
              {[
                {
                  icon: "🎯",
                  title: "Decision Labs",
                  body: "Practice real financial decisions in a safe, fictional environment — from reading a paystub to building an investment portfolio.",
                },
                {
                  icon: "📋",
                  title: "Financial Blueprint",
                  body: "Build a personalized 12-month financial plan throughout the course, section by section, and export it as a PDF when you're done.",
                },
                {
                  icon: "🏆",
                  title: "Certificate of Completion",
                  body: "Complete all modules, Decision Labs, Blueprint sections, and the final assessment to earn your RISE USA Certificate.",
                },
              ].map((f) => (
                <div key={f.title} className="rounded-2xl border border-rise-border bg-white p-6">
                  <div className="mb-3 text-3xl">{f.icon}</div>
                  <h3 className="text-lg font-bold text-rise-navy">{f.title}</h3>
                  <p className="mt-2 text-sm text-rise-muted">{f.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* For organizations */}
        <section className="bg-rise-navy">
          <div className="mx-auto max-w-7xl px-4 py-16">
            <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
              <div>
                <h2 className="text-3xl font-bold text-white">For Schools & Organizations</h2>
                <p className="mt-3 text-lg text-white/80">
                  RISE USA supports schools, nonprofits, workforce programs, and
                  community groups. Instructors track student progress, organizations
                  manage cohorts, and admins oversee everything.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  {["Schools", "Nonprofits", "Workforce Programs", "Community Groups"].map((t) => (
                    <span
                      key={t}
                      className="rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  { title: "Instructor Dashboard", body: "Track cohorts, student progress, scores, and follow-ups." },
                  { title: "Organization Manager", body: "See learners connected to your organization." },
                  { title: "Cohorts & Enrollment", body: "Organize students by semester, site, or program." },
                  { title: "CSV Import/Export", body: "Bulk enrollment and progress reporting." },
                ].map((item) => (
                  <div key={item.title} className="rounded-xl border border-white/10 bg-white/5 p-5">
                    <h3 className="text-sm font-bold text-white">{item.title}</h3>
                    <p className="mt-1 text-xs text-white/70">{item.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-white">
          <div className="mx-auto max-w-4xl px-4 py-20 text-center">
            <h2 className="text-4xl font-bold text-rise-navy">Ready to Build What Lasts?</h2>
            <p className="mt-4 text-lg text-rise-muted">
              Join RISE USA and take control of your financial future — one module at a time.
            </p>
            <div className="mt-8 flex justify-center gap-3">
              <Link
                href="/auth/sign-up"
                className="rounded-xl bg-rise-navy px-8 py-3.5 text-base font-semibold text-white hover:bg-rise-navy-light"
              >
                Create Your Account
              </Link>
              <Link
                href="/auth/login"
                className="rounded-xl border border-rise-border bg-white px-8 py-3.5 text-base font-semibold text-rise-navy hover:bg-rise-sky"
              >
                Log in
              </Link>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t border-rise-border bg-white">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-2 px-4 py-8 text-sm text-rise-muted sm:flex-row sm:justify-between">
          <p className="flex items-center gap-2">
            <span className="font-semibold text-rise-navy">RISE USA</span>
            <span className="text-rise-red">·</span>
            <span>Build What Lasts</span>
          </p>
          <p>© {new Date().getFullYear()} RISE USA · Roadmap to Income, Savings, and Equity</p>
        </div>
      </footer>
    </div>
  );
}
