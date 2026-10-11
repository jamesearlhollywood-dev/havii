// ============================================================================
// RISE USA LMS — Type Definitions
// ============================================================================

export type UserRole = "student" | "instructor" | "org_manager" | "admin";

export const PUBLIC_SIGNUP_ROLES: UserRole[] = ["student"];

export const STAFF_ROLES: UserRole[] = ["instructor", "org_manager", "admin"];

export type AccountStatus = "active" | "inactive" | "suspended" | "pending";

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
  cohort_id: string;
  profile_id: string;
  status: "enrolled" | "completed" | "withdrawn";
  enrolled_at: string;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
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

export interface Announcement {
  id: string;
  title: string;
  body: string;
  audience: "all" | "students" | "instructors" | "org_managers";
  is_published: boolean;
  created_at: string;
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
