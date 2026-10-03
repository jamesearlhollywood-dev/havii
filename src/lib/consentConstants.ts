// Consent constants and types — kept outside "use server" modules.

/** Consent document version. Update when the consent text changes. */
export const CONSENT_DOCUMENT_VERSION = "draft-2026-10-v1";

/** Invitation link expiry (days). */
export const INVITATION_EXPIRY_DAYS = 7;

/** Minimum minutes between resending invitations. */
export const INVITATION_RESEND_COOLDOWN_MINUTES = 5;

export type InvitationStatus = "pending" | "used" | "expired" | "revoked";
export type ConsentDecision = "approved" | "declined" | "withdrawn";

export type YouthConsentStatus =
  | "invitation_needed"
  | "awaiting_permission"
  | "approved"
  | "not_approved";

export type InvitationState = {
  error?: string;
  success?: string;
  caregiverName?: string;
  caregiverEmail?: string;
  devLink?: string;
};

export type CaregiverConsentState = {
  error?: string;
  success?: string;
};

export type WithdrawState = {
  error?: string;
  success?: string;
};

// ──────────────────────────────────────────────────────────────────────────
// DRAFT consent text — clearly labeled for program team review.
// LAUNCH REQUIREMENT: Replace with approved consent language before
// production use. The version constant above must be updated to match.
// ──────────────────────────────────────────────────────────────────────────

export type ConsentSection = {
  heading: string;
  body: string;
};

export const CONSENT_SECTIONS: ConsentSection[] = [
  {
    heading: "What HAVII offers",
    body: "HAVII is a free wellness and mentorship app for youth ages 13–24. It offers daily mood check-ins, a private journal, personal goal tracking, and connections to community resources. HAVII is not an emergency or crisis service and is not monitored 24/7.",
  },
  {
    heading: "What participation involves",
    body: "Your youth will be able to log daily check-ins, write private journal entries, and set personal goals. Participation is voluntary — they can stop using any feature at any time. HAVII does not replace professional medical or mental health care.",
  },
  {
    heading: "What information is collected and who can access it",
    body: "HAVII collects your youth's preferred name, date of birth (for age eligibility), and the entries they create (check-ins, journals, goals). These entries are private — only your youth can see them. As a caregiver, you can see your youth's basic participation and consent status, but you cannot see their journals, check-in notes, goals, or private reflections. HAVII staff may access account information for safety and program operations.",
  },
  {
    heading: "How to contact the program team",
    body: "If you have questions about HAVII or want to withdraw your consent, you can reach the program team at support@togetherforyou.org. You can also withdraw consent at any time from your caregiver account.",
  },
  {
    heading: "Your consent decision",
    body: "By approving, you give your permission for your youth to participate in HAVII's program features. You can withdraw this consent at any time, which will immediately restrict their access to protected program features while preserving any records already created. If you decline, your youth's protected features will remain locked, but they can still browse public support resources.",
  },
];
