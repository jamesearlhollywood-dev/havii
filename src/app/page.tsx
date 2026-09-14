import Link from "next/link";
import { MarketingHeader } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/Button";
import { Card, CardDescription, CardTitle } from "@/components/ui/Card";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-havii-cream">
      <MarketingHeader />
      <main>
        <section className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(15,118,110,0.12),_transparent_45%),radial-gradient(circle_at_bottom_left,_rgba(224,122,95,0.12),_transparent_40%)]" />
          <div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:py-24 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="mb-3 text-sm font-medium uppercase tracking-wide text-havii-teal">
                For youth ages 13–24
              </p>
              <h1 className="text-4xl font-semibold tracking-tight text-havii-ink sm:text-5xl">
                A place to connect, grow, and find support.
              </h1>
              <p className="mt-4 max-w-xl text-lg text-havii-muted">
                HAVII helps young people build confidence, find mentors, and access
                caring support — calm, trustworthy, and built for real life. From{" "}
                <span className="font-medium text-havii-ink">Together For You, Inc.</span>
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/auth/sign-up">
                  <Button size="lg">Join HAVII</Button>
                </Link>
                <Link href="/auth/login">
                  <Button size="lg" variant="outline">
                    Log in
                  </Button>
                </Link>
                <Link href="/help">
                  <Button size="lg" variant="ghost">
                    Need help now?
                  </Button>
                </Link>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                {
                  title: "Mentorship",
                  body: "Find someone in your corner — when matching opens.",
                },
                {
                  title: "Growth",
                  body: "Goals, programs, and skills that fit your path.",
                },
                {
                  title: "Support",
                  body: "Resources and a Support Hub designed with care.",
                },
                {
                  title: "Safety-first",
                  body: "Clear help paths. Privacy respected. No clinical diagnosis.",
                },
              ].map((item) => (
                <Card key={item.title}>
                  <CardTitle>{item.title}</CardTitle>
                  <CardDescription>{item.body}</CardDescription>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-havii-mist bg-white">
          <div className="mx-auto max-w-6xl px-4 py-14">
            <h2 className="text-2xl font-semibold text-havii-ink">Who HAVII is for</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                ["Youth", "Explore support, mentors, goals, and community."],
                ["Mentors", "Apply, train, and walk alongside young people."],
                ["Caregivers", "Stay connected with consent and privacy."],
                ["Partners", "Collaborate on programs and referrals."],
              ].map(([title, body]) => (
                <Card key={title} className="bg-havii-cream/60">
                  <CardTitle className="text-base">{title}</CardTitle>
                  <CardDescription>{body}</CardDescription>
                </Card>
              ))}
            </div>
            <p className="mt-8 text-sm text-havii-muted">
              Staff and administrators use invitation-only accounts for operations.
            </p>
          </div>
        </section>
      </main>
      <footer className="border-t border-havii-mist bg-havii-cream">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-8 text-sm text-havii-muted sm:flex-row sm:justify-between">
          <p>
            © {new Date().getFullYear()} HAVII · Together For You, Inc.
          </p>
          <Link href="/help" className="hover:text-havii-teal">
            Help & crisis resources
          </Link>
        </div>
      </footer>
    </div>
  );
}
