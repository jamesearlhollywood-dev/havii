// ============================================================================
// RISE USA LMS — Analytics & Outcomes Utilities
// ============================================================================

import { modules } from "@/data/course";
import type {
  StudentProgressSummary,
  AnalyticsMetrics,
  ModulePerformance,
  ConfidenceAnalysis,
  EndOfCourseSurvey,
  StartingPointSurvey,
  AnalyticsFilter,
} from "@/lib/types";

// ---------------------------------------------------------------------------
// Confidence Survey Statements (used for both pre and post surveys)
// ---------------------------------------------------------------------------
export const CONFIDENCE_SURVEY_STATEMENTS: string[] = [
  "I know how to read a paycheck.",
  "I understand gross versus net pay.",
  "I understand how bank accounts work.",
  "I know how to create a monthly budget.",
  "I understand how credit scores work.",
  "I understand the cost of borrowing.",
  "I understand student loans.",
  "I understand basic investing.",
  "I understand the true cost of owning a car.",
  "I know what to review before signing a financial agreement or lease.",
];

// ---------------------------------------------------------------------------
// Small-group privacy suppression
// ---------------------------------------------------------------------------
export const SMALL_GROUP_THRESHOLD = 5;

/**
 * If a group has fewer than SMALL_GROUP_THRESHOLD students, suppress
 * individual-level breakdowns and show only aggregate information.
 */
export function shouldSuppressSmallGroup(studentCount: number): boolean {
  return studentCount > 0 && studentCount < SMALL_GROUP_THRESHOLD;
}

// ---------------------------------------------------------------------------
// Compute analytics metrics from student summaries
// ---------------------------------------------------------------------------
export function computeAnalyticsMetrics(
  students: StudentProgressSummary[],
  stalledThresholdDays = 14
): AnalyticsMetrics {
  const total = students.length;
  const notStarted = students.filter(
    (s) => s.lessons_completed === 0 && s.enrollment_status !== "completed"
  ).length;
  const inProgress = students.filter(
    (s) => s.lessons_completed > 0 && !s.has_certificate && s.enrollment_status !== "withdrawn"
  ).length;
  const completed = students.filter(
    (s) => s.has_certificate || s.enrollment_status === "completed"
  ).length;
  const active = students.filter(
    (s) =>
      s.lessons_completed > 0 &&
      !s.is_stalled &&
      !s.has_certificate &&
      s.enrollment_status !== "withdrawn" &&
      s.enrollment_status !== "completed"
  ).length;
  const stalled = students.filter((s) => s.is_stalled).length;

  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  const progressValues = students.map((s) => s.overall_progress);
  const avgProgress =
    progressValues.length > 0
      ? Math.round(progressValues.reduce((a, b) => a + b, 0) / progressValues.length)
      : 0;

  const kcScores = students
    .filter((s) => s.best_quiz_score !== null)
    .map((s) => s.best_quiz_score!);
  const avgKC =
    kcScores.length > 0
      ? Math.round(kcScores.reduce((a, b) => a + b, 0) / kcScores.length)
      : 0;

  // Final assessment metrics — derived from quiz_passed as proxy in demo
  const assessedStudents = students.filter((s) => s.best_quiz_score !== null);
  const passedStudents = assessedStudents.filter((s) => s.quiz_passed);
  const finalPassRate =
    assessedStudents.length > 0
      ? Math.round((passedStudents.length / assessedStudents.length) * 100)
      : 0;
  const avgFinalScore =
    assessedStudents.length > 0
      ? Math.round(
          assessedStudents.reduce((sum, s) => sum + (s.best_quiz_score ?? 0), 0) /
            assessedStudents.length
        )
      : 0;

  const totalDecisionLabs = students.reduce(
    (sum, s) => sum + s.decision_labs_completed,
    0
  );

  const blueprintComplete = students.filter(
    (s) => s.blueprint_sections_completed === modules.length
  ).length;
  const blueprintRate =
    total > 0 ? Math.round((blueprintComplete / total) * 100) : 0;

  const certificates = students.filter((s) => s.has_certificate).length;

  // Avg time to completion — approximate from last_activity for completed students
  const completedStudents = students.filter((s) => s.has_certificate);
  const avgTimeToCompletion =
    completedStudents.length > 0
      ? Math.round(
          completedStudents.reduce((sum, s) => {
            // Rough estimate: ~45 days average for demo
            const days = s.last_activity_date
              ? Math.round(
                  (new Date(s.last_activity_date).getTime() -
                    new Date("2025-09-01").getTime()) /
                    86400000
                )
              : 45;
            return sum + Math.max(days, 30);
          }, 0) / completedStudents.length
        )
      : 0;

  return {
    total_enrolled: total,
    active_students: active,
    not_started: notStarted,
    in_progress: inProgress,
    completed,
    completion_rate: completionRate,
    avg_overall_progress: avgProgress,
    avg_knowledge_check_score: avgKC,
    final_assessment_pass_rate: finalPassRate,
    avg_final_assessment_score: avgFinalScore,
    decision_labs_completed: totalDecisionLabs,
    blueprint_completion_rate: blueprintRate,
    certificates_issued: certificates,
    avg_time_to_completion_days: avgTimeToCompletion,
    stalled_students: stalled,
  };
}

// ---------------------------------------------------------------------------
// Compute module-level performance
// ---------------------------------------------------------------------------
export function computeModulePerformance(
  students: StudentProgressSummary[],
  moduleProgressData: Record<
    string,
    { scores: number[]; passed: boolean[]; attempts: number[] }
  >
): ModulePerformance[] {
  return modules.map((mod) => {
    const data = moduleProgressData[mod.id];
    const scores = data?.scores ?? [];
    const passed = data?.passed ?? [];
    const attempts = data?.attempts ?? [];

    const avgScore =
      scores.length > 0
        ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
        : 0;
    const passRate =
      passed.length > 0
        ? Math.round((passed.filter(Boolean).length / passed.length) * 100)
        : 0;
    const avgAttempts =
      attempts.length > 0
        ? Math.round(
            (attempts.reduce((a, b) => a + b, 0) / attempts.length) * 10
          ) / 10
        : 0;

    return {
      module_id: mod.id,
      module_number: mod.number,
      module_title: mod.title,
      avg_knowledge_check_score: avgScore,
      pass_rate: passRate,
      avg_attempts: avgAttempts,
      most_missed_topics: MODULE_MISSED_TOPICS[mod.id] ?? [],
      strongest_topics: MODULE_STRONGEST_TOPICS[mod.id] ?? [],
      needs_reinforcement: MODULE_REINFORCEMENT[mod.id] ?? [],
    };
  });
}

// Topic data for module performance (demo-derived)
const MODULE_MISSED_TOPICS: Record<string, string[]> = {
  "module-1": ["Net pay calculations", "W-4 allowances"],
  "module-2": ["Emergency fund sizing", "Variable expense planning"],
  "module-3": ["Credit utilization ratio", "APR vs interest rate"],
  "module-4": ["Subsidized vs unsubsidized loans", "FAFSA deadlines"],
  "module-5": ["Diversification", "Compound interest"],
  "module-6": ["Insurance deductibles", "Lease vs buy analysis"],
};

const MODULE_STRONGEST_TOPICS: Record<string, string[]> = {
  "module-1": ["Types of income", "Reading a paystub"],
  "module-2": ["Budget categories", "Savings goals"],
  "module-3": ["Credit score factors", "Types of borrowing"],
  "module-4": ["College cost comparison", "Loan repayment options"],
  "module-5": ["Risk vs reward", "Investment account types"],
  "module-6": ["Car ownership costs", "Renter protections"],
};

const MODULE_REINFORCEMENT: Record<string, string[]> = {
  "module-1": ["Tax withholding", "Bank account agreements"],
  "module-2": ["Irregular income budgeting"],
  "module-3": ["Loan amortization", "Debt-to-income ratio"],
  "module-4": ["Interest capitalization", "Income-driven repayment"],
  "module-5": ["Asset allocation", "Index funds vs individual stocks"],
  "module-6": ["Coverage limits", "Tenant insurance"],
};

// ---------------------------------------------------------------------------
// Compute confidence analysis (pre/post)
// ---------------------------------------------------------------------------
export function computeConfidenceAnalysis(
  preSurveys: StartingPointSurvey[],
  postSurveys: EndOfCourseSurvey[],
  level: "individual" | "cohort" | "organization" | "system",
  levelName: string
): ConfidenceAnalysis {
  const studentCount = preSurveys.length;
  const hasPostData = postSurveys.length > 0;

  const byTopic = CONFIDENCE_SURVEY_STATEMENTS.map((question, idx) => {
    // Normalize question matching — the pre-survey uses slightly different wording
    const preQuestion = normalizeQuestion(question);
    const preValues = preSurveys
      .map((s) => {
        const r = s.responses.find(
          (resp) => normalizeQuestion(resp.question) === preQuestion
        );
        return r?.confidence;
      })
      .filter((v): v is number => v !== undefined);

    const postValues = postSurveys
      .map((s) => {
        const r = s.responses.find(
          (resp) => normalizeQuestion(resp.question) === preQuestion
        );
        return r?.confidence;
      })
      .filter((v): v is number => v !== undefined);

    const avgPre =
      preValues.length > 0
        ? Math.round((preValues.reduce((a, b) => a + b, 0) / preValues.length) * 10) / 10
        : 0;
    const avgPost =
      postValues.length > 0
        ? Math.round((postValues.reduce((a, b) => a + b, 0) / postValues.length) * 10) / 10
        : 0;

    return {
      question,
      avg_pre: avgPre,
      avg_post: avgPost,
      change: Math.round((avgPost - avgPre) * 10) / 10,
    };
  });

  const avgPreScore =
    byTopic.length > 0
      ? Math.round((byTopic.reduce((sum, t) => sum + t.avg_pre, 0) / byTopic.length) * 10) / 10
      : 0;
  const avgPostScore =
    byTopic.length > 0 && hasPostData
      ? Math.round((byTopic.reduce((sum, t) => sum + t.avg_post, 0) / byTopic.length) * 10) / 10
      : 0;
  const percentageChange =
    avgPreScore > 0
      ? Math.round(((avgPostScore - avgPreScore) / avgPreScore) * 100)
      : 0;

  return {
    level,
    level_name: levelName,
    avg_pre_score: avgPreScore,
    avg_post_score: avgPostScore,
    percentage_change: percentageChange,
    by_topic: byTopic,
    student_count: studentCount,
    has_post_data: hasPostData,
  };
}

function normalizeQuestion(q: string): string {
  return q
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

// ---------------------------------------------------------------------------
// Apply analytics filters to student summaries
// ---------------------------------------------------------------------------
export function applyAnalyticsFilter(
  students: StudentProgressSummary[],
  filter: AnalyticsFilter,
  cohortMap: Map<string, { organization_id: string; name: string }>,
  orgMap: Map<string, string>
): StudentProgressSummary[] {
  return students.filter((s) => {
    if (filter.organization_id) {
      if (s.organization_name !== orgMap.get(filter.organization_id)) return false;
    }
    if (filter.cohort_id) {
      const cohort = cohortMap.get(filter.cohort_id);
      if (!cohort || s.cohort_name !== cohort.name) return false;
    }
    if (filter.enrollment_status && filter.enrollment_status !== "all") {
      if (s.enrollment_status !== filter.enrollment_status) return false;
    }
    return true;
  });
}
