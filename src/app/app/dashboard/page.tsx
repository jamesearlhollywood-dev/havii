import Link from "next/link";
import { getJobStats, getRecentJobApplications } from "@/actions/job-application";
import { StatusBadge } from "@/components/career/StatusBadge";
import { StatCard } from "@/components/career/StatCard";
import { Card } from "@/components/ui/Card";

export const dynamic = "force-dynamic";
export const metadata = { title: "Dashboard" };

function StatIcon({ children }: { children: React.ReactNode }) {
  return <span className="text-lg">{children}</span>;
}

export default async function DashboardPage() {
  const [stats, recentJobs] = await Promise.all([
    getJobStats(),
    getRecentJobApplications(5),
  ]);

  return (
    <div className="space-y-6">
      {/* Welcome header */}
      <div>
        <h1 className="text-2xl font-bold text-career-navy">Dashboard</h1>
        <p className="mt-1 text-sm text-career-slate">
          Your career command center — track progress and take the next step.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Tracked Jobs"
          value={stats.total}
          accent="slate"
          icon={<StatIcon>📋</StatIcon>}
        />
        <StatCard
          label="Applications Submitted"
          value={stats.applied}
          accent="blue"
          icon={<StatIcon>📤</StatIcon>}
        />
        <StatCard
          label="Active Interviews"
          value={stats.interview}
          accent="amber"
          icon={<StatIcon>🎤</StatIcon>}
        />
        <StatCard
          label="Offers Received"
          value={stats.offer}
          accent="emerald"
          icon={<StatIcon>🎉</StatIcon>}
        />
      </div>

      {/* Quick actions */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Link
          href="/app/find-jobs"
          className="rounded-xl border border-career-border bg-white p-4 shadow-sm transition hover:border-career-blue hover:shadow-md"
        >
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-career-blue">
              🔍
            </span>
            <div>
              <p className="font-medium text-career-navy">Find Jobs</p>
              <p className="text-xs text-career-slate">Search new opportunities</p>
            </div>
          </div>
        </Link>
        <Link
          href="/app/job-tracker"
          className="rounded-xl border border-career-border bg-white p-4 shadow-sm transition hover:border-career-blue hover:shadow-md"
        >
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
              ➕
            </span>
            <div>
              <p className="font-medium text-career-navy">Add a Job</p>
              <p className="text-xs text-career-slate">Track a new opportunity</p>
            </div>
          </div>
        </Link>
        <Link
          href="/app/resume-ai"
          className="rounded-xl border border-career-border bg-white p-4 shadow-sm transition hover:border-career-blue hover:shadow-md"
        >
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-career-blue">
              ✨
            </span>
            <div>
              <p className="font-medium text-career-navy">Improve Resume</p>
              <p className="text-xs text-career-slate">Tailor with AI</p>
            </div>
          </div>
        </Link>
        <Link
          href="/app/interview-prep"
          className="rounded-xl border border-career-border bg-white p-4 shadow-sm transition hover:border-career-blue hover:shadow-md"
        >
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
              🎤
            </span>
            <div>
              <p className="font-medium text-career-navy">Practice Interview</p>
              <p className="text-xs text-career-slate">Mock sessions with AI</p>
            </div>
          </div>
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent opportunities */}
        <div className="lg:col-span-2">
          <div className="rounded-xl border border-career-border bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-career-border px-5 py-4">
              <h2 className="font-semibold text-career-navy">Recent Opportunities</h2>
              <Link
                href="/app/job-tracker"
                className="text-sm font-medium text-career-blue hover:underline"
              >
                View all
              </Link>
            </div>
            {recentJobs.length === 0 ? (
              <div className="px-5 py-12 text-center">
                <p className="text-sm text-career-slate">
                  No jobs tracked yet. Start by finding jobs or adding one manually.
                </p>
                <div className="mt-4 flex justify-center gap-3">
                  <Link
                    href="/app/find-jobs"
                    className="rounded-lg bg-career-blue px-4 py-2 text-sm font-medium text-white hover:bg-career-blue-dark"
                  >
                    Find Jobs
                  </Link>
                  <Link
                    href="/app/job-tracker"
                    className="rounded-lg border border-career-border px-4 py-2 text-sm font-medium text-career-navy hover:bg-career-surface"
                  >
                    Add a Job
                  </Link>
                </div>
              </div>
            ) : (
              <div className="divide-y divide-career-border">
                {recentJobs.map((job) => (
                  <Link
                    key={job.id}
                    href={`/app/jobs/${job.id}`}
                    className="flex items-center justify-between px-5 py-4 transition hover:bg-career-surface"
                  >
                    <div className="min-w-0">
                      <p className="font-medium text-career-navy">
                        {job.title || "Untitled role"}
                      </p>
                      <p className="text-sm text-career-slate">
                        {job.company || "Unknown company"}
                        {job.location ? ` · ${job.location}` : ""}
                      </p>
                    </div>
                    <StatusBadge status={job.status} />
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Career AI Studio card */}
        <div>
          <Card className="flex h-full flex-col justify-between bg-gradient-to-br from-career-navy to-career-navy-2 text-white">
            <div>
              <h2 className="text-lg font-semibold">Career AI Studio</h2>
              <p className="mt-1.5 text-sm text-slate-300">
                Tailor your resume, generate cover letters, and practice
                interviews — all powered by AI.
              </p>
            </div>
            <div className="mt-6 space-y-3">
              <Link
                href="/app/resume-ai"
                className="block rounded-lg bg-career-blue px-4 py-2.5 text-center text-sm font-medium text-white hover:bg-career-blue-dark"
              >
                Go to Resume AI
              </Link>
              <Link
                href="/app/interview-prep"
                className="block rounded-lg border border-slate-600 px-4 py-2.5 text-center text-sm font-medium text-white hover:bg-career-navy-2"
              >
                Practice Interviews
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
