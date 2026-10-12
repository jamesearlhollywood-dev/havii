"use server";

import { createClient } from "@/lib/supabase/server";
import { hasValidSupabaseConfig } from "@/lib/supabase/server";
import { getCurrentUserAndProfile } from "@/lib/profile";
import {
  computeAnalyticsMetrics,
  computeModulePerformance,
  computeConfidenceAnalysis,
  applyAnalyticsFilter,
} from "@/lib/analytics-utils";
import {
  DEMO_COHORT_STUDENTS,
  DEMO_ORGANIZATIONS,
  DEMO_COHORTS,
  DEMO_ADMIN_SETTINGS,
  DEMO_CERTIFICATES,
} from "@/data/demo-data";
import {
  DEMO_END_OF_COURSE_SURVEYS,
  DEMO_COHORT_STARTING_SURVEYS,
  DEMO_MODULE_PERFORMANCE_DATA,
  DEMO_PROGRAM_IMPACT,
  buildStudentOutcomesProfile,
} from "@/data/analytics-demo-data";
import type {
  StudentProgressSummary,
  AnalyticsMetrics,
  ModulePerformance,
  ConfidenceAnalysis,
  ProgramImpactData,
  StudentOutcomesProfile,
  AnalyticsFilter,
  StartingPointSurvey,
  EndOfCourseSurvey,
} from "@/lib/types";

// ---------------------------------------------------------------------------
// Get analytics data for a given scope (with demo fallback)
// ---------------------------------------------------------------------------
export async function getAnalyticsData(
  filter: AnalyticsFilter = {},
  scope: "system" | "organization" | "instructor" = "system",
  scopeOrgId?: string,
  scopeInstructorId?: string
): Promise<{
  students: StudentProgressSummary[];
  metrics: AnalyticsMetrics;
  modulePerformance: ModulePerformance[];
}> {
  if (!hasValidSupabaseConfig()) {
    return getDemoAnalyticsData(filter, scope, scopeOrgId, scopeInstructorId);
  }

  // Real Supabase data fetching
  const supabase = await createClient();
  let query = supabase.from("enrollments").select(`
    *,
    student:profiles!enrollments_student_profile_id_fkey(*),
    cohort:cohorts(*),
    organization:organizations(*)
  `);

  if (scope === "organization" && scopeOrgId) {
    query = query.eq("organization_id", scopeOrgId);
  }
  if (scope === "instructor" && scopeInstructorId) {
    query = query.eq("assigned_instructor_id", scopeInstructorId);
  }
  if (filter.organization_id) {
    query = query.eq("organization_id", filter.organization_id);
  }
  if (filter.cohort_id) {
    query = query.eq("cohort_id", filter.cohort_id);
  }

  const { data: enrollments } = await query;

  // Transform enrollments to StudentProgressSummary
  const students: StudentProgressSummary[] = (enrollments ?? []).map((e: any) => ({
    profile_id: e.student_profile_id,
    student_name: e.student ? `${e.student.first_name ?? ""} ${e.student.last_name ?? ""}`.trim() : "Unknown",
    cohort_name: e.cohort?.name ?? "—",
    organization_name: e.organization?.name ?? "—",
    enrollment_status: e.status,
    lessons_completed: 0,
    modules_completed: 0,
    overall_progress: e.overall_progress ?? 0,
    best_quiz_score: null,
    quiz_passed: false,
    decision_labs_completed: 0,
    blueprint_sections_completed: 0,
    has_certificate: e.certificate_status === "issued",
    last_activity_date: e.updated_at,
    is_stalled: false,
    failed_quiz_attempts: 0,
    missing_blueprint_sections: 0,
    eligible_for_completion: false,
  }));

  const metrics = computeAnalyticsMetrics(students, DEMO_ADMIN_SETTINGS.stalled_threshold_days);
  const modulePerformance = computeModulePerformance(students, DEMO_MODULE_PERFORMANCE_DATA);

  return { students, metrics, modulePerformance };
}

// ---------------------------------------------------------------------------
// Demo analytics data
// ---------------------------------------------------------------------------
function getDemoAnalyticsData(
  filter: AnalyticsFilter,
  scope: "system" | "organization" | "instructor",
  scopeOrgId?: string,
  scopeInstructorId?: string
) {
  let students = [...DEMO_COHORT_STUDENTS];

  // Scope filtering
  if (scope === "organization" && scopeOrgId) {
    const org = DEMO_ORGANIZATIONS.find((o) => o.id === scopeOrgId);
    if (org) {
      students = students.filter((s) => s.organization_name === org.name);
    }
  }
  if (scope === "instructor" && scopeInstructorId) {
    const instructorCohorts = DEMO_COHORTS.filter(
      (c) => c.instructor_profile_id === scopeInstructorId
    );
    students = students.filter((s) =>
      instructorCohorts.some((c) => c.name === s.cohort_name)
    );
  }

  // Apply analytics filters
  const orgMap = new Map(DEMO_ORGANIZATIONS.map((o) => [o.id, o.name]));
  const cohortMap = new Map(
    DEMO_COHORTS.map((c) => [c.id, { organization_id: c.organization_id, name: c.name }])
  );
  students = applyAnalyticsFilter(students, filter, cohortMap, orgMap);

  const metrics = computeAnalyticsMetrics(students, DEMO_ADMIN_SETTINGS.stalled_threshold_days);
  const modulePerformance = computeModulePerformance(students, DEMO_MODULE_PERFORMANCE_DATA);

  return { students, metrics, modulePerformance };
}

// ---------------------------------------------------------------------------
// Get confidence analysis (pre/post)
// ---------------------------------------------------------------------------
export async function getConfidenceAnalysis(
  filter: AnalyticsFilter = {},
  level: "individual" | "cohort" | "organization" | "system" = "system",
  levelName = "System-Wide",
  scopeOrgId?: string
): Promise<ConfidenceAnalysis> {
  if (!hasValidSupabaseConfig()) {
    return getDemoConfidenceAnalysis(filter, level, levelName, scopeOrgId);
  }

  // Real Supabase — fetch starting_point_survey from profiles and end_of_course_surveys
  const supabase = await createClient();
  let profileQuery = supabase.from("profiles").select("starting_point_survey, id, first_name, last_name").eq("role", "student");
  if (scopeOrgId) {
    profileQuery = profileQuery.eq("organization_id", scopeOrgId);
  }
  const { data: profiles } = await profileQuery;

  const preSurveys: StartingPointSurvey[] = (profiles ?? [])
    .filter((p: any) => p.starting_point_survey)
    .map((p: any) => p.starting_point_survey as StartingPointSurvey);

  const profileIds = (profiles ?? []).map((p: any) => p.id);
  const { data: postSurveyData } = await supabase
    .from("end_of_course_surveys")
    .select("*")
    .in("profile_id", profileIds);

  const postSurveys: EndOfCourseSurvey[] = (postSurveyData ?? []) as EndOfCourseSurvey[];

  return computeConfidenceAnalysis(preSurveys, postSurveys, level, levelName);
}

function getDemoConfidenceAnalysis(
  filter: AnalyticsFilter,
  level: "individual" | "cohort" | "organization" | "system",
  levelName: string,
  scopeOrgId?: string
): ConfidenceAnalysis {
  let preSurveys = [...DEMO_COHORT_STARTING_SURVEYS] as StartingPointSurvey[];
  let postSurveys = [...DEMO_END_OF_COURSE_SURVEYS];

  // Scope by organization
  if (scopeOrgId) {
    const org = DEMO_ORGANIZATIONS.find((o) => o.id === scopeOrgId);
    if (org) {
      const orgStudentIds = DEMO_COHORT_STUDENTS
        .filter((s) => s.organization_name === org.name)
        .map((s) => s.profile_id);
      preSurveys = preSurveys.filter((s) => s.profile_id && orgStudentIds.includes(s.profile_id));
      postSurveys = postSurveys.filter((s) => s.profile_id && orgStudentIds.includes(s.profile_id));
    }
  }

  // Scope by cohort
  if (filter.cohort_id) {
    const cohort = DEMO_COHORTS.find((c) => c.id === filter.cohort_id);
    if (cohort) {
      const cohortStudentIds = DEMO_COHORT_STUDENTS
        .filter((s) => s.cohort_name === cohort.name)
        .map((s) => s.profile_id);
      preSurveys = preSurveys.filter((s) => s.profile_id && cohortStudentIds.includes(s.profile_id));
      postSurveys = postSurveys.filter((s) => s.profile_id && cohortStudentIds.includes(s.profile_id));
    }
  }

  return computeConfidenceAnalysis(preSurveys, postSurveys, level, levelName);
}

// ---------------------------------------------------------------------------
// Get program impact data (trends over time)
// ---------------------------------------------------------------------------
export async function getProgramImpactData(): Promise<ProgramImpactData> {
  if (!hasValidSupabaseConfig()) {
    return DEMO_PROGRAM_IMPACT;
  }

  // Real Supabase — would query enrollments grouped by month, etc.
  // For now, return demo data as fallback
  return DEMO_PROGRAM_IMPACT;
}

// ---------------------------------------------------------------------------
// Get student outcomes profile
// ---------------------------------------------------------------------------
export async function getStudentOutcomesProfile(
  studentId: string
): Promise<StudentOutcomesProfile | null> {
  if (!hasValidSupabaseConfig()) {
    return buildStudentOutcomesProfile(studentId);
  }

  // Real Supabase implementation
  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", studentId)
    .maybeSingle();

  if (!profile) return null;

  const { data: enrollments } = await supabase
    .from("enrollments")
    .select("*, cohort:cohorts(*), organization:organizations(*)")
    .eq("student_profile_id", studentId)
    .limit(1);

  const enrollment = enrollments?.[0];

  const { data: moduleProgress } = await supabase
    .from("module_progress")
    .select("*")
    .eq("profile_id", studentId);

  const { data: finalAttempts } = await supabase
    .from("final_assessment_attempts")
    .select("*")
    .eq("profile_id", studentId)
    .order("created_at", { ascending: false })
    .limit(1);

  const { data: decisionLabs } = await supabase
    .from("decision_lab_submissions")
    .select("*")
    .eq("profile_id", studentId);

  const { data: blueprintSections } = await supabase
    .from("blueprint_sections")
    .select("*")
    .eq("profile_id", studentId);

  const { data: certificates } = await supabase
    .from("certificates")
    .select("*")
    .eq("profile_id", studentId)
    .eq("status", "issued")
    .limit(1);

  const { data: endSurvey } = await supabase
    .from("end_of_course_surveys")
    .select("*")
    .eq("profile_id", studentId)
    .limit(1);

  // Build module details
  const { modules: courseModules } = await import("@/data/course");
  const moduleDetails = courseModules.map((mod) => {
    const mp = moduleProgress?.find((m: any) => m.module_id === mod.id);
    return {
      module_id: mod.id,
      module_number: mod.number,
      module_title: mod.title,
      knowledge_check_score: mp?.knowledge_check_score ?? null,
      knowledge_check_passed: mp?.knowledge_check_passed ?? false,
      decision_lab_completed: decisionLabs?.some((dl: any) => dl.module_id === mod.id) ?? false,
      blueprint_section_completed: blueprintSections?.some((bp: any) => bp.module_id === mod.id && bp.completed) ?? false,
      module_completed: mp?.module_completed ?? false,
    };
  });

  const startingConfidence = profile.starting_point_survey
    ? Math.round(
        (profile.starting_point_survey.responses.reduce(
          (sum: number, r: any) => sum + r.confidence, 0
        ) / profile.starting_point_survey.responses.length) * 10
      ) / 10
    : null;

  const endingConfidence = endSurvey?.[0]
    ? Math.round(
        ((endSurvey[0] as any).responses.reduce(
          (sum: number, r: any) => sum + r.confidence, 0
        ) / (endSurvey[0] as any).responses.length) * 10
      ) / 10
    : null;

  return {
    profile_id: studentId,
    student_name: `${profile.first_name ?? ""} ${profile.last_name ?? ""}`.trim(),
    organization_name: enrollment?.organization?.name ?? "—",
    cohort_name: enrollment?.cohort?.name ?? "—",
    enrollment_status: enrollment?.status ?? "not_started",
    overall_progress: enrollment?.overall_progress ?? 0,
    modules_completed: moduleProgress?.filter((m: any) => m.module_completed).length ?? 0,
    module_details: moduleDetails,
    final_assessment_score: finalAttempts?.[0]?.percentage ?? null,
    final_assessment_passed: finalAttempts?.[0]?.passed ?? false,
    decision_labs_completed: decisionLabs?.length ?? 0,
    blueprint_sections_completed: blueprintSections?.filter((bp: any) => bp.completed).length ?? 0,
    certificate_status: certificates?.length ? "issued" : "not_eligible",
    starting_confidence: startingConfidence,
    ending_confidence: endingConfidence,
    confidence_change:
      startingConfidence !== null && endingConfidence !== null
        ? Math.round((endingConfidence - startingConfidence) * 10) / 10
        : null,
  };
}
