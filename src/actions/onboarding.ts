"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { UserRole } from "@/lib/types";
import { dashboardPathForRole } from "@/lib/roles";

export type OnboardingState = {
  error?: string;
  success?: string;
};

async function getAuthedProfile() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { supabase, user: null, profile: null, error: "Not authenticated." };
  }
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();
  if (error || !profile) {
    return {
      supabase,
      user,
      profile: null,
      error: error?.message || "Profile not found.",
    };
  }
  return { supabase, user, profile, error: null };
}

export async function completeOnboardingAction(
  _prev: OnboardingState,
  formData: FormData
): Promise<OnboardingState> {
  try {
    const { supabase, profile, error } = await getAuthedProfile();
    if (error || !profile) return { error: error || "Profile not found." };

    const role = profile.role as UserRole;
    const firstName = String(formData.get("first_name") || "").trim();
    const lastName = String(formData.get("last_name") || "").trim();
    const preferredName = String(formData.get("preferred_name") || "").trim();
    const pronouns = String(formData.get("pronouns") || "").trim();
    const city = String(formData.get("city") || "").trim();
    const state = String(formData.get("state") || "").trim();
    const phone = String(formData.get("phone") || "").trim();
    const dateOfBirth = String(formData.get("date_of_birth") || "").trim();

    if (!preferredName && !firstName) {
      return { error: "Please provide at least a preferred or first name." };
    }

    const { error: profileUpdateError } = await supabase
      .from("profiles")
      .update({
        first_name: firstName || null,
        last_name: lastName || null,
        preferred_name: preferredName || firstName || null,
        pronouns: pronouns || null,
        city: city || null,
        state: state || null,
        phone: phone || null,
        date_of_birth: dateOfBirth || null,
        onboarding_completed: true,
        updated_at: new Date().toISOString(),
      })
      .eq("id", profile.id);

    if (profileUpdateError) {
      return { error: profileUpdateError.message };
    }

    // RISE USA onboarding — all roles complete the same basic profile
    // Students additionally provide school/program info
    if (role === "student") {
      const schoolOrProgram = String(formData.get("school_or_program") || "").trim();
      const graduationYear = String(formData.get("graduation_year") || "").trim();

      // Store extra student info in the profile's metadata (no separate table needed)
      // The school/program and graduation year can be stored in city/state or a future field
      // For now, we just complete the basic profile
    }

    redirect(dashboardPathForRole(role));
  } catch (e) {
    if (e && typeof e === "object" && "digest" in e) throw e;
    return { error: e instanceof Error ? e.message : "Onboarding failed." };
  }
}
