// ============================================================================
// RISE USA LMS — Analytics Demo Data
// ============================================================================

import type {
  EndOfCourseSurvey,
  TimeSeriesPoint,
  ProgramImpactData,
  StudentOutcomesProfile,
} from "@/lib/types";
import { CONFIDENCE_SURVEY_STATEMENTS } from "@/lib/analytics-utils";
import { modules, blueprintSections } from "@/data/course";
import { DEMO_COHORT_STUDENTS, DEMO_STUDENT_RECORD_DETAILS } from "@/data/demo-data";

const now = new Date();
const daysAgo = (d: number) => new Date(now.getTime() - d * 86400000).toISOString();

// ---------------------------------------------------------------------------
// End-of-Course Confidence Surveys (only for completed students)
// ---------------------------------------------------------------------------
function makeEndSurvey(
  profileId: string,
  baseConfidence: number[],
  daysBack: number
): EndOfCourseSurvey {
  return {
    profile_id: profileId,
    responses: CONFIDENCE_SURVEY_STATEMENTS.map((question, i) => ({
      question,
      confidence: Math.min(5, baseConfidence[i] ?? 4),
    })),
    completed_at: daysAgo(daysBack),
  };
}

export const DEMO_END_OF_COURSE_SURVEYS: EndOfCourseSurvey[] = [
  // Sam Anderson (s7) — completed, high confidence gain
  makeEndSurvey("s7", [5, 5, 4, 4, 5, 4, 4, 4, 4, 5], 5),
  // Morgan Taylor (s6) — completed, strong gain
  makeEndSurvey("s6", [4, 5, 5, 4, 4, 4, 4, 3, 4, 4], 1),
  // Previous student (s-old-1) — older completion
  makeEndSurvey("s-old-1", [4, 4, 4, 3, 4, 3, 3, 3, 3, 4], 300),
];

// Starting point surveys for cohort students (for pre/post comparison)
export const DEMO_COHORT_STARTING_SURVEYS: {
  profile_id: string;
  responses: { question: string; confidence: number }[];
  completed_at: string;
}[] = [
  {
    profile_id: "s7",
    responses: CONFIDENCE_SURVEY_STATEMENTS.map((q, i) => ({
      question: q,
      confidence: [2, 2, 3, 1, 2, 2, 1, 1, 2, 2][i] ?? 2,
    })),
    completed_at: daysAgo(60),
  },
  {
    profile_id: "s6",
    responses: CONFIDENCE_SURVEY_STATEMENTS.map((q, i) => ({
      question: q,
      confidence: [3, 2, 3, 2, 2, 1, 1, 2, 2, 2][i] ?? 2,
    })),
    completed_at: daysAgo(55),
  },
  {
    profile_id: "s2",
    responses: CONFIDENCE_SURVEY_STATEMENTS.map((q, i) => ({
      question: q,
      confidence: [2, 1, 2, 1, 1, 2, 1, 1, 1, 2][i] ?? 2,
    })),
    completed_at: daysAgo(40),
  },
  {
    profile_id: "s4",
    responses: CONFIDENCE_SURVEY_STATEMENTS.map((q, i) => ({
      question: q,
      confidence: [3, 2, 3, 2, 2, 1, 2, 1, 2, 2][i] ?? 2,
    })),
    completed_at: daysAgo(35),
  },
  {
    profile_id: "s5",
    responses: CONFIDENCE_SURVEY_STATEMENTS.map((q, i) => ({
      question: q,
      confidence: [2, 2, 2, 1, 1, 1, 1, 1, 1, 1][i] ?? 2,
    })),
    completed_at: daysAgo(30),
  },
  {
    profile_id: "s8",
    responses: CONFIDENCE_SURVEY_STATEMENTS.map((q, i) => ({
      question: q,
      confidence: [1, 1, 2, 1, 1, 1, 1, 1, 1, 1][i] ?? 1,
    })),
    completed_at: daysAgo(15),
  },
  {
    profile_id: "s-old-1",
    responses: CONFIDENCE_SURVEY_STATEMENTS.map((q, i) => ({
      question: q,
      confidence: [2, 1, 2, 1, 1, 1, 1, 1, 1, 2][i] ?? 1,
    })),
    completed_at: daysAgo(320),
  },
];

// ---------------------------------------------------------------------------
// Module-level performance data (per student per module)
// ---------------------------------------------------------------------------
export const DEMO_MODULE_PERFORMANCE_DATA: Record<
  string,
  { scores: number[]; passed: boolean[]; attempts: number[] }
> = {
  "module-1": {
    scores: [85, 70, 45, 55, 80, 92, 95, null, 60, null].filter(
      (s): s is number => s !== null
    ),
    passed: [true, true, false, false, true, true, true, false, false, false],
    attempts: [1, 2, 3, 2, 1, 1, 1, 0, 1, 0],
  },
  "module-2": {
    scores: [null, 75, 45, 55, 80, 92, 95, null, null, null].filter(
      (s): s is number => s !== null
    ),
    passed: [false, true, false, false, true, true, true, false, false, false],
    attempts: [0, 1, 2, 2, 1, 1, 1, 0, 0, 0],
  },
  "module-3": {
    scores: [null, null, null, 55, 80, 92, 95, null, null, null].filter(
      (s): s is number => s !== null
    ),
    passed: [false, false, false, false, true, true, true, false, false, false],
    attempts: [0, 0, 0, 2, 1, 1, 1, 0, 0, 0],
  },
  "module-4": {
    scores: [null, null, null, null, 80, 92, 95, null, null, null].filter(
      (s): s is number => s !== null
    ),
    passed: [false, false, false, false, true, true, true, false, false, false],
    attempts: [0, 0, 0, 0, 1, 1, 1, 0, 0, 0],
  },
  "module-5": {
    scores: [null, null, null, null, 80, 92, 95, null, null, null].filter(
      (s): s is number => s !== null
    ),
    passed: [false, false, false, false, true, true, true, false, false, false],
    attempts: [0, 0, 0, 0, 1, 1, 1, 0, 0, 0],
  },
  "module-6": {
    scores: [null, null, null, null, null, 92, 95, null, null, null].filter(
      (s): s is number => s !== null
    ),
    passed: [false, false, false, false, false, true, true, false, false, false],
    attempts: [0, 0, 0, 0, 0, 1, 1, 0, 0, 0],
  },
};

// ---------------------------------------------------------------------------
// Program Impact — Time Series Data
// ---------------------------------------------------------------------------
export const DEMO_PROGRAM_IMPACT: ProgramImpactData = {
  enrollments_by_month: [
    { label: "Sep 2025", value: 18 },
    { label: "Oct 2025", value: 12 },
    { label: "Nov 2025", value: 8 },
    { label: "Dec 2025", value: 5 },
    { label: "Jan 2026", value: 15 },
    { label: "Feb 2026", value: 10 },
    { label: "Mar 2026", value: 7 },
    { label: "Apr 2026", value: 4 },
    { label: "May 2026", value: 6 },
    { label: "Jun 2026", value: 3 },
  ],
  completion_rate_over_time: [
    { label: "Sep 2025", value: 0 },
    { label: "Oct 2025", value: 5 },
    { label: "Nov 2025", value: 12 },
    { label: "Dec 2025", value: 20 },
    { label: "Jan 2026", value: 25 },
    { label: "Feb 2026", value: 30 },
    { label: "Mar 2026", value: 35 },
    { label: "Apr 2026", value: 38 },
    { label: "May 2026", value: 40 },
    { label: "Jun 2026", value: 42 },
  ],
  assessment_performance_over_time: [
    { label: "Sep 2025", value: 65 },
    { label: "Oct 2025", value: 68 },
    { label: "Nov 2025", value: 72 },
    { label: "Dec 2025", value: 75 },
    { label: "Jan 2026", value: 73 },
    { label: "Feb 2026", value: 78 },
    { label: "Mar 2026", value: 80 },
    { label: "Apr 2026", value: 79 },
    { label: "May 2026", value: 82 },
    { label: "Jun 2026", value: 85 },
  ],
  certificates_by_month: [
    { label: "Sep 2025", value: 0 },
    { label: "Oct 2025", value: 1 },
    { label: "Nov 2025", value: 2 },
    { label: "Dec 2025", value: 3 },
    { label: "Jan 2026", value: 2 },
    { label: "Feb 2026", value: 4 },
    { label: "Mar 2026", value: 3 },
    { label: "Apr 2026", value: 5 },
    { label: "May 2026", value: 4 },
    { label: "Jun 2026", value: 6 },
  ],
  participating_organizations: 3,
  active_cohorts: 2,
  confidence_improvement_over_time: [
    { label: "Sep 2025", value: 0 },
    { label: "Oct 2025", value: 15 },
    { label: "Nov 2025", value: 25 },
    { label: "Dec 2025", value: 35 },
    { label: "Jan 2026", value: 40 },
    { label: "Feb 2026", value: 48 },
    { label: "Mar 2026", value: 52 },
    { label: "Apr 2026", value: 55 },
    { label: "May 2026", value: 58 },
    { label: "Jun 2026", value: 62 },
  ],
};

// ---------------------------------------------------------------------------
// Student Outcomes Profiles (for authorized staff)
// ---------------------------------------------------------------------------
export function buildStudentOutcomesProfile(
  profileId: string
): StudentOutcomesProfile | null {
  const student = DEMO_COHORT_STUDENTS.find((s) => s.profile_id === profileId);
  if (!student) return null;

  const recordDetail = DEMO_STUDENT_RECORD_DETAILS.find(
    (r) => r.profile_id === profileId
  );

  const moduleDetails = modules.map((mod) => {
    const recordModule = recordDetail?.modules.find(
      (m) => m.module_id === mod.id
    );
    return {
      module_id: mod.id,
      module_number: mod.number,
      module_title: mod.title,
      knowledge_check_score: recordModule?.knowledge_check_score ?? null,
      knowledge_check_passed: recordModule?.knowledge_check_passed ?? false,
      decision_lab_completed: recordModule?.decision_lab_completed ?? false,
      blueprint_section_completed:
        recordModule?.blueprint_section_completed ?? false,
      module_completed: recordModule?.module_completed ?? false,
    };
  });

  const preSurvey = DEMO_COHORT_STARTING_SURVEYS.find(
    (s) => s.profile_id === profileId
  );
  const postSurvey = DEMO_END_OF_COURSE_SURVEYS.find(
    (s) => s.profile_id === profileId
  );

  const startingConfidence = preSurvey
    ? Math.round(
        (preSurvey.responses.reduce((sum, r) => sum + r.confidence, 0) /
          preSurvey.responses.length) *
          10
      ) / 10
    : null;
  const endingConfidence = postSurvey
    ? Math.round(
        (postSurvey.responses.reduce((sum, r) => sum + r.confidence, 0) /
          postSurvey.responses.length) *
          10
      ) / 10
    : null;
  const confidenceChange =
    startingConfidence !== null && endingConfidence !== null
      ? Math.round((endingConfidence - startingConfidence) * 10) / 10
      : null;

  return {
    profile_id: profileId,
    student_name: student.student_name,
    organization_name: student.organization_name,
    cohort_name: student.cohort_name,
    enrollment_status: student.enrollment_status,
    overall_progress: student.overall_progress,
    modules_completed: student.modules_completed,
    module_details: moduleDetails,
    final_assessment_score: recordDetail?.final_assessment_score ?? null,
    final_assessment_passed: recordDetail?.final_assessment_passed ?? false,
    decision_labs_completed: student.decision_labs_completed,
    blueprint_sections_completed: student.blueprint_sections_completed,
    certificate_status: student.has_certificate ? "issued" : "not_eligible",
    starting_confidence: startingConfidence,
    ending_confidence: endingConfidence,
    confidence_change: confidenceChange,
  };
}
