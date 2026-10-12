"use server";

import { createClient } from "@/lib/supabase/server";
import { hasValidSupabaseConfig } from "@/lib/supabase/server";
import { getCurrentUserAndProfile } from "@/lib/profile";
import { modules, blueprintSections } from "@/data/course";
import { CONFIDENCE_SURVEY_QUESTIONS } from "@/data/confidence-survey";
import type { ConfidenceSurveyResponse } from "@/data/confidence-survey";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export interface ActionPlanItem {
  goal: string;
  whyItMatters: string;
  targetDate: string;
  firstStep: string;
  status: "Not Started" | "In Progress" | "Completed" | "Changed";
  category: string;
}

export interface CapstoneData {
  actionPlan: ActionPlanItem[];
  topPriorities: string[];
  moneyRules: string[];
  finalReflection: string;
  commitmentConfirmed: boolean;
  endOfCourseSurvey: ConfidenceSurveyResponse[] | null;
  surveyCompletedAt: string | null;
}

export const ACTION_PLAN_CATEGORIES = [
  "Income/job",
  "Banking",
  "Budget",
  "Emergency savings",
  "Credit",
  "Education",
  "Student loans",
  "Investing",
  "Transportation",
  "Housing",
  "Insurance",
  "Financial protection",
];

export const ACTION_PLAN_STATUSES = ["Not Started", "In Progress", "Completed", "Changed"] as const;

export const DEFAULT_MONEY_RULES = [
  "I will read financial agreements before signing.",
  "I will compare total cost, not just monthly payments.",
  "I will know the difference between gross and net pay.",
  "I will maintain an emergency-savings goal.",
  "I will understand debt before borrowing.",
];

export const SUGGESTED_MONEY_RULES = [
  "I will read financial agreements before signing.",
  "I will compare total cost, not just monthly payments.",
  "I will know the difference between gross and net pay.",
  "I will maintain an emergency-savings goal.",
  "I will understand debt before borrowing.",
  "I will verify investment opportunities before sending money.",
  "I will protect my passwords and authentication codes.",
];

// ---------------------------------------------------------------------------
// Save End-of-Course Confidence Survey
// ---------------------------------------------------------------------------
export async function saveEndOfCourseSurvey(
  responses: ConfidenceSurveyResponse[],
): Promise<{ error?: string; success?: string }> {
  if (!hasValidSupabaseConfig()) {
    return { success: "Demo mode — survey not persisted." };
  }

  try {
    const { profile } = await getCurrentUserAndProfile();
    if (!profile) return { error: "Not authenticated" };

    const supabase = await createClient();

    // Store as a capstone_data row with key "end_of_course_survey"
    await supabase.from("capstone_data").upsert(
      {
        profile_id: profile.id,
        data_key: "end_of_course_survey",
        data_value: { responses, completed_at: new Date().toISOString() },
        updated_at: new Date().toISOString(),
      },
      { onConflict: "profile_id,data_key" },
    );

    return { success: "Survey saved." };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Failed to save survey." };
  }
}

// ---------------------------------------------------------------------------
// Save Capstone Data (action plan, priorities, money rules, reflection, commitment)
// ---------------------------------------------------------------------------
export async function saveCapstoneData(
  data: Partial<CapstoneData>,
): Promise<{ error?: string; success?: string }> {
  if (!hasValidSupabaseConfig()) {
    return { success: "Demo mode — capstone data not persisted." };
  }

  try {
    const { profile } = await getCurrentUserAndProfile();
    if (!profile) return { error: "Not authenticated" };

    const supabase = await createClient();

    await supabase.from("capstone_data").upsert(
      {
        profile_id: profile.id,
        data_key: "capstone",
        data_value: data,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "profile_id,data_key" },
    );

    return { success: "Capstone data saved." };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Failed to save capstone data." };
  }
}

// ---------------------------------------------------------------------------
// Confirm Blueprint Review (commitment) — also triggers certificate check
// ---------------------------------------------------------------------------
export async function confirmBlueprintReview(): Promise<{ error?: string; success?: string }> {
  if (!hasValidSupabaseConfig()) {
    return { success: "Demo mode — commitment not persisted." };
  }

  try {
    const { profile } = await getCurrentUserAndProfile();
    if (!profile) return { error: "Not authenticated" };

    const supabase = await createClient();

    await supabase.from("capstone_data").upsert(
      {
        profile_id: profile.id,
        data_key: "blueprint_reviewed",
        data_value: { confirmed: true, confirmed_at: new Date().toISOString() },
        updated_at: new Date().toISOString(),
      },
      { onConflict: "profile_id,data_key" },
    );

    // Trigger certificate eligibility check — this is the final step
    const { checkAndIssueCertificate } = await import("@/actions/progress");
    await checkAndIssueCertificate(profile.id);

    return { success: "Blueprint review confirmed." };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Failed to confirm review." };
  }
}

// ---------------------------------------------------------------------------
// Get Capstone Data (for display)
// ---------------------------------------------------------------------------
export async function getCapstoneData(profileId: string): Promise<CapstoneData> {
  const defaultData: CapstoneData = {
    actionPlan: [],
    topPriorities: [],
    moneyRules: [...DEFAULT_MONEY_RULES],
    finalReflection: "",
    commitmentConfirmed: false,
    endOfCourseSurvey: null,
    surveyCompletedAt: null,
  };

  if (!hasValidSupabaseConfig()) {
    return defaultData;
  }

  try {
    const supabase = await createClient();

    const { data: rows } = await supabase
      .from("capstone_data")
      .select("*")
      .eq("profile_id", profileId);

    if (!rows || rows.length === 0) return defaultData;

    const result = { ...defaultData };

    for (const row of rows) {
      const val = row.data_value as Record<string, unknown>;
      if (row.data_key === "capstone") {
        if (val.actionPlan) result.actionPlan = val.actionPlan as ActionPlanItem[];
        if (val.topPriorities) result.topPriorities = val.topPriorities as string[];
        if (val.moneyRules) result.moneyRules = val.moneyRules as string[];
        if (val.finalReflection) result.finalReflection = val.finalReflection as string;
        if (val.commitmentConfirmed) result.commitmentConfirmed = val.commitmentConfirmed as boolean;
      } else if (row.data_key === "end_of_course_survey") {
        const surveyVal = val as { responses: ConfidenceSurveyResponse[]; completed_at: string };
        result.endOfCourseSurvey = surveyVal.responses ?? null;
        result.surveyCompletedAt = surveyVal.completed_at ?? null;
      } else if (row.data_key === "blueprint_reviewed") {
        result.commitmentConfirmed = (val.confirmed as boolean) ?? false;
      }
    }

    return result;
  } catch {
    return defaultData;
  }
}

// ---------------------------------------------------------------------------
// Check if end-of-course survey is completed
// ---------------------------------------------------------------------------
export async function isSurveyCompleted(profileId: string): Promise<boolean> {
  if (!hasValidSupabaseConfig()) return false;

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("capstone_data")
      .select("data_value")
      .eq("profile_id", profileId)
      .eq("data_key", "end_of_course_survey")
      .maybeSingle();

    return !!data;
  } catch {
    return false;
  }
}

// ---------------------------------------------------------------------------
// Check if blueprint review is confirmed
// ---------------------------------------------------------------------------
export async function isBlueprintReviewed(profileId: string): Promise<boolean> {
  if (!hasValidSupabaseConfig()) return false;

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("capstone_data")
      .select("data_value")
      .eq("profile_id", profileId)
      .eq("data_key", "blueprint_reviewed")
      .maybeSingle();

    return !!(data?.data_value as Record<string, unknown>)?.confirmed;
  } catch {
    return false;
  }
}
