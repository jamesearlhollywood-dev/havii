"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { query } from "@/lib/db";
import { getSession, getProfile } from "@/lib/session";
import {
  createSessionToken,
  hashPassword,
  verifyPassword,
  SESSION_COOKIE,
  SESSION_COOKIE_OPTIONS,
} from "@/lib/auth";
import {
  generateInvitationToken,
  hashToken,
  getActiveInvitation,
  getLatestInvitationAge,
  revokePendingInvitations,
  expireOldInvitations,
  getYouthConsentStatus,
  getCaregiverLinkForYouth,
  getCaregiverLinkForCaregiver,
  getInvitationByToken,
  recordAudit,
  buildInviteUrl,
  computeExpiry,
} from "@/lib/caregiver";
import { sendInvitationEmail } from "@/lib/email";
import {
  CONSENT_DOCUMENT_VERSION,
  INVITATION_RESEND_COOLDOWN_MINUTES,
  type InvitationState,
  type CaregiverConsentState,
  type WithdrawState,
} from "@/lib/consentConstants";

// ── 1. YOUTH: Create / resend caregiver invitation ───────────────────────────

/** Create or resend a caregiver invitation. Enforces rate limits and invalidates old invitations. */
export async function createInvitationAction(
  _prev: InvitationState,
  formData: FormData
): Promise<InvitationState> {
  const session = await getSession();
  if (!session) return { error: "Not authenticated." };

  const profile = await getProfile();
  if (!profile) return { error: "Profile not found." };

  // Only minors (13–17) with pending caregiver consent can invite
  if (profile.role !== "youth") {
    return { error: "Only youth accounts can send caregiver invitations." };
  }
  if (profile.consent_status !== "pending_caregiver" && profile.consent_status !== "caregiver_declined") {
    return { error: "Consent has already been resolved for your account." };
  }

  const caregiverName = String(formData.get("caregiver_name") || "").trim();
  const caregiverEmail = String(formData.get("caregiver_email") || "").trim().toLowerCase();

  const base = { caregiverName, caregiverEmail };

  if (!caregiverName) return { error: "Please enter your caregiver's name.", ...base };
  if (!caregiverEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(caregiverEmail)) {
    return { error: "Please enter a valid email address for your caregiver.", ...base };
  }

  // Prevent self-invitation
  if (caregiverEmail === session.email) {
    return { error: "You cannot invite yourself. Please enter your caregiver's email.", ...base };
  }

  // Rate limit: check the age of the most recent invitation
  const lastAge = await getLatestInvitationAge(session.userId);
  if (lastAge !== null && lastAge < INVITATION_RESEND_COOLDOWN_MINUTES * 60) {
    const wait = Math.ceil((INVITATION_RESEND_COOLDOWN_MINUTES * 60 - lastAge) / 60);
    return {
      error: `Please wait ${wait} minute${wait === 1 ? "" : "s"} before sending another invitation.`,
      ...base,
    };
  }

  // Determine if this is a resend or a new invitation
  const existing = await getActiveInvitation(session.userId);
  const isResend =
    existing &&
    existing.caregiver_email === caregiverEmail &&
    existing.caregiver_name === caregiverName;

  // Invalidate all previous pending invitations
  await revokePendingInvitations(session.userId);

  // Generate a new token
  const token = generateInvitationToken();
  const tokenHash = hashToken(token);
  const expiresAt = computeExpiry();

  await query(
    `INSERT INTO caregiver_invitations (youth_user_id, caregiver_name, caregiver_email, token_hash, expires_at)
     VALUES ($1, $2, $3, $4, $5)`,
    [session.userId, caregiverName, caregiverEmail, tokenHash, expiresAt]
  );

  // Build the invitation URL
  const headerList = await headers();
  const origin = headerList.get("origin") || "http://localhost:3000";
  const inviteUrl = buildInviteUrl(origin, token);

  // Send the email
  const emailResult = await sendInvitationEmail(
    caregiverEmail,
    caregiverName,
    profile.preferred_name,
    inviteUrl
  );

  // Audit
  await recordAudit(
    session.userId,
    session.userId,
    null,
    isResend ? "invitation_resent" : "invitation_sent",
    { caregiver_email: caregiverEmail }
  );

  if (emailResult.delivered) {
    return {
      success: `An invitation has been sent to ${caregiverName} at ${caregiverEmail}. They'll receive an email with a link to review and provide consent.`,
      ...base,
    };
  }

  if (emailResult.devLink) {
    return {
      success: `Invitation created. In development, email delivery is not configured — share this link with your caregiver:`,
      devLink: emailResult.devLink,
      ...base,
    };
  }

  return {
    error: emailResult.error || "Invitation created but email delivery failed. Please contact support.",
    ...base,
  };
}

/** Get the youth's current consent status for display. */
export async function getYouthConsentStatusAction() {
  const session = await getSession();
  if (!session) return null;
  return getYouthConsentStatus(session.userId);
}

/** Get the active invitation for the current youth (for display). */
export async function getActiveInvitationAction() {
  const session = await getSession();
  if (!session) return null;
  await expireOldInvitations();
  return getActiveInvitation(session.userId);
}

// ── 2. CAREGIVER: Sign up (from invitation) ─────────────────────────────────

export async function caregiverSignUpAction(
  _prev: { error?: string; success?: string },
  formData: FormData
): Promise<{ error?: string; success?: string }> {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");
  const preferredName = String(formData.get("preferred_name") || "").trim();
  const token = String(formData.get("token") || "");

  if (!token) return { error: "Invalid invitation." };
  if (!email || !email.includes("@")) return { error: "Please enter a valid email." };
  if (password.length < 8) return { error: "Password must be at least 8 characters." };
  if (!preferredName) return { error: "Please enter your name." };

  // Verify the invitation token
  const invitation = await getInvitationByToken(token);
  if (!invitation) return { error: "This invitation is no longer valid." };
  if (invitation.status !== "pending") return { error: "This invitation has already been used or cancelled." };
  if (new Date(invitation.expires_at) <= new Date()) return { error: "This invitation has expired." };

  // Email must match the invitation
  if (email !== invitation.caregiver_email) {
    return { error: "This invitation was sent to a different email address. Please use the email that received the invitation." };
  }

  // Check for existing user
  const { rows: existing } = await query("SELECT id FROM users WHERE email = $1", [email]);
  if (existing.length > 0) {
    return { error: "An account with this email already exists. Please sign in instead." };
  }

  // Prevent self-signup (caregiver email = youth email)
  const { rows: youthUser } = await query<{ email: string }>(
    "SELECT email FROM users WHERE id = $1",
    [invitation.youth_user_id]
  );
  if (youthUser.length > 0 && youthUser[0].email === email) {
    return { error: "You cannot create a caregiver account with the same email as the youth account." };
  }

  // Create the caregiver account
  const passwordHash = hashPassword(password);
  const { rows } = await query<{ id: string }>(
    "INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id",
    [email, passwordHash]
  );
  const userId = rows[0].id;

  // Create a caregiver profile (no youth onboarding needed)
  await query(
    `INSERT INTO profiles (user_id, preferred_name, role, onboarding_completed, consent_status, eligibility_status)
     VALUES ($1, $2, 'caregiver', true, 'pending', 'eligible')`,
    [userId, preferredName]
  );

  // Set session cookie
  const sessionToken = createSessionToken(userId, email);
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, sessionToken, SESSION_COOKIE_OPTIONS);

  redirect(`/consent/review?token=${token}`);
}

// ── 3. CAREGIVER: Approve or decline consent ────────────────────────────────

export async function caregiverApproveAction(
  _prev: CaregiverConsentState,
  formData: FormData
): Promise<CaregiverConsentState> {
  return processConsentDecision(formData, "approved");
}

export async function caregiverDeclineAction(
  _prev: CaregiverConsentState,
  formData: FormData
): Promise<CaregiverConsentState> {
  return processConsentDecision(formData, "declined");
}

async function processConsentDecision(
  formData: FormData,
  decision: "approved" | "declined"
): Promise<CaregiverConsentState> {
  const session = await getSession();
  if (!session) return { error: "Please sign in to continue." };

  const token = String(formData.get("token") || "");
  if (!token) return { error: "Invalid invitation." };

  // Verify the invitation
  const invitation = await getInvitationByToken(token);
  if (!invitation) return { error: "This invitation is no longer valid." };
  if (invitation.status !== "pending") return { error: "This invitation has already been used." };
  if (new Date(invitation.expires_at) <= new Date()) return { error: "This invitation has expired." };

  // Verify the logged-in user's email matches the invitation
  if (session.email !== invitation.caregiver_email) {
    return { error: "This invitation was sent to a different email address. Please sign in with the email that received the invitation." };
  }

  // Prevent self-approval (caregiver is the youth)
  if (session.userId === invitation.youth_user_id) {
    return { error: "You cannot provide consent for your own account." };
  }

  // Verify the caregiver has a caregiver profile
  const profile = await getProfile();
  if (!profile || profile.role !== "caregiver") {
    return { error: "Only caregiver accounts can provide consent." };
  }

  // Check for an existing link (prevent duplicate decisions)
  const existingLink = await getCaregiverLinkForYouth(invitation.youth_user_id);
  if (existingLink && existingLink.caregiver_user_id === session.userId && existingLink.consent_decision === "approved") {
    return { error: "You have already approved consent for this youth." };
  }

  // Use a transaction to ensure atomicity
  const client = await (await import("@/lib/db")).default.connect();
  try {
    await client.query("BEGIN");

    // Mark the invitation as used
    await client.query(
      "UPDATE caregiver_invitations SET status = 'used' WHERE id = $1",
      [invitation.id]
    );

    // Upsert the caregiver link
    if (existingLink) {
      await client.query(
        `UPDATE caregiver_links
         SET consent_decision = $1, consent_document_version = $2,
             consented_at = CASE WHEN $1 = 'approved' THEN now() ELSE consented_at END,
             declined_at = CASE WHEN $1 = 'declined' THEN now() ELSE declined_at END
         WHERE id = $3`,
        [decision, CONSENT_DOCUMENT_VERSION, existingLink.id]
      );
    } else {
      await client.query(
        `INSERT INTO caregiver_links (youth_user_id, caregiver_user_id, invitation_id,
                                       consent_decision, consent_document_version,
                                       consented_at, declined_at)
         VALUES ($1, $2, $3, $4, $5,
                 CASE WHEN $4 = 'approved' THEN now() ELSE NULL END,
                 CASE WHEN $4 = 'declined' THEN now() ELSE NULL END)`,
        [invitation.youth_user_id, session.userId, invitation.id,
         decision, CONSENT_DOCUMENT_VERSION]
      );
    }

    // Update the youth's consent status
    const newStatus = decision === "approved" ? "caregiver_consented" : "caregiver_declined";
    await client.query(
      "UPDATE profiles SET consent_status = $1 WHERE user_id = $2",
      [newStatus, invitation.youth_user_id]
    );

    // Audit
    await client.query(
      `INSERT INTO consent_audit (actor_user_id, youth_user_id, caregiver_user_id, action, details)
       VALUES ($1, $2, $3, $4, $5)`,
      [session.userId, invitation.youth_user_id, session.userId,
       `consent_${decision}`,
       JSON.stringify({ consent_document_version: CONSENT_DOCUMENT_VERSION })]
    );

    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("processConsentDecision error:", err instanceof Error ? err.message : "unknown");
    return { error: "Something went wrong recording your decision. Please try again." };
  } finally {
    client.release();
  }

  if (decision === "approved") {
    redirect("/caregiver");
  }
  return { success: "You have declined to provide consent. The youth will be notified that consent was not approved." };
}

// ── 4. CAREGIVER: Withdraw consent ──────────────────────────────────────────

export async function withdrawConsentAction(
  _prev: WithdrawState,
  formData: FormData
): Promise<WithdrawState> {
  const session = await getSession();
  if (!session) return { error: "Not authenticated." };

  const confirmed = formData.get("confirm") === "true";
  if (!confirmed) return { error: "Please confirm that you want to withdraw consent." };

  const link = await getCaregiverLinkForCaregiver(session.userId);
  if (!link) return { error: "No consent relationship found." };
  if (link.consent_decision !== "approved") {
    return { error: "There is no active consent to withdraw." };
  }

  try {
    await query("BEGIN");
    await query(
      `UPDATE caregiver_links SET consent_decision = 'withdrawn', withdrawn_at = now()
       WHERE id = $1`,
      [link.id]
    );
    // Restrict the youth's access
    await query(
      "UPDATE profiles SET consent_status = 'pending_caregiver' WHERE user_id = $1",
      [link.youth_user_id]
    );
    await query(
      `INSERT INTO consent_audit (actor_user_id, youth_user_id, caregiver_user_id, action, details)
       VALUES ($1, $2, $3, 'consent_withdrawn', $4)`,
      [session.userId, link.youth_user_id, session.userId,
       JSON.stringify({ consent_document_version: link.consent_document_version })]
    );
    await query("COMMIT");
  } catch (err) {
    await query("ROLLBACK");
    console.error("withdrawConsent error:", err instanceof Error ? err.message : "unknown");
    return { error: "Something went wrong. Please try again." };
  }

  return { success: "Consent has been withdrawn. The youth's access to protected features has been restricted." };
}

// ── 5. ADULT CONSENT (turning 18) ─────────────────────────────────────────────

export async function adultConsentAction(
  _prev: { error?: string; success?: string },
  formData: FormData
): Promise<{ error?: string; success?: string }> {
  const session = await getSession();
  if (!session) return { error: "Not authenticated." };

  const profile = await getProfile();
  if (!profile) return { error: "Profile not found." };
  if (profile.role !== "youth") return { error: "Only youth accounts can complete this step." };

  const consentGiven = formData.get("consent_given") === "true";
  if (!consentGiven) return { error: "Please review and accept the consent terms to continue." };

  // Verify the user is 18+
  const { calculateAge } = await import("@/lib/caregiver");
  if (!profile.date_of_birth) return { error: "Date of birth is not set." };
  const age = calculateAge(profile.date_of_birth);
  if (age < 18) return { error: "You must be 18 or older to complete adult consent." };

  try {
    await query("BEGIN");

    // Update consent to self-consented
    await query(
      `UPDATE profiles SET consent_status = 'self_consented', consented_at = now()
       WHERE user_id = $1`,
      [session.userId]
    );

    // Withdraw any active caregiver link
    const link = await getCaregiverLinkForYouth(session.userId);
    if (link && link.consent_decision === "approved") {
      await query(
        `UPDATE caregiver_links SET consent_decision = 'withdrawn', withdrawn_at = now()
         WHERE id = $1`,
        [link.id]
      );
    }

    // Audit
    await query(
      `INSERT INTO consent_audit (actor_user_id, youth_user_id, action, details)
       VALUES ($1, $2, 'adult_consent_completed', $3)`,
      [session.userId, session.userId, JSON.stringify({ age, consent_document_version: CONSENT_DOCUMENT_VERSION })]
    );

    await query("COMMIT");
  } catch (err) {
    await query("ROLLBACK");
    console.error("adultConsent error:", err instanceof Error ? err.message : "unknown");
    return { error: "Something went wrong. Please try again." };
  }

  redirect("/app");
}
