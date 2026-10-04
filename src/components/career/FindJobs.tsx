"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { searchJobsAction } from "@/actions/find-jobs";
import { saveJobFromSearchAction } from "@/actions/job-application";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { SaveSearchModal } from "@/components/career/SaveSearchModal";
import type { NormalizedJobResult } from "@/lib/career/types";
import { WORK_MODES, EMPLOYMENT_TYPES } from "@/lib/career/types";

const workModeOptions = [
  { value: "", label: "Any" },
  ...WORK_MODES.map((w) => ({ value: w, label: w })),
];
const employmentOptions = [
  { value: "", label: "Any" },
  ...EMPLOYMENT_TYPES.map((e) => ({ value: e, label: e })),
];
const datePostedOptions = [
  { value: "", label: "Any time" },
  { value: "24h", label: "Past 24 hours" },
  { value: "7d", label: "Past week" },
  { value: "30d", label: "Past month" },
];

type SearchState = "idle" | "loading" | "results" | "empty" | "error" | "not-configured";

export function FindJobs({ apiConfigured }: { apiConfigured: boolean }) {
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [workMode, setWorkMode] = useState("");
  const [employmentType, setEmploymentType] = useState("");
  const [salaryMin, setSalaryMin] = useState("");
  const [datePosted, setDatePosted] = useState("");

  const [state, setState] = useState<SearchState>("idle");
  const [results, setResults] = useState<NormalizedJobResult[]>([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    const res = await searchJobsAction({
      keyword,
      location,
      remote_only: remoteOnly,
      work_mode: workMode || null,
      employment_type: employmentType || null,
      salary_min: salaryMin ? Number(salaryMin) : null,
      date_posted: datePosted || null,
    });

    if (res.error) {
      setErrorMsg(res.error);
      setState("error");
    } else if (!res.configured) {
      setState("not-configured");
    } else if (res.results.length === 0) {
      setState("empty");
    } else {
      setResults(res.results);
      setState("results");
    }
  }

  function handleSave(job: NormalizedJobResult) {
    startTransition(async () => {
      await saveJobFromSearchAction(job);
      setSavedIds((prev) => new Set(prev).add(job.source_job_id));
      router.refresh();
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-career-navy">Find Jobs</h1>
        <p className="mt-1 text-sm text-career-slate">
          Search and discover opportunities through connected job APIs.
        </p>
      </div>

      {/* Search section */}
      <form
        onSubmit={handleSearch}
        className="rounded-xl border border-career-border bg-white p-5 shadow-sm"
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Input
            label="Job title or keyword"
            placeholder="Software Engineer"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <Input
            label="Location"
            placeholder="San Francisco, CA"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <Select
            label="Work arrangement"
            options={workModeOptions}
            value={workMode}
            onChange={(e) => setWorkMode(e.target.value)}
          />
          <Select
            label="Employment type"
            options={employmentOptions}
            value={employmentType}
            onChange={(e) => setEmploymentType(e.target.value)}
          />
          <Input
            label="Minimum salary"
            type="number"
            placeholder="80000"
            value={salaryMin}
            onChange={(e) => setSalaryMin(e.target.value)}
          />
          <Select
            label="Date posted"
            options={datePostedOptions}
            value={datePosted}
            onChange={(e) => setDatePosted(e.target.value)}
          />
        </div>

        <div className="mt-4 flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm text-career-slate">
            <input
              type="checkbox"
              checked={remoteOnly}
              onChange={(e) => setRemoteOnly(e.target.checked)}
              className="h-4 w-4 rounded border-career-border text-career-blue focus:ring-career-blue"
            />
            Remote jobs only
          </label>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setSaveModalOpen(true)}
            >
              Save Search
            </Button>
            <Button type="submit" loading={state === "loading"}>
              Search Jobs
            </Button>
          </div>
        </div>
      </form>

      <SaveSearchModal
        open={saveModalOpen}
        onClose={() => setSaveModalOpen(false)}
        filters={{
          keywords: keyword,
          location,
          remote_only: remoteOnly,
          work_mode: workMode,
          employment_type: employmentType,
          minimum_salary: salaryMin,
          date_posted: datePosted,
        }}
      />

      {/* Results */}
      {state === "idle" && (
        <div className="rounded-xl border border-career-border bg-white p-12 text-center shadow-sm">
          <p className="text-sm text-career-slate">
            Enter your search criteria above and click <strong>Search Jobs</strong> to find opportunities.
          </p>
        </div>
      )}

      {state === "loading" && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-32 animate-pulse rounded-xl border border-career-border bg-white shadow-sm"
            />
          ))}
        </div>
      )}

      {state === "not-configured" && (
        <div className="rounded-xl border border-career-border bg-white p-12 text-center shadow-sm">
          <p className="text-base font-medium text-career-navy">Jobs API not connected</p>
          <p className="mx-auto mt-2 max-w-md text-sm text-career-slate">
            No external jobs provider is configured yet. Career AI is built to
            connect to any job-search API. Once a provider is connected, search
            results will appear here.
          </p>
          {!apiConfigured && (
            <p className="mt-4 text-xs text-career-slate">
              The search interface is fully functional and API-ready.
            </p>
          )}
        </div>
      )}

      {state === "empty" && (
        <div className="rounded-xl border border-career-border bg-white p-12 text-center shadow-sm">
          <p className="text-sm text-career-slate">
            No jobs found matching your criteria. Try adjusting your filters.
          </p>
        </div>
      )}

      {state === "error" && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
          <p className="text-sm font-medium text-red-700">Search error</p>
          <p className="mt-1 text-sm text-red-600">{errorMsg}</p>
        </div>
      )}

      {state === "results" && (
        <div className="space-y-3">
          <p className="text-sm text-career-slate">
            {results.length} {results.length === 1 ? "result" : "results"} found
          </p>
          {results.map((job) => {
            const isSaved = savedIds.has(job.source_job_id);
            return (
              <JobResultCard
                key={`${job.api_provider}-${job.source_job_id}`}
                job={job}
                isSaved={isSaved}
                onSave={() => handleSave(job)}
                saving={isPending}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

function JobResultCard({
  job,
  isSaved,
  onSave,
  saving,
}: {
  job: NormalizedJobResult;
  isSaved: boolean;
  onSave: () => void;
  saving: boolean;
}) {
  return (
    <div className="rounded-xl border border-career-border bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-career-navy">{job.title}</h3>
          <p className="mt-0.5 text-sm text-career-slate">
            {job.company}
            {job.location ? ` · ${job.location}` : ""}
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {job.work_mode ? (
              <Tag>{job.work_mode}</Tag>
            ) : null}
            {job.employment_type ? (
              <Tag>{job.employment_type}</Tag>
            ) : null}
            {job.salary_text ? (
              <Tag>{job.salary_text}</Tag>
            ) : null}
            {job.date_posted ? (
              <Tag>Posted {job.date_posted}</Tag>
            ) : null}
            {job.source ? (
              <Tag>{job.source}</Tag>
            ) : null}
          </div>
          {job.description ? (
            <p className="mt-3 line-clamp-2 text-sm text-career-slate">
              {job.description}
            </p>
          ) : null}
        </div>
        <div className="flex shrink-0 gap-2">
          {job.job_url ? (
            <a
              href={job.job_url}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-career-border px-3 py-2 text-sm font-medium text-career-navy hover:bg-career-surface"
            >
              View Job
            </a>
          ) : null}
          <button
            type="button"
            onClick={onSave}
            disabled={isSaved || saving}
            className={`rounded-lg px-3 py-2 text-sm font-medium ${
              isSaved
                ? "bg-emerald-50 text-emerald-700"
                : "bg-career-blue text-white hover:bg-career-blue-dark"
            } disabled:cursor-not-allowed`}
          >
            {isSaved ? "Saved ✓" : "Save Job"}
          </button>
        </div>
      </div>
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
