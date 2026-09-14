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
