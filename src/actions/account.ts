"use server";

import { query } from "@/lib/db";
import { getSession, getProfile } from "@/lib/session";

export type AccountState = { error?: string; success?: string };

export async function updateProfileAction(
  _prev: AccountState,
  formData: FormData
): Promise<AccountState> {
  const session = await getSession();
  if (!session) return { error: "Not authenticated." };

  const preferredName = String(formData.get("preferred_name") || "").trim();
  const timezone = String(formData.get("timezone") || "UTC").trim();

  if (!preferredName) {
    return { error: "Preferred name cannot be empty." };
  }

  // Only update preferred_name and timezone — NOT date_of_birth,
  // consent_status, or eligibility_status (prevents bypassing eligibility/consent).
  try {
    await query(
      `UPDATE profiles SET preferred_name = $1, timezone = $2 WHERE user_id = $3`,
      [preferredName, timezone, session.userId]
    );
    return { success: "Your account has been updated." };
  } catch (err) {
    console.error("updateProfile error:", err);
    return { error: "Something went wrong. Please try again." };
  }
}

/** Get the current user's profile for the account page. */
export async function getAccountProfile() {
  return getProfile();
}
