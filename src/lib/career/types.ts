// Career AI — domain types

export type JobStatus =
  | "Saved"
  | "Applied"
  | "Interview"
  | "Offer"
  | "Rejected"
  | "Withdrawn";

export const JOB_STATUSES: JobStatus[] = [
  "Saved",
  "Applied",
  "Interview",
  "Offer",
  "Rejected",
  "Withdrawn",
];

export type WorkMode = "Remote" | "Hybrid" | "On-site";
export const WORK_MODES: WorkMode[] = ["Remote", "Hybrid", "On-site"];

export type EmploymentType =
  | "Full-time"
  | "Part-time"
  | "Contract"
  | "Temporary"
  | "Internship";

export const EMPLOYMENT_TYPES: EmploymentType[] = [
  "Full-time",
  "Part-time",
  "Contract",
  "Temporary",
  "Internship",
];

export interface CareerProfile {
  id: string;
  user_id: string;
  full_name: string | null;
  headline: string | null;
  location: string | null;
  target_roles: string[] | null;
  salary_min: number | null;
  salary_max: number | null;
  work_preferences: string | null;
  skills: string[] | null;
  summary: string | null;
  years_experience: number | null;
  linkedin_url: string | null;
  portfolio_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface JobApplication {
  id: string;
  user_id: string;
  company: string | null;
  title: string | null;
  location: string | null;
  employment_type: string | null;
  work_mode: string | null;
  salary_text: string | null;
  salary_min: number | null;
  salary_max: number | null;
  description: string | null;
  job_url: string | null;
  status: JobStatus;
  applied_date: string | null;
  next_action_date: string | null;
  notes: string | null;
  match_score: number | null;
  source: string | null;
  source_job_id: string | null;
  api_provider: string | null;
  api_payload_ref: string | null;
  created_at: string;
  updated_at: string;
}

/** A single work experience entry extracted from a resume. */
export interface WorkExperienceEntry {
  job_title: string | null;
  employer: string | null;
  start_date: string | null;
  end_date: string | null;
  description: string | null;
}

/** A single education entry extracted from a resume. */
export interface EducationEntry {
  institution: string | null;
  degree: string | null;
  field: string | null;
  start_date: string | null;
  end_date: string | null;
}

/** Structured data extracted from a resume by the parser. */
export interface ParsedResumeData {
  candidate_name: string | null;
  headline: string | null;
  summary: string | null;
  skills: string[];
  work_experience: WorkExperienceEntry[];
  education: EducationEntry[];
  certifications: string[];
  keywords: string[];
}

export interface Resume {
  id: string;
  user_id: string;
  name: string | null;
  raw_text: string | null;
  target_role: string | null;
  version_label: string | null;
  is_primary: boolean;
  source_file_url: string | null;
  parsed_skills: string[] | null;
  parsed_keywords: string[] | null;
  parsed_data: ParsedResumeData | null;
  created_at: string;
  updated_at: string;
}

export interface GeneratedDocument {
  id: string;
  user_id: string;
  document_type: string | null;
  title: string | null;
  content: string | null;
  job_application_id: string | null;
  resume_id: string | null;
  prompt_context: string | null;
  ai_provider: string | null;
  model_name: string | null;
  created_at: string;
  updated_at: string;
}

export interface InterviewSession {
  id: string;
  user_id: string;
  job_application_id: string | null;
  role_title: string | null;
  company: string | null;
  interview_type: string | null;
  scheduled_at: string | null;
  questions: unknown;
  responses: unknown;
  feedback: string | null;
  score: number | null;
  ai_provider: string | null;
  model_name: string | null;
  created_at: string;
  updated_at: string;
}

// Normalized job result from any external jobs API provider
export interface NormalizedJobResult {
  source_job_id: string;
  api_provider: string;
  company: string;
  title: string;
  location: string;
  employment_type: string;
  work_mode: string;
  salary_text: string;
  salary_min: number | null;
  salary_max: number | null;
  description: string;
  job_url: string;
  source: string;
  date_posted?: string;
}

export interface JobSearchRequest {
  keyword: string;
  location: string;
  remote_only: boolean;
  work_mode: string | null;
  employment_type: string | null;
  salary_min: number | null;
  date_posted: string | null;
}

// ---------------------------------------------------------------------------
// Job Match Analysis & Recommendations
// ---------------------------------------------------------------------------

export type MatchLabel = "Excellent Match" | "Strong Match" | "Potential Match" | "Low Match";

export const MATCH_LABELS: MatchLabel[] = [
  "Excellent Match",
  "Strong Match",
  "Potential Match",
  "Low Match",
];

export function scoreToLabel(score: number): MatchLabel {
  if (score >= 90) return "Excellent Match";
  if (score >= 75) return "Strong Match";
  if (score >= 60) return "Potential Match";
  return "Low Match";
}

export interface JobMatchAnalysis {
  match_score: number;
  match_label: MatchLabel;
  matching_skills: string[];
  missing_skills: string[];
  experience_alignment: string;
  salary_alignment: string;
  location_alignment: string;
  work_mode_alignment: string;
  strengths: string[];
  gaps: string[];
  recommendation_reason: string;
}

/** Cached match analysis record stored in the job_match_analyses table. */
export interface JobMatchAnalysisRecord extends JobMatchAnalysis {
  id: string;
  user_id: string;
  source_job_id: string;
  api_provider: string | null;
  job_data: NormalizedJobResult;
  ai_provider: string | null;
  model_name: string | null;
  created_at: string;
  updated_at: string;
}

/** A job with its optional match analysis — null analysis means "not analyzed". */
export interface RecommendedJob {
  job: NormalizedJobResult;
  analysis: JobMatchAnalysis | null;
  cached: boolean;
}

export type RecommendationSort = "best_match" | "newest" | "highest_salary" | "most_relevant";

export interface RecommendationFilters {
  minMatchScore: number;
  remoteOnly: boolean;
  salaryMin: number | null;
  employmentType: string | null;
  datePosted: string | null;
  sortBy: RecommendationSort;
}
