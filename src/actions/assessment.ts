"use server";

import { createClient } from "@/lib/supabase/server";
import { hasValidSupabaseConfig } from "@/lib/supabase/server";
import { getCurrentUserAndProfile } from "@/lib/profile";
import {
  getQuestionsForAssessment,
  getAssessmentById,
} from "@/data/assessment-data";
import { gradeAssessment, type AssessmentResult } from "@/lib/assessment-scoring";
import { modules, blueprintSections, PASSING_SCORE } from "@/data/course";
import { generateCertificateId } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Submit Assessment (Knowledge Check or Final Assessment)
// ---------------------------------------------------------------------------
export async function submitAssessment(
  assessmentId: string,
  answers: Record<string, string | string[]>,
): Promise<AssessmentResult> {
  const config = getAssessmentById(assessmentId);
  if (!config) throw new Error("Assessment not found");

  const questions = getQuestionsForAssessment(assessmentId);
  if (questions.length === 0) throw new Error("No questions found for assessment");

  const result = gradeAssessment(questions, answers, config.passingScore);

  // If Supabase is connected, persist the attempt
  if (hasValidSupabaseConfig()) {
    const { profile } = await getCurrentUserAndProfile();
    if (!profile) throw new Error("Not authenticated");

    const supabase = await createClient();

    // Count existing attempts
    const { count } = await supabase
      .from("assessment_attempts")
      .select("*", { count: "exact", head: true })
      .eq("profile_id", profile.id)
      .eq("assessment_id", assessmentId);

    const attemptNumber = (count ?? 0) + 1;

    await supabase.from("assessment_attempts").insert({
      profile_id: profile.id,
      assessment_id: assessmentId,
      assessment_type: config.type,
      module_id: config.moduleId ?? null,
      attempt_number: attemptNumber,
      started_at: new Date(Date.now() - 60000).toISOString(),
      submitted_at: new Date().toISOString(),
      score: result.earnedPoints,
      percentage: result.percentage,
      passed: result.passed,
      responses: answers,
      question_results: Object.fromEntries(
        result.questionResults.map((r) => [r.questionId, r.correct])
      ),
    });

    // If knowledge check passed, update module progress
    if (config.type === "knowledge_check" && config.moduleId) {
      await updateModuleProgressAfterKC(
        profile.id,
        config.moduleId,
        result.percentage,
        result.passed
      );
    }

    // If final assessment passed, check for certificate
    if (config.type === "final_assessment" && result.passed) {
      await checkAndIssueCertificate(profile.id);
    }
  }

  return result;
}

// ---------------------------------------------------------------------------
// Update module progress after knowledge check
// ---------------------------------------------------------------------------
async function updateModuleProgressAfterKC(
  profileId: string,
  moduleId: string,
  score: number,
  passed: boolean,
) {
  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("module_progress")
    .select("*")
    .eq("profile_id", profileId)
    .eq("module_id", moduleId)
    .maybeSingle();

  const attempts = (existing?.knowledge_check_attempts ?? 0) + 1;
  const bestScore = Math.max(score, Number(existing?.knowledge_check_score ?? 0));
  const bestPassed = passed || (existing?.knowledge_check_passed ?? false);

  await supabase.from("module_progress").upsert(
    {
      profile_id: profileId,
      module_id: moduleId,
      lessons_completed: existing?.lessons_completed ?? 0,
      knowledge_check_score: bestScore,
      knowledge_check_passed: bestPassed,
      knowledge_check_attempts: attempts,
      decision_lab_submitted: existing?.decision_lab_submitted ?? false,
      blueprint_section_completed: existing?.blueprint_section_completed ?? false,
      module_completed: false,
      completed_at: null,
    },
    { onConflict: "profile_id,module_id" }
  );
}

// ---------------------------------------------------------------------------
// Certificate eligibility check and auto-issue
// ---------------------------------------------------------------------------
export async function checkAndIssueCertificate(profileId: string) {
  const supabase = await createClient();

  // Check all modules completed
  const { data: moduleProgress } = await supabase
    .from("module_progress")
    .select("*")
    .eq("profile_id", profileId);

  const allModulesComplete = modules.every((m) =>
    moduleProgress?.some((mp) => mp.module_id === m.id && mp.module_completed)
  );
  if (!allModulesComplete) return;

  // Check final assessment passed
  const { data: finalAttempts } = await supabase
    .from("assessment_attempts")
    .select("*")
    .eq("profile_id", profileId)
    .eq("assessment_type", "final_assessment")
    .eq("passed", true)
    .limit(1);

  const finalPassed = finalAttempts && finalAttempts.length > 0;
  if (!finalPassed) return;

  // Check end-of-course survey and blueprint review (capstone requirements)
  const { data: capstoneRows } = await supabase
    .from("capstone_data")
    .select("data_key, data_value")
    .eq("profile_id", profileId);
  const surveyDone = capstoneRows?.some((r) => r.data_key === "end_of_course_survey");
  const reviewRow = capstoneRows?.find((r) => r.data_key === "blueprint_reviewed");
  const blueprintReviewed = !!((reviewRow?.data_value as Record<string, unknown>)?.confirmed);
  if (!surveyDone || !blueprintReviewed) return;

  // Check if certificate already exists
  const { data: existing } = await supabase
    .from("certificates")
    .select("*")
    .eq("profile_id", profileId)
    .eq("status", "issued")
    .maybeSingle();

  if (existing) return;

  // Get student name and org/cohort info
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", profileId)
    .maybeSingle();

  if (!profile) return;

  const studentName =
    [profile.first_name, profile.last_name].filter(Boolean).join(" ") ||
    profile.preferred_name ||
    "Student";

  // Get enrollment info for org/cohort
  const { data: enrollment } = await supabase
    .from("enrollments")
    .select("*")
    .eq("student_profile_id", profileId)
    .maybeSingle();

  let orgName: string | null = null;
  let cohortName: string | null = null;
  let instructorName: string | null = null;

  if (enrollment?.organization_id) {
    const { data: org } = await supabase
      .from("organizations")
      .select("name")
      .eq("id", enrollment.organization_id)
      .maybeSingle();
    orgName = org?.name ?? null;
  }

  if (enrollment?.cohort_id) {
    const { data: cohort } = await supabase
      .from("cohorts")
      .select("name, instructor_profile_id")
      .eq("id", enrollment.cohort_id)
      .maybeSingle();
    cohortName = cohort?.name ?? null;

    if (cohort?.instructor_profile_id) {
      const { data: instructor } = await supabase
        .from("profiles")
        .select("first_name, last_name, preferred_name")
        .eq("id", cohort.instructor_profile_id)
        .maybeSingle();
      instructorName = instructor
        ? [instructor.first_name, instructor.last_name].filter(Boolean).join(" ") ||
          instructor.preferred_name ||
          null
        : null;
    }
  }

  const certId = generateCertificateId();

  await supabase.from("certificates").insert({
    profile_id: profileId,
    certificate_id: certId,
    student_name: studentName,
    course_name: "RISE USA: Roadmap to Income, Savings, and Equity",
    status: "issued",
    organization_name: orgName,
    cohort_name: cohortName,
    instructor_name: instructorName,
  });

  // Update enrollment status
  if (enrollment) {
    await supabase
      .from("enrollments")
      .update({
        status: "completed",
        actual_completion_date: new Date().toISOString(),
        certificate_status: "issued",
      })
      .eq("id", enrollment.id);
  }

  // Log audit entry
  await supabase.from("certificate_audit").insert({
    certificate_id: certId,
    action: "issued",
    performed_by: profileId,
    note: "Auto-issued upon course completion",
  });
}

// ---------------------------------------------------------------------------
// Admin: Revoke certificate
// ---------------------------------------------------------------------------
export async function revokeCertificate(
  certificateId: string,
  note: string,
): Promise<{ error?: string; success?: string }> {
  if (!hasValidSupabaseConfig()) return { error: "Supabase not configured" };
  const { profile } = await getCurrentUserAndProfile();
  if (!profile || profile.role !== "admin")
    return { error: "Not authorized" };

  const supabase = await createClient();

  const { error } = await supabase
    .from("certificates")
    .update({ status: "revoked" })
    .eq("certificate_id", certificateId);

  if (error) return { error: error.message };

  await supabase.from("certificate_audit").insert({
    certificate_id: certificateId,
    action: "revoked",
    performed_by: profile.id,
    note,
  });

  return { success: "Certificate revoked." };
}

// ---------------------------------------------------------------------------
// Admin: Reissue certificate
// ---------------------------------------------------------------------------
export async function reissueCertificate(
  certificateId: string,
  note: string,
): Promise<{ error?: string; success?: string }> {
  if (!hasValidSupabaseConfig()) return { error: "Supabase not configured" };
  const { profile } = await getCurrentUserAndProfile();
  if (!profile || profile.role !== "admin")
    return { error: "Not authorized" };

  const supabase = await createClient();

  const { error } = await supabase
    .from("certificates")
    .update({ status: "issued" })
    .eq("certificate_id", certificateId);

  if (error) return { error: error.message };

  await supabase.from("certificate_audit").insert({
    certificate_id: certificateId,
    action: "reissued",
    performed_by: profile.id,
    note,
  });

  return { success: "Certificate reissued." };
}

// ---------------------------------------------------------------------------
// Admin: Manually issue certificate (with override)
// ---------------------------------------------------------------------------
export async function manuallyIssueCertificate(
  studentProfileId: string,
  note: string,
): Promise<{ error?: string; success?: string }> {
  if (!hasValidSupabaseConfig()) return { error: "Supabase not configured" };
  const { profile } = await getCurrentUserAndProfile();
  if (!profile || profile.role !== "admin")
    return { error: "Not authorized" };

  const supabase = await createClient();

  // Get student
  const { data: student } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", studentProfileId)
    .maybeSingle();

  if (!student) return { error: "Student not found" };

  const studentName =
    [student.first_name, student.last_name].filter(Boolean).join(" ") ||
    student.preferred_name ||
    "Student";

  const certId = generateCertificateId();

  const { error } = await supabase.from("certificates").insert({
    profile_id: studentProfileId,
    certificate_id: certId,
    student_name: studentName,
    course_name: "RISE USA: Roadmap to Income, Savings, and Equity",
    status: "issued",
  });

  if (error) return { error: error.message };

  await supabase.from("certificate_audit").insert({
    certificate_id: certId,
    action: "manually_issued",
    performed_by: profile.id,
    note: `Admin override: ${note}`,
  });

  return { success: "Certificate manually issued." };
}
