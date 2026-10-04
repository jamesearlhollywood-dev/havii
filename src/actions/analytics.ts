"use server";

// Analytics — server actions.
// Pulls the signed-in user's actual records across every Career AI entity and
// runs them through the deterministic aggregation engine in
// src/lib/career/analytics.ts. Nothing is fabricated. Goal CRUD + progress is
// computed against real records. careerAnalyticsInsights is an OPTIONAL AI
// operation that only interprets the provided metrics.

import { createClient } from "@/lib/supabase/server";
import { computeAnalytics, computeGoalProgress, careerAnalyticsInsights } from "@/lib/career/analytics";
import type { AnalyticsInsightsResult, AnalyticsMetrics, AnalyticsRange } from "@/lib/career/types";
import type {
  CareerGoal,
  CareerGoalInput,
  CareerGoalWithProgress,
  JobApplication,
  CareerTask,
  InterviewSession,
  JobOffer,
  GeneratedDocument,
  SavedJobSearch,
  CareerContact,
  ContactInteraction,
  GoalType,
  GoalPeriod,
  GoalStatus,
} from "@/lib/career/types";
import type { GoalActionState } from "@/actions/types";

async function getAuthedClient() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return { supabase, user };
}

// ---------------------------------------------------------------------------
// Load all raw records for the signed-in user
// ---------------------------------------------------------------------------

async function loadRaw(userId: string, supabase: Awaited<ReturnType<typeof createClient>>) {
  const [
    jobsRes,
    tasksRes,
    interviewsRes,
    offersRes,
    docsRes,
    searchesRes,
    contactsRes,
    interactionsRes,
    goalsRes,
  ] = await Promise.all([
    supabase.from("job_applications").select("*").eq("user_id", userId),
    supabase.from("career_tasks").select("*").eq("user_id", userId),
    supabase.from("interview_sessions").select("*").eq("user_id", userId),
    supabase.from("job_offers").select("*").eq("user_id", userId),
    supabase.from("generated_documents").select("*").eq("user_id", userId),
    supabase.from("saved_job_searches").select("*").eq("user_id", userId),
    supabase.from("career_contacts").select("*").eq("user_id", userId),
    supabase.from("contact_interactions").select("*").eq("user_id", userId),
    supabase.from("career_goals").select("*").eq("user_id", userId),
  ]);

  return {
    jobs: (jobsRes.data ?? []) as JobApplication[],
    tasks: (tasksRes.data ?? []) as CareerTask[],
    interviews: (interviewsRes.data ?? []) as InterviewSession[],
    offers: (offersRes.data ?? []) as JobOffer[],
    documents: (docsRes.data ?? []) as GeneratedDocument[],
    savedSearches: (searchesRes.data ?? []) as SavedJobSearch[],
    contacts: (contactsRes.data ?? []) as CareerContact[],
    interactions: (interactionsRes.data ?? []) as ContactInteraction[],
    goals: (goalsRes.data ?? []) as CareerGoal[],
  };
}

// ---------------------------------------------------------------------------
// Get aggregated analytics for a date range
// ---------------------------------------------------------------------------

export async function getAnalyticsAction(
  range: AnalyticsRange = "all"
): Promise<{ error?: string; metrics: AnalyticsMetrics | null }> {
  let supabase;
  let userId: string | null = null;
  try {
    const ctx = await getAuthedClient();
    supabase = ctx.supabase;
    userId = ctx.user?.id ?? null;
  } catch {
    return { error: "Unable to connect to the database.", metrics: null };
  }
  if (!userId) return { error: "Not authenticated.", metrics: null };

  try {
    const raw = await loadRaw(userId, supabase);
    const metrics = computeAnalytics(raw, range);
    return { metrics };
  } catch {
    return { error: "Could not compute analytics.", metrics: null };
  }
}

// ---------------------------------------------------------------------------
// AI insights (optional)
// ---------------------------------------------------------------------------

export async function getAnalyticsInsightsAction(
  metrics: AnalyticsMetrics
): Promise<AnalyticsInsightsResult> {
  return careerAnalyticsInsights(metrics);
}

// ---------------------------------------------------------------------------
// Goals — CRUD
// ---------------------------------------------------------------------------

export async function listGoalsAction(): Promise<{
  error?: string;
  goals: CareerGoalWithProgress[];
}> {
  let supabase;
  let userId: string | null = null;
  try {
    const ctx = await getAuthedClient();
    supabase = ctx.supabase;
    userId = ctx.user?.id ?? null;
  } catch {
    return { error: "Unable to connect to the database.", goals: [] };
  }
  if (!userId) return { error: "Not authenticated.", goals: [] };

  const { data, error } = await supabase
    .from("career_goals")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) return { error: "Could not load goals.", goals: [] };

  const raw = await loadRaw(userId, supabase);
  const goals = (data ?? []) as CareerGoal[];
  return { goals: goals.map((g) => computeGoalProgress(g, raw)) };
}

interface GoalRow {
  id: string;
  user_id: string;
  goal_type: GoalType;
  target_value: number;
  period: GoalPeriod;
  start_date: string;
  end_date: string | null;
  status: GoalStatus;
  created_at: string;
}

function rowToGoal(row: GoalRow): CareerGoal {
  return {
    id: row.id,
    user_id: row.user_id,
    goal_type: row.goal_type,
    target_value: row.target_value,
    period: row.period,
    start_date: row.start_date,
    end_date: row.end_date,
    status: row.status,
    created_date: row.created_at,
  };
}

export async function createGoalAction(
  input: CareerGoalInput
): Promise<GoalActionState> {
  try {
    const { supabase, user } = await getAuthedClient();
    if (!user) return { error: "Not authenticated." };

    const { error } = await supabase.from("career_goals").insert({
      user_id: user.id,
      goal_type: input.goal_type,
      target_value: input.target_value,
      period: input.period,
      start_date: input.start_date,
      end_date: input.end_date || null,
      status: input.status,
    });
    if (error) return { error: "Could not create the goal." };
    return { success: "Goal created." };
  } catch (e) {
    if (e && typeof e === "object" && "digest" in e) throw e;
    return { error: "Could not create the goal." };
  }
}

export async function updateGoalAction(
  id: string,
  input: CareerGoalInput
): Promise<GoalActionState> {
  try {
    const { supabase, user } = await getAuthedClient();
    if (!user) return { error: "Not authenticated." };

    const { error } = await supabase
      .from("career_goals")
      .update({
        goal_type: input.goal_type,
        target_value: input.target_value,
        period: input.period,
        start_date: input.start_date,
        end_date: input.end_date || null,
        status: input.status,
      })
      .eq("id", id)
      .eq("user_id", user.id);
    if (error) return { error: "Could not update the goal." };
    return { success: "Goal updated." };
  } catch (e) {
    if (e && typeof e === "object" && "digest" in e) throw e;
    return { error: "Could not update the goal." };
  }
}

export async function deleteGoalAction(id: string): Promise<GoalActionState> {
  try {
    const { supabase, user } = await getAuthedClient();
    if (!user) return { error: "Not authenticated." };

    const { error } = await supabase
      .from("career_goals")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);
    if (error) return { error: "Could not delete the goal." };
    return { success: "Goal deleted." };
  } catch (e) {
    if (e && typeof e === "object" && "digest" in e) throw e;
    return { error: "Could not delete the goal." };
  }
}


