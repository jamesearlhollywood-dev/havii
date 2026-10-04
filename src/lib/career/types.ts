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

// ---------------------------------------------------------------------------
// Networking & Contact Management
// ---------------------------------------------------------------------------

export type RelationshipType =
  | "Recruiter"
  | "Hiring Manager"
  | "Colleague"
  | "Former Colleague"
  | "Mentor"
  | "Alumni"
  | "Referral"
  | "Professional Contact"
  | "Employer Contact"
  | "Other";

export const RELATIONSHIP_TYPES: RelationshipType[] = [
  "Recruiter",
  "Hiring Manager",
  "Colleague",
  "Former Colleague",
  "Mentor",
  "Alumni",
  "Referral",
  "Professional Contact",
  "Employer Contact",
  "Other",
];

export type RelationshipStrength = "New" | "Developing" | "Established" | "Strong";
export const RELATIONSHIP_STRENGTHS: RelationshipStrength[] = [
  "New",
  "Developing",
  "Established",
  "Strong",
];

export interface CareerContact {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string | null;
  organization: string | null;
  job_title: string | null;
  email: string | null;
  phone: string | null;
  linkedin_url: string | null;
  relationship_type: RelationshipType;
  relationship_strength: RelationshipStrength;
  location: string | null;
  notes: string | null;
  source: string | null;
  last_contact_date: string | null;
  next_follow_up_date: string | null;
  related_job_application_id: string | null;
  created_date: string;
}

/** Input shape for creating / updating a contact (client → action). */
export interface CareerContactInput {
  first_name: string;
  last_name: string | null;
  organization: string | null;
  job_title: string | null;
  email: string | null;
  phone: string | null;
  linkedin_url: string | null;
  relationship_type: RelationshipType;
  relationship_strength: RelationshipStrength;
  location: string | null;
  notes: string | null;
  source: string | null;
  last_contact_date: string | null;
  next_follow_up_date: string | null;
  related_job_application_id: string | null;
}

export type InteractionType =
  | "Email"
  | "Phone Call"
  | "Meeting"
  | "LinkedIn"
  | "Event"
  | "Interview"
  | "Referral"
  | "Other";

export const INTERACTION_TYPES: InteractionType[] = [
  "Email",
  "Phone Call",
  "Meeting",
  "LinkedIn",
  "Event",
  "Interview",
  "Referral",
  "Other",
];

export interface ContactInteraction {
  id: string;
  user_id: string;
  career_contact_id: string;
  interaction_type: InteractionType;
  interaction_date: string;
  subject: string | null;
  notes: string | null;
  related_job_application_id: string | null;
  follow_up_required: boolean;
  follow_up_date: string | null;
  created_date: string;
}

/** Input shape for logging an interaction (client → action). */
export interface ContactInteractionInput {
  career_contact_id: string;
  interaction_type: InteractionType;
  interaction_date: string;
  subject: string | null;
  notes: string | null;
  related_job_application_id: string | null;
  follow_up_required: boolean;
  follow_up_date: string | null;
}

/** Kinds of networking messages the AI service layer can draft. */
export type NetworkMessageType =
  | "networking_email"
  | "recruiter_follow_up"
  | "referral_request"
  | "thank_you"
  | "informational_interview";

export const NETWORK_MESSAGE_TYPES: { value: NetworkMessageType; label: string }[] = [
  { value: "networking_email", label: "Networking email" },
  { value: "recruiter_follow_up", label: "Recruiter follow-up" },
  { value: "referral_request", label: "Referral request" },
  { value: "thank_you", label: "Thank-you message" },
  { value: "informational_interview", label: "Informational interview request" },
];

/** A draft networking message — never claimed as "sent" unless a real email provider confirms delivery. */
export interface NetworkDraftResult {
  error?: string;
  subject: string;
  body: string;
  ai_provider: string | null;
  model: string | null;
  sent: false; // always false until a real email integration completes a send
  note: string;
}

// ---------------------------------------------------------------------------
// Job Offers (Salary Research, Offer Comparison, Negotiation)
// ---------------------------------------------------------------------------

export type OfferStatus = "Received" | "Negotiating" | "Accepted" | "Declined" | "Expired";

export const OFFER_STATUSES: OfferStatus[] = [
  "Received",
  "Negotiating",
  "Accepted",
  "Declined",
  "Expired",
];

export type BonusType =
  | "Annual"
  | "Performance"
  | "Signing"
  | "Profit Sharing"
  | "Equity"
  | "None"
  | "Other";

export const BONUS_TYPES: BonusType[] = [
  "Annual",
  "Performance",
  "Signing",
  "Profit Sharing",
  "Equity",
  "None",
  "Other",
];

/** A tracked job offer — optionally linked to a JobApplication. */
export interface JobOffer {
  id: string;
  user_id: string;
  job_application_id: string | null;
  company: string;
  role_title: string | null;
  base_salary: number | null;
  bonus_amount: number | null;
  bonus_type: BonusType | null;
  equity_value: number | null;
  signing_bonus: number | null;
  retirement_match: number | null;
  health_benefit_value: number | null;
  paid_time_off_days: number | null;
  remote_stipend: number | null;
  relocation_assistance: number | null;
  other_compensation: string | null;
  total_estimated_compensation: number | null;
  location: string | null;
  work_mode: WorkMode | null;
  start_date: string | null;
  response_deadline: string | null;
  offer_status: OfferStatus;
  notes: string | null;
  created_date: string;
}

/** Input shape for creating / updating a job offer (client → action). */
export interface JobOfferInput {
  job_application_id: string | null;
  company: string;
  role_title: string | null;
  base_salary: number | null;
  bonus_amount: number | null;
  bonus_type: BonusType | null;
  equity_value: number | null;
  signing_bonus: number | null;
  retirement_match: number | null;
  health_benefit_value: number | null;
  paid_time_off_days: number | null;
  remote_stipend: number | null;
  relocation_assistance: number | null;
  other_compensation: string | null;
  total_estimated_compensation: number | null;
  location: string | null;
  work_mode: WorkMode | null;
  start_date: string | null;
  response_deadline: string | null;
  offer_status: OfferStatus;
  notes: string | null;
}

// ---------------------------------------------------------------------------
// Salary Research — compensation data provider abstraction
// ---------------------------------------------------------------------------

/** Company-size buckets supported by the compensation data abstraction. */
export type CompanySize =
  | "Startup (1-50)"
  | "Small (51-200)"
  | "Mid-size (201-1000)"
  | "Large (1001-5000)"
  | "Enterprise (5000+)";

export const COMPANY_SIZES: CompanySize[] = [
  "Startup (1-50)",
  "Small (51-200)",
  "Mid-size (201-1000)",
  "Large (1001-5000)",
  "Enterprise (5000+)",
];

/** Inputs for a salary estimate request. */
export interface SalaryResearchRequest {
  title: string;
  location: string;
  years_experience: number | null;
  industry: string | null;
  company_size: CompanySize | null;
  work_mode: WorkMode | null;
}

/** Normalized salary estimate returned by any compensation data provider. */
export interface SalaryEstimate {
  salary_min: number | null;
  salary_median: number | null;
  salary_max: number | null;
  percentile_25: number | null;
  percentile_75: number | null;
  currency: string;
  source: string;
  source_url: string | null;
  data_date: string | null;
  location_adjustment: number | null;
  experience_adjustment: number | null;
}

/** Result of a salary research query — distinguishes provider state from data. */
export interface SalaryResearchResult {
  estimate: SalaryEstimate | null;
  configured: boolean;
  error?: string;
}

// ---------------------------------------------------------------------------
// Negotiation Prep
// ---------------------------------------------------------------------------

/** Inputs to the negotiationStrategy AI operation. */
export interface NegotiationStrategyInput {
  job_offer_id: string;
  desired_salary: number | null;
  minimum_acceptable_salary: number | null;
  priority_benefits: string[];
  competing_offer_info: string | null;
  leverage_points: string | null;
}

/** Structured strategy returned by the AI (or empty when no AI provider). */
export interface NegotiationStrategy {
  negotiation_position: string | null;
  recommended_target: number | null;
  recommended_floor: number | null;
  strongest_leverage_points: string[];
  risks: string[];
  recommended_sequence: string[];
  suggested_talking_points: string[];
  suggested_email: string | null;
  suggested_phone_script: string | null;
}

export interface NegotiationStrategyResult {
  strategy: NegotiationStrategy | null;
  ai_configured: boolean;
  /** Distinguishes data provenance: verified market data, user-entered, AI-generated. */
  data_sources: {
    market_data_verified: boolean;
    user_entered: string[];
    ai_generated: boolean;
  };
  error?: string;
}

/** Kinds of negotiation documents the AI service layer can draft. */
export type NegotiationDocumentType =
  | "salary_negotiation_email"
  | "counteroffer_email"
  | "benefits_negotiation_email"
  | "offer_acceptance_email"
  | "offer_decline_email";

export const NEGOTIATION_DOCUMENT_TYPES: {
  value: NegotiationDocumentType;
  label: string;
}[] = [
  { value: "salary_negotiation_email", label: "Salary negotiation email" },
  { value: "counteroffer_email", label: "Counteroffer email" },
  { value: "benefits_negotiation_email", label: "Benefits negotiation email" },
  { value: "offer_acceptance_email", label: "Offer acceptance email" },
  { value: "offer_decline_email", label: "Offer decline email" },
];

/** A draft negotiation document — saved to GeneratedDocument only after user review. */
export interface NegotiationDocumentResult {
  error?: string;
  subject: string;
  body: string;
  ai_provider: string | null;
  model: string | null;
  saved: boolean;
}

// ---------------------------------------------------------------------------
// Career Goals (Analytics)
// ---------------------------------------------------------------------------

export type GoalType =
  | "Applications"
  | "Networking Contacts"
  | "Follow-Ups"
  | "Interviews"
  | "Resume Tailoring"
  | "Job Searches";

export const GOAL_TYPES: GoalType[] = [
  "Applications",
  "Networking Contacts",
  "Follow-Ups",
  "Interviews",
  "Resume Tailoring",
  "Job Searches",
];

export type GoalPeriod = "Weekly" | "Monthly" | "Custom";
export const GOAL_PERIODS: GoalPeriod[] = ["Weekly", "Monthly", "Custom"];

export type GoalStatus = "Active" | "Completed" | "Archived";
export const GOAL_STATUSES: GoalStatus[] = ["Active", "Completed", "Archived"];

export interface CareerGoal {
  id: string;
  user_id: string;
  goal_type: GoalType;
  target_value: number;
  period: GoalPeriod;
  start_date: string;
  end_date: string | null;
  status: GoalStatus;
  created_date: string;
}

export interface CareerGoalInput {
  goal_type: GoalType;
  target_value: number;
  period: GoalPeriod;
  start_date: string;
  end_date: string | null;
  status: GoalStatus;
}

/** A goal with its actual progress computed from stored records. */
export interface CareerGoalWithProgress extends CareerGoal {
  current_value: number;
  progress_pct: number;
}

// ---------------------------------------------------------------------------
// Analytics — aggregated metrics & insights
// ---------------------------------------------------------------------------

export type AnalyticsRange = "30d" | "90d" | "6m" | "12m" | "all";

export const ANALYSIS_RANGES: { value: AnalyticsRange; label: string }[] = [
  { value: "30d", label: "Last 30 days" },
  { value: "90d", label: "Last 90 days" },
  { value: "6m", label: "Last 6 months" },
  { value: "12m", label: "Last 12 months" },
  { value: "all", label: "All time" },
];

/** Time-series bucket for activity-over-time charts. */
export interface ActivityBucket {
  label: string;
  saved: number;
  applied: number;
  interviews: number;
  offers: number;
}

/** A single funnel stage with its count and conversion rate from the prior stage. */
export interface FunnelStage {
  stage: string;
  count: number;
  conversion_from_prior: number | null;
}

/** Per-source breakdown of opportunities. */
export interface SourceBreakdown {
  source: string;
  found: number;
  saved: number;
  applied: number;
  interviews: number;
  offers: number;
}

/** Per-role (title) breakdown. */
export interface RoleBreakdown {
  role: string;
  opportunities: number;
  applied: number;
  interviews: number;
  offers: number;
  avg_match_score: number | null;
}

/** Per-location / work-mode breakdown. */
export interface LocationBreakdown {
  location: string;
  jobs: number;
  applied: number;
  interview_rate: number | null;
  offer_rate: number | null;
}

export interface WorkModeBreakdown {
  work_mode: string;
  jobs: number;
  applied: number;
  interview_rate: number | null;
  offer_rate: number | null;
}

/** The full aggregated analytics payload derived from a user's stored records. */
export interface AnalyticsMetrics {
  overview: {
    total_tracked: number;
    applications_submitted: number;
    interviews_received: number;
    offers_received: number;
    rejections: number;
    withdrawn: number;
    active_opportunities: number;
    avg_match_score: number | null;
  };
  funnel: FunnelStage[];
  activity: {
    buckets: ActivityBucket[];
    granularity: "week" | "month";
  };
  velocity: {
    applications_per_week: number | null;
    interviews_per_month: number | null;
    avg_saved_to_applied_days: number | null;
    avg_applied_to_interview_days: number | null;
    avg_interview_to_offer_days: number | null;
  };
  sources: SourceBreakdown[];
  matchScore: {
    avg: number | null;
    highest: number | null;
    avg_applied: number | null;
    avg_interview: number | null;
    avg_offer: number | null;
    /** Buckets used by the "outcome patterns by match score" chart. */
    outcome_buckets: { label: string; applied: number; interviews: number; offers: number }[];
  };
  roles: RoleBreakdown[];
  locations: LocationBreakdown[];
  workModes: WorkModeBreakdown[];
  salary: {
    avg_min: number | null;
    avg_max: number | null;
    highest: number | null;
    avg_interview_stage: number | null;
    avg_offer_stage: number | null;
    count_with_salary: number;
  };
  responseRate: {
    applications: number;
    with_response: number;
    no_response: number;
    interview_rate: number | null;
    rejection_rate: number | null;
    offer_rate: number | null;
  };
  followUps: {
    created: number;
    completed: number;
    overdue: number;
    avg_completion_days: number | null;
    completion_rate_applications_with: number | null;
    completion_rate_applications_without: number | null;
  };
  networking: {
    active_contacts: number;
    recruiters: number;
    hiring_managers: number;
    referrals: number;
    interactions: number;
    follow_ups_completed: number;
    applications_with_contact: number;
  };
  documents: { type: string; label: string; count: number }[];
  interviews: {
    prepared_for: number;
    sessions_completed: number;
    avg_score: number | null;
    by_type: { type: string; count: number }[];
  };
  offers: {
    received: number;
    accepted: number;
    declined: number;
    negotiating: number;
    avg_base_salary: number | null;
    avg_total_comp: number | null;
  };
  goals: CareerGoalWithProgress[];
  /** Deterministic, human-readable insights derived purely from the metrics. */
  insights: string[];
}

/** AI-generated interpretation of the aggregated metrics. */
export interface AnalyticsInsightsResult {
  error?: string;
  ai_configured: boolean;
  patterns: string[];
  improvements: string[];
  questions: string[];
  suggested_actions: string[];
  ai_provider: string | null;
  model: string | null;
}

