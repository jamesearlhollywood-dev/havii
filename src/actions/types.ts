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
