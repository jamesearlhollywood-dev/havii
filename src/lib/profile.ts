import { createClient } from "@/lib/supabase/server";
import type {
  CaregiverProfile,
  MentorProfile,
  PartnerProfile,
  Profile,
  YouthProfile,
} from "@/lib/types";

export async function getCurrentUserAndProfile() {
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

export async function getRoleExtension(profile: Profile) {
  const supabase = await createClient();
  if (profile.role === "youth") {
    const { data } = await supabase
      .from("youth_profiles")
      .select("*")
      .eq("profile_id", profile.id)
      .maybeSingle();
    return { youth: data as YouthProfile | null };
  }
  if (profile.role === "mentor") {
    const { data } = await supabase
      .from("mentor_profiles")
      .select("*")
      .eq("profile_id", profile.id)
      .maybeSingle();
    return { mentor: data as MentorProfile | null };
  }
  if (profile.role === "caregiver") {
    const { data } = await supabase
      .from("caregiver_profiles")
      .select("*")
      .eq("profile_id", profile.id)
      .maybeSingle();
    return { caregiver: data as CaregiverProfile | null };
  }
  if (profile.role === "community_partner") {
    const { data } = await supabase
      .from("partner_profiles")
      .select("*")
      .eq("profile_id", profile.id)
      .maybeSingle();
    return { partner: data as PartnerProfile | null };
  }
  return {};
}

export { displayName } from "@/lib/utils";

/**
 * Returns the signed-in user's display name (preferred_name → first_name →
 * email handle → "User"). Returns null when not authenticated.
 */
export async function getUserName(): Promise<string | null> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;
    const { data: profile } = await supabase
      .from("profiles")
      .select("preferred_name, first_name, last_name")
      .eq("user_id", user.id)
      .maybeSingle();
    return (
      profile?.preferred_name ||
      profile?.first_name ||
      user.email?.split("@")[0] ||
      "User"
    );
  } catch {
    return null;
  }
}
