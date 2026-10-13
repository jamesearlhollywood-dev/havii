import { createClient } from "@/lib/supabase/server";
import { hasValidSupabaseConfig } from "@/lib/supabase/server";
import type { Profile, StudentProgress } from "@/lib/types";

export async function getCurrentUserAndProfile() {
  if (!hasValidSupabaseConfig()) {
    return { user: null, profile: null, supabase: null } as const;
  }
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { user: null, profile: null, supabase };

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  return { user, profile: profile as Profile | null, supabase };
}

export async function getStudentProgress(profileId: string): Promise<StudentProgress> {
  const supabase = await createClient();
  const { data: lessonProgress } = await supabase
    .from("lesson_progress")
    .select("*")
    .eq("profile_id", profileId);

  const { data: moduleProgress } = await supabase
    .from("module_progress")
    .select("*")
    .eq("profile_id", profileId);

  const { data: quizAttempts } = await supabase
    .from("quiz_attempts")
    .select("*")
    .eq("profile_id", profileId)
    .order("created_at", { ascending: false });

  const { data: decisionLabs } = await supabase
    .from("decision_lab_submissions")
    .select("*")
    .eq("profile_id", profileId);

  const { data: blueprintSections } = await supabase
    .from("blueprint_sections")
    .select("*")
    .eq("profile_id", profileId);

  const { data: certificates } = await supabase
    .from("certificates")
    .select("*")
    .eq("profile_id", profileId)
    .eq("status", "issued");

  const { data: finalAttempts } = await supabase
    .from("final_assessment_attempts")
    .select("*")
    .eq("profile_id", profileId)
    .order("created_at", { ascending: false });

  return {
    lessonProgress: (lessonProgress ?? []) as StudentProgress["lessonProgress"],
    moduleProgress: (moduleProgress ?? []) as StudentProgress["moduleProgress"],
    quizAttempts: (quizAttempts ?? []) as StudentProgress["quizAttempts"],
    decisionLabs: (decisionLabs ?? []) as StudentProgress["decisionLabs"],
    blueprintSections: (blueprintSections ?? []) as StudentProgress["blueprintSections"],
    certificates: (certificates ?? []) as StudentProgress["certificates"],
    finalAttempts: (finalAttempts ?? []) as StudentProgress["finalAttempts"],
  };
}

export { displayName } from "@/lib/utils";
