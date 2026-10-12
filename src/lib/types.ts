// ============================================================================
// RISE USA LMS — Type Definitions
// ============================================================================

export type UserRole = "student" | "instructor" | "org_manager" | "admin";

export const PUBLIC_SIGNUP_ROLES: UserRole[] = ["student"];

export const STAFF_ROLES: UserRole[] = ["instructor", "org_manager", "admin"];

export type AccountStatus = "active" | "inactive" | "suspended" | "pending";

// ---------------------------------------------------------------------------
// Enrollment
// ---------------------------------------------------------------------------
export type EnrollmentStatus =
  | "invited"
  | "active"
  | "not_started"
  | "in_progress"
  | "completed"
  | "withdrawn"
  | "archived";

export type CertificateStatus = "not_eligible" | "eligible" | "issued";

// ---------------------------------------------------------------------------
// Activity Progress
// ---------------------------------------------------------------------------
export type ActivityStatus =
  | "not_started"
  | "in_progress"
  | "submitted"
  | "passed"
  | "needs_retry"
  | "completed";

export type ActivityType =
  | "lesson"
  | "decision_lab"
  | "knowledge_check"
  | "reflection"
  | "action_commitment"
  | "blueprint_section"
  | "final_assessment";

// ---------------------------------------------------------------------------
// Student Onboarding Enums
// ---------------------------------------------------------------------------
export type PostGraduationInterest =
  | "four_year_college"
  | "community_college"
  | "trade_technical"
  | "apprenticeship"
  | "military"
  | "workforce"
  | "entrepreneurship"
  | "undecided"
  | "other";

export type LearningGoal =
  | "managing_paycheck"
  | "banking"
  | "budgeting"
  | "saving_money"
  | "building_credit"
  | "avoiding_debt"
  | "paying_college"
  | "student_loans"
  | "investing"
  | "buying_car"
  | "renting_apartment"
  | "insurance"
  | "avoiding_scams"
  | "starting_business";

export interface StartingPointSurvey {
  responses: { question: string; confidence: number }[];
  completed_at: string;
}

// ---------------------------------------------------------------------------
// Module Roadmap
// ---------------------------------------------------------------------------
export type ModuleStatus = "locked" | "available" | "in_progress" | "completed";

// ---------------------------------------------------------------------------
// Profile
// ---------------------------------------------------------------------------
export interface Profile {
  id: string;
  user_id: string;
  first_name: string | null;
  last_name: string | null;
  preferred_name: string | null;
  date_of_birth: string | null;
  role: UserRole;
  pronouns: string | null;
  phone: string | null;
  city: string | null;
  state: string | null;
  profile_photo_url: string | null;
  onboarding_completed: boolean;
  account_status: AccountStatus;
  organization_id: string | null;
  created_at: string;
  updated_at: string;
  // Student-specific (optional — only set for students during onboarding)
  grade_level?: string | null;
  graduation_year?: string | null;
  school_or_program?: string | null;
  post_graduation_interest?: PostGraduationInterest | null;
  learning_goals?: LearningGoal[];
  starting_point_survey?: StartingPointSurvey | null;
}

// ---------------------------------------------------------------------------
// Organization & Cohort
// ---------------------------------------------------------------------------
export type OrganizationType =
  | "school"
  | "nonprofit"
  | "workforce"
  | "community"
  | "other";

export interface Organization {
  id: string;
  name: string;
  type: OrganizationType;
  contact_name: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  city: string | null;
  state: string | null;
  created_at: string;
  updated_at: string;
}

export interface Cohort {
  id: string;
  organization_id: string;
  name: string;
  term: string | null;
  site: string | null;
  starts_on: string | null;
  ends_on: string | null;
  instructor_profile_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Enrollment {
  id: string;
  student_profile_id: string;
  course_id: string;
  organization_id: string | null;
  cohort_id: string | null;
  enrolled_at: string;
  status: EnrollmentStatus;
  start_date: string | null;
  target_completion_date: string | null;
  actual_completion_date: string | null;
  assigned_instructor_id: string | null;
  overall_progress: number;
  certificate_status: CertificateStatus;
  created_at: string;
  updated_at: string;
}

// ---------------------------------------------------------------------------
// Enrollment Code
// ---------------------------------------------------------------------------
export interface EnrollmentCode {
  id: string;
  code: string;
  organization_id: string | null;
  cohort_id: string | null;
  course_id: string;
  expires_at: string | null;
  max_uses: number | null;
  current_uses: number;
  is_active: boolean;
  created_at: string;
}

// ---------------------------------------------------------------------------
// Instructor Assignment
// ---------------------------------------------------------------------------
export interface InstructorAssignment {
  id: string;
  instructor_profile_id: string;
  cohort_id: string;
  course_id: string;
  assigned_at: string;
}

// ---------------------------------------------------------------------------
// Student Progress
// ---------------------------------------------------------------------------
export interface LessonProgress {
  id: string;
  profile_id: string;
  module_id: string;
  lesson_id: string;
  status: "not_started" | "in_progress" | "completed";
  reflection_text: string | null;
  completed_at: string | null;
  updated_at: string;
}

export interface ModuleProgressRow {
  id: string;
  profile_id: string;
  module_id: string;
  lessons_completed: number;
  knowledge_check_score: number | null;
  knowledge_check_passed: boolean;
  knowledge_check_attempts: number;
  decision_lab_submitted: boolean;
  blueprint_section_completed: boolean;
  module_completed: boolean;
  completed_at: string | null;
  updated_at: string;
}

export interface ActivityProgress {
  id: string;
  profile_id: string;
  enrollment_id: string | null;
  course_id: string;
  module_id: string;
  lesson_id: string | null;
  activity_id: string;
  activity_type: ActivityType;
  status: ActivityStatus;
  started_at: string | null;
  last_accessed_at: string | null;
  completed_at: string | null;
  percentage_complete: number;
  score: number | null;
  attempts: number;
}

// ---------------------------------------------------------------------------
// Knowledge Check
// ---------------------------------------------------------------------------
export interface QuizAttempt {
  id: string;
  profile_id: string;
  module_id: string;
  score: number;
  passed: boolean;
  answers: Record<string, string | string[]>;
  created_at: string;
}

// ---------------------------------------------------------------------------
// Decision Lab
// ---------------------------------------------------------------------------
export interface DecisionLabSubmission {
  id: string;
  profile_id: string;
  module_id: string;
  lab_type: string;
  responses: Record<string, unknown>;
  submitted_at: string;
  created_at: string;
}

// ---------------------------------------------------------------------------
// Financial Blueprint
// ---------------------------------------------------------------------------
export interface BlueprintSection {
  id: string;
  profile_id: string;
  section_number: number;
  section_key: string;
  section_title: string;
  data: Record<string, unknown>;
  completed: boolean;
  unlocked: boolean;
  updated_at: string;
}

// ---------------------------------------------------------------------------
// Certificate
// ---------------------------------------------------------------------------
export interface Certificate {
  id: string;
  profile_id: string;
  certificate_id: string;
  student_name: string;
  course_name: string;
  issued_at: string;
  status: "issued" | "revoked";
}

// ---------------------------------------------------------------------------
// Student Progress Summary (for instructor/admin dashboards)
// ---------------------------------------------------------------------------
export interface StudentProgressSummary {
  profile_id: string;
  student_name: string;
  cohort_name: string;
  organization_name: string;
  enrollment_status: EnrollmentStatus;
  lessons_completed: number;
  modules_completed: number;
  overall_progress: number;
  best_quiz_score: number | null;
  quiz_passed: boolean;
  decision_labs_completed: number;
  blueprint_sections_completed: number;
  has_certificate: boolean;
  last_activity_date: string | null;
  is_stalled: boolean;
  failed_quiz_attempts: number;
  missing_blueprint_sections: number;
  eligible_for_completion: boolean;
}

// ---------------------------------------------------------------------------
// Progress Filters
// ---------------------------------------------------------------------------
export interface ProgressFilter {
  organization_id?: string;
  cohort_id?: string;
  module_id?: string;
  instructor_id?: string;
  completion_status?: EnrollmentStatus | "all";
  last_activity?: "all" | "active" | "stalled" | "not_started";
}

// ---------------------------------------------------------------------------
// Admin Settings
// ---------------------------------------------------------------------------
export interface AdminSettings {
  stalled_threshold_days: number;
  allow_public_self_enrollment: boolean;
  prerequisite_override_enabled: boolean;
}

// ---------------------------------------------------------------------------
// Resources, Announcements, Support
// ---------------------------------------------------------------------------
export interface Resource {
  id: string;
  title: string;
  description: string | null;
  url: string | null;
  resource_type: "link" | "file" | "video" | "document";
  module_id: string | null;
  is_published: boolean;
  created_at: string;
}

// ---------------------------------------------------------------------------
// Notifications
// ---------------------------------------------------------------------------
export type NotificationType =
  | "enrollment_confirmed"
  | "course_available"
  | "module_unlocked"
  | "lab_due"
  | "knowledge_check_available"
  | "knowledge_check_passed"
  | "knowledge_check_retry"
  | "instructor_feedback"
  | "blueprint_section_completed"
  | "final_assessment_unlocked"
  | "course_completed"
  | "certificate_issued"
  | "progress_reminder"
  | "inactivity_reminder"
  | "announcement"
  | "admin_message"
  | "instructor_message"
  | "assignment_submitted"
  | "submission_awaiting_review"
  | "feedback_posted"
  | "revision_requested"
  | "resubmission_received"
  | "activity_marked_complete";

export type NotificationCategory =
  | "course_progress"
  | "instructor_messages"
  | "announcements"
  | "assignment_reminders"
  | "certificate_completion"
  | "account_security";

export type RelatedEntityType =
  | "course"
  | "module"
  | "lesson"
  | "cohort"
  | "organization"
  | "blueprint"
  | "certificate"
  | "assessment"
  | "announcement"
  | "message"
  | "submission";

export interface AppNotification {
  id: string;
  profile_id: string;
  type: NotificationType;
  category: NotificationCategory;
  title: string;
  description: string;
  related_type: RelatedEntityType | null;
  related_id: string | null;
  link_url: string | null;
  read_at: string | null;
  created_at: string;
}

export interface NotificationPreferences {
  profile_id: string;
  course_progress: boolean;
  instructor_messages: boolean;
  announcements: boolean;
  assignment_reminders: boolean;
  certificate_completion: boolean;
  // account_security is always enabled — not toggleable
  updated_at: string;
}

export const REQUIRED_CATEGORIES: NotificationCategory[] = ["account_security"];
export const TOGGLEABLE_CATEGORIES: NotificationCategory[] = [
  "course_progress",
  "instructor_messages",
  "announcements",
  "assignment_reminders",
  "certificate_completion",
];

// ---------------------------------------------------------------------------
// Announcements (enhanced)
// ---------------------------------------------------------------------------
export type AnnouncementPriority = "standard" | "important" | "urgent";
export type AnnouncementAudienceType =
  | "all_users"
  | "organization"
  | "cohort"
  | "course";

export interface Announcement {
  id: string;
  title: string;
  body: string;
  audience_type: AnnouncementAudienceType;
  audience_id: string | null;
  audience_name: string | null;
  priority: AnnouncementPriority;
  publish_date: string;
  expiration_date: string | null;
  link_url: string | null;
  attachment_url: string | null;
  created_by: string;
  created_by_name: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

// ---------------------------------------------------------------------------
// Messages
// ---------------------------------------------------------------------------
export type MessageStatus = "sent" | "delivered" | "read";

export interface Message {
  id: string;
  sender_id: string;
  sender_name: string;
  sender_role: UserRole;
  recipient_id: string | null;
  recipient_name: string | null;
  organization_id: string | null;
  cohort_id: string | null;
  subject: string;
  body: string;
  sent_at: string;
  read_at: string | null;
  status: MessageStatus;
  is_cohort_broadcast: boolean;
  reported: boolean;
}

export type ReportStatus = "open" | "reviewing" | "resolved" | "dismissed";

export interface MessageReport {
  id: string;
  message_id: string;
  reported_by: string;
  reported_by_name: string;
  reason: string;
  status: ReportStatus;
  admin_note: string | null;
  resolved_by: string | null;
  created_at: string;
  resolved_at: string | null;
}

export interface SupportRequest {
  id: string;
  profile_id: string;
  subject: string;
  body: string;
  status: "open" | "in_progress" | "resolved" | "closed";
  created_at: string;
  updated_at: string;
}

// ---------------------------------------------------------------------------
// Analytics & Outcomes
// ---------------------------------------------------------------------------

export interface EndOfCourseSurvey {
  profile_id: string;
  responses: { question: string; confidence: number }[];
  completed_at: string;
}

export interface AnalyticsFilter {
  organization_id?: string;
  cohort_id?: string;
  instructor_id?: string;
  course_id?: string;
  module_id?: string;
  enrollment_status?: EnrollmentStatus | "all";
  date_from?: string;
  date_to?: string;
  grade_level?: string;
  graduation_year?: string;
}

export interface AnalyticsMetrics {
  total_enrolled: number;
  active_students: number;
  not_started: number;
  in_progress: number;
  completed: number;
  completion_rate: number;
  avg_overall_progress: number;
  avg_knowledge_check_score: number;
  final_assessment_pass_rate: number;
  avg_final_assessment_score: number;
  decision_labs_completed: number;
  blueprint_completion_rate: number;
  certificates_issued: number;
  avg_time_to_completion_days: number;
  stalled_students: number;
}

export interface ModulePerformance {
  module_id: string;
  module_number: number;
  module_title: string;
  avg_knowledge_check_score: number;
  pass_rate: number;
  avg_attempts: number;
  most_missed_topics: string[];
  strongest_topics: string[];
  needs_reinforcement: string[];
}

export interface ConfidenceAnalysis {
  level: "individual" | "cohort" | "organization" | "system";
  level_name: string;
  avg_pre_score: number;
  avg_post_score: number;
  percentage_change: number;
  by_topic: {
    question: string;
    avg_pre: number;
    avg_post: number;
    change: number;
  }[];
  student_count: number;
  has_post_data: boolean;
}

export interface TimeSeriesPoint {
  label: string;
  value: number;
}

export interface ProgramImpactData {
  enrollments_by_month: TimeSeriesPoint[];
  completion_rate_over_time: TimeSeriesPoint[];
  assessment_performance_over_time: TimeSeriesPoint[];
  certificates_by_month: TimeSeriesPoint[];
  participating_organizations: number;
  active_cohorts: number;
  confidence_improvement_over_time: TimeSeriesPoint[];
}

export interface StudentOutcomesProfile {
  profile_id: string;
  student_name: string;
  organization_name: string;
  cohort_name: string;
  enrollment_status: EnrollmentStatus;
  overall_progress: number;
  modules_completed: number;
  module_details: {
    module_id: string;
    module_number: number;
    module_title: string;
    knowledge_check_score: number | null;
    knowledge_check_passed: boolean;
    decision_lab_completed: boolean;
    blueprint_section_completed: boolean;
    module_completed: boolean;
  }[];
  final_assessment_score: number | null;
  final_assessment_passed: boolean;
  decision_labs_completed: number;
  blueprint_sections_completed: number;
  certificate_status: CertificateStatus;
  starting_confidence: number | null;
  ending_confidence: number | null;
  confidence_change: number | null;
}

// ---------------------------------------------------------------------------
// Instructor Review, Feedback & Assignment Grading
// ---------------------------------------------------------------------------

/** Activities that require human review (excludes auto-graded quizzes/KCs). */
export type SubmissionType =
  | "decision_lab"
  | "workbook"
  | "reflection"
  | "action_commitment"
  | "short_answer"
  | "blueprint_section"
  | "final_capstone";

export type ReviewStatus =
  | "not_submitted"
  | "submitted"
  | "in_review"
  | "feedback_provided"
  | "revision_requested"
  | "resubmitted"
  | "completed";

/** Admin-configurable review mode per activity. */
export type ActivityReviewMode =
  | "completion_only"
  | "instructor_reviewed"
  | "scored"
  | "rubric_scored";

/** Privacy controls per activity. */
export type ActivityPrivacyLevel =
  | "student_instructor_only"
  | "student_instructor_admin"
  | "org_visible_completion";

export type PerformanceLevel = "beginning" | "developing" | "proficient" | "strong";

export interface RubricCriterion {
  id: string;
  title: string;
  description: string;
}

export interface RubricPerformanceLevel {
  level: PerformanceLevel;
  label: string;
  point_value: number;
  description: string;
}

export interface Rubric {
  id: string;
  title: string;
  activity_type: SubmissionType;
  criteria: RubricCriterion[];
  performance_levels: RubricPerformanceLevel[];
  is_default: boolean;
  created_by: string;
  created_by_name: string;
  created_at: string;
  updated_at: string;
}

export interface RubricCriterionResult {
  criterion_id: string;
  criterion_title: string;
  performance_level: PerformanceLevel;
  point_value: number;
  instructor_comment: string;
}

export interface RubricResult {
  rubric_id: string;
  rubric_title: string;
  criterion_results: RubricCriterionResult[];
  total_points: number;
  max_points: number;
}

export interface Submission {
  id: string;
  student_profile_id: string;
  student_name: string;
  enrollment_id: string | null;
  organization_id: string | null;
  organization_name: string | null;
  cohort_id: string | null;
  cohort_name: string | null;
  course_id: string;
  module_id: string;
  module_number: number;
  module_title: string;
  lesson_id: string | null;
  lesson_title: string | null;
  activity_id: string;
  activity_title: string;
  activity_instructions: string;
  submission_type: SubmissionType;
  student_response: string;
  attached_file_url: string | null;
  attached_file_name: string | null;
  submitted_at: string;
  review_status: ReviewStatus;
  assigned_instructor_id: string | null;
  assigned_instructor_name: string | null;
  instructor_feedback: string | null;
  score: number | null;
  max_score: number | null;
  rubric_result: RubricResult | null;
  private_instructor_notes: string | null;
  reviewed_at: string | null;
  resubmission_status: "none" | "revision_requested" | "resubmitted" | null;
  version_number: number;
  privacy_level: ActivityPrivacyLevel;
  review_mode: ActivityReviewMode;
  created_at: string;
  updated_at: string;
}

export interface SubmissionVersion {
  version_number: number;
  student_response: string;
  submitted_at: string;
  instructor_feedback: string | null;
  review_status: ReviewStatus;
  score: number | null;
  reviewed_at: string | null;
}

export interface ReviewSettings {
  review_target_days: number;
  highlight_overdue: boolean;
}

export interface InstructorWorkloadMetrics {
  instructor_id: string;
  instructor_name: string;
  submissions_awaiting_review: number;
  reviews_completed: number;
  avg_review_turnaround_hours: number;
  revisions_requested: number;
  overdue_reviews: number;
}

export interface ReviewQueueFilters {
  cohort_id?: string;
  module_id?: string;
  activity_type?: SubmissionType | "all";
  review_status?: ReviewStatus | "all";
  date_from?: string;
  date_to?: string;
  student_search?: string;
}

export type ReviewQueueSort =
  | "oldest_first"
  | "newest_first"
  | "student_name"
  | "module";

export interface ReviewQueueItem {
  id: string;
  student_name: string;
  organization_name: string;
  cohort_name: string;
  module_number: number;
  module_title: string;
  activity_title: string;
  submission_type: SubmissionType;
  submitted_at: string;
  review_status: ReviewStatus;
  days_waiting: number;
  is_overdue: boolean;
  assigned_instructor_name: string | null;
}

export interface StudentFeedbackItem {
  submission_id: string;
  activity_title: string;
  module_number: number;
  module_title: string;
  submission_type: SubmissionType;
  review_status: ReviewStatus;
  instructor_feedback: string | null;
  score: number | null;
  max_score: number | null;
  rubric_result: RubricResult | null;
  resubmission_status: "none" | "revision_requested" | "resubmitted" | null;
  reviewed_at: string | null;
  submitted_at: string;
  link_url: string | null;
}

export interface OrgManagerReviewItem {
  student_name: string;
  cohort_name: string;
  module_number: number;
  module_title: string;
  activity_title: string;
  submission_type: SubmissionType;
  review_status: ReviewStatus;
  submitted_at: string | null;
  reviewed_at: string | null;
  is_org_visible: boolean;
}
