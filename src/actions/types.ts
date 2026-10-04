import type { CareerProfile } from "@/lib/career/types";
import type { NormalizedJobResult } from "@/lib/career/types";

export type AuthActionState = {
  error?: string;
  success?: string;
};

export type OnboardingState = {
  error?: string;
  success?: string;
};

export type CareerProfileState = {
  error?: string;
  success?: string;
  profile?: CareerProfile;
};

export type SearchJobsResult = {
  results: NormalizedJobResult[];
  provider: string | null;
  configured: boolean;
  error?: string;
};

export type RecommendationsResult = {
  error?: string;
  profileReady: boolean;
  jobsAvailable: boolean;
  apiConfigured: boolean;
  recommendations: import("@/lib/career/types").RecommendedJob[];
  analyzedCount: number;
  totalCandidates: number;
};

export type JobMatchActionResult = {
  error?: string;
  analysis?: import("@/lib/career/types").JobMatchAnalysis;
};

export type JobActionState = {
  error?: string;
  success?: string;
};

export type ResumeActionState = {
  error?: string;
  success?: string;
};

/** Result returned to the client after parsing an uploaded resume. */
export type ResumeParseResult = {
  error?: string;
  rawText?: string;
  parsedData?: import("@/lib/career/types").ParsedResumeData;
  fileName?: string;
  fileSize?: number;
};

// ---------------------------------------------------------------------------
// Career Assistant
// ---------------------------------------------------------------------------

export type AssistantActionType =
  | "open_job"
  | "tailor_resume"
  | "generate_cover_letter"
  | "start_interview_prep"
  | "save_document"
  | "update_career_profile";

export interface AssistantSuggestedAction {
  type: AssistantActionType;
  label: string;
  job_id?: string;
  resume_id?: string;
  document_type?: string;
}

export interface CareerContextHint {
  job_application_id?: string;
  resume_id?: string;
  company_name?: string;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface CareerAssistantResult {
  error?: string;
  response?: string;
  suggested_actions?: AssistantSuggestedAction[];
  referenced_job_ids?: string[];
  referenced_resume_ids?: string[];
  generated_document_type?: string | null;
  ai_provider?: string | null;
}

// ---------------------------------------------------------------------------
// Saved Searches & Job Alerts
// ---------------------------------------------------------------------------

import type {
  SavedJobSearch,
  SavedSearchInput,
  JobAlertResult,
} from "@/lib/career/types";

export type SavedSearchActionState = {
  error?: string;
  success?: string;
};

export type AlertResultsResult = {
  error?: string;
  results: JobAlertResult[];
};

export type { SavedJobSearch, SavedSearchInput, JobAlertResult };
