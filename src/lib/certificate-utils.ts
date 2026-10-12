// ============================================================================
// RISE USA LMS — Certificate Eligibility & Completion Utilities
// ============================================================================

import { modules, blueprintSections, PASSING_SCORE, TOTAL_LESSONS } from "@/data/course";

export interface CompletionChecks {
  allModulesCompleted: boolean;
  allLessonsCompleted: boolean;
  allDecisionLabsCompleted: boolean;
  allBlueprintSectionsCompleted: boolean;
  allKnowledgeChecksPassed: boolean;
  finalAssessmentPassed: boolean;
  endOfCourseSurveyCompleted: boolean;
  blueprintReviewed: boolean;
}

export interface CompletionCheckResult {
  eligible: boolean;
  reasons: string[];
  checks: CompletionChecks;
}

export interface StudentProgressData {
  moduleProgress: Array<{
    module_id: string;
    module_completed: boolean;
    lessons_completed: number;
    knowledge_check_score: number | null;
    knowledge_check_passed: boolean;
    decision_lab_submitted: boolean;
    blueprint_section_completed: boolean;
  }>;
  lessonProgress: Array<{ status: string }>;
  decisionLabs: Array<{ module_id: string }>;
  blueprintSections: Array<{ completed: boolean }>;
  finalAttempts: Array<{ passed: boolean; score?: number; percentage?: number }>;
  endOfCourseSurveyCompleted?: boolean;
  blueprintReviewed?: boolean;
}

/**
 * Check whether a student meets ALL requirements for a RISE USA certificate.
 * Returns the individual check results plus a list of unmet requirements.
 */
export function checkCertificateEligibility(
  progress: StudentProgressData
): CompletionCheckResult {
  const reasons: string[] = [];

  // 1. All six modules completed
  const allModulesCompleted = modules.every((m) =>
    progress.moduleProgress?.some(
      (mp) => mp.module_id === m.id && mp.module_completed
    )
  );
  if (!allModulesCompleted) {
    const completed = progress.moduleProgress?.filter((mp) => mp.module_completed).length ?? 0;
    reasons.push(`Not all modules completed (${completed}/6)`);
  }

  // 2. All required lessons completed
  const completedLessons = progress.lessonProgress?.filter((lp) => lp.status === "completed").length ?? 0;
  const allLessonsCompleted = completedLessons >= TOTAL_LESSONS;
  if (!allLessonsCompleted) {
    reasons.push(`Not all lessons completed (${completedLessons}/${TOTAL_LESSONS})`);
  }

  // 3. All six Decision Labs completed
  const decisionLabModules = new Set(progress.decisionLabs?.map((dl) => dl.module_id));
  const allDecisionLabsCompleted = modules.every((m) => decisionLabModules.has(m.id));
  if (!allDecisionLabsCompleted) {
    reasons.push(`Not all Decision Labs completed (${decisionLabModules.size}/6)`);
  }

  // 4. All six Blueprint sections completed
  const completedBlueprint = progress.blueprintSections?.filter((bp) => bp.completed).length ?? 0;
  const allBlueprintSectionsCompleted = completedBlueprint >= blueprintSections.length;
  if (!allBlueprintSectionsCompleted) {
    reasons.push(`Not all Blueprint sections completed (${completedBlueprint}/${blueprintSections.length})`);
  }

  // 5. All Knowledge Checks passed at 70%+
  const allKnowledgeChecksPassed = modules.every((m) => {
    const mp = progress.moduleProgress?.find((p) => p.module_id === m.id);
    return mp?.knowledge_check_passed ?? false;
  });
  if (!allKnowledgeChecksPassed) {
    const passed = progress.moduleProgress?.filter((mp) => mp.knowledge_check_passed).length ?? 0;
    reasons.push(`Not all Knowledge Checks passed at ${PASSING_SCORE}%+ (${passed}/6)`);
  }

  // 6. Final Assessment passed at 70%+
  const finalAssessmentPassed = progress.finalAttempts?.some((a) => a.passed) ?? false;
  if (!finalAssessmentPassed) {
    reasons.push("Final assessment not passed at 70%+");
  }

  // 7. End-of-Course Confidence Survey completed
  const endOfCourseSurveyCompleted = progress.endOfCourseSurveyCompleted ?? true;
  if (!endOfCourseSurveyCompleted) {
    reasons.push("End-of-Course Confidence Survey not completed");
  }

  // 8. Final 12-Month Financial Blueprint reviewed
  const blueprintReviewed = progress.blueprintReviewed ?? true;
  if (!blueprintReviewed) {
    reasons.push("Final 12-Month Financial Blueprint not reviewed");
  }

  const checks: CompletionChecks = {
    allModulesCompleted,
    allLessonsCompleted,
    allDecisionLabsCompleted,
    allBlueprintSectionsCompleted,
    allKnowledgeChecksPassed,
    finalAssessmentPassed,
    endOfCourseSurveyCompleted,
    blueprintReviewed,
  };

  return {
    eligible: Object.values(checks).every(Boolean),
    reasons,
    checks,
  };
}

/**
 * Generate a summary list of completion requirements for display.
 */
export function getCompletionRequirements(checks: CompletionChecks): {
  label: string;
  done: boolean;
}[] {
  return [
    { label: "All 6 modules completed", done: checks.allModulesCompleted },
    { label: `All ${TOTAL_LESSONS} lessons completed`, done: checks.allLessonsCompleted },
    { label: "All 6 Decision Labs completed", done: checks.allDecisionLabsCompleted },
    { label: "All 6 Blueprint sections completed", done: checks.allBlueprintSectionsCompleted },
    { label: `All Knowledge Checks passed (${PASSING_SCORE}%+)`, done: checks.allKnowledgeChecksPassed },
    { label: `Final Assessment passed (${PASSING_SCORE}%+)`, done: checks.finalAssessmentPassed },
    { label: "End-of-Course Confidence Survey completed", done: checks.endOfCourseSurveyCompleted },
    { label: "Final 12-Month Financial Blueprint reviewed", done: checks.blueprintReviewed },
  ];
}
