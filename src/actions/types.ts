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
