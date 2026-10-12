"use server";

import { createClient } from "@/lib/supabase/server";
import { getCurrentUserAndProfile } from "@/lib/profile";
import { isAdministrator } from "@/lib/roles";
import { generateCertificateId } from "@/lib/utils";
import { checkCertificateEligibility, type StudentProgressData } from "@/lib/certificate-utils";
import { getStudentProgress } from "@/lib/profile";

// ---------------------------------------------------------------------------
// Helper: insert audit log entry
// ---------------------------------------------------------------------------
async function insertAuditEntry(
  supabase: Awaited<ReturnType<typeof createClient>>,
  certificateId: string,
  action: string,
  performedBy: string,
  note: string | null
) {
  await supabase.from("certificate_audit").insert({
    certificate_id: certificateId,
    action,
    performed_by: performedBy,
    note,
  });
}

// ---------------------------------------------------------------------------
// Revoke a certificate (admin only)
// ---------------------------------------------------------------------------
export async function revokeCertificate(
  certificateId: string,
  note: string
): Promise<{ error?: string; success?: string }> {
  const { profile } = await getCurrentUserAndProfile();
  if (!profile) return { error: "Not authenticated" };
  if (!isAdministrator(profile.role)) return { error: "Only administrators can revoke certificates" };

  const supabase = await createClient();

  const { error } = await supabase
    .from("certificates")
    .update({ status: "revoked" })
    .eq("certificate_id", certificateId);

  if (error) return { error: error.message };

  await insertAuditEntry(supabase, certificateId, "revoked", profile.id, note || null);

  return { success: `Certificate ${certificateId} has been revoked.` };
}

// ---------------------------------------------------------------------------
// Reissue a corrected certificate (admin only)
// ---------------------------------------------------------------------------
export async function reissueCertificate(
  certificateId: string,
  note: string
): Promise<{ error?: string; success?: string }> {
  const { profile } = await getCurrentUserAndProfile();
  if (!profile) return { error: "Not authenticated" };
  if (!isAdministrator(profile.role)) return { error: "Only administrators can reissue certificates" };

  const supabase = await createClient();

  const { error } = await supabase
    .from("certificates")
    .update({ status: "issued", issued_at: new Date().toISOString() })
    .eq("certificate_id", certificateId);

  if (error) return { error: error.message };

  await insertAuditEntry(supabase, certificateId, "reissued", profile.id, note || null);

  return { success: `Certificate ${certificateId} has been reissued.` };
}

// ---------------------------------------------------------------------------
// Manually issue a certificate with admin override (admin only)
// ---------------------------------------------------------------------------
export async function manuallyIssueCertificate(
  profileId: string,
  note: string
): Promise<{ error?: string; success?: string }> {
  const { profile: adminProfile } = await getCurrentUserAndProfile();
  if (!adminProfile) return { error: "Not authenticated" };
  if (!isAdministrator(adminProfile.role)) return { error: "Only administrators can manually issue certificates" };

  const supabase = await createClient();

  // Check if certificate already exists
  const { data: existing } = await supabase
    .from("certificates")
    .select("*")
    .eq("profile_id", profileId)
    .eq("status", "issued")
    .maybeSingle();

  if (existing) return { error: "An active certificate already exists for this student." };

  // Get student profile
  const { data: studentProfile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", profileId)
    .maybeSingle();

  if (!studentProfile) return { error: "Student profile not found" };

  // Get student progress to check eligibility (informational only — admin override)
  const progress = await getStudentProgress(profileId);
  const progressData: StudentProgressData = {
    moduleProgress: progress.moduleProgress as any,
    lessonProgress: progress.lessonProgress as any,
    decisionLabs: progress.decisionLabs as any,
    blueprintSections: progress.blueprintSections as any,
    finalAttempts: progress.finalAttempts as any,
  };
  const eligibility = checkCertificateEligibility(progressData);

  const studentName = [studentProfile.first_name, studentProfile.last_name]
    .filter(Boolean)
    .join(" ") || studentProfile.preferred_name || "Student";

  // Look up enrollment for org/cohort/instructor info
  const { data: enrollment } = await supabase
    .from("enrollments")
    .select("*, cohorts(*), organizations(*)")
    .eq("student_profile_id", profileId)
    .maybeSingle();

  let orgName: string | null = null;
  let cohortName: string | null = null;
  let instructorName: string | null = null;

  if (enrollment) {
    orgName = enrollment.organizations?.name ?? null;
    cohortName = enrollment.cohorts?.name ?? null;
    if (enrollment.assigned_instructor_id) {
      const { data: instructor } = await supabase
        .from("profiles")
        .select("first_name, last_name, preferred_name")
        .eq("id", enrollment.assigned_instructor_id)
        .maybeSingle();
      if (instructor) {
        instructorName = [instructor.first_name, instructor.last_name].filter(Boolean).join(" ") || instructor.preferred_name || null;
      }
    }
  }

  const certId = generateCertificateId();

  const { error } = await supabase.from("certificates").insert({
    profile_id: profileId,
    certificate_id: certId,
    student_name: studentName,
    course_name: "RISE USA: Roadmap to Income, Savings, and Equity",
    status: "issued",
    organization_name: orgName,
    cohort_name: cohortName,
    instructor_name: instructorName,
  });

  if (error) return { error: error.message };

  // Update enrollment status to completed
  await supabase
    .from("enrollments")
    .update({
      status: "completed",
      actual_completion_date: new Date().toISOString(),
      certificate_status: "issued",
    })
    .eq("student_profile_id", profileId);

  const auditNote = eligibility.eligible
    ? note || "Manually issued by admin (student met all requirements)"
    : `ADMIN OVERRIDE — ${note || "Manually issued despite incomplete requirements"}. Unmet: ${eligibility.reasons.join("; ")}`;

  await insertAuditEntry(supabase, certId, "manually_issued", adminProfile.id, auditNote);

  return { success: `Certificate ${certId} has been issued for ${studentName}.` };
}
