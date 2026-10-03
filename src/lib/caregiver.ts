// Non-action server-side functions for the caregiver consent process.
// This module does NOT use "use server" so it can export regular functions.

import { createHash, randomBytes } from "crypto";
import { query } from "@/lib/db";
import {
  INVITATION_EXPIRY_DAYS,
  type InvitationStatus,
  type YouthConsentStatus,
  type ConsentDecision,
} from "@/lib/consentConstants";

// ── Token helpers ──────────────────────────────────────────────────────────

/** Generate a cryptographically random invitation token (64 hex chars). */
export function generateInvitationToken(): string {
  return randomBytes(32).toString("hex");
}

/** Hash a token for storage — the raw token is never stored. */
export function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

// ── Age calculation ─────────────────────────────────────────────────────────

export function calculateAge(dateOfBirth: string): number {
  const dob = new Date(dateOfBirth + "T00:00:00Z");
  const today = new Date();
  let age = today.getUTCFullYear() - dob.getUTCFullYear();
  const monthDiff = today.getUTCMonth() - dob.getUTCMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getUTCDate() < dob.getUTCDate())) {
    age--;
  }
  return age;
}

// ── Types ───────────────────────────────────────────────────────────────────

export type InvitationRecord = {
  id: string;
  youth_user_id: string;
  caregiver_name: string;
  caregiver_email: string;
  status: InvitationStatus;
  expires_at: string;
  created_at: string;
};

export type CaregiverLinkRecord = {
  id: string;
  youth_user_id: string;
  caregiver_user_id: string;
  consent_decision: ConsentDecision;
  consent_document_version: string;
  consented_at: string | null;
  declined_at: string | null;
  withdrawn_at: string | null;
  created_at: string;
};

export type YouthProfileBasic = {
  preferred_name: string;
  date_of_birth: string | null;
  consent_status: string;
  onboarding_completed: boolean;
};

// ── Invitation lookups ──────────────────────────────────────────────────────

/** Look up an invitation by its raw token. Returns null if not found. */
export async function getInvitationByToken(
  token: string
): Promise<(InvitationRecord & { youth_preferred_name: string }) | null> {
  const tokenHash = hashToken(token);
  const { rows } = await query<InvitationRecord & { youth_preferred_name: string }>(
    `SELECT ci.id, ci.youth_user_id, ci.caregiver_name, ci.caregiver_email,
            ci.status, ci.expires_at, ci.created_at,
            p.preferred_name AS youth_preferred_name
     FROM caregiver_invitations ci
     JOIN profiles p ON p.user_id = ci.youth_user_id
     WHERE ci.token_hash = $1`,
    [tokenHash]
  );
  return rows[0] ?? null;
}

/** Get the active (pending, non-expired) invitation for a youth. */
export async function getActiveInvitation(
  youthUserId: string
): Promise<InvitationRecord | null> {
  const { rows } = await query<InvitationRecord>(
    `SELECT id, youth_user_id, caregiver_name, caregiver_email,
            status, expires_at, created_at
     FROM caregiver_invitations
     WHERE youth_user_id = $1 AND status = 'pending' AND expires_at > now()
     ORDER BY created_at DESC LIMIT 1`,
    [youthUserId]
  );
  return rows[0] ?? null;
}

/** Check whether the user has sent an invitation recently (rate limit). */
export async function getLatestInvitationAge(
  youthUserId: string
): Promise<number | null> {
  const { rows } = await query<{ age_seconds: number }>(
    `SELECT EXTRACT(EPOCH FROM (now() - created_at))::int AS age_seconds
     FROM caregiver_invitations
     WHERE youth_user_id = $1
     ORDER BY created_at DESC LIMIT 1`,
    [youthUserId]
  );
  return rows.length > 0 ? rows[0].age_seconds : null;
}

/** Mark all pending invitations for a youth as revoked (used when replacing). */
export async function revokePendingInvitations(youthUserId: string): Promise<void> {
  await query(
    `UPDATE caregiver_invitations SET status = 'revoked'
     WHERE youth_user_id = $1 AND status = 'pending'`,
    [youthUserId]
  );
}

/** Mark expired invitations (pending but past expiry). */
export async function expireOldInvitations(): Promise<void> {
  await query(
    `UPDATE caregiver_invitations SET status = 'expired'
     WHERE status = 'pending' AND expires_at <= now()`
  );
}

// ── Consent status ──────────────────────────────────────────────────────────

/** Derive the youth-facing consent status from DB state. */
export async function getYouthConsentStatus(
  youthUserId: string
): Promise<YouthConsentStatus> {
  // Check for an approved, non-withdrawn link.
  const { rows: links } = await query<{ consent_decision: ConsentDecision }>(
    `SELECT consent_decision FROM caregiver_links
     WHERE youth_user_id = $1
     ORDER BY updated_at DESC LIMIT 1`,
    [youthUserId]
  );

  if (links.length > 0) {
    const decision = links[0].consent_decision;
    if (decision === "approved") return "approved";
    if (decision === "withdrawn") return "not_approved";
    if (decision === "declined") return "not_approved";
  }

  // No active link — check invitations.
  await expireOldInvitations();
  const invitation = await getActiveInvitation(youthUserId);
  if (invitation) return "awaiting_permission";

  return "invitation_needed";
}

// ── Caregiver link lookups ───────────────────────────────────────────────────

/** Get the link record for a youth (most recent decision). */
export async function getCaregiverLinkForYouth(
  youthUserId: string
): Promise<CaregiverLinkRecord | null> {
  const { rows } = await query<CaregiverLinkRecord>(
    `SELECT id, youth_user_id, caregiver_user_id, consent_decision,
            consent_document_version, consented_at, declined_at,
            withdrawn_at, created_at
     FROM caregiver_links
     WHERE youth_user_id = $1
     ORDER BY updated_at DESC LIMIT 1`,
    [youthUserId]
  );
  return rows[0] ?? null;
}

/** Get the link record for a caregiver (most recent decision). */
export async function getCaregiverLinkForCaregiver(
  caregiverUserId: string
): Promise<CaregiverLinkRecord | null> {
  const { rows } = await query<CaregiverLinkRecord>(
    `SELECT id, youth_user_id, caregiver_user_id, consent_decision,
            consent_document_version, consented_at, declined_at,
            withdrawn_at, created_at
     FROM caregiver_links
     WHERE caregiver_user_id = $1
     ORDER BY updated_at DESC LIMIT 1`,
    [caregiverUserId]
  );
  return rows[0] ?? null;
}

/** Get basic youth profile info for the caregiver dashboard. */
export async function getYouthBasicProfile(
  youthUserId: string
): Promise<YouthProfileBasic | null> {
  const { rows } = await query<YouthProfileBasic>(
    `SELECT preferred_name, date_of_birth::text, consent_status, onboarding_completed
     FROM profiles WHERE user_id = $1`,
    [youthUserId]
  );
  return rows[0] ?? null;
}

// ── Audit ───────────────────────────────────────────────────────────────────

export async function recordAudit(
  actorUserId: string | null,
  youthUserId: string,
  caregiverUserId: string | null,
  action: string,
  details: Record<string, unknown> | null = null
): Promise<void> {
  await query(
    `INSERT INTO consent_audit (actor_user_id, youth_user_id, caregiver_user_id, action, details)
     VALUES ($1, $2, $3, $4, $5)`,
    [actorUserId, youthUserId, caregiverUserId, action, JSON.stringify(details)]
  );
}

// ── Invitation URL ──────────────────────────────────────────────────────────

/** Build the invitation URL from a token using the request origin. */
export function buildInviteUrl(origin: string, token: string): string {
  return `${origin}/consent/invite?token=${token}`;
}

/** Compute the expiry timestamp for a new invitation. */
export function computeExpiry(): Date {
  const expires = new Date();
  expires.setDate(expires.getDate() + INVITATION_EXPIRY_DAYS);
  return expires;
}
