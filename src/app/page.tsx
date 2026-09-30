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
          <div className="relative mx-auto max-w-md px-4 py-10 sm:py-16">
            <p className="mb-3 text-sm font-medium uppercase tracking-wide text-havii-teal">
              For youth ages 13–24
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-havii-ink sm:text-4xl">
              A place to connect, grow, and find support.
            </h1>
            <p className="mt-4 text-base text-havii-muted">
              HAVII helps young people build confidence, find mentors, and access
              caring support — calm, trustworthy, and built for real life. From{" "}
              <span className="font-medium text-havii-ink">Together For You, Inc.</span>
            </p>
            <div className="mt-8 flex flex-col gap-3">
              <Link href="/auth/sign-up">
                <Button size="lg" className="w-full">Join HAVII</Button>
              </Link>
              <Link href="/auth/login">
                <Button size="lg" variant="outline" className="w-full">
                  Log in
                </Button>
              </Link>
              <Link href="/help">
                <Button size="lg" variant="ghost" className="w-full">
                  Need help now?
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="border-t border-havii-mist bg-white">
          <div className="mx-auto max-w-md px-4 py-10">
            <h2 className="text-xl font-semibold text-havii-ink">What HAVII offers</h2>
            <div className="mt-5 space-y-3">
              {[
                ["Mentorship", "Find someone in your corner — when matching opens."],
                ["Growth", "Goals, programs, and skills that fit your path."],
                ["Support", "Resources and a Support Hub designed with care."],
                ["Safety-first", "Clear help paths. Privacy respected. No clinical diagnosis."],
              ].map(([title, body]) => (
                <Card key={title} className="bg-havii-cream/60">
                  <CardTitle className="text-base">{title}</CardTitle>
                  <CardDescription>{body}</CardDescription>
                </Card>
              ))}
            </div>
            <h2 className="mt-8 text-xl font-semibold text-havii-ink">Who HAVII is for</h2>
            <div className="mt-5 space-y-3">
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
            <p className="mt-6 text-sm text-havii-muted">
              Staff and administrators use invitation-only accounts for operations.
            </p>
          </div>
        </section>
      </main>
      <footer className="border-t border-havii-mist bg-havii-cream">
        <div className="mx-auto flex max-w-md flex-col gap-2 px-4 py-6 text-sm text-havii-muted">
          <p>
            © {new Date().getFullYear()} HAVII · Together For You, Inc.
          </p>
          <Link href="/help" className="hover:text-havii-teal">
            Help &amp; crisis resources
          </Link>
        </div>
      </footer>
    </div>
  );
}
