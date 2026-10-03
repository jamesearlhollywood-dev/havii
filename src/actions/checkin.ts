"use server";

import { query } from "@/lib/db";
import { getSession, getProfile } from "@/lib/session";

export type CheckInState = { error?: string; success?: string; mood?: string; note?: string };

export const MOOD_OPTIONS = [
  { value: "great", label: "Great", emoji: "😄" },
  { value: "good", label: "Good", emoji: "🙂" },
  { value: "okay", label: "Okay", emoji: "😐" },
  { value: "low", label: "Low", emoji: "😕" },
  { value: "struggling", label: "Struggling", emoji: "😞" },
] as const;

export type CheckIn = {
  id: string;
  mood: string;
  note: string | null;
  check_in_date: string;
  created_at: string;
  updated_at: string;
};

/** Get the user's check-in date for "today" in their timezone. */
async function getTodayDate(timezone: string): Promise<string> {
  const { rows } = await query<{ check_in_date: string }>(
    "SELECT (now() AT TIME ZONE $1)::date AS check_in_date",
    [timezone || "UTC"]
  );
  return rows[0].check_in_date;
}

/** Verify the user has full access (eligible + consented). */
async function requireFullAccess() {
  const session = await getSession();
  if (!session) return { error: "Not authenticated." as const, session: null, profile: null };

  const profile = await getProfile();
  if (!profile) return { error: "Profile not found." as const, session, profile: null };

  if (profile.eligibility_status !== "eligible") {
    return { error: "You are not eligible to use this feature." as const, session, profile };
  }
  if (profile.consent_status !== "self_consented" && profile.consent_status !== "caregiver_consented") {
    return { error: "Caregiver consent is required before you can use check-ins." as const, session, profile };
  }
  return { error: null, session, profile };
}

/** Get today's check-in for the current user (or null). */
export async function getTodayCheckIn(): Promise<CheckIn | null> {
  const session = await getSession();
  if (!session) return null;
  const profile = await getProfile();
  if (!profile) return null;

  const today = await getTodayDate(profile.timezone);
  const { rows } = await query<CheckIn>(
    `SELECT id, mood, note, check_in_date::text, created_at, updated_at
     FROM check_ins WHERE user_id = $1 AND check_in_date = $2`,
    [session.userId, today]
  );
  return rows[0] ?? null;
}

/** Save or update today's check-in. */
export async function saveCheckInAction(
  _prev: CheckInState,
  formData: FormData
): Promise<CheckInState> {
  const mood = String(formData.get("mood") || "");
  const note = String(formData.get("note") || "").trim();

  const access = await requireFullAccess();
  if (access.error || !access.session || !access.profile) {
    return { error: access.error, mood, note };
  }

  if (!MOOD_OPTIONS.some((m) => m.value === mood)) {
    return { error: "Please select a mood.", mood, note };
  }

  const today = await getTodayDate(access.profile.timezone);

  try {
    await query(
      `INSERT INTO check_ins (user_id, mood, note, check_in_date)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (user_id, check_in_date)
       DO UPDATE SET mood = $2, note = $3, updated_at = now()`,
      [access.session.userId, mood, note || null, today]
    );
    return { success: "Your check-in has been saved.", mood, note };
  } catch (err) {
    console.error("saveCheckIn error:", err);
    return { error: "Something went wrong. Your text has been preserved — please try again.", mood, note };
  }
}

/** Get all check-ins for the current user, newest first. */
export async function getCheckInHistory(): Promise<CheckIn[]> {
  const session = await getSession();
  if (!session) return [];
  const { rows } = await query<CheckIn>(
    `SELECT id, mood, note, check_in_date::text, created_at, updated_at
     FROM check_ins WHERE user_id = $1
     ORDER BY check_in_date DESC`,
    [session.userId]
  );
  return rows;
}
