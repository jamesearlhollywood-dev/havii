import { redirect } from "next/navigation";
import { getCurrentUserAndProfile } from "@/lib/profile";
import { hasValidSupabaseConfig } from "@/lib/supabase/server";
import { AppShell } from "@/components/layout/AppShell";
import { canAccessOrgManagerRoutes } from "@/lib/roles";
import { StudentRecordView } from "@/components/records/StudentRecordView";
import {
  DEMO_ORG_MANAGER_PROFILE,
  DEMO_ORGANIZATIONS,
  DEMO_COHORT_STUDENTS,
  DEMO_COHORTS,
  DEMO_ENROLLMENTS,
  DEMO_CERTIFICATES,
  DEMO_STUDENT_RECORD_DETAILS,
} from "@/data/demo-data";
import type { Profile } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ studentId: string }>;
}) {
  const { studentId } = await params;
  const student = DEMO_COHORT_STUDENTS.find((s) => s.profile_id === studentId);
  return { title: student ? `Record: ${student.student_name}` : "Student Record" };
}

export default async function OrgManagerStudentRecordPage({
  params,
}: {
  params: Promise<{ studentId: string }>;
}) {
  const { studentId } = await params;
  const supabaseConnected = hasValidSupabaseConfig();

  let profile: Profile;

  if (supabaseConnected) {
    const { user, profile: userProfile } = await getCurrentUserAndProfile();
    if (!user) redirect("/auth/login");
    if (!userProfile) redirect("/onboarding");
    if (!userProfile.onboarding_completed) redirect("/onboarding");
    if (!canAccessOrgManagerRoutes(userProfile.role)) redirect("/forbidden");
    profile = userProfile;
  } else {
    profile = DEMO_ORG_MANAGER_PROFILE;
  }

  // Org-scoping: only show students belonging to the org manager's organization
  const orgId = profile.organization_id;
  const orgCohorts = DEMO_COHORTS.filter((c) => c.organization_id === orgId);
  const orgStudentIds = DEMO_COHORT_STUDENTS.filter((s) =>
    orgCohorts.some((c) => c.name === s.cohort_name)
  ).map((s) => s.profile_id);

  // Server-side ownership validation: redirect if student is outside the org
  if (!orgStudentIds.includes(studentId)) redirect("/org-manager");

  const student = DEMO_COHORT_STUDENTS.find((s) => s.profile_id === studentId);
  if (!student) redirect("/org-manager");

  const enrollment = DEMO_ENROLLMENTS.find((e) => e.student_profile_id === studentId);
  const cohort = DEMO_COHORTS.find((c) => c.name === student.cohort_name);
  const certificate = DEMO_CERTIFICATES.find((c) => c.profile_id === studentId);
  const recordDetail = DEMO_STUDENT_RECORD_DETAILS.find((r) => r.profile_id === studentId);

  return (
    <AppShell profile={profile}>
      <StudentRecordView
        student={student}
        enrollment={enrollment}
        cohort={cohort}
        certificate={certificate}
        recordDetail={recordDetail}
        dashboardHref="/org-manager"
        dashboardLabel="Dashboard"
      />
    </AppShell>
  );
}
