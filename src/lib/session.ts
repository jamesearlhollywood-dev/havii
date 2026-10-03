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
  date_of_birth: string;
  timezone: string;
  consent_status: string;
  consented_at: string | null;
  eligibility_status: string;
  onboarding_completed: boolean;
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
    `SELECT id, user_id, preferred_name, date_of_birth, timezone,
            consent_status, consented_at, eligibility_status, onboarding_completed
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
export type AccessLevel = "guest" | "onboarding" | "restricted" | "full" | "ineligible";

export async function getAccessLevel(): Promise<{ level: AccessLevel; profile: Profile | null }> {
  const profile = await getProfile();
  if (!profile) return { level: "guest", profile: null };

  if (!profile.onboarding_completed) return { level: "onboarding", profile };
  if (profile.eligibility_status === "ineligible") return { level: "ineligible", profile };

  if (
    profile.consent_status === "self_consented" ||
    profile.consent_status === "caregiver_consented"
  ) {
    return { level: "full", profile };
  }

  return { level: "restricted", profile };
}
