import { cookies } from "next/headers";
import { query } from "@/lib/db";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth";

export type SessionUser = {
  userId: string;
  email: string;
};

export type Profile = {
  id: string;
  user_id: string;
  preferred_name: string;
  date_of_birth: string | null;
  timezone: string;
  consent_status: string;
  consented_at: string | null;
  eligibility_status: string;
  onboarding_completed: boolean;
  role: string;
};

/** Read and verify the session cookie. Returns null if not logged in. */
export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

/** Get the current user's profile, or null if not logged in / no profile. */
export async function getProfile(): Promise<Profile | null> {
  const session = await getSession();
  if (!session) return null;

  const { rows } = await query<Profile>(
    `SELECT id, user_id, preferred_name, date_of_birth::text, timezone,
            consent_status, consented_at, eligibility_status, onboarding_completed, role
     FROM profiles WHERE user_id = $1`,
    [session.userId]
  );
  return rows[0] ?? null;
}

/**
 * Determine the user's access level.
 * - 'guest'        — not logged in
 * - 'onboarding'   — logged in but onboarding not complete
 * - 'restricted'   — onboarding complete but consent pending (minors)
 * - 'full'         — onboarding complete and consented (can use check-ins etc.)
 * - 'ineligible'   — age outside 13–24
 */
export type AccessLevel =
  | "guest"
  | "onboarding"
  | "restricted"
  | "full"
  | "ineligible"
  | "caregiver"
  | "adult_consent";

function calcAge(dateOfBirth: string | null): number | null {
  if (!dateOfBirth) return null;
  const dob = new Date(dateOfBirth + "T00:00:00Z");
  const today = new Date();
  let age = today.getUTCFullYear() - dob.getUTCFullYear();
  const monthDiff = today.getUTCMonth() - dob.getUTCMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getUTCDate() < dob.getUTCDate())) {
    age--;
  }
  return age;
}

export async function getAccessLevel(): Promise<{ level: AccessLevel; profile: Profile | null }> {
  const profile = await getProfile();
  if (!profile) return { level: "guest", profile: null };

  // Caregiver accounts have their own access level
  if (profile.role === "caregiver") return { level: "caregiver", profile };

  if (!profile.onboarding_completed) return { level: "onboarding", profile };
  if (profile.eligibility_status === "ineligible") return { level: "ineligible", profile };

  // Adult self-consent → full access
  if (profile.consent_status === "self_consented") return { level: "full", profile };

  // Caregiver-consented → full access unless they've turned 18 (need adult consent)
  if (profile.consent_status === "caregiver_consented") {
    const age = calcAge(profile.date_of_birth);
    if (age !== null && age >= 18) return { level: "adult_consent", profile };
    return { level: "full", profile };
  }

  // Pending caregiver or declined → restricted, unless they've turned 18
  if (
    profile.consent_status === "pending_caregiver" ||
    profile.consent_status === "caregiver_declined"
  ) {
    const age = calcAge(profile.date_of_birth);
    if (age !== null && age >= 18) return { level: "adult_consent", profile };
    return { level: "restricted", profile };
  }

  return { level: "restricted", profile };
}
