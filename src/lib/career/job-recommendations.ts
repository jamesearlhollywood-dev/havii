// Job recommendation pipeline — modular, provider-agnostic.
//
// Pipeline steps:
//   1. Retrieve candidate profile (career profile + primary resume)
//   2. Retrieve available normalized jobs (saved jobs + external API if connected)
//   3. Apply basic eligibility and preference filters
//   4. Send qualified jobs to the AI matching service (jobMatchAnalysis)
//   5. Receive structured match analysis
//   6. Rank jobs by match score
//   7. Return highest-quality opportunities
//
// Caching: match analyses are persisted in job_match_analyses so subsequent page
// loads don't re-call the AI. Only uncached jobs are sent for analysis.

import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  CareerProfile,
  Resume,
  JobApplication,
  NormalizedJobResult,
  RecommendedJob,
  RecommendationFilters,
  RecommendationSort,
} from "./types";
import { searchJobs, isJobsApiConfigured } from "./jobs-api";

// ---------------------------------------------------------------------------
// Step 1: Retrieve candidate profile
// ---------------------------------------------------------------------------

export async function getCandidateProfile(
  supabase: SupabaseClient,
  userId: string
): Promise<{ profile: CareerProfile | null; primaryResume: Resume | null }> {
  const { data: profileData } = await supabase
    .from("career_profiles")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  const { data: resumeData } = await supabase
    .from("resumes")
    .select("*")
    .eq("user_id", userId)
    .eq("is_primary", true)
    .maybeSingle();

  return {
    profile: profileData as CareerProfile | null,
    primaryResume: resumeData as Resume | null,
  };
}

export function isProfileComplete(
  profile: CareerProfile | null,
  primaryResume: Resume | null
): boolean {
  if (!profile) return false;
  if (!primaryResume) return false;
  const hasTargetRoles = (profile.target_roles ?? []).length > 0;
  const hasSkills = (profile.skills ?? []).length > 0;
  return hasTargetRoles || hasSkills || !!profile.headline;
}

// ---------------------------------------------------------------------------
// Step 2: Retrieve available normalized jobs
// ---------------------------------------------------------------------------

/** Convert a saved JobApplication row into a NormalizedJobResult for analysis. */
export function jobApplicationToNormalized(job: JobApplication): NormalizedJobResult {
  return {
    source_job_id: job.source_job_id || job.id,
    api_provider: job.api_provider || "saved",
    company: job.company || "",
    title: job.title || "",
    location: job.location || "",
    employment_type: job.employment_type || "",
    work_mode: job.work_mode || "",
    salary_text: job.salary_text || "",
    salary_min: job.salary_min,
    salary_max: job.salary_max,
    description: job.description || "",
    job_url: job.job_url || "",
    source: job.source || "saved",
  };
}

export async function getCandidateJobs(
  supabase: SupabaseClient,
  userId: string,
  profile: CareerProfile | null
): Promise<NormalizedJobResult[]> {
  const jobs: NormalizedJobResult[] = [];

  // 2a. Saved jobs (status "Saved") — always available as real data
  const { data: savedJobs } = await supabase
    .from("job_applications")
    .select("*")
    .eq("user_id", userId)
    .eq("status", "Saved")
    .order("created_at", { ascending: false })
    .limit(50);

  for (const j of (savedJobs ?? []) as JobApplication[]) {
    jobs.push(jobApplicationToNormalized(j));
  }

  // 2b. External API search — if connected, search using target roles
  if (isJobsApiConfigured() && profile) {
    const targetRoles = profile.target_roles ?? [];
    const keyword = targetRoles[0] || profile.headline || "";
    if (keyword) {
      try {
        const { results } = await searchJobs({
          keyword,
          location: profile.location || "",
          remote_only: false,
          work_mode: null,
          employment_type: null,
          salary_min: profile.salary_min ?? null,
          date_posted: null,
        });
        // Deduplicate against saved jobs by source_job_id + api_provider
        const existingKeys = new Set(
          jobs.map((j) => `${j.api_provider}:${j.source_job_id}`)
        );
        for (const r of results) {
          const key = `${r.api_provider}:${r.source_job_id}`;
          if (!existingKeys.has(key)) {
            jobs.push(r);
            existingKeys.add(key);
          }
        }
      } catch {
        // API search failed — continue with saved jobs only
      }
    }
  }

  return jobs;
}

// ---------------------------------------------------------------------------
// Step 3: Apply basic eligibility and preference filters
// ---------------------------------------------------------------------------

export function applyFilters(
  jobs: NormalizedJobResult[],
  filters: RecommendationFilters
): NormalizedJobResult[] {
  return jobs.filter((job) => {
    // Remote only
    if (filters.remoteOnly && job.work_mode !== "Remote") return false;

    // Salary minimum
    if (filters.salaryMin !== null && filters.salaryMin > 0) {
      const jobSalary = job.salary_max ?? job.salary_min ?? 0;
      if (jobSalary > 0 && jobSalary < filters.salaryMin) return false;
    }

    // Employment type
    if (filters.employmentType && job.employment_type !== filters.employmentType) {
      return false;
    }

    // Date posted (if job has date_posted)
    if (filters.datePosted && job.date_posted) {
      const posted = new Date(job.date_posted);
      const now = new Date();
      const diffMs = now.getTime() - posted.getTime();
      const diffDays = diffMs / (1000 * 60 * 60 * 24);
      if (filters.datePosted === "24h" && diffDays > 1) return false;
      if (filters.datePosted === "7d" && diffDays > 7) return false;
      if (filters.datePosted === "30d" && diffDays > 30) return false;
    }

    return true;
  });
}

// ---------------------------------------------------------------------------
// Step 6: Rank jobs
// ---------------------------------------------------------------------------

export function rankJobs(
  recommendations: RecommendedJob[],
  sortBy: RecommendationSort
): RecommendedJob[] {
  const sorted = [...recommendations];
  switch (sortBy) {
    case "best_match":
      sorted.sort((a, b) => (b.analysis?.match_score ?? 0) - (a.analysis?.match_score ?? 0));
      break;
    case "newest":
      sorted.sort((a, b) => (b.job.date_posted || "").localeCompare(a.job.date_posted || ""));
      break;
    case "highest_salary":
      sorted.sort(
        (a, b) =>
          (b.job.salary_max ?? b.job.salary_min ?? 0) -
          (a.job.salary_max ?? a.job.salary_min ?? 0)
      );
      break;
    case "most_relevant":
      // Relevance = match score, but unanalyzed jobs go last
      sorted.sort((a, b) => {
        if (a.analysis && !b.analysis) return -1;
        if (!a.analysis && b.analysis) return 1;
        return (b.analysis?.match_score ?? 0) - (a.analysis?.match_score ?? 0);
      });
      break;
  }
  return sorted;
}

// ---------------------------------------------------------------------------
// Cache helpers
// ---------------------------------------------------------------------------

export async function getCachedAnalyses(
  supabase: SupabaseClient,
  userId: string
): Promise<Map<string, import("./types").JobMatchAnalysis>> {
  const { data } = await supabase
    .from("job_match_analyses")
    .select("*")
    .eq("user_id", userId)
    .order("match_score", { ascending: false });

  const map = new Map<string, import("./types").JobMatchAnalysis>();
  for (const row of data ?? []) {
    const key = `${row.api_provider || "saved"}:${row.source_job_id}`;
    map.set(key, {
      match_score: row.match_score,
      match_label: row.match_label,
      matching_skills: row.matching_skills ?? [],
      missing_skills: row.missing_skills ?? [],
      experience_alignment: row.experience_alignment,
      salary_alignment: row.salary_alignment,
      location_alignment: row.location_alignment,
      work_mode_alignment: row.work_mode_alignment,
      strengths: row.strengths ?? [],
      gaps: row.gaps ?? [],
      recommendation_reason: row.recommendation_reason,
    });
  }
  return map;
}

export function jobCacheKey(job: NormalizedJobResult): string {
  return `${job.api_provider}:${job.source_job_id}`;
}

/**
 * Merge candidate jobs with cached analyses into RecommendedJob[].
 * Jobs without a cached analysis get analysis: null ("Match not analyzed").
 */
export function buildRecommendations(
  jobs: NormalizedJobResult[],
  cache: Map<string, import("./types").JobMatchAnalysis>
): RecommendedJob[] {
  return jobs.map((job) => {
    const key = jobCacheKey(job);
    const analysis = cache.get(key) ?? null;
    return { job, analysis, cached: !!analysis };
  });
}
