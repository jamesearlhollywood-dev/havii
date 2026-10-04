"use server";

// Saved searches & job alerts — server actions.
// CRUD for SavedJobSearch + on-demand alert run ("Run Search Now").

import { createClient } from "@/lib/supabase/server";
import "@/lib/ai/openai-provider"; // side-effect: auto-registers AI provider if key set
import {
  loadUserSavedSearches,
  runSavedSearchAlert,
} from "@/lib/career/job-alerts";
import type { SavedJobSearch, SavedSearchInput, AlertRunSummary } from "@/lib/career/types";
import type { SavedSearchActionState, AlertResultsResult } from "@/actions/types";

// ---------------------------------------------------------------------------
// Save (create) a saved search
// ---------------------------------------------------------------------------

export async function saveSavedSearchAction(
  input: SavedSearchInput
): Promise<SavedSearchActionState> {
  let supabase;
  let userId: string | null = null;
  try {
    supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    userId = user?.id ?? null;
  } catch {
    return { error: "Unable to connect to the database." };
  }
  if (!userId) return { error: "Not authenticated." };

  const { error } = await supabase.from("saved_job_searches").insert({
    user_id: userId,
    name: input.name.trim(),
    keywords: input.keywords ?? "",
    location: input.location ?? "",
    remote_only: input.remote_only,
    work_mode: input.work_mode || null,
    employment_type: input.employment_type || null,
    minimum_salary: input.minimum_salary ?? null,
    date_posted: input.date_posted || null,
    minimum_match_score: input.minimum_match_score ?? null,
    is_active: input.is_active,
    alert_frequency: input.alert_frequency,
  });
  if (error) return { error: "Could not save the search. Please try again." };
  return { success: "Search saved." };
}

// ---------------------------------------------------------------------------
// List the signed-in user's saved searches
// ---------------------------------------------------------------------------

export async function listSavedSearchesAction(): Promise<{
  error?: string;
  searches: SavedJobSearch[];
}> {
  let supabase;
  let userId: string | null = null;
  try {
    supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    userId = user?.id ?? null;
  } catch {
    return { error: "Unable to connect to the database.", searches: [] };
  }
  if (!userId) return { error: "Not authenticated.", searches: [] };
  const searches = await loadUserSavedSearches(supabase, userId);
  return { searches };
}

// ---------------------------------------------------------------------------
// Update a saved search
// ---------------------------------------------------------------------------

export async function updateSavedSearchAction(
  id: string,
  input: SavedSearchInput
): Promise<SavedSearchActionState> {
  let supabase;
  let userId: string | null = null;
  try {
    supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    userId = user?.id ?? null;
  } catch {
    return { error: "Unable to connect to the database." };
  }
  if (!userId) return { error: "Not authenticated." };

  const { error } = await supabase
    .from("saved_job_searches")
    .update({
      name: input.name.trim(),
      keywords: input.keywords ?? "",
      location: input.location ?? "",
      remote_only: input.remote_only,
      work_mode: input.work_mode || null,
      employment_type: input.employment_type || null,
      minimum_salary: input.minimum_salary ?? null,
      date_posted: input.date_posted || null,
      minimum_match_score: input.minimum_match_score ?? null,
      is_active: input.is_active,
      alert_frequency: input.alert_frequency,
    })
    .eq("id", id)
    .eq("user_id", userId);
  if (error) return { error: "Could not update the search." };
  return { success: "Search updated." };
}

// ---------------------------------------------------------------------------
// Delete a saved search
// ---------------------------------------------------------------------------

export async function deleteSavedSearchAction(id: string): Promise<SavedSearchActionState> {
  let supabase;
  let userId: string | null = null;
  try {
    supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    userId = user?.id ?? null;
  } catch {
    return { error: "Unable to connect to the database." };
  }
  if (!userId) return { error: "Not authenticated." };

  const { error } = await supabase
    .from("saved_job_searches")
    .delete()
    .eq("id", id)
    .eq("user_id", userId);
  if (error) return { error: "Could not delete the search." };
  return { success: "Search deleted." };
}

// ---------------------------------------------------------------------------
// Pause / resume alerts (toggle is_active + alert_frequency)
// ---------------------------------------------------------------------------

export async function pauseAlertAction(id: string): Promise<SavedSearchActionState> {
  let supabase;
  let userId: string | null = null;
  try {
    supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    userId = user?.id ?? null;
  } catch {
    return { error: "Unable to connect to the database." };
  }
  if (!userId) return { error: "Not authenticated." };

  const { error } = await supabase
    .from("saved_job_searches")
    .update({ is_active: false })
    .eq("id", id)
    .eq("user_id", userId);
  if (error) return { error: "Could not pause the alert." };
  return { success: "Alert paused." };
}

export async function resumeAlertAction(id: string): Promise<SavedSearchActionState> {
  let supabase;
  let userId: string | null = null;
  try {
    supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    userId = user?.id ?? null;
  } catch {
    return { error: "Unable to connect to the database." };
  }
  if (!userId) return { error: "Not authenticated." };

  const { error } = await supabase
    .from("saved_job_searches")
    .update({ is_active: true })
    .eq("id", id)
    .eq("user_id", userId);
  if (error) return { error: "Could not resume the alert." };
  return { success: "Alert resumed." };
}

// ---------------------------------------------------------------------------
// Run Search Now — execute the alert pipeline on demand
// ---------------------------------------------------------------------------

export async function runSavedSearchNowAction(id: string): Promise<AlertRunSummary> {
  let supabase;
  let userId: string | null = null;
  try {
    supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    userId = user?.id ?? null;
  } catch {
    return { searched: false, apiConfigured: false, totalFound: 0, newResults: 0, alerted: 0, error: "Unable to connect to the database." };
  }
  if (!userId) return { searched: false, apiConfigured: false, totalFound: 0, newResults: 0, alerted: 0, error: "Not authenticated." };

  const { data: row } = await supabase
    .from("saved_job_searches")
    .select("*")
    .eq("id", id)
    .eq("user_id", userId)
    .maybeSingle();
  if (!row) return { searched: false, apiConfigured: false, totalFound: 0, newResults: 0, alerted: 0, error: "Search not found." };

  return runSavedSearchAlert(supabase, userId, {
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
    alert_frequency: row.alert_frequency,
    last_checked_at: row.last_checked_at,
    last_alert_at: row.last_alert_at,
    api_provider: row.api_provider,
    created_date: row.created_at,
  });
}

// ---------------------------------------------------------------------------
// List alert results for a saved search (Job Alerts detail view)
// ---------------------------------------------------------------------------

export async function listAlertResultsAction(
  savedSearchId: string
): Promise<AlertResultsResult> {
  let supabase;
  let userId: string | null = null;
  try {
    supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    userId = user?.id ?? null;
  } catch {
    return { error: "Unable to connect to the database.", results: [] };
  }
  if (!userId) return { error: "Not authenticated.", results: [] };

  const { data, error } = await supabase
    .from("job_alert_results")
    .select("*")
    .eq("saved_search_id", savedSearchId)
    .eq("user_id", userId)
    .order("first_seen_at", { ascending: false });
  if (error) return { error: "Could not load alert results.", results: [] };
  return { results: data ?? [] };
}
