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

// ---------------------------------------------------------------------------
// Saved Searches & Job Alerts
// ---------------------------------------------------------------------------

export type AlertFrequency = "Daily" | "Weekdays" | "Weekly" | "Off";

export const ALERT_FREQUENCIES: AlertFrequency[] = [
  "Daily",
  "Weekdays",
  "Weekly",
  "Off",
];

export type JobAlertResultStatus = "new" | "alerted" | "dismissed";

/** A saved job search with optional alerting. */
export interface SavedJobSearch {
  id: string;
  user_id: string;
  name: string;
  keywords: string;
  location: string;
  remote_only: boolean;
  work_mode: string | null;
  employment_type: string | null;
  minimum_salary: number | null;
  date_posted: string | null;
  minimum_match_score: number | null;
  is_active: boolean;
  alert_frequency: AlertFrequency;
  last_checked_at: string | null;
  last_alert_at: string | null;
  api_provider: string | null;
  created_date: string;
}

/** A job surfaced by a saved-search alert run, used to dedupe future alerts. */
export interface JobAlertResult {
  id: string;
  saved_search_id: string;
  source_job_id: string;
  api_provider: string | null;
  job_title: string;
  company: string;
  location: string;
  job_url: string;
  salary_text: string;
  match_score: number | null;
  first_seen_at: string;
  alert_sent_at: string | null;
  status: JobAlertResultStatus;
}

/** Result of running a single saved-search alert. */
export interface AlertRunSummary {
  searched: boolean;
  apiConfigured: boolean;
  totalFound: number;
  newResults: number;
  alerted: number;
  error?: string;
}

/** Input shape for creating / updating a saved search (client → action). */
export interface SavedSearchInput {
  name: string;
  keywords: string;
  location: string;
  remote_only: boolean;
  work_mode: string | null;
  employment_type: string | null;
  minimum_salary: number | null;
  date_posted: string | null;
  minimum_match_score: number | null;
  alert_frequency: AlertFrequency;
  is_active: boolean;
}

// ---------------------------------------------------------------------------
// In-app notifications
// ---------------------------------------------------------------------------

export type NotificationType =
  | "job_alert"
  | "new_recommendation"
  | "interview_upcoming"
  | "follow_up"
  | "offer_reminder"
  | "task_reminder";

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  body: string | null;
  link: string | null;
  related_id: string | null;
  read_at: string | null;
  created_at: string;
}

// ---------------------------------------------------------------------------
// Career Tasks, Follow-Ups & Deadlines
// ---------------------------------------------------------------------------

export type TaskType =
  | "Application"
  | "Follow-Up"
  | "Interview"
  | "Networking"
  | "Resume"
  | "Cover Letter"
  | "Offer"
  | "Negotiation"
  | "General";

export const TASK_TYPES: TaskType[] = [
  "Application",
  "Follow-Up",
  "Interview",
  "Networking",
  "Resume",
  "Cover Letter",
  "Offer",
  "Negotiation",
  "General",
];

export type TaskPriority = "Low" | "Medium" | "High" | "Urgent";
export const TASK_PRIORITIES: TaskPriority[] = ["Low", "Medium", "High", "Urgent"];

export type TaskStatus = "To Do" | "In Progress" | "Completed" | "Cancelled";
export const TASK_STATUSES: TaskStatus[] = [
  "To Do",
  "In Progress",
  "Completed",
  "Cancelled",
];

/** Active (non-terminal) task statuses — used for "today" / "upcoming" views. */
export const ACTIVE_TASK_STATUSES: TaskStatus[] = ["To Do", "In Progress"];

export interface CareerTask {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  task_type: TaskType;
  related_job_application_id: string | null;
  due_date: string | null;
  due_time: string | null;
  priority: TaskPriority;
  status: TaskStatus;
  reminder_enabled: boolean;
  reminder_date: string | null;
  reminder_time: string | null;
  completed_at: string | null;
  created_date: string;
}

/** Input shape for creating / updating a task (client → action). */
export interface CareerTaskInput {
  title: string;
  description: string | null;
  task_type: TaskType;
  related_job_application_id: string | null;
  due_date: string | null;
  due_time: string | null;
  priority: TaskPriority;
  status: TaskStatus;
  reminder_enabled: boolean;
  reminder_date: string | null;
  reminder_time: string | null;
}
