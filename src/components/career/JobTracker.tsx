"use client";

import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import {
  createJobApplicationAction,
  updateJobStatusAction,
  deleteJobApplicationAction,
} from "@/actions/job-application";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import type { JobApplication, JobStatus } from "@/lib/career/types";
import { JOB_STATUSES, EMPLOYMENT_TYPES, WORK_MODES } from "@/lib/career/types";

const statusOptions = JOB_STATUSES.map((s) => ({ value: s, label: s }));
const employmentOptions = [
  { value: "", label: "Any" },
  ...EMPLOYMENT_TYPES.map((e) => ({ value: e, label: e })),
];
const workModeOptions = [
  { value: "", label: "Any" },
  ...WORK_MODES.map((w) => ({ value: w, label: w })),
];

export function JobTracker({ jobs }: { jobs: JobApplication[] }) {
  const [search, setSearch] = useState("");

  const filtered = jobs.filter((job) => {
    const q = search.toLowerCase().trim();
    if (!q) return true;
    return [job.title, job.company, job.location]
      .filter(Boolean)
      .some((field) => field!.toLowerCase().includes(q));
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-career-navy">Job Tracker</h1>
          <p className="mt-1 text-sm text-career-slate">
            Manage all your tracked opportunities in one place.
          </p>
        </div>
      </div>

      <AddOpportunityForm />

      <div className="rounded-xl border border-career-border bg-white shadow-sm">
        <div className="border-b border-career-border px-5 py-4">
          <Input
            placeholder="Search by company, job title, or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {filtered.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <p className="text-sm text-career-slate">
              {search
                ? "No jobs match your search."
                : "No jobs tracked yet. Add your first opportunity above."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-career-border text-left text-xs font-medium uppercase tracking-wide text-career-slate">
                  <th className="px-5 py-3">Job Title</th>
                  <th className="px-5 py-3">Company</th>
                  <th className="px-5 py-3">Location</th>
                  <th className="px-5 py-3">Salary</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Date Added</th>
                  <th className="px-5 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-career-border">
                {filtered.map((job) => (
                  <JobRow key={job.id} job={job} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function JobRow({ job }: { job: JobApplication }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleStatusChange(status: JobStatus) {
    startTransition(async () => {
      await updateJobStatusAction(job.id, status);
      router.refresh();
    });
  }

  function handleDelete() {
    if (!confirm("Remove this job from your tracker?")) return;
    startTransition(async () => {
      await deleteJobApplicationAction(job.id);
      router.refresh();
    });
  }

  const dateAdded = new Date(job.created_at).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <tr className="text-sm hover:bg-career-surface">
      <td className="px-5 py-3.5">
        <a
          href={`/app/jobs/${job.id}`}
          className="font-medium text-career-navy hover:text-career-blue"
        >
          {job.title || "Untitled role"}
        </a>
      </td>
      <td className="px-5 py-3.5 text-career-slate">{job.company || "—"}</td>
      <td className="px-5 py-3.5 text-career-slate">{job.location || "—"}</td>
      <td className="px-5 py-3.5 text-career-slate">{job.salary_text || "—"}</td>
      <td className="px-5 py-3.5">
        <select
          value={job.status}
          onChange={(e) => handleStatusChange(e.target.value as JobStatus)}
          disabled={isPending}
          className="rounded-lg border border-career-border bg-white px-2 py-1 text-xs font-medium text-career-navy focus:outline-none focus-visible:ring-2 focus-visible:ring-career-blue"
        >
          {statusOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </td>
      <td className="px-5 py-3.5 text-career-slate">{dateAdded}</td>
      <td className="px-5 py-3.5">
        <button
          type="button"
          onClick={handleDelete}
          disabled={isPending}
          className="text-xs font-medium text-red-600 hover:text-red-700 disabled:opacity-50"
        >
          Delete
        </button>
      </td>
    </tr>
  );
}

function AddOpportunityForm() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  async function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await createJobApplicationAction({}, formData);
      if (result.success) {
        setOpen(false);
        router.refresh();
      } else if (result.error) {
        setError(result.error);
      }
    });
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-career-border bg-white px-4 py-4 text-sm font-medium text-career-slate transition hover:border-career-blue hover:text-career-blue"
      >
        + Add Opportunity
      </button>
    );
  }

  return (
    <form
      action={handleSubmit}
      className="space-y-4 rounded-xl border border-career-border bg-white p-5 shadow-sm"
    >
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-career-navy">Add Opportunity</h3>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-sm text-career-slate hover:text-career-navy"
        >
          Cancel
        </button>
      </div>

      {error ? <Alert tone="error">{error}</Alert> : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <Input name="company" label="Company" placeholder="Acme Corp" />
        <Input name="title" label="Job title" placeholder="Software Engineer" />
        <Input name="location" label="Location" placeholder="Remote / San Francisco" />
        <Input name="salary_text" label="Salary or salary range" placeholder="$120k–$140k" />
        <Select
          name="employment_type"
          label="Employment type"
          options={employmentOptions}
        />
        <Select name="work_mode" label="Work arrangement" options={workModeOptions} />
        <Input name="job_url" label="Job URL" placeholder="https://..." />
        <Select
          name="status"
          label="Status"
          options={statusOptions}
          defaultValue="Saved"
        />
      </div>
      <Textarea
        name="notes"
        label="Notes"
        placeholder="Any notes about this opportunity..."
        className="min-h-[80px]"
      />

      <div className="flex justify-end">
        <Button type="submit" loading={pending}>
          Add to Tracker
        </Button>
      </div>
    </form>
  );
}
