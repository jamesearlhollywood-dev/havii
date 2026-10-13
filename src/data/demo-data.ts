// ============================================================================
// RISE USA LMS — Demo Data (used when Supabase is not configured)
// ============================================================================

import type {
  Profile,
  Organization,
  Cohort,
  Enrollment,
  EnrollmentCode,
  InstructorAssignment,
  LessonProgress,
  ModuleProgressRow,
  QuizAttempt,
  DecisionLabSubmission,
  BlueprintSection,
  Certificate,
  StudentProgressSummary,
  AdminSettings,
  AssessmentAttempt,
  FinalAssessmentAttempt,
  StudentProgress,
} from "@/lib/types";
import { modules, blueprintSections, TOTAL_LESSONS } from "@/data/course";

// ---------------------------------------------------------------------------
// Demo Profiles
// ---------------------------------------------------------------------------
export const DEMO_STUDENT_PROFILE: Profile = {
  id: "demo-student",
  user_id: "demo-student",
  first_name: "Alex",
  last_name: "Johnson",
  preferred_name: "Alex",
  date_of_birth: null,
  role: "student",
  pronouns: "they/them",
  phone: null,
  city: "Springfield",
  state: "IL",
  profile_photo_url: null,
  onboarding_completed: true,
  account_status: "active",
  organization_id: "org-lincoln",
  created_at: "2025-09-01T00:00:00.000Z",
  updated_at: "2025-09-01T00:00:00.000Z",
  grade_level: "12th",
  graduation_year: "2026",
  school_or_program: "Lincoln High School",
  post_graduation_interest: "four_year_college",
  learning_goals: ["budgeting", "building_credit", "investing"],
  starting_point_survey: {
    responses: [
      { question: "I know how to read a paycheck.", confidence: 2 },
      { question: "I understand the difference between gross and net pay.", confidence: 2 },
      { question: "I understand how checking and savings accounts work.", confidence: 3 },
      { question: "I know how to create a monthly budget.", confidence: 1 },
      { question: "I understand how credit scores work.", confidence: 2 },
      { question: "I understand the cost of borrowing money.", confidence: 2 },
      { question: "I know how student loans work.", confidence: 1 },
      { question: "I understand basic investing.", confidence: 1 },
      { question: "I understand the true cost of owning a car.", confidence: 2 },
      { question: "I know what to look for before signing a lease or financial agreement.", confidence: 2 },
    ],
    completed_at: "2025-09-01T12:00:00.000Z",
  },
};

export const DEMO_INSTRUCTOR_PROFILE: Profile = {
  id: "demo-instructor",
  user_id: "demo-instructor",
  first_name: "Maria",
  last_name: "Garcia",
  preferred_name: "Ms. Garcia",
  date_of_birth: null,
  role: "instructor",
  pronouns: "she/her",
  phone: null,
  city: "Springfield",
  state: "IL",
  profile_photo_url: null,
  onboarding_completed: true,
  account_status: "active",
  organization_id: "org-lincoln",
  created_at: "2025-08-15T00:00:00.000Z",
  updated_at: "2025-08-15T00:00:00.000Z",
};

export const DEMO_ADMIN_PROFILE: Profile = {
  id: "demo-admin",
  user_id: "demo-admin",
  first_name: "Admin",
  last_name: "User",
  preferred_name: "Admin",
  date_of_birth: null,
  role: "admin",
  pronouns: null,
  phone: null,
  city: null,
  state: null,
  profile_photo_url: null,
  onboarding_completed: true,
  account_status: "active",
  organization_id: null,
  created_at: "2025-08-01T00:00:00.000Z",
  updated_at: "2025-08-01T00:00:00.000Z",
};

export const DEMO_ORG_MANAGER_PROFILE: Profile = {
  id: "demo-org-manager",
  user_id: "demo-org-manager",
  first_name: "James",
  last_name: "Wilson",
  preferred_name: "James",
  date_of_birth: null,
  role: "org_manager",
  pronouns: "he/him",
  phone: null,
  city: "Springfield",
  state: "IL",
  profile_photo_url: null,
  onboarding_completed: true,
  account_status: "active",
  organization_id: "org-lincoln",
  created_at: "2025-08-10T00:00:00.000Z",
  updated_at: "2025-08-10T00:00:00.000Z",
};

// ---------------------------------------------------------------------------
// Demo Organizations
// ---------------------------------------------------------------------------
export const DEMO_ORGANIZATIONS: Organization[] = [
  {
    id: "org-lincoln",
    name: "Lincoln High School",
    type: "school",
    contact_name: "James Wilson",
    contact_email: "jwilson@lincolnhs.edu",
    contact_phone: "217-555-0100",
    city: "Springfield",
    state: "IL",
    created_at: "2025-08-01T00:00:00.000Z",
    updated_at: "2025-08-01T00:00:00.000Z",
  },
  {
    id: "org-cya",
    name: "Community Youth Alliance",
    type: "nonprofit",
    contact_name: "Patricia Lee",
    contact_email: "plee@cya.org",
    contact_phone: "217-555-0200",
    city: "Decatur",
    state: "IL",
    created_at: "2025-08-05T00:00:00.000Z",
    updated_at: "2025-08-05T00:00:00.000Z",
  },
  {
    id: "org-wdc",
    name: "Workforce Development Center",
    type: "workforce",
    contact_name: "Robert Chen",
    contact_email: "rchen@wdc.org",
    contact_phone: "217-555-0300",
    city: "Champaign",
    state: "IL",
    created_at: "2025-08-10T00:00:00.000Z",
    updated_at: "2025-08-10T00:00:00.000Z",
  },
];

// ---------------------------------------------------------------------------
// Demo Cohorts
// ---------------------------------------------------------------------------
export const DEMO_COHORTS: (Cohort & { organization_name: string; instructor_name: string | null })[] = [
  {
    id: "cohort-fall-2025",
    organization_id: "org-lincoln",
    name: "Fall 2025 — Period 3",
    term: "Fall 2025",
    site: "Room 204",
    starts_on: "2025-09-01",
    ends_on: "2025-12-18",
    instructor_profile_id: "demo-instructor",
    created_at: "2025-08-15T00:00:00.000Z",
    updated_at: "2025-08-15T00:00:00.000Z",
    organization_name: "Lincoln High School",
    instructor_name: "Ms. Garcia",
  },
  {
    id: "cohort-spring-2026",
    organization_id: "org-lincoln",
    name: "Spring 2026 — After School",
    term: "Spring 2026",
    site: "Library",
    starts_on: "2026-01-15",
    ends_on: "2026-05-30",
    instructor_profile_id: "demo-instructor",
    created_at: "2025-11-01T00:00:00.000Z",
    updated_at: "2025-11-01T00:00:00.000Z",
    organization_name: "Lincoln High School",
    instructor_name: "Ms. Garcia",
  },
  {
    id: "cohort-cya-2026",
    organization_id: "org-cya",
    name: "Winter 2026 Cohort",
    term: "Winter 2026",
    site: "Community Center",
    starts_on: "2026-01-06",
    ends_on: "2026-04-30",
    instructor_profile_id: null,
    created_at: "2025-10-01T00:00:00.000Z",
    updated_at: "2025-10-01T00:00:00.000Z",
    organization_name: "Community Youth Alliance",
    instructor_name: null,
  },
];

// ---------------------------------------------------------------------------
// Demo Enrollment Codes
// ---------------------------------------------------------------------------
export const DEMO_ENROLLMENT_CODES: (EnrollmentCode & { organization_name: string | null; cohort_name: string | null })[] = [
  {
    id: "code-1",
    code: "RISE-LHS-2025",
    organization_id: "org-lincoln",
    cohort_id: "cohort-fall-2025",
    course_id: "rise-usa",
    expires_at: "2025-12-31T23:59:59.000Z",
    max_uses: 30,
    current_uses: 18,
    is_active: true,
    created_at: "2025-08-15T00:00:00.000Z",
    organization_name: "Lincoln High School",
    cohort_name: "Fall 2025 — Period 3",
  },
  {
    id: "code-2",
    code: "RISE-CYA-2026",
    organization_id: "org-cya",
    cohort_id: "cohort-cya-2026",
    course_id: "rise-usa",
    expires_at: "2026-04-30T23:59:59.000Z",
    max_uses: 25,
    current_uses: 8,
    is_active: true,
    created_at: "2025-10-01T00:00:00.000Z",
    organization_name: "Community Youth Alliance",
    cohort_name: "Winter 2026 Cohort",
  },
  {
    id: "code-3",
    code: "RISE-PUBLIC",
    organization_id: null,
    cohort_id: null,
    course_id: "rise-usa",
    expires_at: null,
    max_uses: 100,
    current_uses: 45,
    is_active: true,
    created_at: "2025-08-01T00:00:00.000Z",
    organization_name: null,
    cohort_name: null,
  },
  {
    id: "code-4",
    code: "RISE-OLD-2024",
    organization_id: "org-lincoln",
    cohort_id: null,
    course_id: "rise-usa",
    expires_at: "2024-12-31T23:59:59.000Z",
    max_uses: 50,
    current_uses: 50,
    is_active: false,
    created_at: "2024-08-01T00:00:00.000Z",
    organization_name: "Lincoln High School",
    cohort_name: null,
  },
];

// ---------------------------------------------------------------------------
// Demo Instructor Assignments
// ---------------------------------------------------------------------------
export const DEMO_INSTRUCTOR_ASSIGNMENTS: InstructorAssignment[] = [
  {
    id: "ia-1",
    instructor_profile_id: "demo-instructor",
    cohort_id: "cohort-fall-2025",
    course_id: "rise-usa",
    assigned_at: "2025-08-15T00:00:00.000Z",
  },
  {
    id: "ia-2",
    instructor_profile_id: "demo-instructor",
    cohort_id: "cohort-spring-2026",
    course_id: "rise-usa",
    assigned_at: "2025-11-01T00:00:00.000Z",
  },
];

// ---------------------------------------------------------------------------
// Demo Student Progress (for the demo student)
// ---------------------------------------------------------------------------
const now = new Date();
const daysAgo = (d: number) => new Date(now.getTime() - d * 86400000).toISOString();

export const DEMO_LESSON_PROGRESS: LessonProgress[] = [
  // Module 1 — all lessons completed
  ...modules[0].lessons.map((l, i) => ({
    id: `lp-m1-${i}`,
    profile_id: "demo-student",
    module_id: "module-1",
    lesson_id: l.id,
    status: "completed" as const,
    reflection_text: null,
    completed_at: daysAgo(30 - i),
    updated_at: daysAgo(30 - i),
  })),
  // Module 2 — 3 of 5 lessons completed
  ...modules[1].lessons.slice(0, 3).map((l, i) => ({
    id: `lp-m2-${i}`,
    profile_id: "demo-student",
    module_id: "module-2",
    lesson_id: l.id,
    status: "completed" as const,
    reflection_text: null,
    completed_at: daysAgo(10 - i),
    updated_at: daysAgo(10 - i),
  })),
  // Module 2 — lesson 4 in progress
  {
    id: "lp-m2-3",
    profile_id: "demo-student",
    module_id: "module-2",
    lesson_id: modules[1].lessons[3].id,
    status: "in_progress" as const,
    reflection_text: null,
    completed_at: null,
    updated_at: daysAgo(2),
  },
];

export const DEMO_MODULE_PROGRESS: ModuleProgressRow[] = [
  {
    id: "mp-1",
    profile_id: "demo-student",
    module_id: "module-1",
    lessons_completed: modules[0].lessons.length,
    knowledge_check_score: 85,
    knowledge_check_passed: true,
    knowledge_check_attempts: 1,
    decision_lab_submitted: true,
    blueprint_section_completed: true,
    module_completed: true,
    completed_at: daysAgo(20),
    updated_at: daysAgo(20),
  },
  {
    id: "mp-2",
    profile_id: "demo-student",
    module_id: "module-2",
    lessons_completed: 3,
    knowledge_check_score: null,
    knowledge_check_passed: false,
    knowledge_check_attempts: 0,
    decision_lab_submitted: false,
    blueprint_section_completed: false,
    module_completed: false,
    completed_at: null,
    updated_at: daysAgo(2),
  },
];

export const DEMO_QUIZ_ATTEMPTS: QuizAttempt[] = [
  {
    id: "qa-1",
    profile_id: "demo-student",
    module_id: "module-1",
    score: 85,
    passed: true,
    answers: {},
    created_at: daysAgo(22),
  },
  {
    id: "qa-2",
    profile_id: "demo-student",
    module_id: "module-1",
    score: 70,
    passed: true,
    answers: {},
    created_at: daysAgo(25),
  },
];

export const DEMO_ASSESSMENT_ATTEMPTS: AssessmentAttempt[] = [
  {
    id: "aa-1",
    profile_id: "demo-student",
    assessment_id: "kc-module-1",
    assessment_type: "knowledge_check",
    module_id: "module-1",
    attempt_number: 1,
    started_at: daysAgo(25),
    submitted_at: daysAgo(25),
    score: 7,
    percentage: 70,
    passed: true,
    responses: {},
    question_results: {},
  },
  {
    id: "aa-2",
    profile_id: "demo-student",
    assessment_id: "kc-module-1",
    assessment_type: "knowledge_check",
    module_id: "module-1",
    attempt_number: 2,
    started_at: daysAgo(22),
    submitted_at: daysAgo(22),
    score: 8,
    percentage: 85,
    passed: true,
    responses: {},
    question_results: {},
  },
];

export const DEMO_DECISION_LABS: DecisionLabSubmission[] = [
  {
    id: "dl-1",
    profile_id: "demo-student",
    module_id: "module-1",
    lab_type: modules[0].decisionLab.id,
    responses: {},
    submitted_at: daysAgo(21),
    created_at: daysAgo(21),
  },
];

export const DEMO_BLUEPRINT_SECTIONS: BlueprintSection[] = [
  {
    id: "bp-1",
    profile_id: "demo-student",
    section_number: 1,
    section_key: "income_banking",
    section_title: "Income, Paycheck & Banking Plan",
    data: {},
    completed: true,
    unlocked: true,
    updated_at: daysAgo(20),
  },
  {
    id: "bp-2",
    profile_id: "demo-student",
    section_number: 2,
    section_key: "budget_savings",
    section_title: "Monthly Budget & Emergency Savings Plan",
    data: {},
    completed: false,
    unlocked: true,
    updated_at: daysAgo(5),
  },
];

export const DEMO_CERTIFICATES: (Certificate & {
  organization_name: string | null;
  cohort_name: string | null;
  instructor_name: string | null;
})[] = [
  {
    id: "cert-1",
    profile_id: "s7",
    certificate_id: "RISE-2025-SAM001",
    student_name: "Sam Anderson",
    course_name: "RISE USA: Roadmap to Income, Savings, and Equity",
    issued_at: daysAgo(5),
    status: "issued",
    organization_name: "Lincoln High School",
    cohort_name: "Fall 2025 — Period 3",
    instructor_name: "Ms. Garcia",
  },
  {
    id: "cert-2",
    profile_id: "s6",
    certificate_id: "RISE-2025-MOR002",
    student_name: "Morgan Taylor",
    course_name: "RISE USA: Roadmap to Income, Savings, and Equity",
    issued_at: daysAgo(1),
    status: "issued",
    organization_name: "Lincoln High School",
    cohort_name: "Fall 2025 — Period 3",
    instructor_name: "Ms. Garcia",
  },
  {
    id: "cert-3",
    profile_id: "s-old-1",
    certificate_id: "RISE-2024-OLD001",
    student_name: "Previous Student",
    course_name: "RISE USA: Roadmap to Income, Savings, and Equity",
    issued_at: "2024-12-15T00:00:00.000Z",
    status: "revoked",
    organization_name: "Lincoln High School",
    cohort_name: "Spring 2024 — Period 5",
    instructor_name: "Mr. Davis",
  },
];

export const DEMO_CERTIFICATE_AUDIT: {
  id: string;
  certificate_id: string;
  action: string;
  performed_by: string;
  note: string | null;
  created_at: string;
}[] = [
  {
    id: "audit-1",
    certificate_id: "RISE-2025-SAM001",
    action: "issued",
    performed_by: "system",
    note: "Auto-issued upon course completion",
    created_at: daysAgo(5),
  },
  {
    id: "audit-2",
    certificate_id: "RISE-2025-MOR002",
    action: "issued",
    performed_by: "system",
    note: "Auto-issued upon course completion",
    created_at: daysAgo(1),
  },
  {
    id: "audit-3",
    certificate_id: "RISE-2024-OLD001",
    action: "revoked",
    performed_by: "demo-admin",
    note: "Revoked due to incomplete requirements discovered during audit",
    created_at: "2024-12-20T00:00:00.000Z",
  },
];

export const DEMO_FINAL_ATTEMPTS: FinalAssessmentAttempt[] = [];

export const DEMO_STUDENT_PROGRESS: StudentProgress = {
  lessonProgress: DEMO_LESSON_PROGRESS,
  moduleProgress: DEMO_MODULE_PROGRESS,
  quizAttempts: DEMO_QUIZ_ATTEMPTS,
  decisionLabs: DEMO_DECISION_LABS,
  blueprintSections: DEMO_BLUEPRINT_SECTIONS,
  certificates: DEMO_CERTIFICATES,
  finalAttempts: DEMO_FINAL_ATTEMPTS,
};

// ---------------------------------------------------------------------------
// Demo Enrollments
// ---------------------------------------------------------------------------
export const DEMO_ENROLLMENTS: (Enrollment & {
  student_name: string;
  cohort_name: string;
  organization_name: string;
})[] = [
  {
    id: "enr-1",
    student_profile_id: "demo-student",
    course_id: "rise-usa",
    organization_id: "org-lincoln",
    cohort_id: "cohort-fall-2025",
    enrolled_at: "2025-09-01T00:00:00.000Z",
    status: "in_progress",
    start_date: "2025-09-01",
    target_completion_date: "2025-12-18",
    actual_completion_date: null,
    assigned_instructor_id: "demo-instructor",
    overall_progress: 25,
    certificate_status: "not_eligible",
    created_at: "2025-09-01T00:00:00.000Z",
    updated_at: daysAgo(2),
    student_name: "Alex Johnson",
    cohort_name: "Fall 2025 — Period 3",
    organization_name: "Lincoln High School",
  },
];

// ---------------------------------------------------------------------------
// Demo Cohort Students (for instructor dashboard)
// ---------------------------------------------------------------------------
function makeStudentSummary(
  id: string,
  firstName: string,
  lastName: string,
  cohortName: string,
  orgName: string,
  status: StudentProgressSummary["enrollment_status"],
  lessonsCompleted: number,
  modulesCompleted: number,
  quizScore: number | null,
  quizPassed: boolean,
  decisionLabs: number,
  blueprintSectionsCompleted: number,
  hasCert: boolean,
  lastActivityDays: number | null,
  failedAttempts: number,
): StudentProgressSummary {
  const isStalled = lastActivityDays !== null && lastActivityDays > 14 && lessonsCompleted > 0 && modulesCompleted < modules.length;
  const missingBp = modules.length - blueprintSectionsCompleted;
  const eligible = modulesCompleted === modules.length && quizPassed && decisionLabs === modules.length && blueprintSectionsCompleted === blueprintSections.length && !hasCert;
  return {
    profile_id: id,
    student_name: `${firstName} ${lastName}`,
    cohort_name: cohortName,
    organization_name: orgName,
    enrollment_status: status,
    lessons_completed: lessonsCompleted,
    modules_completed: modulesCompleted,
    overall_progress: Math.round((lessonsCompleted / TOTAL_LESSONS) * 100),
    best_quiz_score: quizScore,
    quiz_passed: quizPassed,
    decision_labs_completed: decisionLabs,
    blueprint_sections_completed: blueprintSectionsCompleted,
    has_certificate: hasCert,
    last_activity_date: lastActivityDays !== null ? daysAgo(lastActivityDays) : null,
    is_stalled: isStalled,
    failed_quiz_attempts: failedAttempts,
    missing_blueprint_sections: missingBp,
    eligible_for_completion: eligible,
  };
}

export const DEMO_COHORT_STUDENTS: StudentProgressSummary[] = [
  // Not started
  makeStudentSummary("s1", "Emma", "Davis", "Fall 2025 — Period 3", "Lincoln High School", "not_started", 0, 0, null, false, 0, 0, false, null, 0),
  // Active — in progress
  makeStudentSummary("s2", "Tyler", "Brown", "Fall 2025 — Period 3", "Lincoln High School", "in_progress", 8, 1, 75, true, 1, 1, false, 1, 0),
  // Stalled — no activity for 20 days
  makeStudentSummary("s3", "Jordan", "Smith", "Fall 2025 — Period 3", "Lincoln High School", "in_progress", 5, 0, 45, false, 0, 0, false, 20, 1),
  // Failed knowledge check
  makeStudentSummary("s4", "Riley", "Martinez", "Fall 2025 — Period 3", "Lincoln High School", "in_progress", 12, 2, 55, false, 2, 2, false, 3, 2),
  // Missing blueprint sections
  makeStudentSummary("s5", "Casey", "Nguyen", "Fall 2025 — Period 3", "Lincoln High School", "in_progress", 18, 4, 80, true, 4, 3, false, 2, 0),
  // Eligible for completion
  makeStudentSummary("s6", "Morgan", "Taylor", "Fall 2025 — Period 3", "Lincoln High School", "in_progress", 24, 6, 92, true, 6, 6, false, 1, 0),
  // Completed with certificate
  makeStudentSummary("s7", "Sam", "Anderson", "Fall 2025 — Period 3", "Lincoln High School", "completed", 24, 6, 95, true, 6, 6, true, 5, 0),
  // Active — just started
  makeStudentSummary("s8", "Jamie", "Wilson", "Fall 2025 — Period 3", "Lincoln High School", "in_progress", 3, 0, null, false, 0, 0, false, 1, 0),
  // Withdrawn
  makeStudentSummary("s9", "Drew", "Clark", "Fall 2025 — Period 3", "Lincoln High School", "withdrawn", 6, 1, 60, false, 1, 0, false, 30, 1),
  // Invited — not yet started
  makeStudentSummary("s10", "Quinn", "Lewis", "Fall 2025 — Period 3", "Lincoln High School", "invited", 0, 0, null, false, 0, 0, false, null, 0),
];

// ---------------------------------------------------------------------------
// Demo Student Record Details (per-module breakdown for Student Course Record)
// ---------------------------------------------------------------------------
export interface StudentRecordDetail {
  profile_id: string;
  modules: {
    module_id: string;
    module_number: number;
    lessons_completed: number;
    lessons_total: number;
    knowledge_check_score: number | null;
    knowledge_check_passed: boolean;
    knowledge_check_attempts: number;
    decision_lab_completed: boolean;
    blueprint_section_completed: boolean;
    module_completed: boolean;
  }[];
  final_assessment_score: number | null;
  final_assessment_passed: boolean;
  final_assessment_date: string | null;
}

function makeRecordDetail(
  profileId: string,
  modulesCompleted: number,
  quizScore: number | null,
  quizPassed: boolean,
  decisionLabs: number,
  blueprintSections: number,
  finalScore: number | null,
  finalPassed: boolean,
): StudentRecordDetail {
  const moduleDetails = modules.map((m) => {
    const isComplete = modulesCompleted >= m.number;
    const hasKC = quizPassed && modulesCompleted >= m.number;
    const hasDL = decisionLabs >= m.number;
    const hasBP = blueprintSections >= m.number;
    return {
      module_id: m.id,
      module_number: m.number,
      lessons_completed: isComplete ? m.lessons.length : Math.floor(m.lessons.length * 0.5),
      lessons_total: m.lessons.length,
      knowledge_check_score: hasKC ? quizScore : null,
      knowledge_check_passed: hasKC,
      knowledge_check_attempts: hasKC ? 1 : 0,
      decision_lab_completed: hasDL,
      blueprint_section_completed: hasBP,
      module_completed: isComplete,
    };
  });

  return {
    profile_id: profileId,
    modules: moduleDetails,
    final_assessment_score: finalScore,
    final_assessment_passed: finalPassed,
    final_assessment_date: finalPassed ? daysAgo(5) : null,
  };
}

export const DEMO_STUDENT_RECORD_DETAILS: StudentRecordDetail[] = [
  // s1 — not started
  makeRecordDetail("s1", 0, null, false, 0, 0, null, false),
  // s2 — in progress, 1 module
  makeRecordDetail("s2", 1, 75, true, 1, 1, null, false),
  // s3 — stalled, 0 modules
  makeRecordDetail("s3", 0, 45, false, 0, 0, null, false),
  // s4 — 2 modules, failed KC
  makeRecordDetail("s4", 2, 55, false, 2, 2, null, false),
  // s5 — 4 modules, missing blueprint
  makeRecordDetail("s5", 4, 80, true, 4, 3, null, false),
  // s6 — eligible, all done but no cert yet
  makeRecordDetail("s6", 6, 92, true, 6, 6, 88, true),
  // s7 — completed with certificate
  makeRecordDetail("s7", 6, 95, true, 6, 6, 92, true),
  // s8 — just started
  makeRecordDetail("s8", 0, null, false, 0, 0, null, false),
  // s9 — withdrawn
  makeRecordDetail("s9", 1, 60, false, 1, 0, null, false),
  // s10 — invited
  makeRecordDetail("s10", 0, null, false, 0, 0, null, false),
];

// ---------------------------------------------------------------------------
// Demo Admin Settings
// ---------------------------------------------------------------------------
export const DEMO_ADMIN_SETTINGS: AdminSettings = {
  stalled_threshold_days: 14,
  allow_public_self_enrollment: true,
  prerequisite_override_enabled: true,
};

// ---------------------------------------------------------------------------
// Demo Notifications
// ---------------------------------------------------------------------------
import type {
  AppNotification,
  NotificationPreferences,
  Announcement,
  Message,
  MessageReport,
} from "@/lib/types";

const hoursAgo = (h: number) => new Date(now.getTime() - h * 3600000).toISOString();

export const DEMO_NOTIFICATIONS: AppNotification[] = [
  {
    id: "ntf-1",
    profile_id: "demo-student",
    type: "module_unlocked",
    category: "course_progress",
    title: "Module 2 is now available",
    description: "Budgeting & Saving — your next module has been unlocked. Keep building what lasts!",
    related_type: "module",
    related_id: "module-2",
    link_url: "/course/module/module-2",
    read_at: null,
    created_at: hoursAgo(2),
  },
  {
    id: "ntf-2",
    profile_id: "demo-student",
    type: "knowledge_check_passed",
    category: "course_progress",
    title: "Knowledge Check passed — Module 1",
    description: "Great work! You scored 85% on the Module 1 Knowledge Check.",
    related_type: "assessment",
    related_id: "module-1",
    link_url: "/course/module/module-1/knowledge-check",
    read_at: hoursAgo(26),
    created_at: hoursAgo(28),
  },
  {
    id: "ntf-3",
    profile_id: "demo-student",
    type: "blueprint_section_completed",
    category: "course_progress",
    title: "Blueprint Section 1 completed",
    description: "Your Income, Paycheck & Banking Plan is saved. Section 2 is now unlocked.",
    related_type: "blueprint",
    related_id: "section-1",
    link_url: "/blueprint",
    read_at: hoursAgo(48),
    created_at: hoursAgo(50),
  },
  {
    id: "ntf-4",
    profile_id: "demo-student",
    type: "instructor_feedback",
    category: "instructor_messages",
    title: "Feedback from Ms. Garcia",
    description: "Your instructor left feedback on your Module 1 Decision Lab. Check it out!",
    related_type: "module",
    related_id: "module-1",
    link_url: "/course/module/module-1/decision-lab",
    read_at: null,
    created_at: hoursAgo(5),
  },
  {
    id: "ntf-5",
    profile_id: "demo-student",
    type: "announcement",
    category: "announcements",
    title: "Welcome to RISE USA Fall 2025!",
    description: "Welcome to the RISE USA program. Your journey to financial literacy starts here.",
    related_type: "announcement",
    related_id: "ann-1",
    link_url: "/announcements",
    read_at: hoursAgo(72),
    created_at: hoursAgo(72),
  },
  {
    id: "ntf-6",
    profile_id: "demo-student",
    type: "progress_reminder",
    category: "assignment_reminders",
    title: "Keep building what lasts",
    description: "You have one activity remaining in Module 2. Finish strong!",
    related_type: "module",
    related_id: "module-2",
    link_url: "/course/module/module-2",
    read_at: null,
    created_at: hoursAgo(20),
  },
  {
    id: "ntf-7",
    profile_id: "demo-student",
    type: "enrollment_confirmed",
    category: "course_progress",
    title: "Enrollment confirmed",
    description: "You're enrolled in RISE USA — Fall 2025, Period 3 at Lincoln High School.",
    related_type: "cohort",
    related_id: "cohort-fall-2025",
    link_url: "/course",
    read_at: hoursAgo(720),
    created_at: hoursAgo(720),
  },
];

export const DEMO_NOTIFICATION_PREFERENCES: NotificationPreferences = {
  profile_id: "demo-student",
  course_progress: true,
  instructor_messages: true,
  announcements: true,
  assignment_reminders: true,
  certificate_completion: true,
  updated_at: hoursAgo(720),
};

// ---------------------------------------------------------------------------
// Demo Announcements
// ---------------------------------------------------------------------------
export const DEMO_ANNOUNCEMENTS: Announcement[] = [
  {
    id: "ann-1",
    title: "Welcome to RISE USA Fall 2025!",
    body: "Welcome to the RISE USA program! Over the next several weeks, you'll build a personalized Financial Blueprint and learn skills that will last a lifetime. Take it one module at a time — you've got this.",
    audience_type: "all_users",
    audience_id: null,
    audience_name: null,
    priority: "standard",
    publish_date: daysAgo(30),
    expiration_date: null,
    link_url: null,
    attachment_url: null,
    created_by: "demo-admin",
    created_by_name: "Admin User",
    is_published: true,
    created_at: daysAgo(30),
    updated_at: daysAgo(30),
  },
  {
    id: "ann-2",
    title: "Module 2 Knowledge Check — Tips for Success",
    body: "Before taking the Module 2 Knowledge Check, review your budget and savings notes. The check covers budgeting fundamentals, emergency funds, and saving strategies. You can retake it as many times as needed.",
    audience_type: "cohort",
    audience_id: "cohort-fall-2025",
    audience_name: "Fall 2025 — Period 3",
    priority: "important",
    publish_date: daysAgo(5),
    expiration_date: daysAgo(-14),
    link_url: "/course/module/module-2/knowledge-check",
    attachment_url: null,
    created_by: "demo-instructor",
    created_by_name: "Ms. Garcia",
    is_published: true,
    created_at: daysAgo(5),
    updated_at: daysAgo(5),
  },
  {
    id: "ann-3",
    title: "Financial Literacy Week — Special Workshop",
    body: "Join us for a special workshop on credit building this Friday at 3:30 PM in Room 204. All RISE USA students are welcome to attend.",
    audience_type: "organization",
    audience_id: "org-lincoln",
    audience_name: "Lincoln High School",
    priority: "urgent",
    publish_date: daysAgo(3),
    expiration_date: daysAgo(-7),
    link_url: null,
    attachment_url: null,
    created_by: "demo-admin",
    created_by_name: "Admin User",
    is_published: true,
    created_at: daysAgo(3),
    updated_at: daysAgo(3),
  },
  {
    id: "ann-4",
    title: "New Resource: Budget Template Added",
    body: "A printable monthly budget template has been added to the Resources page. Download it to practice what you've learned in Module 2.",
    audience_type: "course",
    audience_id: "rise-usa",
    audience_name: "RISE USA Course",
    priority: "standard",
    publish_date: daysAgo(1),
    expiration_date: null,
    link_url: "/resources",
    attachment_url: null,
    created_by: "demo-admin",
    created_by_name: "Admin User",
    is_published: true,
    created_at: daysAgo(1),
    updated_at: daysAgo(1),
  },
];

// ---------------------------------------------------------------------------
// Demo Messages
// ---------------------------------------------------------------------------
export const DEMO_MESSAGES: Message[] = [
  {
    id: "msg-1",
    sender_id: "demo-instructor",
    sender_name: "Ms. Garcia",
    sender_role: "instructor",
    recipient_id: "demo-student",
    recipient_name: "Alex Johnson",
    organization_id: "org-lincoln",
    cohort_id: "cohort-fall-2025",
    subject: "Great start on Module 1!",
    body: "Hi Alex, I wanted to say great job completing Module 1. Your Decision Lab responses showed real thought about your paycheck priorities. Keep up the momentum as you move into Module 2!",
    sent_at: hoursAgo(5),
    read_at: null,
    status: "sent",
    is_cohort_broadcast: false,
    reported: false,
  },
  {
    id: "msg-2",
    sender_id: "demo-student",
    sender_name: "Alex Johnson",
    sender_role: "student",
    recipient_id: "demo-instructor",
    recipient_name: "Ms. Garcia",
    organization_id: "org-lincoln",
    cohort_id: "cohort-fall-2025",
    subject: "Question about the budget template",
    body: "Hi Ms. Garcia, I downloaded the budget template from Resources but I'm not sure how to fill in the 'variable expenses' section. Could you help me understand what goes there?",
    sent_at: hoursAgo(26),
    read_at: hoursAgo(24),
    status: "read",
    is_cohort_broadcast: false,
    reported: false,
  },
  {
    id: "msg-3",
    sender_id: "demo-instructor",
    sender_name: "Ms. Garcia",
    sender_role: "instructor",
    recipient_id: null,
    recipient_name: "Fall 2025 — Period 3 (All Students)",
    organization_id: "org-lincoln",
    cohort_id: "cohort-fall-2025",
    subject: "Reminder: Knowledge Check tips posted",
    body: "Hi everyone, I've posted some tips for the Module 2 Knowledge Check in the Announcements section. Please review them before attempting the check. You've got this!",
    sent_at: hoursAgo(48),
    read_at: hoursAgo(46),
    status: "read",
    is_cohort_broadcast: true,
    reported: false,
  },
  {
    id: "msg-4",
    sender_id: "demo-admin",
    sender_name: "Admin User",
    sender_role: "admin",
    recipient_id: "demo-student",
    recipient_name: "Alex Johnson",
    organization_id: null,
    cohort_id: null,
    subject: "Your RISE USA account is active",
    body: "Welcome to RISE USA! Your account has been confirmed and you're ready to start your financial literacy journey. If you have any questions, reach out to your instructor or use the Support page.",
    sent_at: hoursAgo(720),
    read_at: hoursAgo(718),
    status: "read",
    is_cohort_broadcast: false,
    reported: false,
  },
];

export const DEMO_MESSAGE_REPORTS: MessageReport[] = [
  {
    id: "rpt-1",
    message_id: "msg-3",
    reported_by: "s3",
    reported_by_name: "Jordan Smith",
    reason: "Message seemed off-topic for the course.",
    status: "resolved",
    admin_note: "Reviewed — message is appropriate course communication.",
    resolved_by: "demo-admin",
    created_at: hoursAgo(40),
    resolved_at: hoursAgo(36),
  },
];

// ---------------------------------------------------------------------------
// Helper: Get demo profile for a role
// ---------------------------------------------------------------------------
export function getDemoProfile(role: string): Profile {
  switch (role) {
    case "instructor":
      return DEMO_INSTRUCTOR_PROFILE;
    case "org_manager":
      return DEMO_ORG_MANAGER_PROFILE;
    case "admin":
      return DEMO_ADMIN_PROFILE;
    default:
      return DEMO_STUDENT_PROFILE;
  }
}
