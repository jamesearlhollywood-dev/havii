"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { MOOD_LABELS } from "@/lib/types";

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
// Mood check-in
// ---------------------------------------------------------------------------
export async function saveMoodCheckInAction(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const { supabase, profile, error } = await getAuthedProfile();
  if (error || !profile) return { error };

  const moodLevel = Number(formData.get("mood_level"));
  if (!moodLevel || moodLevel < 1 || moodLevel > 5) {
    return { error: "Please select how you're feeling." };
  }
  const notes = String(formData.get("notes") || "").trim();

  // Check if already checked in today
  const today = new Date();
  const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate()).toISOString();
  const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1).toISOString();

  const { data: existing } = await supabase
    .from("emotional_checkins")
    .select("id")
    .eq("profile_id", profile.id)
    .gte("created_at", startOfDay)
    .lt("created_at", endOfDay)
    .maybeSingle();

  if (existing) {
    const { error: updateError } = await supabase
      .from("emotional_checkins")
      .update({
        mood_level,
        mood: MOOD_LABELS[moodLevel] || null,
        notes: notes || null,
      })
      .eq("id", existing.id);
    if (updateError) return { error: updateError.message };
  } else {
    const { error: insertError } = await supabase
      .from("emotional_checkins")
      .insert({
        profile_id: profile.id,
        mood_level,
        mood: MOOD_LABELS[moodLevel] || null,
        notes: notes || null,
      });
    if (insertError) return { error: insertError.message };
  }

  return { success: "Thanks for checking in!" };
}

// ---------------------------------------------------------------------------
// Goals
// ---------------------------------------------------------------------------
export async function createGoalAction(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const { supabase, profile, error } = await getAuthedProfile();
  if (error || !profile) return { error };

  const title = String(formData.get("title") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const targetDate = String(formData.get("target_date") || "").trim();

  if (!title) return { error: "Please give your goal a title." };

  const { error: insertError } = await supabase.from("goals").insert({
    profile_id: profile.id,
    title,
    description: description || null,
    target_date: targetDate || null,
    status: "active",
  });
  if (insertError) return { error: insertError.message };

  return { success: "Goal created!" };
}

export async function updateGoalProgressAction(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const { supabase, profile, error } = await getAuthedProfile();
  if (error || !profile) return { error };

  const goalId = String(formData.get("goal_id") || "");
  const progress = Number(formData.get("progress") || 0);

  if (!goalId) return { error: "Goal not found." };

  const status = progress >= 100 ? "completed" : "active";

  const { error: updateError } = await supabase
    .from("goals")
    .update({ progress, status })
    .eq("id", goalId)
    .eq("profile_id", profile.id);

  if (updateError) return { error: updateError.message };

  return { success: "Progress updated!" };
}

// ---------------------------------------------------------------------------
// Journal
// ---------------------------------------------------------------------------
export async function createJournalEntryAction(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const { supabase, profile, error } = await getAuthedProfile();
  if (error || !profile) return { error };

  const title = String(formData.get("title") || "").trim();
  const body = String(formData.get("body") || "").trim();

  if (!body) return { error: "Please write something in your journal entry." };

  const { error: insertError } = await supabase.from("journal_entries").insert({
    profile_id: profile.id,
    title: title || null,
    body,
    is_private: true,
  });
  if (insertError) return { error: insertError.message };

  return { success: "Journal entry saved!" };
}

export async function deleteJournalEntryAction(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const { supabase, profile, error } = await getAuthedProfile();
  if (error || !profile) return { error };

  const entryId = String(formData.get("entry_id") || "");
  if (!entryId) return { error: "Entry not found." };

  const { error: deleteError } = await supabase
    .from("journal_entries")
    .delete()
    .eq("id", entryId)
    .eq("profile_id", profile.id);

  if (deleteError) return { error: deleteError.message };

  return { success: "Entry deleted." };
}
