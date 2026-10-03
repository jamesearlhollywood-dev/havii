"use client";

import { useState, useEffect, useTransition, useRef } from "react";
import { useRouter } from "next/navigation";
import { getRecommendationsAction, analyzeJobMatchAction } from "@/actions/job-match";
import { saveJobFromSearchAction } from "@/actions/job-application";
import { Select } from "@/components/ui/Select";
import type {
  RecommendedJob,
  RecommendationFilters,
  RecommendationSort,
  MatchLabel,
} from "@/lib/career/types";
import { EMPLOYMENT_TYPES } from "@/lib/career/types";
import type { RecommendationsResult } from "@/actions/types";

const sortOptions = [
  { value: "best_match", label: "Best Match" },
  { value: "newest", label: "Newest" },
  { value: "highest_salary", label: "Highest Salary" },
  { value: "most_relevant", label: "Most Relevant" },
];

const minScoreOptions = [
  { value: "0", label: "Any score" },
  { value: "60", label: "60+ (Potential+)" },
  { value: "75", label: "75+ (Strong+)" },
  { value: "90", label: "90+ (Excellent)" },
];

const employmentOptions = [
  { value: "", label: "Any type" },
  ...EMPLOYMENT_TYPES.map((e) => ({ value: e, label: e })),
];

const dateOptions = [
  { value: "", label: "Any time" },
  { value: "24h", label: "Past 24 hours" },
  { value: "7d", label: "Past week" },
  { value: "30d", label: "Past month" },
];

type LoadState = "loading" | "ready" | "incomplete" | "no-jobs" | "error";

export function JobRecommendations({ apiConfigured }: { apiConfigured: boolean }) {
  const [state, setState] = useState<LoadState>("loading");
  const [recommendations, setRecommendations] = useState<RecommendedJob[]>([]);
  const [analyzedCount, setAnalyzedCount] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");

  const [sortBy, setSortBy] = useState<RecommendationSort>("best_match");
  const [minScore, setMinScore] = useState(0);
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [salaryMin, setSalaryMin] = useState("");
  const [employmentType, setEmploymentType] = useState("");
  const [datePosted, setDatePosted] = useState("");

  const [savedKeys, setSavedKeys] = useState<Set<string>>(new Set());
  const [analyzingIds, setAnalyzingIds] = useState<Set<string>>(new Set());
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const firstLoad = useRef(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!firstLoad.current) setState("loading");
      firstLoad.current = false;

      const filters: Partial<RecommendationFilters> = {
        sortBy,
        minMatchScore: minScore,
        remoteOnly,
        salaryMin: salaryMin ? Number(salaryMin) : null,
        employmentType: employmentType || null,
        datePosted: datePosted || null,
      };

      const result: RecommendationsResult = await getRecommendationsAction(filters);
      if (cancelled) return;

      if (result.error) {
        setErrorMsg(result.error);
        setState("error");
        return;
      }
      if (!result.profileReady) {
        setState("incomplete");
        return;
      }
      if (result.recommendations.length === 0) {
        setState("no-jobs");
        return;
      }

      setRecommendations(result.recommendations);
      setAnalyzedCount(result.analyzedCount);
      setState("ready");
    }

    load();
    return () => { cancelled = true; };
  }, [sortBy, minScore, remoteOnly, salaryMin, employmentType, datePosted]);

  function handleSave(rec: RecommendedJob) {
    startTransition(async () => {
      await saveJobFromSearchAction(rec.job, rec.analysis?.match_score);
      setSavedKeys((prev) => new Set(prev).add(`${rec.job.api_provider}:${rec.job.source_job_id}`));
      router.refresh();
    });
  }

  async function handleAnalyze(rec: RecommendedJob, index: number) {
    const key = `${rec.job.api_provider}:${rec.job.source_job_id}`;
    setAnalyzingIds((prev) => new Set(prev).add(key));
    try {
      const result = await analyzeJobMatchAction(rec.job);
      if (result.analysis) {
        setRecommendations((prev) => {
          const updated = [...prev];
          updated[index] = { ...updated[index], analysis: result.analysis!, cached: true };
          return updated;
        });
      }
    } finally {
      setAnalyzingIds((prev) => {
        const next = new Set(prev);
        next.delete(key);
        return next;
      });
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-career-navy">Recommended for You</h2>
          <p className="mt-0.5 text-sm text-career-slate">
            Personalized job matches based on your career profile and resume.
          </p>
        </div>
      </div>

      {/* Filter bar */}
      {state !== "loading" && state !== "incomplete" && (
        <div className="flex flex-wrap items-end gap-3 rounded-xl border border-career-border bg-white p-4 shadow-sm">
          <div className="w-auto">
            <Select
              label="Sort by"
              options={sortOptions}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as RecommendationSort)}
              className="text-sm"
            />
          </div>
          <div className="w-auto">
            <Select
              label="Min match"
              options={minScoreOptions}
              value={String(minScore)}
              onChange={(e) => setMinScore(Number(e.target.value))}
              className="text-sm"
            />
          </div>
          <div className="w-auto">
            <Select
              label="Employment"
              options={employmentOptions}
              value={employmentType}
              onChange={(e) => setEmploymentType(e.target.value)}
              className="text-sm"
            />
          </div>
          <div className="w-auto">
            <Select
              label="Date posted"
              options={dateOptions}
              value={datePosted}
              onChange={(e) => setDatePosted(e.target.value)}
              className="text-sm"
            />
          </div>
          <div className="w-28">
            <label className="block text-sm font-medium text-career-navy">Min salary</label>
            <input
              type="number"
              placeholder="0"
              value={salaryMin}
              onChange={(e) => setSalaryMin(e.target.value)}
              className="w-full rounded-xl border border-career-border bg-white px-3 py-2 text-sm text-career-navy focus:outline-none focus-visible:ring-2 focus-visible:ring-career-blue"
            />
          </div>
          <label className="flex items-center gap-2 pb-2 text-sm text-career-slate">
            <input
              type="checkbox"
              checked={remoteOnly}
              onChange={(e) => setRemoteOnly(e.target.checked)}
              className="h-4 w-4 rounded border-career-border text-career-blue focus:ring-career-blue"
            />
            Remote only
          </label>
        </div>
      )}

      {/* Loading */}
      {state === "loading" && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-40 animate-pulse rounded-xl border border-career-border bg-white shadow-sm" />
          ))}
        </div>
      )}

      {/* Incomplete profile */}
      {state === "incomplete" && (
        <div className="rounded-xl border border-career-border bg-white p-10 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-50 text-2xl">
            ✦
          </div>
          <h3 className="mt-4 text-base font-semibold text-career-navy">
            Complete your profile for recommendations
          </h3>
          <p className="mx-auto mt-2 max-w-md text-sm text-career-slate">
            Complete your Career Profile and add a primary resume to receive
            personalized job recommendations.
          </p>
          <a
            href="/app/career-profile"
            className="mt-5 inline-block rounded-xl bg-career-blue px-5 py-2.5 text-sm font-medium text-white hover:bg-career-blue-dark"
          >
            Set Up Career Profile
          </a>
        </div>
      )}

      {/* No jobs */}
      {state === "no-jobs" && (
        <div className="rounded-xl border border-career-border bg-white p-10 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-50 text-2xl">
            🔍
          </div>
          <h3 className="mt-4 text-base font-semibold text-career-navy">
            No candidate jobs available
          </h3>
          <p className="mx-auto mt-2 max-w-md text-sm text-career-slate">
            {apiConfigured
              ? "No jobs matched your filters. Try adjusting your criteria or search for jobs above."
              : "Save jobs to your Job Tracker and they'll appear here for AI match analysis. Connect a jobs API provider for automated recommendations."}
          </p>
        </div>
      )}

      {/* Error */}
      {state === "error" && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
          <p className="text-sm font-medium text-red-700">Recommendations error</p>
          <p className="mt-1 text-sm text-red-600">{errorMsg}</p>
        </div>
      )}

      {/* Results */}
      {state === "ready" && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm text-career-slate">
              {recommendations.length} {recommendations.length === 1 ? "recommendation" : "recommendations"}
              {analyzedCount > 0 && ` · ${analyzedCount} newly analyzed`}
            </p>
          </div>
          {recommendations.map((rec, i) => {
            const key = `${rec.job.api_provider}:${rec.job.source_job_id}`;
            const isSaved = savedKeys.has(key);
            const isAnalyzing = analyzingIds.has(key);
            return (
              <RecommendationCard
                key={key}
                rec={rec}
                isSaved={isSaved}
                isAnalyzing={isAnalyzing}
                onSave={() => handleSave(rec)}
                onAnalyze={() => handleAnalyze(rec, i)}
                saving={isPending}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Recommendation card
// ---------------------------------------------------------------------------

const LABEL_STYLES: Record<MatchLabel, string> = {
  "Excellent Match": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Strong Match": "bg-blue-50 text-blue-700 border-blue-200",
  "Potential Match": "bg-amber-50 text-amber-700 border-amber-200",
  "Low Match": "bg-slate-100 text-slate-600 border-slate-200",
};

const SCORE_COLORS: Record<MatchLabel, string> = {
  "Excellent Match": "text-emerald-600",
  "Strong Match": "text-blue-600",
  "Potential Match": "text-amber-600",
  "Low Match": "text-slate-500",
};

function RecommendationCard({
  rec,
  isSaved,
  isAnalyzing,
  onSave,
  onAnalyze,
  saving,
}: {
  rec: RecommendedJob;
  isSaved: boolean;
  isAnalyzing: boolean;
  onSave: () => void;
  onAnalyze: () => void;
  saving: boolean;
}) {
  const { job, analysis } = rec;
  const label = analysis?.match_label;
  const score = analysis?.match_score;
  const topSkills = (analysis?.matching_skills ?? []).slice(0, 5);

  return (
    <div className="rounded-xl border border-career-border bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        {/* Job info */}
        <div className="min-w-0 flex-1">
          <div className="flex items-start gap-3">
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-career-navy">{job.title || "Untitled"}</h3>
              <p className="mt-0.5 text-sm text-career-slate">
                {job.company || "Unknown company"}
                {job.location ? ` · ${job.location}` : ""}
              </p>
            </div>
            {/* Match badge */}
            {label ? (
              <div className="shrink-0 text-right">
                <div className={`inline-flex items-center rounded-lg border px-3 py-1 text-sm font-semibold ${LABEL_STYLES[label]}`}>
                  {label}
                </div>
                <div className={`mt-1 text-2xl font-bold ${SCORE_COLORS[label]}`}>
                  {score}
                  <span className="text-sm font-normal text-slate-400">/100</span>
                </div>
              </div>
            ) : (
              <div className="shrink-0">
                <span className="inline-flex items-center rounded-lg border border-slate-200 bg-slate-50 px-3 py-1 text-sm font-medium text-slate-400">
                  Match not analyzed
                </span>
              </div>
            )}
          </div>

          {/* Tags */}
          <div className="mt-2 flex flex-wrap gap-2">
            {job.work_mode && <Tag>{job.work_mode}</Tag>}
            {job.employment_type && <Tag>{job.employment_type}</Tag>}
            {job.salary_text && <Tag>{job.salary_text}</Tag>}
            {job.date_posted && <Tag>Posted {job.date_posted}</Tag>}
            {job.source && <Tag>{job.source}</Tag>}
          </div>

          {/* Matching skills */}
          {topSkills.length > 0 && (
            <div className="mt-3">
              <p className="text-xs font-medium uppercase tracking-wide text-career-slate">
                Top matching skills
              </p>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {topSkills.map((s) => (
                  <span key={s} className="inline-flex items-center rounded-md bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Recommendation reason */}
          {analysis?.recommendation_reason && (
            <p className="mt-3 text-sm italic text-career-slate">
              {analysis.recommendation_reason}
            </p>
          )}
        </div>
      </div>

      {/* Action buttons */}
      <div className="mt-4 flex flex-wrap gap-2 border-t border-career-border pt-3">
        {job.job_url && (
          <a
            href={job.job_url}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-career-border px-3 py-2 text-sm font-medium text-career-navy hover:bg-career-surface"
          >
            View Job
          </a>
        )}
        {!isSaved && (
          <button
            type="button"
            onClick={onSave}
            disabled={saving}
            className="rounded-lg bg-career-blue px-3 py-2 text-sm font-medium text-white hover:bg-career-blue-dark disabled:opacity-50"
          >
            Save Job
          </button>
        )}
        {isSaved && (
          <span className="inline-flex items-center rounded-lg bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700">
            Saved ✓
          </span>
        )}
        {!analysis && (
          <button
            type="button"
            onClick={onAnalyze}
            disabled={isAnalyzing}
            className="rounded-lg border border-career-blue px-3 py-2 text-sm font-medium text-career-blue hover:bg-blue-50 disabled:opacity-50"
          >
            {isAnalyzing ? (
              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-career-blue border-r-transparent" />
            ) : (
              "Analyze Match"
            )}
          </button>
        )}
        {analysis && (
          <button
            type="button"
            onClick={onAnalyze}
            disabled={isAnalyzing}
            className="rounded-lg border border-career-border px-3 py-2 text-sm font-medium text-career-slate hover:bg-career-surface disabled:opacity-50"
          >
            {isAnalyzing ? "Re-analyzing…" : "Re-analyze"}
          </button>
        )}
        <a
          href="/app/resume-ai"
          className="rounded-lg border border-career-border px-3 py-2 text-sm font-medium text-career-navy hover:bg-career-surface"
        >
          Tailor Resume
        </a>
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
