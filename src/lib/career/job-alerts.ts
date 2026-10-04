// Job alert processing pipeline — separated from the external jobs API logic.
//
// The external jobs API (searchJobs) lives in jobs-api.ts and stays
// provider-agnostic. This module orchestrates the alert workflow on top of it:
//
//   1. Load active SavedJobSearch records
//   2. Query the external jobs API (delegated to jobs-api.ts)
//   3. Normalize job results (already normalized by the provider adapter)
//   4. Remove duplicates (by source_job_id + api_provider)
//   5. Compare against previously seen jobs (job_alert_results)
//   6. Run job matching when appropriate (AI match, if configured + min score set)
//   7. Identify newly relevant jobs
//   8. Notify the user only when useful new jobs are found (in-app; email/push
//      only if a provider is connected — never faked)
//
// This is callable on demand ("Run Search Now") and is structured so a
// scheduled Base44 backend job can call runAllDueAlerts() later.

import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  NormalizedJobResult,
  SavedJobSearch,
  AlertRunSummary,
  JobSearchRequest,
} from "./types";
import { searchJobs, isJobsApiConfigured } from "./jobs-api";
import { jobMatchAnalysis } from "@/actions/job-match";
import { getCandidateProfile } from "./job-recommendations";
import { getAIProvider } from "@/lib/ai/provider";
import { dispatchNotification } from "./notifications";

/** Row shape from the saved_job_searches table. */
interface SavedJobSearchRow {
  id: string;
  user_id: string;
  name: string;
  keywords: string;
  location: string;
  remote_only: boolean;
  work_mode: string | null;
  employment_type: string | null;
  minimum_salary: number | null;
  date_posted: string | null;
  minimum_match_score: number | null;
  is_active: boolean;
  alert_frequency: string;
  last_checked_at: string | null;
  last_alert_at: string | null;
  api_provider: string | null;
  created_at: string;
}

function rowToSavedJobSearch(row: SavedJobSearchRow): SavedJobSearch {
  return {
    id: row.id,
    user_id: row.user_id,
    name: row.name,
    keywords: row.keywords,
    location: row.location,
    remote_only: row.remote_only,
    work_mode: row.work_mode,
    employment_type: row.employment_type,
    minimum_salary: row.minimum_salary,
    date_posted: row.date_posted,
    minimum_match_score: row.minimum_match_score,
    is_active: row.is_active,
    alert_frequency: row.alert_frequency as SavedJobSearch["alert_frequency"],
    last_checked_at: row.last_checked_at,
    last_alert_at: row.last_alert_at,
    api_provider: row.api_provider,
    created_date: row.created_at,
  };
}

/** Build the JobSearchRequest from a saved search's stored criteria. */
export function savedSearchToRequest(s: SavedJobSearch): JobSearchRequest {
  return {
    keyword: s.keywords,
    location: s.location,
    remote_only: s.remote_only,
    work_mode: s.work_mode || null,
    employment_type: s.employment_type || null,
    salary_min: s.minimum_salary ?? null,
    date_posted: s.date_posted || null,
  };
}

// ---------------------------------------------------------------------------
// Step 1: Load active saved searches
// ---------------------------------------------------------------------------

export async function loadActiveSavedSearches(
  supabase: SupabaseClient
): Promise<SavedJobSearch[]> {
  const { data, error } = await supabase
    .from("saved_job_searches")
    .select("*")
    .eq("is_active", true)
    .neq("alert_frequency", "Off");
  if (error || !data) return [];
  return (data as SavedJobSearchRow[]).map(rowToSavedJobSearch);
}

/** Load all saved searches for a single user (active + inactive). */
export async function loadUserSavedSearches(
  supabase: SupabaseClient,
  userId: string
): Promise<SavedJobSearch[]> {
  const { data, error } = await supabase
    .from("saved_job_searches")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error || !data) return [];
  return (data as SavedJobSearchRow[]).map(rowToSavedJobSearch);
}

// ---------------------------------------------------------------------------
// Core: run a single saved search through the alert pipeline
// ---------------------------------------------------------------------------

export async function runSavedSearchAlert(
  supabase: SupabaseClient,
  userId: string,
  savedSearch: SavedJobSearch
): Promise<AlertRunSummary> {
  const now = new Date().toISOString();
  const apiConfigured = isJobsApiConfigured();

  // 2. Query external jobs API
  if (!apiConfigured) {
    // Still record the check so the UI reflects "last checked".
    await supabase
      .from("saved_job_searches")
      .update({ last_checked_at: now })
      .eq("id", savedSearch.id);
    return { searched: false, apiConfigured: false, totalFound: 0, newResults: 0, alerted: 0 };
  }

  let results: NormalizedJobResult[] = [];
  try {
    const { results: apiResults } = await searchJobs(savedSearchToRequest(savedSearch));
    results = apiResults;
  } catch {
    await supabase
      .from("saved_job_searches")
      .update({ last_checked_at: now })
      .eq("id", savedSearch.id);
    return { searched: true, apiConfigured: true, totalFound: 0, newResults: 0, alerted: 0, error: "Jobs API request failed." };
  }

  // 4. Remove duplicates within the result set (by provider + source_job_id)
  const deduped = dedupeResults(results);

  // 5. Compare against previously seen jobs for this saved search
  const seenKeys = await loadSeenJobKeys(supabase, savedSearch.id);
  const freshJobs = deduped.filter(
    (j) => !seenKeys.has(seenKey(j.api_provider, j.source_job_id))
  );

  // 6. Run job matching when appropriate
  const minScore = savedSearch.minimum_match_score ?? 0;
  const aiProvider = getAIProvider();
  let relevantJobs = freshJobs;

  if (minScore > 0 && aiProvider && freshJobs.length > 0) {
    const { profile, primaryResume } = await getCandidateProfile(supabase, userId);
    const scored: { job: NormalizedJobResult; score: number }[] = [];
    for (const job of freshJobs) {
      const analysis = await jobMatchAnalysis(profile, primaryResume, job);
      const score = analysis?.match_score ?? 0;
      if (score >= minScore) scored.push({ job, score });
    }
    relevantJobs = scored.map((s) => s.job);
  }

  // 7. Record newly relevant jobs in job_alert_results
  let alerted = 0;
  if (relevantJobs.length > 0) {
    const rows = relevantJobs.map((job) => ({
      user_id: userId,
      saved_search_id: savedSearch.id,
      source_job_id: job.source_job_id,
      api_provider: job.api_provider,
      job_title: job.title,
      company: job.company,
      location: job.location,
      job_url: job.job_url,
      salary_text: job.salary_text,
      match_score: null, // score not persisted here; analyses live in job_match_analyses
      first_seen_at: now,
      alert_sent_at: null,
      status: "new" as const,
    }));

    const { error: insertError } = await supabase
      .from("job_alert_results")
      .upsert(rows, { onConflict: "saved_search_id,source_job_id,api_provider", ignoreDuplicates: true });

    if (!insertError) {
      // Count how many were actually new (upsert with ignoreDuplicates = new inserts only).
      const { count } = await supabase
        .from("job_alert_results")
        .select("*", { count: "exact", head: true })
        .eq("saved_search_id", savedSearch.id)
        .in(
          "source_job_id",
          relevantJobs.map((j) => j.source_job_id)
        );
      alerted = count ?? 0;
    }
  }

  // 8. Notify the user only when useful new jobs are found
  let alertSentAt: string | null = null;
  if (alerted > 0 && savedSearch.alert_frequency !== "Off") {
    await dispatchNotification(supabase, {
      userId,
      type: "job_alert",
      title: `${alerted} new job${alerted === 1 ? "" : "s"} for "${savedSearch.name}"`,
      body:
        alerted === 1
          ? `New match: ${relevantJobs[0].title} at ${relevantJobs[0].company}`
          : `${alerted} new opportunities match your saved search.`,
      link: `/app/job-alerts?search=${savedSearch.id}`,
      relatedId: savedSearch.id,
    });
    alertSentAt = now;

    // Mark the surfaced results as alerted
    await supabase
      .from("job_alert_results")
      .update({ alert_sent_at: now, status: "alerted" })
      .eq("saved_search_id", savedSearch.id)
      .in(
        "source_job_id",
        relevantJobs.map((j) => j.source_job_id)
      );
  }

  await supabase
    .from("saved_job_searches")
    .update({ last_checked_at: now, last_alert_at: alertSentAt ?? undefined })
    .eq("id", savedSearch.id);

  return {
    searched: true,
    apiConfigured: true,
    totalFound: deduped.length,
    newResults: freshJobs.length,
    alerted,
  };
}

// ---------------------------------------------------------------------------
// Step run-all: for future scheduled Base44 backend jobs
// ---------------------------------------------------------------------------

export async function runAllDueAlerts(
  supabase: SupabaseClient
): Promise<{ processed: number; totalAlerted: number }> {
  const due = await loadActiveSavedSearches(supabase);
  let totalAlerted = 0;
  let processed = 0;
  for (const s of due) {
    if (!isDue(s)) continue;
    try {
      const summary = await runSavedSearchAlert(supabase, s.user_id, s);
      totalAlerted += summary.alerted;
      processed++;
    } catch {
      // continue processing other searches
    }
  }
  return { processed, totalAlerted };
}

/** Determine whether a saved search is due based on its frequency + last check. */
export function isDue(s: SavedJobSearch): boolean {
  if (!s.is_active || s.alert_frequency === "Off") return false;
  if (!s.last_checked_at) return true;
  const last = new Date(s.last_checked_at).getTime();
  const now = Date.now();
  const hours = (now - last) / (1000 * 60 * 60);
  switch (s.alert_frequency) {
    case "Daily":
      return hours >= 24;
    case "Weekdays":
      // Due if last checked before today's start on a weekday
      return isWeekdayNow() && hours >= 20;
    case "Weekly":
      return hours >= 168;
    default:
      return false;
  }
}

function isWeekdayNow(): boolean {
  const day = new Date().getDay(); // 0 Sun – 6 Sat
  return day >= 1 && day <= 5;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function seenKey(apiProvider: string, sourceJobId: string): string {
  return `${apiProvider}:${sourceJobId}`;
}

function dedupeResults(jobs: NormalizedJobResult[]): NormalizedJobResult[] {
  const map = new Map<string, NormalizedJobResult>();
  for (const j of jobs) {
    const key = seenKey(j.api_provider, j.source_job_id);
    if (!map.has(key)) map.set(key, j);
  }
  return Array.from(map.values());
}

async function loadSeenJobKeys(
  supabase: SupabaseClient,
  savedSearchId: string
): Promise<Set<string>> {
  const { data } = await supabase
    .from("job_alert_results")
    .select("source_job_id, api_provider")
    .eq("saved_search_id", savedSearchId);
  const keys = new Set<string>();
  for (const row of data ?? []) {
    keys.add(seenKey(row.api_provider || "", row.source_job_id));
  }
  return keys;
}
