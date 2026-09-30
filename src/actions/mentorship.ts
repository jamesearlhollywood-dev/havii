"use server";

import { createClient } from "@/lib/supabase/server";
import type { UserRole } from "@/lib/types";

export type ActionResult = { error?: string; success?: string };

async function getAuthedProfile() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { supabase, profile: null, error: "Not authenticated." };
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();
  if (error || !profile) {
    return { supabase, profile: null, error: "Profile not found." };
  }
  return { supabase, profile, error: null };
}

// ---------------------------------------------------------------------------
// 1. Youth: Request a mentor
// ---------------------------------------------------------------------------
export async function createMentorRequestAction(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const { supabase, profile, error } = await getAuthedProfile();
  if (error || !profile) return { error };
  if (profile.role !== "youth") return { error: "Only youth can request a mentor." };

  // Get youth_profile
  const { data: youthProfile } = await supabase
    .from("youth_profiles")
    .select("id")
    .eq("profile_id", profile.id)
    .maybeSingle();
  if (!youthProfile) return { error: "Youth profile not found. Complete onboarding first." };

  const interests = formData.getAll("interests").map(String);
  const helpAreas = formData.getAll("help_areas").map(String);
  const availabilityNotes = String(formData.get("availability_notes") || "").trim();

  if (interests.length === 0 && helpAreas.length === 0) {
    return { error: "Please select at least one interest or support area." };
  }

  // Check for existing pending request
  const { data: existing } = await supabase
    .from("mentor_requests")
    .select("id, status")
    .eq("youth_profile_id", youthProfile.id)
    .eq("status", "pending")
    .maybeSingle();

  if (existing) {
    // Update existing request
    const { error: updateError } = await supabase
      .from("mentor_requests")
      .update({ interests, help_areas, availability_notes: availabilityNotes || null })
      .eq("id", existing.id);
    if (updateError) return { error: updateError.message };
  } else {
    const { error: insertError } = await supabase
      .from("mentor_requests")
      .insert({
        youth_profile_id: youthProfile.id,
        interests,
        help_areas: helpAreas,
        availability_notes: availabilityNotes || null,
        status: "pending",
      });
    if (insertError) return { error: insertError.message };
  }

  // Update youth_profile with mentorship_interested
  await supabase
    .from("youth_profiles")
    .update({
      mentorship_interested: true,
      interests: interests.length > 0 ? interests : undefined,
      help_areas: helpAreas.length > 0 ? helpAreas : undefined,
      availability_notes: availabilityNotes || undefined,
    })
    .eq("id", youthProfile.id);

  return { success: "Your mentor request has been submitted! Our staff will review it." };
}

// ---------------------------------------------------------------------------
// 2. Mentor: Submit application
// ---------------------------------------------------------------------------
export async function submitMentorApplicationAction(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const { supabase, profile, error } = await getAuthedProfile();
  if (error || !profile) return { error };
  if (profile.role !== "mentor") return { error: "Only mentors can submit applications." };

  const profession = String(formData.get("profession") || "").trim();
  const backgroundSummary = String(formData.get("background_summary") || "").trim();
  const mentoringInterests = formData.getAll("mentoring_interests").map(String);
  const supportAreas = formData.getAll("support_areas").map(String);
  const locationGeneral = String(formData.get("location_general") || "").trim();
  const availabilityNotes = String(formData.get("availability_notes") || "").trim();

  if (!profession) return { error: "Profession is required." };
  if (mentoringInterests.length === 0) return { error: "Select at least one mentoring interest." };

  const { error: upsertError } = await supabase
    .from("mentor_profiles")
    .upsert(
      {
        profile_id: profile.id,
        profession,
        background_summary: backgroundSummary || null,
        mentoring_interests: mentoringInterests,
        support_areas: supportAreas,
        location_general: locationGeneral || null,
        availability_notes: availabilityNotes || null,
        application_status: "submitted",
        application_submitted_at: new Date().toISOString(),
      },
      { onConflict: "profile_id" }
    );
  if (upsertError) return { error: upsertError.message };

  return { success: "Application submitted! Staff will review it. You'll be notified when a decision is made." };
}

// ---------------------------------------------------------------------------
// 3. Staff: Approve / decline mentor application
// ---------------------------------------------------------------------------
export async function approveMentorAction(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const { supabase, profile, error } = await getAuthedProfile();
  if (error || !profile) return { error };
  if (!["staff", "administrator"].includes(profile.role)) return { error: "Only staff can approve mentors." };

  const mentorProfileId = String(formData.get("mentor_profile_id") || "");
  if (!mentorProfileId) return { error: "Mentor not found." };

  const { error: updateError } = await supabase
    .from("mentor_profiles")
    .update({
      application_status: "approved",
      approved_by: profile.id,
      approved_at: new Date().toISOString(),
    })
    .eq("id", mentorProfileId);

  if (updateError) return { error: updateError.message };

  // Log audit
  await supabase.from("audit_logs").insert({
    actor_profile_id: profile.id,
    action: "approve_mentor",
    entity_type: "mentor_profile",
    entity_id: mentorProfileId,
    metadata: { application_status: "approved" },
  });

  return { success: "Mentor approved. They can now be matched with youth." };
}

export async function declineMentorAction(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const { supabase, profile, error } = await getAuthedProfile();
  if (error || !profile) return { error };
  if (!["staff", "administrator"].includes(profile.role)) return { error: "Only staff can decline mentors." };

  const mentorProfileId = String(formData.get("mentor_profile_id") || "");
  const reason = String(formData.get("reason") || "").trim();
  if (!mentorProfileId) return { error: "Mentor not found." };

  const { error: updateError } = await supabase
    .from("mentor_profiles")
    .update({
      application_status: "declined",
    })
    .eq("id", mentorProfileId);

  if (updateError) return { error: updateError.message };

  await supabase.from("audit_logs").insert({
    actor_profile_id: profile.id,
    action: "decline_mentor",
    entity_type: "mentor_profile",
    entity_id: mentorProfileId,
    metadata: { reason },
  });

  return { success: "Mentor application declined." };
}

// ---------------------------------------------------------------------------
// 3b. Staff: Create / update match
// ---------------------------------------------------------------------------
export async function createMatchAction(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const { supabase, profile, error } = await getAuthedProfile();
  if (error || !profile) return { error };
  if (!["staff", "administrator"].includes(profile.role)) return { error: "Only staff can create matches." };

  const youthProfileId = String(formData.get("youth_profile_id") || "");
  const mentorProfileId = String(formData.get("mentor_profile_id") || "");
  const notes = String(formData.get("notes") || "").trim();

  if (!youthProfileId || !mentorProfileId) return { error: "Select both a youth and a mentor." };

  // Verify mentor is approved
  const { data: mentor } = await supabase
    .from("mentor_profiles")
    .select("application_status")
    .eq("id", mentorProfileId)
    .maybeSingle();
  if (!mentor || mentor.application_status !== "approved") {
    return { error: "This mentor has not been approved." };
  }

  // Check if youth already has an active match
  const { data: existingMatch } = await supabase
    .from("mentor_matches")
    .select("id, status")
    .eq("youth_profile_id", youthProfileId)
    .in("status", ["proposed", "active", "paused"])
    .maybeSingle();

  if (existingMatch) {
    return { error: "This youth already has an active mentor match. End it before creating a new one." };
  }

  const { error: insertError } = await supabase.from("mentor_matches").insert({
    youth_profile_id: youthProfileId,
    mentor_profile_id: mentorProfileId,
    status: "active",
    matched_by: profile.id,
    notes: notes || null,
    status_changed_by: profile.id,
    status_changed_at: new Date().toISOString(),
  });

  if (insertError) return { error: insertError.message };

  // Update mentor request status if exists
  await supabase
    .from("mentor_requests")
    .update({ status: "matched" })
    .eq("youth_profile_id", youthProfileId)
    .eq("status", "pending");

  await supabase.from("audit_logs").insert({
    actor_profile_id: profile.id,
    action: "create_match",
    entity_type: "mentor_match",
    metadata: { youth_profile_id: youthProfileId, mentor_profile_id: mentorProfileId },
  });

  return { success: "Match created successfully!" };
}

export async function updateMatchStatusAction(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const { supabase, profile, error } = await getAuthedProfile();
  if (error || !profile) return { error };
  if (!["staff", "administrator"].includes(profile.role)) return { error: "Only staff can update matches." };

  const matchId = String(formData.get("match_id") || "");
  const newStatus = String(formData.get("status") || "");
  const reason = String(formData.get("reason") || "").trim();

  if (!matchId) return { error: "Match not found." };
  if (!["active", "paused", "ended"].includes(newStatus)) return { error: "Invalid status." };

  const updateData: Record<string, unknown> = {
    status: newStatus,
    status_changed_by: profile.id,
    status_changed_at: new Date().toISOString(),
  };
  if (newStatus === "ended" && reason) updateData.ended_reason = reason;

  const { error: updateError } = await supabase
    .from("mentor_matches")
    .update(updateData)
    .eq("id", matchId);

  if (updateError) return { error: updateError.message };

  await supabase.from("audit_logs").insert({
    actor_profile_id: profile.id,
    action: "update_match_status",
    entity_type: "mentor_match",
    entity_id: matchId,
    metadata: { new_status: newStatus, reason },
  });

  return { success: `Match status updated to ${newStatus}.` };
}

// ---------------------------------------------------------------------------
// 4. Youth: Request help with match
// ---------------------------------------------------------------------------
export async function requestHelpWithMatchAction(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const { supabase, profile, error } = await getAuthedProfile();
  if (error || !profile) return { error };

  const matchId = String(formData.get("match_id") || "");
  const message = String(formData.get("message") || "").trim();

  if (!matchId) return { error: "Match not found." };
  if (!message) return { error: "Please describe what you need help with." };

  // Create a safety case
  const { error: insertError } = await supabase.from("safety_cases").insert({
    title: `Help request for mentor match`,
    status: "open",
    severity: "normal",
    assigned_to: null,
  });

  if (insertError) return { error: insertError.message };

  return { success: "Your request has been sent to staff. They'll reach out soon." };
}

// ---------------------------------------------------------------------------
// 6. Session scheduling: request, confirm, cancel
// ---------------------------------------------------------------------------
export async function requestSessionAction(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const { supabase, profile, error } = await getAuthedProfile();
  if (error || !profile) return { error };

  const matchId = String(formData.get("match_id") || "");
  const title = String(formData.get("title") || "").trim() || "Mentor session";
  const startsAt = String(formData.get("starts_at") || "").trim();
  const endsAt = String(formData.get("ends_at") || "").trim();
  const timezone = String(formData.get("timezone") || "America/New_York").trim();
  const notes = String(formData.get("notes") || "").trim();
  const location = String(formData.get("location") || "Virtual").trim();

  if (!matchId) return { error: "Match not found." };
  if (!startsAt) return { error: "Please select a date and time." };

  const { error: insertError } = await supabase.from("sessions").insert({
    mentor_match_id: matchId,
    title,
    starts_at: startsAt,
    ends_at: endsAt || null,
    location: location || null,
    status: "scheduled",
    requested_by: profile.id,
    timezone,
    notes: notes || null,
  });

  if (insertError) return { error: insertError.message };

  return { success: "Session requested! The other person will be notified to confirm." };
}

export async function confirmSessionAction(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const { supabase, profile, error } = await getAuthedProfile();
  if (error || !profile) return { error };

  const sessionId = String(formData.get("session_id") || "");
  if (!sessionId) return { error: "Session not found." };

  const { error: updateError } = await supabase
    .from("sessions")
    .update({ status: "confirmed" })
    .eq("id", sessionId);

  if (updateError) return { error: updateError.message };

  return { success: "Session confirmed!" };
}

export async function cancelSessionAction(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const { supabase, profile, error } = await getAuthedProfile();
  if (error || !profile) return { error };

  const sessionId = String(formData.get("session_id") || "");
  const cancelReason = String(formData.get("cancel_reason") || "").trim();

  if (!sessionId) return { error: "Session not found." };

  const { error: updateError } = await supabase
    .from("sessions")
    .update({
      status: "cancelled",
      cancel_reason: cancelReason || null,
    })
    .eq("id", sessionId);

  if (updateError) return { error: updateError.message };

  return { success: "Session cancelled." };
}
