"use server";

import { createClient } from "@/lib/supabase/server";
import type { JobApplication, JobStatus, NormalizedJobResult } from "@/lib/career/types";

export type JobActionState = {
  error?: string;
  success?: string;
};

async function getAuthedClient() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return { supabase, user };
  } catch {
    return { supabase: null, user: null };
  }
}

// ---------------------------------------------------------------------------
// Queries
// ---------------------------------------------------------------------------

export async function getJobApplications(): Promise<JobApplication[]> {
  const { supabase, user } = await getAuthedClient();
  if (!user) return [];

  const { data } = await supabase
    .from("job_applications")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (data ?? []) as JobApplication[];
}

export async function getJobApplicationById(
  id: string
): Promise<JobApplication | null> {
  const { supabase, user } = await getAuthedClient();
  if (!user) return null;

  const { data } = await supabase
    .from("job_applications")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle();

  return data as JobApplication | null;
}

export async function getRecentJobApplications(
  limit = 5
): Promise<JobApplication[]> {
  const { supabase, user } = await getAuthedClient();
  if (!user) return [];

  const { data } = await supabase
    .from("job_applications")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(limit);

  return (data ?? []) as JobApplication[];
}

export async function getJobStats(): Promise<{
  total: number;
  applied: number;
  interview: number;
  offer: number;
}> {
  const { supabase, user } = await getAuthedClient();
  if (!user) return { total: 0, applied: 0, interview: 0, offer: 0 };

  const { data } = await supabase
    .from("job_applications")
    .select("status")
    .eq("user_id", user.id);

  const rows = data ?? [];
  return {
    total: rows.length,
    applied: rows.filter((r) => r.status === "Applied").length,
    interview: rows.filter((r) => r.status === "Interview").length,
    offer: rows.filter((r) => r.status === "Offer").length,
  };
}

// ---------------------------------------------------------------------------
// Mutations
// ---------------------------------------------------------------------------

export async function createJobApplicationAction(
  _prev: JobActionState,
  formData: FormData
): Promise<JobActionState> {
  try {
    const { supabase, user } = await getAuthedClient();
    if (!user) return { error: "Not authenticated." };

    const status = String(formData.get("status") || "Saved") as JobStatus;
    const salaryMin = formData.get("salary_min");
    const salaryMax = formData.get("salary_max");

    const { error } = await supabase.from("job_applications").insert({
      user_id: user.id,
      company: String(formData.get("company") || "").trim() || null,
      title: String(formData.get("title") || "").trim() || null,
      location: String(formData.get("location") || "").trim() || null,
      employment_type: String(formData.get("employment_type") || "").trim() || null,
      work_mode: String(formData.get("work_mode") || "").trim() || null,
      salary_text: String(formData.get("salary_text") || "").trim() || null,
      salary_min: salaryMin ? Number(salaryMin) : null,
      salary_max: salaryMax ? Number(salaryMax) : null,
      job_url: String(formData.get("job_url") || "").trim() || null,
      status,
      notes: String(formData.get("notes") || "").trim() || null,
      applied_date: status === "Applied" ? new Date().toISOString().slice(0, 10) : null,
    });

    if (error) return { error: error.message };
    return { success: "Opportunity added." };
  } catch (e) {
    if (e && typeof e === "object" && "digest" in e) throw e;
    return { error: e instanceof Error ? e.message : "Failed to add job." };
  }
}

export async function saveJobFromSearchAction(
  job: NormalizedJobResult
): Promise<JobActionState> {
  try {
    const { supabase, user } = await getAuthedClient();
    if (!user) return { error: "Not authenticated." };

    // Avoid duplicates from the same provider
    if (job.source_job_id && job.api_provider) {
      const { data: existing } = await supabase
        .from("job_applications")
        .select("id")
        .eq("user_id", user.id)
        .eq("source_job_id", job.source_job_id)
        .eq("api_provider", job.api_provider)
        .maybeSingle();
      if (existing) return { success: "Already saved." };
    }

    const { error } = await supabase.from("job_applications").insert({
      user_id: user.id,
      company: job.company,
      title: job.title,
      location: job.location,
      employment_type: job.employment_type || null,
      work_mode: job.work_mode || null,
      salary_text: job.salary_text || null,
      salary_min: job.salary_min,
      salary_max: job.salary_max,
      description: job.description || null,
      job_url: job.job_url || null,
      status: "Saved",
      source: job.source || null,
      source_job_id: job.source_job_id || null,
      api_provider: job.api_provider || null,
      api_payload_ref: null,
    });

    if (error) return { error: error.message };
    return { success: "Job saved to tracker." };
  } catch (e) {
    if (e && typeof e === "object" && "digest" in e) throw e;
    return { error: e instanceof Error ? e.message : "Failed to save job." };
  }
}

export async function updateJobStatusAction(
  id: string,
  status: JobStatus
): Promise<JobActionState> {
  try {
    const { supabase, user } = await getAuthedClient();
    if (!user) return { error: "Not authenticated." };

    const update: Record<string, unknown> = {
      status,
      updated_at: new Date().toISOString(),
    };
    if (status === "Applied") {
      update.applied_date = new Date().toISOString().slice(0, 10);
    }

    const { error } = await supabase
      .from("job_applications")
      .update(update)
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) return { error: error.message };
    return { success: "Status updated." };
  } catch (e) {
    if (e && typeof e === "object" && "digest" in e) throw e;
    return { error: e instanceof Error ? e.message : "Failed to update status." };
  }
}

export async function deleteJobApplicationAction(
  id: string
): Promise<JobActionState> {
  try {
    const { supabase, user } = await getAuthedClient();
    if (!user) return { error: "Not authenticated." };

    const { error } = await supabase
      .from("job_applications")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) return { error: error.message };
    return { success: "Job removed." };
  } catch (e) {
    if (e && typeof e === "object" && "digest" in e) throw e;
    return { error: e instanceof Error ? e.message : "Failed to delete job." };
  }
}
