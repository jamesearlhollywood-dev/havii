// Career Assistant context retrieval layer.
//
// Retrieves ONLY the data needed for the user's current request — never all
// records at once. An intent classifier inspects the user message and optional
// client hints, then fetches the minimal relevant subset from Supabase (RLS
// ensures user isolation).

import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  CareerProfile,
  JobApplication,
  Resume,
  GeneratedDocument,
  InterviewSession,
} from "./types";

// ---------------------------------------------------------------------------
// Intent classification
// ---------------------------------------------------------------------------

export type AssistantIntent =
  | "job_targeting"
  | "strategy_review"
  | "job_fit"
  | "resume_improvement"
  | "interview_prep"
  | "follow_up"
  | "skill_gap"
  | "negotiation"
  | "general";

const INTENT_KEYWORDS: Record<AssistantIntent, string[]> = {
  job_targeting: ["target", "should i apply", "what jobs", "which jobs", "look for", "search for"],
  strategy_review: ["strategy", "search strategy", "plan", "approach", "how am i doing", "progress"],
  job_fit: ["best fit", "which job", "best match", "rank", "compare", "most suitable"],
  resume_improvement: ["resume", "improve my resume", "tailor", "update resume", "fix resume"],
  interview_prep: ["interview", "prepare", "mock", "practice", "interview at"],
  follow_up: ["follow up", "follow-up", "check in", "check-in", "after my application", "reach out"],
  skill_gap: ["skill", "skills", "strengthen", "learn", "gap", "missing", "improve"],
  negotiation: ["negotiate", "offer", "salary", "compensation", "counter"],
  general: [],
};

export function classifyIntent(message: string): AssistantIntent {
  const lower = message.toLowerCase();
  for (const [intent, keywords] of Object.entries(INTENT_KEYWORDS)) {
    if (intent === "general") continue;
    if (keywords.some((kw) => lower.includes(kw))) {
      return intent as AssistantIntent;
    }
  }
  return "general";
}

// ---------------------------------------------------------------------------
// Hints from the client (optional — helps narrow context for specific jobs)
// ---------------------------------------------------------------------------

export interface CareerContextHint {
  job_application_id?: string;
  resume_id?: string;
  company_name?: string;
}

// ---------------------------------------------------------------------------
// Fetchers — each returns only what's needed
// ---------------------------------------------------------------------------

export async function getCareerProfile(
  supabase: SupabaseClient,
  userId: string
): Promise<CareerProfile | null> {
  const { data } = await supabase
    .from("career_profiles")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();
  return data as CareerProfile | null;
}

export async function getPrimaryResume(
  supabase: SupabaseClient,
  userId: string
): Promise<Resume | null> {
  const { data } = await supabase
    .from("resumes")
    .select("*")
    .eq("user_id", userId)
    .eq("is_primary", true)
    .maybeSingle();
  return data as Resume | null;
}

export async function getResumeById(
  supabase: SupabaseClient,
  userId: string,
  resumeId: string
): Promise<Resume | null> {
  const { data } = await supabase
    .from("resumes")
    .select("*")
    .eq("id", resumeId)
    .eq("user_id", userId)
    .maybeSingle();
  return data as Resume | null;
}

export async function getAllResumes(
  supabase: SupabaseClient,
  userId: string
): Promise<Resume[]> {
  const { data } = await supabase
    .from("resumes")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  return (data ?? []) as Resume[];
}

export async function getJobApplications(
  supabase: SupabaseClient,
  userId: string
): Promise<JobApplication[]> {
  const { data } = await supabase
    .from("job_applications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  return (data ?? []) as JobApplication[];
}

export async function getJobApplicationById(
  supabase: SupabaseClient,
  userId: string,
  jobId: string
): Promise<JobApplication | null> {
  const { data } = await supabase
    .from("job_applications")
    .select("*")
    .eq("id", jobId)
    .eq("user_id", userId)
    .maybeSingle();
  return data as JobApplication | null;
}

export async function getGeneratedDocuments(
  supabase: SupabaseClient,
  userId: string,
  jobId?: string
): Promise<GeneratedDocument[]> {
  let query = supabase
    .from("generated_documents")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (jobId) query = query.eq("job_application_id", jobId);
  const { data } = await query.limit(10);
  return (data ?? []) as GeneratedDocument[];
}

export async function getInterviewSessions(
  supabase: SupabaseClient,
  userId: string,
  jobId?: string
): Promise<InterviewSession[]> {
  let query = supabase
    .from("interview_sessions")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (jobId) query = query.eq("job_application_id", jobId);
  const { data } = await query.limit(10);
  return (data ?? []) as InterviewSession[];
}

// ---------------------------------------------------------------------------
// Assembled context — the minimal payload sent to the AI
// ---------------------------------------------------------------------------

export interface AssembledContext {
  intent: AssistantIntent;
  careerProfile: CareerProfile | null;
  primaryResume: Resume | null;
  resumes: Resume[];
  jobApplications: JobApplication[];
  referencedJobIds: string[];
  referencedResumeIds: string[];
  generatedDocuments: GeneratedDocument[];
  interviewSessions: InterviewSession[];
}

/**
 * Retrieve only the context needed for the given message + hints.
 * Never fetches every table unconditionally — each intent pulls a targeted subset.
 */
export async function retrieveContext(
  supabase: SupabaseClient,
  userId: string,
  message: string,
  hints?: CareerContextHint
): Promise<AssembledContext> {
  const intent = classifyIntent(message);
  const ctx: AssembledContext = {
    intent,
    careerProfile: null,
    primaryResume: null,
    resumes: [],
    jobApplications: [],
    referencedJobIds: [],
    referencedResumeIds: [],
    generatedDocuments: [],
    interviewSessions: [],
  };

  // Career profile is lightweight and almost always relevant
  ctx.careerProfile = await getCareerProfile(supabase, userId);

  // Resolve a specific job if hinted
  let targetJob: JobApplication | null = null;
  if (hints?.job_application_id) {
    targetJob = await getJobApplicationById(supabase, userId, hints.job_application_id);
    if (targetJob) {
      ctx.jobApplications = [targetJob];
      ctx.referencedJobIds = [targetJob.id];
    }
  } else if (hints?.company_name) {
    const allJobs = await getJobApplications(supabase, userId);
    targetJob =
      allJobs.find(
        (j) => j.company?.toLowerCase().includes(hints.company_name!.toLowerCase())
      ) ?? null;
    if (targetJob) {
      ctx.jobApplications = [targetJob];
      ctx.referencedJobIds = [targetJob.id];
    }
  }

  switch (intent) {
    case "job_targeting":
    case "strategy_review":
    case "job_fit":
      ctx.primaryResume = await getPrimaryResume(supabase, userId);
      if (ctx.referencedJobIds.length === 0) {
        ctx.jobApplications = await getJobApplications(supabase, userId);
        ctx.referencedJobIds = ctx.jobApplications.slice(0, 10).map((j) => j.id);
      }
      break;

    case "resume_improvement":
      ctx.resumes = await getAllResumes(supabase, userId);
      ctx.primaryResume = ctx.resumes.find((r) => r.is_primary) ?? ctx.resumes[0] ?? null;
      ctx.referencedResumeIds = ctx.resumes.map((r) => r.id);
      break;

    case "interview_prep":
      ctx.primaryResume = await getPrimaryResume(supabase, userId);
      if (targetJob) {
        ctx.interviewSessions = await getInterviewSessions(supabase, userId, targetJob.id);
      } else {
        // No specific job — fetch recent interview sessions
        ctx.interviewSessions = await getInterviewSessions(supabase, userId);
        if (ctx.jobApplications.length === 0) {
          // Fetch jobs with Interview status if no specific job mentioned
          const allJobs = await getJobApplications(supabase, userId);
          ctx.jobApplications = allJobs.filter((j) => j.status === "Interview");
          ctx.referencedJobIds = ctx.jobApplications.map((j) => j.id);
        }
      }
      break;

    case "follow_up":
      if (ctx.referencedJobIds.length === 0) {
        const allJobs = await getJobApplications(supabase, userId);
        // Focus on jobs that are Applied or Interview (follow-up candidates)
        ctx.jobApplications = allJobs.filter(
          (j) => j.status === "Applied" || j.status === "Interview"
        );
        ctx.referencedJobIds = ctx.jobApplications.map((j) => j.id);
      }
      ctx.generatedDocuments = await getGeneratedDocuments(
        supabase,
        userId,
        ctx.referencedJobIds[0]
      );
      break;

    case "skill_gap":
      ctx.primaryResume = await getPrimaryResume(supabase, userId);
      ctx.jobApplications = await getJobApplications(supabase, userId);
      ctx.referencedJobIds = ctx.jobApplications.slice(0, 10).map((j) => j.id);
      break;

    case "negotiation":
      if (ctx.referencedJobIds.length === 0) {
        const allJobs = await getJobApplications(supabase, userId);
        ctx.jobApplications = allJobs.filter((j) => j.status === "Offer");
        ctx.referencedJobIds = ctx.jobApplications.map((j) => j.id);
      }
      break;

    default: // general — profile only, already fetched
      break;
  }

  return ctx;
}

// ---------------------------------------------------------------------------
// Serialize context into a compact system prompt section
// ---------------------------------------------------------------------------

export function serializeContext(ctx: AssembledContext): string {
  const parts: string[] = [];

  if (ctx.careerProfile) {
    const p = ctx.careerProfile;
    parts.push("## Career Profile");
    parts.push(`Name: ${p.full_name ?? "N/A"}`);
    parts.push(`Headline: ${p.headline ?? "N/A"}`);
    parts.push(`Location: ${p.location ?? "N/A"}`);
    parts.push(`Target roles: ${(p.target_roles ?? []).join(", ") || "N/A"}`);
    parts.push(`Skills: ${(p.skills ?? []).join(", ") || "N/A"}`);
    parts.push(`Years of experience: ${p.years_experience ?? "N/A"}`);
    if (p.summary) parts.push(`Summary: ${p.summary}`);
    if (p.salary_min || p.salary_max) {
      parts.push(`Salary range: ${p.salary_min ?? "?"} - ${p.salary_max ?? "?"}`);
    }
    if (p.work_preferences) parts.push(`Work preferences: ${p.work_preferences}`);
  }

  if (ctx.primaryResume) {
    const r = ctx.primaryResume;
    parts.push("\n## Primary Resume");
    parts.push(`Name: ${r.name ?? "N/A"}`);
    parts.push(`Target role: ${r.target_role ?? "N/A"}`);
    if (r.parsed_skills?.length) parts.push(`Skills: ${r.parsed_skills.join(", ")}`);
    if (r.parsed_keywords?.length) parts.push(`Keywords: ${r.parsed_keywords.join(", ")}`);
    if (r.parsed_data?.summary) parts.push(`Summary: ${r.parsed_data.summary}`);
    if (r.raw_text) {
      parts.push(`Full text (truncated):\n${r.raw_text.slice(0, 3000)}`);
    }
  }

  if (ctx.resumes.length > 1) {
    parts.push("\n## Other Resumes");
    for (const r of ctx.resumes.filter((res) => !res.is_primary)) {
      parts.push(`- ${r.name} (target: ${r.target_role ?? "N/A"}, id: ${r.id})`);
    }
  }

  if (ctx.jobApplications.length > 0) {
    parts.push("\n## Job Applications");
    for (const j of ctx.jobApplications) {
      parts.push(
        `- ${j.company ?? "?"} / ${j.title ?? "?"} | Status: ${j.status} | Location: ${j.location ?? "N/A"} | ID: ${j.id}`
      );
      if (j.salary_text) parts.push(`  Salary: ${j.salary_text}`);
      if (j.description) parts.push(`  Description: ${j.description.slice(0, 500)}`);
      if (j.notes) parts.push(`  Notes: ${j.notes}`);
    }
  }

  if (ctx.interviewSessions.length > 0) {
    parts.push("\n## Interview Sessions");
    for (const s of ctx.interviewSessions) {
      parts.push(
        `- ${s.role_title ?? "?"} at ${s.company ?? "?"} | Type: ${s.interview_type ?? "N/A"} | Score: ${s.score ?? "N/A"} | ID: ${s.id}`
      );
      if (s.feedback) parts.push(`  Feedback: ${s.feedback.slice(0, 300)}`);
    }
  }

  if (ctx.generatedDocuments.length > 0) {
    parts.push("\n## Generated Documents");
    for (const d of ctx.generatedDocuments) {
      parts.push(`- ${d.title ?? "Untitled"} (type: ${d.document_type ?? "N/A"}, id: ${d.id})`);
    }
  }

  return parts.join("\n");
}
