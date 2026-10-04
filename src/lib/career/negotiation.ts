// Negotiation strategy & document generation — service layer.
//
// negotiationStrategy is an AI service operation that produces a structured
// negotiation plan from an offer, the user's career profile, target
// compensation, relevant (verified) market data, and the user's priorities.
//
// Provenance is explicit and surfaced to the user:
//   - Verified market data   → only when a compensation provider returned data
//   - User-entered information → the offer details + negotiation inputs
//   - AI-generated strategy  → the returned structured plan
//
// The AI is instructed NEVER to claim market data is verified unless it was
// actually provided. Drafts are returned for review; saving to
// GeneratedDocument happens only via the action layer after the user confirms.

import "@/lib/ai/openai-provider"; // side-effect: registers AI provider if key set
import { getAIProvider, isAIConfigured, type AIMessage } from "@/lib/ai/provider";
import type {
  JobOffer,
  NegotiationDocumentType,
  NegotiationDocumentResult,
  NegotiationStrategy,
  NegotiationStrategyInput,
  NegotiationStrategyResult,
  SalaryEstimate,
} from "@/lib/career/types";
import type { CareerProfile } from "@/lib/career/types";

// ---------------------------------------------------------------------------
// negotiationStrategy
// ---------------------------------------------------------------------------

interface StrategyContext {
  offer: JobOffer;
  profile: CareerProfile | null;
  input: NegotiationStrategyInput;
  marketData: SalaryEstimate | null;
}

export async function negotiationStrategy(
  ctx: StrategyContext
): Promise<NegotiationStrategyResult> {
  const data_sources = {
    market_data_verified: !!ctx.marketData,
    user_entered: [
      "Offer compensation details",
      "Desired / minimum salary",
      "Priority benefits",
      "Competing offer information",
      "Leverage points",
    ],
    ai_generated: false,
  };

  if (!isAIConfigured()) {
    return { strategy: null, ai_configured: false, data_sources };
  }

  const provider = getAIProvider()!;

  const offer = ctx.offer;
  const marketNote = ctx.marketData
    ? `Verified market data (from ${ctx.marketData.source}${
        ctx.marketData.data_date ? `, dated ${ctx.marketData.data_date}` : ""
      }): median ${fmtMoney(ctx.marketData.salary_median)}, range ${fmtMoney(
        ctx.marketData.salary_min
      )}–${fmtMoney(ctx.marketData.salary_max)}, 25th–75th percentile ${fmtMoney(
        ctx.marketData.percentile_25
      )}–${fmtMoney(ctx.marketData.percentile_75)}.`
    : "No verified compensation data provider is connected. Do NOT claim any market figures are verified. Do not invent salary benchmarks.";

  const systemMsg: AIMessage = {
    role: "system",
    content:
      "You are an expert salary negotiation coach. Produce a structured, actionable negotiation strategy as JSON. " +
      "Distinguish clearly between verified market data, the user's entered information, and your own AI-generated recommendations. " +
      "Never claim market data is verified unless it was explicitly provided. Be realistic and specific. " +
      "Return ONLY a JSON object with these keys: " +
      "negotiation_position (string), recommended_target (number), recommended_floor (number), " +
      "strongest_leverage_points (string[]), risks (string[]), recommended_sequence (string[]), " +
      "suggested_talking_points (string[]), suggested_email (string), suggested_phone_script (string).",
  };

  const userMsg: AIMessage = {
    role: "user",
    content:
      `OFFER (user-entered):\n` +
      `Company: ${offer.company}\n` +
      `Role: ${offer.role_title || "n/a"}\n` +
      `Location: ${offer.location || "n/a"} · ${offer.work_mode || "n/a"}\n` +
      `Base salary: ${fmtMoney(offer.base_salary)}\n` +
      `Bonus: ${fmtMoney(offer.bonus_amount)} (${offer.bonus_type || "n/a"})\n` +
      `Equity value: ${fmtMoney(offer.equity_value)}\n` +
      `Signing bonus: ${fmtMoney(offer.signing_bonus)}\n` +
      `Retirement match: ${fmtMoney(offer.retirement_match)}\n` +
      `Health benefit value: ${fmtMoney(offer.health_benefit_value)}\n` +
      `PTO days: ${offer.paid_time_off_days ?? "n/a"}\n` +
      `Remote stipend: ${fmtMoney(offer.remote_stipend)}\n` +
      `Relocation: ${fmtMoney(offer.relocation_assistance)}\n` +
      `Estimated total comp: ${fmtMoney(offer.total_estimated_compensation)}\n` +
      `Response deadline: ${offer.response_deadline || "n/a"}\n\n` +
      `CANDIDATE (user-entered):\n` +
      `Headline: ${ctx.profile?.headline || "n/a"}\n` +
      `Years experience: ${ctx.profile?.years_experience ?? "n/a"}\n` +
      `Target roles: ${(ctx.profile?.target_roles ?? []).join(", ") || "n/a"}\n\n` +
      `NEGOTIATION INPUTS (user-entered):\n` +
      `Desired salary: ${fmtMoney(ctx.input.desired_salary)}\n` +
      `Minimum acceptable salary: ${fmtMoney(ctx.input.minimum_acceptable_salary)}\n` +
      `Priority benefits: ${ctx.input.priority_benefits.join(", ") || "n/a"}\n` +
      `Competing offer info: ${ctx.input.competing_offer_info || "n/a"}\n` +
      `Leverage points: ${ctx.input.leverage_points || "n/a"}\n\n` +
      `MARKET DATA:\n${marketNote}\n\n` +
      `Generate the negotiation strategy JSON now.`,
  };

  try {
    const res = await provider.complete({
      messages: [systemMsg, userMsg],
      temperature: 0.5,
      maxTokens: 1400,
    });
    const strategy = parseStrategy(res.content);
    return {
      strategy,
      ai_configured: true,
      data_sources: { ...data_sources, ai_generated: true },
    };
  } catch (e) {
    return {
      strategy: null,
      ai_configured: true,
      data_sources,
      error: e instanceof Error ? e.message : "Could not generate strategy.",
    };
  }
}

function parseStrategy(content: string): NegotiationStrategy {
  const cleaned = extractJson(content);
  try {
    const obj = JSON.parse(cleaned);
    const arr = (v: unknown): string[] =>
      Array.isArray(v) ? v.map((x) => String(x)).filter(Boolean) : [];
    return {
      negotiation_position: str(obj.negotiation_position),
      recommended_target: num(obj.recommended_target),
      recommended_floor: num(obj.recommended_floor),
      strongest_leverage_points: arr(obj.strongest_leverage_points),
      risks: arr(obj.risks),
      recommended_sequence: arr(obj.recommended_sequence),
      suggested_talking_points: arr(obj.suggested_talking_points),
      suggested_email: str(obj.suggested_email),
      suggested_phone_script: str(obj.suggested_phone_script),
    };
  } catch {
    return emptyStrategy();
  }
}

function emptyStrategy(): NegotiationStrategy {
  return {
    negotiation_position: null,
    recommended_target: null,
    recommended_floor: null,
    strongest_leverage_points: [],
    risks: [],
    recommended_sequence: [],
    suggested_talking_points: [],
    suggested_email: null,
    suggested_phone_script: null,
  };
}

// ---------------------------------------------------------------------------
// Negotiation document generation
// ---------------------------------------------------------------------------

const DOC_GUIDANCE: Record<NegotiationDocumentType, string> = {
  salary_negotiation_email:
    "A professional salary negotiation email. Reference the offer and propose a specific higher number with concise, respectful justification.",
  counteroffer_email:
    "A counteroffer email responding to an offer. State the counter clearly and reaffirm enthusiasm for the role.",
  benefits_negotiation_email:
    "A benefits negotiation email focused on non-salary compensation (PTO, remote, equity, signing bonus). Be specific about what is requested.",
  offer_acceptance_email:
    "An offer acceptance email. Express genuine enthusiasm, confirm key terms, and state next steps.",
  offer_decline_email:
    "A gracious offer decline email. Thank them sincerely, keep the door open, and do not burn bridges.",
};

export async function draftNegotiationDocument(args: {
  type: NegotiationDocumentType;
  offer: JobOffer;
  senderName?: string | null;
  extraContext?: string | null;
}): Promise<NegotiationDocumentResult> {
  const sender = args.senderName?.trim() || "[Your name]";
  const offer = args.offer;

  if (!isAIConfigured()) {
    return {
      subject: fallbackSubject(args.type, offer),
      body: fallbackBody(args.type, offer, sender),
      ai_provider: null,
      model: null,
      saved: false,
    };
  }

  const provider = getAIProvider()!;
  const systemMsg: AIMessage = {
    role: "system",
    content:
      "You are a professional negotiation writing assistant. Draft a short, natural email (subject + body) the user can review and send. " +
      "Never claim market data is verified unless provided. Keep the body under 200 words.",
  };
  const userMsg: AIMessage = {
    role: "user",
    content:
      `Document type: ${args.type}\n` +
      `Guidance: ${DOC_GUIDANCE[args.type]}\n` +
      `Company: ${offer.company}\n` +
      `Role: ${offer.role_title || "n/a"}\n` +
      `Base salary: ${fmtMoney(offer.base_salary)}\n` +
      `Total comp: ${fmtMoney(offer.total_estimated_compensation)}\n` +
      `Start date: ${offer.start_date || "n/a"}\n` +
      `Response deadline: ${offer.response_deadline || "n/a"}\n` +
      (args.extraContext ? `Additional context: ${args.extraContext}\n` : "") +
      `Sender name: ${sender}\n\n` +
      `Return ONLY the email as: SUBJECT: <subject>\nBODY: <body>`,
  };

  try {
    const res = await provider.complete({
      messages: [systemMsg, userMsg],
      temperature: 0.7,
      maxTokens: 700,
    });
    const { subject, body } = parseDraft(res.content);
    return {
      subject: subject || fallbackSubject(args.type, offer),
      body: body || fallbackBody(args.type, offer, sender),
      ai_provider: res.provider,
      model: res.model,
      saved: false,
    };
  } catch {
    return {
      subject: fallbackSubject(args.type, offer),
      body: fallbackBody(args.type, offer, sender),
      ai_provider: null,
      model: null,
      saved: false,
    };
  }
}

function parseDraft(content: string): { subject: string; body: string } {
  const subjectMatch = content.match(/SUBJECT:\s*(.+)/i);
  const subject = subjectMatch ? subjectMatch[1].trim() : "";
  const bodyIdx = content.search(/BODY:\s*/i);
  const body = bodyIdx >= 0 ? content.slice(bodyIdx + 5).trim() : content.trim();
  return { subject, body };
}

function fallbackSubject(type: NegotiationDocumentType, offer: JobOffer): string {
  switch (type) {
    case "salary_negotiation_email":
      return `Discussion regarding the ${offer.role_title || "role"} offer`;
    case "counteroffer_email":
      return `Following up on my offer from ${offer.company}`;
    case "benefits_negotiation_email":
      return `A few questions about the offer details`;
    case "offer_acceptance_email":
      return `Accepting the ${offer.role_title || "role"} offer`;
    case "offer_decline_email":
      return `Update on the ${offer.role_title || "role"} position`;
  }
}

function fallbackBody(type: NegotiationDocumentType, offer: JobOffer, sender: string): string {
  const company = offer.company;
  switch (type) {
    case "salary_negotiation_email":
      return `Hi,\n\nThank you so much for the offer to join ${company} as ${offer.role_title || "the role"}. I'm very excited about the opportunity.\n\nI was hoping we could discuss the base salary. Based on my experience and the scope of the role, I'd like to propose a figure closer to [your target]. I'd be happy to walk through my reasoning.\n\nThank you,\n${sender}`;
    case "counteroffer_email":
      return `Hi,\n\nThank you for the offer from ${company}. I'd love to join the team.\n\nAfter reviewing the full package, I'd like to counter at [your counter]. I believe this reflects the value I'll bring to the role.\n\nLooking forward to your thoughts.\n${sender}`;
    case "benefits_negotiation_email":
      return `Hi,\n\nThank you for the offer from ${company}. I'm enthusiastic about the role and would like to discuss a few elements of the benefits package — [additional PTO / remote flexibility / equity].\n\nCould we set up a quick call?\n\nThanks,\n${sender}`;
    case "offer_acceptance_email":
      return `Hi,\n\nI'm thrilled to accept the offer to join ${company} as ${offer.role_title || "the role"}$. Thank you for this opportunity. Please let me know the next steps.\n\nBest,\n${sender}`;
    case "offer_decline_email":
      return `Hi,\n\nThank you so much for the offer to join ${company}. After careful consideration, I've decided to go in a different direction. I truly appreciate the time you spent with me and hope we can stay in touch.\n\nWarmly,\n${sender}`;
  }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function fmtMoney(v: number | null | undefined): string {
  if (v == null || Number.isNaN(v)) return "n/a";
  return `$${Math.round(v).toLocaleString("en-US")}`;
}

function str(v: unknown): string | null {
  return typeof v === "string" && v.trim() ? v.trim() : null;
}

function num(v: unknown): number | null {
  return typeof v === "number" && Number.isFinite(v) ? v : null;
}

function extractJson(content: string): string {
  const start = content.indexOf("{");
  const end = content.lastIndexOf("}");
  if (start >= 0 && end > start) return content.slice(start, end + 1);
  return content.trim();
}
