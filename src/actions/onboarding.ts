"use server";

import { redirect } from "next/navigation";
import { query } from "@/lib/db";
import { getSession } from "@/lib/session";

export type OnboardingState = { error?: string; success?: string };

function calculateAge(dateOfBirth: string): number {
  const dob = new Date(dateOfBirth + "T00:00:00Z");
  const today = new Date();
  let age = today.getUTCFullYear() - dob.getUTCFullYear();
  const monthDiff = today.getUTCMonth() - dob.getUTCMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getUTCDate() < dob.getUTCDate())) {
    age--;
  }
  return age;
}

export async function completeOnboardingAction(
  _prev: OnboardingState,
  formData: FormData
): Promise<OnboardingState> {
  const session = await getSession();
  if (!session) return { error: "Not authenticated." };

  const preferredName = String(formData.get("preferred_name") || "").trim();
  const dateOfBirth = String(formData.get("date_of_birth") || "").trim();
  const consentGiven = formData.get("consent_given") === "true";
  const timezone = String(formData.get("timezone") || "UTC").trim();

  if (!preferredName) {
    return { error: "Please enter your preferred name." };
  }
  if (!dateOfBirth) {
    return { error: "Please enter your date of birth." };
  }

  const age = calculateAge(dateOfBirth);

  // Age eligibility: 13–24 only
  if (age < 13 || age > 24) {
    // Mark ineligible and save what we have (without completing onboarding)
    await query(
      `UPDATE profiles
       SET preferred_name = $1, date_of_birth = $2, timezone = $3,
           eligibility_status = 'ineligible',
           consent_status = 'pending',
           onboarding_completed = false
       WHERE user_id = $4`,
      [preferredName, dateOfBirth, timezone, session.userId]
    );
    return {
      error:
        "HAVII is for youth ages 13–24. Based on the date of birth you entered, you are not eligible to enroll at this time.",
    };
  }

  // Ages 18–24: self-consent required
  if (age >= 18) {
    if (!consentGiven) {
      return { error: "Please review and accept the privacy and consent terms to continue." };
    }
    await query(
      `UPDATE profiles
       SET preferred_name = $1, date_of_birth = $2, timezone = $3,
           eligibility_status = 'eligible',
           consent_status = 'self_consented',
           consented_at = now(),
           onboarding_completed = true
       WHERE user_id = $4`,
      [preferredName, dateOfBirth, timezone, session.userId]
    );
    redirect("/app");
  }

  // Ages 13–17: caregiver consent required (not implementable in this phase)
  // Save info but keep onboarding incomplete and consent pending
  await query(
    `UPDATE profiles
     SET preferred_name = $1, date_of_birth = $2, timezone = $3,
         eligibility_status = 'eligible',
         consent_status = 'pending_caregiver',
         onboarding_completed = true
     WHERE user_id = $4`,
    [preferredName, dateOfBirth, timezone, session.userId]
  );

  // Redirect to a restricted-access page (not /app which requires full consent)
  redirect("/app/restricted");
}

export async function ineligibleAction(
  _prev: OnboardingState,
  formData: FormData
): Promise<OnboardingState> {
  // Used when a user acknowledges they are ineligible — just sign them out
  const session = await getSession();
  if (!session) return { error: "Not authenticated." };
  // Keep the profile as-is (ineligible) — user can sign out from the restricted page
  return { success: "Your eligibility has been recorded." };
}
