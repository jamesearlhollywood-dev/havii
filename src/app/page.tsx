import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let user = null;
  try {
    const supabase = await createClient();
    const result = await supabase.auth.getUser();
    user = result.data.user;
  } catch {
    // Supabase not configured — show landing page
  }

  if (user) redirect("/app/dashboard");

  return (
    <div className="min-h-screen bg-career-bg">
      {/* Header */}
      <header className="border-b border-career-border bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-career-blue text-sm font-bold text-white">
              C
            </span>
            <span className="font-semibold text-career-navy">Career AI</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/auth/login"
              className="text-sm font-medium text-career-slate hover:text-career-navy"
            >
              Log in
            </Link>
            <Link
              href="/auth/sign-up"
              className="rounded-lg bg-career-blue px-4 py-2 text-sm font-medium text-white hover:bg-career-blue-dark"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(37,99,235,0.08),_transparent_50%)]" />
        <div className="relative mx-auto max-w-6xl px-4 py-20 text-center">
          <p className="mb-3 text-sm font-medium uppercase tracking-wide text-career-blue">
            Your career command center
          </p>
          <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight text-career-navy sm:text-5xl">
            Organize your job search. Land your next role.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-career-slate">
            Career AI helps you track applications, tailor resumes, prepare for
            interviews, and discover new opportunities — all in one professional workspace.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/auth/sign-up"
              className="rounded-xl bg-career-blue px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-career-blue-dark"
            >
              Start free
            </Link>
            <Link
              href="/auth/login"
              className="rounded-xl border border-career-border bg-white px-6 py-3 text-base font-medium text-career-navy hover:bg-career-surface"
            >
              Log in
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-career-border bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Job Tracker",
                body: "Track every application from saved to offer with a clear status pipeline.",
              },
              {
                title: "Find Jobs",
                body: "Search and discover opportunities through connected job APIs.",
              },
              {
                title: "Resume AI",
                body: "Tailor resumes and generate cover letters with AI assistance.",
              },
              {
                title: "Interview Prep",
                body: "Practice with AI-powered mock interviews and get instant feedback.",
              },
              {
                title: "Career Profile",
                body: "Define your target roles, skills, and preferences to guide your search.",
              },
              {
                title: "Dashboard",
                body: "See your career stats at a glance — applications, interviews, offers.",
              },
            ].map((f) => (
              <div
                key={f.title}
                className="rounded-xl border border-career-border bg-career-bg p-5"
              >
                <h3 className="font-semibold text-career-navy">{f.title}</h3>
                <p className="mt-1.5 text-sm text-career-slate">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-career-border bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-6 text-sm text-career-slate">
          <p>© {new Date().getFullYear()} Career AI</p>
          <Link href="/auth/login" className="hover:text-career-navy">
            Log in
          </Link>
        </div>
      </footer>
    </div>
  );
}
