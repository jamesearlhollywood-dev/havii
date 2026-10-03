"use server";

// Career Assistant — server-side AI service operation.
//
// Accepts structured conversation data (user_message, conversation_history,
// career_context) and returns a structured response with suggested actions.
// The AI provider is called server-side only — API credentials never reach the
// client. Context is retrieved on-demand from Supabase (RLS-isolated), never
// bulk-loaded.

import { createClient } from "@/lib/supabase/server";
import "@/lib/ai/openai-provider"; // side-effect: auto-registers if OPENAI_API_KEY is set
import { getAIProvider, type AIMessage } from "@/lib/ai/provider";
import {
  retrieveContext,
  serializeContext,
  type CareerContextHint,
} from "@/lib/career/assistant-context";
import type {
  CareerAssistantResult,
  ChatMessage,
  AssistantSuggestedAction,
} from "@/actions/types";

const SYSTEM_PROMPT = `You are Career AI's professional career strategist — a seasoned executive coach with deep expertise in job search strategy, resume optimization, interview preparation, salary negotiation, and career development.

Your role is to act as the user's personal career strategist. You are knowledgeable, encouraging, and practical. You give specific, actionable advice — never generic platitudes.

You have access to the user's career data below. Use it to give personalized, evidence-based guidance. Refer to specific jobs, skills, and experiences from their data when relevant.

Guidelines:
- Be concise but thorough. Use clear structure (short paragraphs, occasional bullet points).
- Reference the user's specific data (company names, job titles, skills) to ground your advice.
- When suggesting the user take an action (update resume, prepare for interview, generate a cover letter, open a job), include it in the suggested_actions JSON.
- NEVER claim you have updated, saved, or modified any data. You can only advise — actions are taken by the user through the UI.
- If you reference a specific job, include its ID in referenced_job_ids.
- If you reference a specific resume, include its ID in referenced_resume_ids.
- If your response involves creating a document (cover letter, follow-up message, etc.), set generated_document_type to the document type (e.g. "cover_letter", "follow_up_message", "thank_you_note").

You MUST respond with a single valid JSON object — no markdown, no code fences. The format:
{
  "response": "<your advice as plain text>",
  "suggested_actions": [
    { "type": "open_job", "label": "Open <company>", "job_id": "<id>" },
    { "type": "tailor_resume", "label": "Tailor Resume", "resume_id": "<id>" },
    { "type": "generate_cover_letter", "label": "Generate Cover Letter", "job_id": "<id>" },
    { "type": "start_interview_prep", "label": "Start Interview Prep", "job_id": "<id>" },
    { "type": "save_document", "label": "Save Document" },
    { "type": "update_career_profile", "label": "Update Career Profile" }
  ],
  "referenced_job_ids": ["<id>"],
  "referenced_resume_ids": ["<id>"],
  "generated_document_type": null
}

Only include suggested_actions that are genuinely relevant to the conversation. An empty array is fine.`;

export async function careerAssistant(
  userMessage: string,
  conversationHistory: ChatMessage[],
  careerContext?: CareerContextHint
): Promise<CareerAssistantResult> {
  // 1. Authenticate
  let supabase;
  let userId: string | null = null;
  try {
    supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    userId = user?.id ?? null;
  } catch {
    return { error: "Unable to connect to the database." };
  }

  if (!userId) return { error: "Not authenticated." };

  // 2. Retrieve only the context needed for this request
  const ctx = await retrieveContext(supabase, userId, userMessage, careerContext);
  const contextSection = serializeContext(ctx);
  const hasContext = contextSection.trim().length > 0;

  // 3. Check AI provider
  const provider = getAIProvider();
  if (!provider) {
    return {
      error: undefined,
      response:
        "I'm ready to help, but an AI provider hasn't been connected yet. Once an AI API key is configured on the server, I'll be able to analyze your career data and provide personalized guidance. In the meantime, you can explore your Dashboard, Job Tracker, and Resume AI tools.",
      suggested_actions: getContextBasedActions(ctx),
      referenced_job_ids: ctx.referencedJobIds,
      referenced_resume_ids: ctx.referencedResumeIds,
      generated_document_type: null,
      ai_provider: null,
    };
  }

  // 4. Build the AI message sequence
  const systemContent = hasContext
    ? `${SYSTEM_PROMPT}\n\n## USER CAREER DATA\n\n${contextSection}`
    : `${SYSTEM_PROMPT}\n\n## USER CAREER DATA\n\nNo career data is available yet. The user may be new or hasn't set up their profile/resumes/jobs. Help them get started with general career guidance.`;

  const messages: AIMessage[] = [
    { role: "system", content: systemContent },
    ...conversationHistory.map(
      (m): AIMessage => ({ role: m.role, content: m.content })
    ),
    { role: "user", content: userMessage },
  ];

  // 5. Call the AI provider (server-side only)
  try {
    const result = await provider.complete({
      messages,
      temperature: 0.7,
      maxTokens: 2000,
    });

    // 6. Parse the structured JSON response
    const parsed = parseAIResponse(result.content);

    return {
      response: parsed.response,
      suggested_actions: parsed.suggested_actions?.length
        ? parsed.suggested_actions
        : getContextBasedActions(ctx),
      referenced_job_ids: parsed.referenced_job_ids?.length
        ? parsed.referenced_job_ids
        : ctx.referencedJobIds,
      referenced_resume_ids: parsed.referenced_resume_ids?.length
        ? parsed.referenced_resume_ids
        : ctx.referencedResumeIds,
      generated_document_type: parsed.generated_document_type ?? null,
      ai_provider: result.provider,
    };
  } catch (e) {
    if (e && typeof e === "object" && "digest" in e) throw e;
    return {
      error:
        e instanceof Error
          ? `AI service error: ${e.message}`
          : "The AI service encountered an error. Please try again.",
    };
  }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

interface ParsedAIResponse {
  response: string;
  suggested_actions?: AssistantSuggestedAction[];
  referenced_job_ids?: string[];
  referenced_resume_ids?: string[];
  generated_document_type?: string | null;
}

function parseAIResponse(raw: string): ParsedAIResponse {
  // The AI may wrap JSON in code fences — strip them
  let text = raw.trim();
  if (text.startsWith("```")) {
    text = text.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/i, "").trim();
  }

  try {
    const obj = JSON.parse(text);
    return {
      response: String(obj.response ?? raw),
      suggested_actions: Array.isArray(obj.suggested_actions)
        ? obj.suggested_actions
        : undefined,
      referenced_job_ids: Array.isArray(obj.referenced_job_ids)
        ? obj.referenced_job_ids
        : undefined,
      referenced_resume_ids: Array.isArray(obj.referenced_resume_ids)
        ? obj.referenced_resume_ids
        : undefined,
      generated_document_type: obj.generated_document_type ?? null,
    };
  } catch {
    // If the AI didn't return valid JSON, use the raw text as the response
    return { response: raw };
  }
}

/** Build fallback actions from the retrieved context when the AI doesn't provide them. */
function getContextBasedActions(
  ctx: Awaited<ReturnType<typeof retrieveContext>>
): AssistantSuggestedAction[] {
  const actions: AssistantSuggestedAction[] = [];
  if (ctx.referencedJobIds.length > 0) {
    actions.push({
      type: "open_job",
      label: "Open Job",
      job_id: ctx.referencedJobIds[0],
    });
  }
  if (ctx.primaryResume) {
    actions.push({
      type: "tailor_resume",
      label: "Tailor Resume",
      resume_id: ctx.primaryResume.id,
    });
  }
  if (!ctx.careerProfile) {
    actions.push({ type: "update_career_profile", label: "Update Career Profile" });
  }
  return actions;
}
