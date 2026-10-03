"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { updateJobStatusAction, deleteJobApplicationAction } from "@/actions/job-application";
import { StatusBadge } from "@/components/career/StatusBadge";
import { Button } from "@/components/ui/Button";
import type { JobApplication, JobStatus } from "@/lib/career/types";
import { JOB_STATUSES } from "@/lib/career/types";

export function JobDetail({ job }: { job: JobApplication }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function changeStatus(status: JobStatus) {
    startTransition(async () => {
      await updateJobStatusAction(job.id, status);
      router.refresh();
    });
  }

  function handleDelete() {
    if (!confirm("Remove this job from your tracker?")) return;
    startTransition(async () => {
      await deleteJobApplicationAction(job.id);
      router.push("/app/job-tracker");
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/app/job-tracker"
          className="text-sm text-career-blue hover:underline"
        >
          ← Back to Job Tracker
        </Link>
      </div>

      {/* Header */}
      <div className="rounded-xl border border-career-border bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-career-navy">
              {job.title || "Untitled role"}
            </h1>
            <p className="mt-1 text-career-slate">
              {job.company || "Unknown company"}
              {job.location ? ` · ${job.location}` : ""}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <StatusBadge status={job.status} />
              {job.work_mode ? <Tag>{job.work_mode}</Tag> : null}
              {job.employment_type ? <Tag>{job.employment_type}</Tag> : null}
              {job.source ? <Tag>Source: {job.source}</Tag> : null}
            </div>
          </div>
          <div className="flex shrink-0 gap-2">
            {job.status !== "Applied" && (
              <Button
                onClick={() => changeStatus("Applied")}
                loading={isPending}
                size="sm"
              >
                Mark Applied
              </Button>
            )}
            <Link href="/app/resume-ai">
              <Button variant="outline" size="sm">
                Tailor Resume
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Details grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {job.description ? (
            <div className="rounded-xl border border-career-border bg-white p-6 shadow-sm">
              <h2 className="mb-3 font-semibold text-career-navy">Job Description</h2>
              <p className="whitespace-pre-wrap text-sm text-career-slate">
                {job.description}
              </p>
            </div>
          ) : null}

          {job.notes ? (
            <div className="rounded-xl border border-career-border bg-white p-6 shadow-sm">
              <h2 className="mb-3 font-semibold text-career-navy">Notes</h2>
              <p className="whitespace-pre-wrap text-sm text-career-slate">
                {job.notes}
              </p>
            </div>
          ) : null}
        </div>

        <div className="space-y-6">
          {/* Key details */}
          <div className="rounded-xl border border-career-border bg-white p-6 shadow-sm">
            <h2 className="mb-4 font-semibold text-career-navy">Details</h2>
            <dl className="space-y-3 text-sm">
              <DetailRow label="Salary" value={job.salary_text || "—"} />
              <DetailRow label="Work arrangement" value={job.work_mode || "—"} />
              <DetailRow label="Employment type" value={job.employment_type || "—"} />
              <DetailRow label="Location" value={job.location || "—"} />
              <DetailRow label="Source" value={job.source || "Manual entry"} />
              <DetailRow
                label="Applied date"
                value={
                  job.applied_date
                    ? new Date(job.applied_date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "—"
                }
              />
              <DetailRow
                label="Next action"
                value={
                  job.next_action_date
                    ? new Date(job.next_action_date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "—"
                }
              />
            </dl>

            {job.job_url ? (
              <a
                href={job.job_url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 block rounded-lg bg-career-blue px-4 py-2.5 text-center text-sm font-medium text-white hover:bg-career-blue-dark"
              >
                View Application URL
              </a>
            ) : null}
          </div>

          {/* Status control */}
          <div className="rounded-xl border border-career-border bg-white p-6 shadow-sm">
            <h2 className="mb-3 font-semibold text-career-navy">Update Status</h2>
            <div className="flex flex-wrap gap-2">
              {JOB_STATUSES.map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => changeStatus(status)}
                  disabled={isPending || job.status === status}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                    job.status === status
                      ? "bg-career-blue text-white"
                      : "border border-career-border text-career-slate hover:bg-career-surface"
                  } disabled:cursor-not-allowed`}
                >
                  {status}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={handleDelete}
              disabled={isPending}
              className="mt-4 w-full rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
            >
              Remove from Tracker
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-career-slate">{label}</dt>
      <dd className="text-right font-medium text-career-navy">{value}</dd>
    </div>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
      {children}
    </span>
  );
}
