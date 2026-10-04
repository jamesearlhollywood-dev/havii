// Networking & contact management service layer.
//
// Two responsibilities, kept modular so Gmail / Outlook / LinkedIn DM / CRM
// integrations can be added later without touching the action layer:
//
//   1. Networking-related suggested actions surfaced in the UI.
//   2. AI-powered draft message generation (delegates to the centralized AI
//      provider abstraction in src/lib/ai/provider.ts). Drafts are returned
//      for review — they are NEVER marked "sent". Delivery is gated by the
//      email provider abstraction in network-email.ts; a message is only
//      "sent" once a real provider confirms a successful send.
//
// When an interaction requires follow-up, the action layer creates a
// CareerTask automatically (see src/actions/networking.ts).

import "@/lib/ai/openai-provider"; // side-effect: registers AI provider if key set
import { getAIProvider, isAIConfigured, type AIMessage } from "@/lib/ai/provider";
import type {
  CareerContact,
  ContactInteraction,
  NetworkDraftResult,
  NetworkMessageType,
} from "@/lib/career/types";

// ---------------------------------------------------------------------------
// Suggested networking actions
// ---------------------------------------------------------------------------

export interface NetworkSuggestedAction {
  key: string;
  label: string;
  description: string;
  /** Preferred message draft type for this action, if any. */
  messageType?: NetworkMessageType;
}

export const NETWORK_SUGGESTED_ACTIONS: NetworkSuggestedAction[] = [
  {
    key: "follow_up_recruiter",
    label: "Follow up with recruiter",
    description: "Check in on an active application with a recruiter you've spoken to.",
    messageType: "recruiter_follow_up",
  },
  {
    key: "thank_referral",
    label: "Thank referral contact",
    description: "Send a thank-you to someone who referred you for a role.",
    messageType: "thank_you",
  },
  {
    key: "reconnect_colleague",
    label: "Reconnect with former colleague",
    description: "Warm up a dormant relationship with a former teammate.",
    messageType: "networking_email",
  },
  {
    key: "info_interview",
    label: "Ask for informational interview",
    description: "Request a short conversation to learn about a role or company.",
    messageType: "informational_interview",
  },
  {
    key: "post_interview_thanks",
    label: "Send post-interview thank-you",
    description: "Follow up promptly after an interview to reiterate interest.",
    messageType: "thank_you",
  },
  {
    key: "check_in_application",
    label: "Check in after application",
    description: "Politely follow up after submitting an application.",
    messageType: "recruiter_follow_up",
  },
];

// ---------------------------------------------------------------------------
// AI draft message generation
// ---------------------------------------------------------------------------

interface DraftContext {
  contact: CareerContact;
  senderName?: string | null;
  jobContext?: string | null;
  userNote?: string | null;
}

const MESSAGE_GUIDANCE: Record<NetworkMessageType, string> = {
  networking_email:
    "A warm reconnection email. Reference the prior context and propose a low-friction next step.",
  recruiter_follow_up:
    "A concise, professional follow-up with a recruiter. Mention the role/company and reaffirm interest.",
  referral_request:
    "A respectful request for a referral or introduction. Be specific about the role and why they'd be a strong referrer.",
  thank_you:
    "A genuine thank-you note. Reference what they did and keep it brief.",
  informational_interview:
    "A polite request for a brief informational interview. Offer flexibility on timing and format.",
};

export async function draftNetworkingMessage(
  type: NetworkMessageType,
  ctx: DraftContext
): Promise<NetworkDraftResult> {
  const notConfiguredNote =
    "This is a draft for your review. No email was sent — connect an email provider to send messages.";

  if (!isAIConfigured()) {
    return {
      subject: fallbackSubject(type, ctx.contact),
      body: fallbackBody(type, ctx.contact, ctx.senderName),
      ai_provider: null,
      model: null,
      sent: false,
      note: notConfiguredNote,
    };
  }

  const provider = getAIProvider()!;

  const contactName = `${ctx.contact.first_name}${
    ctx.contact.last_name ? ` ${ctx.contact.last_name}` : ""
  }`;
  const sender = ctx.senderName?.trim() || "[Your name]";

  const systemMsg: AIMessage = {
    role: "system",
    content:
      "You are a concise, professional networking writing assistant. Draft a short, natural email " +
      "(subject line + body) that the user can review and send themselves. Never imply the message " +
      "has been sent. Use a warm, professional tone. Keep the body under 180 words.",
  };

  const userMsg: AIMessage = {
    role: "user",
    content:
      `Message type: ${type}\n` +
      `Guidance: ${MESSAGE_GUIDANCE[type]}\n` +
      `Recipient name: ${contactName}\n` +
      `Recipient role: ${ctx.contact.job_title || "n/a"}\n` +
      `Recipient organization: ${ctx.contact.organization || "n/a"}\n` +
      `Relationship type: ${ctx.contact.relationship_type}\n` +
      (ctx.jobContext ? `Relevant job context: ${ctx.jobContext}\n` : "") +
      (ctx.userNote ? `Additional context from user: ${ctx.userNote}\n` : "") +
      `Sender name: ${sender}\n\n` +
      `Return ONLY the email as: SUBJECT: <subject>\nBODY: <body>`,
  };

  try {
    const res = await provider.complete({
      messages: [systemMsg, userMsg],
      temperature: 0.7,
      maxTokens: 600,
    });

    const { subject, body } = parseDraft(res.content);
    return {
      subject: subject || fallbackSubject(type, ctx.contact),
      body: body || fallbackBody(type, ctx.contact, ctx.senderName),
      ai_provider: res.provider,
      model: res.model,
      sent: false,
      note: notConfiguredNote,
    };
  } catch {
    return {
      subject: fallbackSubject(type, ctx.contact),
      body: fallbackBody(type, ctx.contact, ctx.senderName),
      ai_provider: null,
      model: null,
      sent: false,
      note: notConfiguredNote,
    };
  }
}

function parseDraft(content: string): { subject: string; body: string } {
  const subjectMatch = content.match(/SUBJECT:\s*(.+)/i);
  const subject = subjectMatch ? subjectMatch[1].trim() : "";
  const bodyIdx = content.search(/BODY:\s*/i);
  const body =
    bodyIdx >= 0 ? content.slice(bodyIdx + 5).trim() : content.trim();
  return { subject, body };
}

function fallbackSubject(type: NetworkMessageType, contact: CareerContact): string {
  const name = contact.first_name || "there";
  switch (type) {
    case "thank_you":
      return `Thank you — ${name}`;
    case "recruiter_follow_up":
      return `Following up on my application`;
    case "referral_request":
      return `Interested in a role at ${contact.organization || "your company"}`;
    case "informational_interview":
      return `Would love 15 minutes to learn about your work`;
    default:
      return `Reaching out, ${name}`;
  }
}

function fallbackBody(
  type: NetworkMessageType,
  contact: CareerContact,
  senderName?: string | null
): string {
  const name = contact.first_name || "there";
  const sender = senderName?.trim() || "[Your name]";
  const org = contact.organization || "your organization";
  switch (type) {
    case "thank_you":
      return `Hi ${name},\n\nThank you so much for your help — I really appreciate it. I'd love to stay in touch.\n\nBest,\n${sender}`;
    case "recruiter_follow_up":
      return `Hi ${name},\n\nI wanted to follow up on my application${contact.organization ? ` with ${org}` : ""}. Please let me know if there's anything else you need from me.\n\nThanks,\n${sender}`;
    case "referral_request":
      return `Hi ${name},\n\nI'm hoping to apply to a role at ${org} and would value a referral from you. Would you be open to it?\n\nThanks,\n${sender}`;
    case "informational_interview":
      return `Hi ${name},\n\nI'd love to learn about your work at ${org}. Would you be open to a brief 15-minute chat sometime?\n\nThanks,\n${sender}`;
    default:
      return `Hi ${name},\n\nI hope you're doing well. I wanted to reconnect and see how things are going.\n\nBest,\n${sender}`;
  }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Display name for a contact. */
export function contactName(c: { first_name: string; last_name: string | null }): string {
  return `${c.first_name}${c.last_name ? ` ${c.last_name}` : ""}`.trim();
}

/** Whether a contact has a follow-up due (date is today or earlier, and not null). */
export function isFollowUpDue(
  contact: Pick<CareerContact, "next_follow_up_date">,
  today: string
): boolean {
  return !!contact.next_follow_up_date && contact.next_follow_up_date <= today;
}

/** Sort interactions newest-first for display. */
export function sortInteractionsRecent(
  interactions: ContactInteraction[]
): ContactInteraction[] {
  return [...interactions].sort((a, b) =>
    b.interaction_date.localeCompare(a.interaction_date)
  );
}
