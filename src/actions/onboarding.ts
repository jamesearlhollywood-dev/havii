"use server";

import { redirect } from "next/navigation";
import { createClient, hasValidSupabaseConfig } from "@/lib/supabase/server";
import type { UserRole, LearningGoal, PostGraduationInterest, StartingPointSurvey } from "@/lib/types";
import { dashboardPathForRole } from "@/lib/roles";

export type OnboardingState = {
  error?: string;
  success?: string;
};

export async function completeOnboardingAction(
  _prev: OnboardingState,
  formData: FormData
): Promise<OnboardingState> {
  // Demo mode — no Supabase, just redirect to dashboard
  if (!hasValidSupabaseConfig()) {
    redirect("/dashboard");
  }

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { error: "Not authenticated." };

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user.id)
      .single();
    if (profileError || !profile) {
      return { error: profileError?.message || "Profile not found." };
    }

    const role = profile.role as UserRole;
    const preferredName = String(formData.get("preferred_name") || "").trim();
    const gradeLevel = String(formData.get("grade_level") || "").trim();
    const graduationYear = String(formData.get("graduation_year") || "").trim();
    const schoolOrProgram = String(formData.get("school_or_program") || "").trim();
    const postGrad = String(formData.get("post_graduation_interest") || "").trim();

    let learningGoals: LearningGoal[] = [];
    try {
      learningGoals = JSON.parse(String(formData.get("learning_goals") || "[]"));
    } catch {
      // keep empty
    }

    let startingPointSurvey: StartingPointSurvey | null = null;
    try {
      const surveyData = JSON.parse(String(formData.get("starting_point_survey") || "[]"));
      if (Array.isArray(surveyData) && surveyData.length > 0) {
        startingPointSurvey = {
          responses: surveyData,
          completed_at: new Date().toISOString(),
        };
      }
    } catch {
      // keep null
    }

    if (!preferredName) {
      return { error: "Please provide a preferred name." };
    }

    const updateData: Record<string, unknown> = {
      preferred_name: preferredName,
      onboarding_completed: true,
      updated_at: new Date().toISOString(),
    };

    // Student-specific onboarding fields
    if (role === "student") {
      updateData.grade_level = gradeLevel || null;
      updateData.graduation_year = graduationYear || null;
      updateData.school_or_program = schoolOrProgram || null;
      updateData.post_graduation_interest = (postGrad || null) as PostGraduationInterest | null;
      updateData.learning_goals = learningGoals;
      updateData.starting_point_survey = startingPointSurvey;
    }

    const { error: updateError } = await supabase
      .from("profiles")
      .update(updateData)
      .eq("id", profile.id);

    if (updateError) {
      return { error: updateError.message };
    }

    redirect(dashboardPathForRole(role));
  } catch (e) {
    if (e && typeof e === "object" && "digest" in e) throw e;
    return { error: e instanceof Error ? e.message : "Onboarding failed." };
  }
}

// ---------------------------------------------------------------------------
// Admin: Reset onboarding for a student
// ---------------------------------------------------------------------------
export async function resetOnboardingAction(
  profileId: string
): Promise<{ error?: string; success?: string }> {
  if (!hasValidSupabaseConfig()) {
    return { success: "Demo mode — onboarding reset is not persistent." };
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from("profiles")
      .update({
        onboarding_completed: false,
        updated_at: new Date().toISOString(),
      })
      .eq("id", profileId);

    if (error) return { error: error.message };
    return {
      success:
        "Onboarding reset. The student will complete onboarding on their next login.",
    };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Reset failed." };
  }
}
