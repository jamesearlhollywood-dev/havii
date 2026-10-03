"use server";

import { createClient } from "@/lib/supabase/server";
import type { CareerProfile } from "@/lib/career/types";
import type { CareerProfileState } from "@/actions/types";

function parseStringArray(value: FormDataEntryValue | null): string[] {
  if (!value) return [];
  return String(value)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export async function getCareerProfile(): Promise<CareerProfile | null> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;

    const { data } = await supabase
      .from("career_profiles")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    return data as CareerProfile | null;
  } catch {
    return null;
  }
}

export async function saveCareerProfileAction(
  _prev: CareerProfileState,
  formData: FormData
): Promise<CareerProfileState> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { error: "Not authenticated." };

    const payload = {
      user_id: user.id,
      full_name: String(formData.get("full_name") || "").trim() || null,
      headline: String(formData.get("headline") || "").trim() || null,
      location: String(formData.get("location") || "").trim() || null,
      target_roles: parseStringArray(formData.get("target_roles")),
      salary_min: Number(formData.get("salary_min")) || null,
      salary_max: Number(formData.get("salary_max")) || null,
      work_preferences: String(formData.get("work_preferences") || "").trim() || null,
      skills: parseStringArray(formData.get("skills")),
      summary: String(formData.get("summary") || "").trim() || null,
      years_experience: Number(formData.get("years_experience")) || null,
      linkedin_url: String(formData.get("linkedin_url") || "").trim() || null,
      portfolio_url: String(formData.get("portfolio_url") || "").trim() || null,
    };

    const { data, error } = await supabase
      .from("career_profiles")
      .upsert(payload, { onConflict: "user_id" })
      .select()
      .single();

    if (error) return { error: error.message };

    return { success: "Profile saved successfully.", profile: data as CareerProfile };
  } catch (e) {
    if (e && typeof e === "object" && "digest" in e) throw e;
    return { error: e instanceof Error ? e.message : "Failed to save profile." };
  }
}
