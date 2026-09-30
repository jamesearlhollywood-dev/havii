"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { UserRole } from "@/lib/types";

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

    // --- Consent (required for all users) ---
    const consentAccepted = formData.get("consent_accepted") === "true";
    if (!consentAccepted) {
      return { error: "Please review and accept the consent terms to continue." };
    }

    // --- Determine if user is a minor ---
    let isMinor = false;
    let caregiverConsentStatus: "not_required" | "pending" = "not_required";

    if (dateOfBirth) {
      const dob = new Date(dateOfBirth);
      const now = new Date();
      let age = now.getFullYear() - dob.getFullYear();
      const hasHadBirthday =
        now.getMonth() > dob.getMonth() ||
        (now.getMonth() === dob.getMonth() && now.getDate() >= dob.getDate());
      if (!hasHadBirthday) age--;
      isMinor = age < 18;
    }

    // Caregiver consent for minors
    let caregiverName: string | null = null;
    let caregiverEmail: string | null = null;
    let caregiverRelationship: string | null = null;

    if (isMinor && role === "youth") {
      caregiverName = String(formData.get("caregiver_name") || "").trim();
      caregiverEmail = String(formData.get("caregiver_email") || "").trim();
      caregiverRelationship = String(formData.get("caregiver_relationship") || "").trim();

      if (!caregiverName || !caregiverEmail) {
        return {
          error: "Caregiver name and email are required for accounts under 18.",
        };
      }
      caregiverConsentStatus = "pending";
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
        consent_accepted_at: new Date().toISOString(),
        caregiver_consent_status: caregiverConsentStatus,
        updated_at: new Date().toISOString(),
      })
      .eq("id", profile.id);

    if (profileUpdateError) {
      return { error: profileUpdateError.message };
    }

    if (role === "youth") {
      const interests = formData.getAll("interests").map(String);
      const helpAreas = formData.getAll("help_areas").map(String);
      const mentorshipInterested = formData.get("mentorship_interested") === "true";
      const locationGeneral = String(formData.get("location_general") || "").trim();
      const schoolOrProgram = String(formData.get("school_or_program") || "").trim();

      if (!dateOfBirth) {
        return { error: "Date of birth is required for youth accounts." };
      }

      const { error: ypError } = await supabase.from("youth_profiles").upsert(
        {
          profile_id: profile.id,
          interests,
          help_areas: helpAreas,
          mentorship_interested: mentorshipInterested,
          location_general: locationGeneral || [city, state].filter(Boolean).join(", ") || null,
          school_or_program: schoolOrProgram || null,
          caregiver_name: caregiverName,
          caregiver_email: caregiverEmail,
          caregiver_relationship: caregiverRelationship,
        },
        { onConflict: "profile_id" }
      );
      if (ypError) return { error: ypError.message };
    }

    if (role === "mentor") {
      const profession = String(formData.get("profession") || "").trim();
      const background = String(formData.get("background_summary") || "").trim();
      const mentoringInterests = formData.getAll("mentoring_interests").map(String);
      const supportAreas = formData.getAll("support_areas").map(String);
      const locationGeneral = String(formData.get("location_general") || "").trim();

      if (!profession) {
        return { error: "Profession / background is required." };
      }

      const { error: mpError } = await supabase.from("mentor_profiles").upsert(
        {
          profile_id: profile.id,
          profession,
          background_summary: background || null,
          mentoring_interests: mentoringInterests,
          support_areas: supportAreas,
          location_general: locationGeneral || [city, state].filter(Boolean).join(", ") || null,
          application_status: "pending_application",
        },
        { onConflict: "profile_id" }
      );
      if (mpError) return { error: mpError.message };
    }

    if (role === "caregiver") {
      const notes = String(formData.get("relationship_notes") || "").trim();
      const { error: cpError } = await supabase.from("caregiver_profiles").upsert(
        {
          profile_id: profile.id,
          relationship_notes: notes || null,
        },
        { onConflict: "profile_id" }
      );
      if (cpError) return { error: cpError.message };
    }

    if (role === "community_partner") {
      const organizationName = String(formData.get("organization_name") || "").trim();
      const titleRole = String(formData.get("title_role") || "").trim();
      const contactEmail = String(formData.get("contact_email") || "").trim();
      const reason = String(formData.get("reason_for_use") || "").trim();

      if (!organizationName || !reason) {
        return { error: "Organization name and reason for use are required." };
      }

      const { error: ppError } = await supabase.from("partner_profiles").upsert(
        {
          profile_id: profile.id,
          organization_name: organizationName,
          title_role: titleRole || null,
          contact_email: contactEmail || null,
          reason_for_use: reason,
          review_status: "pending_review",
        },
        { onConflict: "profile_id" }
      );
      if (ppError) return { error: ppError.message };
    }

    // --- Record consent in consent_records ---
    await supabase.from("consent_records").insert({
      profile_id: profile.id,
      consent_type: "platform_terms",
      granted: true,
      metadata: {
        role,
        is_minor: isMinor,
        caregiver_consent_status: caregiverConsentStatus,
      },
    });

    redirect("/dashboard");
  } catch (e) {
    if (e && typeof e === "object" && "digest" in e) throw e;
    return { error: e instanceof Error ? e.message : "Onboarding failed." };
  }
}
