import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUserAndProfile, getStudentProgress } from "@/lib/profile";
import { hasValidSupabaseConfig } from "@/lib/supabase/server";
import { AppShell } from "@/components/layout/AppShell";
import { Card, CardDescription, CardTitle } from "@/components/ui/Card";
import { modules, blueprintSections, TOTAL_LESSONS, PASSING_SCORE } from "@/data/course";
import { formatDate, fullName } from "@/lib/utils";
import { canAccessStaffRoutes } from "@/lib/roles";
import { PrintButton } from "@/components/ui/PrintButton";
import {
  DEMO_INSTRUCTOR_PROFILE,
  DEMO_COHORT_STUDENTS,
  DEMO_COHORTS,
  DEMO_ORGANIZATIONS,
  DEMO_ENROLLMENTS,
  DEMO_CERTIFICATES,
  DEMO_STUDENT_PROGRESS,
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

export default async function StudentRecordPage({
  params,
}: {
  params: Promise<{ studentId: string }>;
}) {
  const { studentId } = await params;
  const supabaseConnected = hasValidSupabaseConfig();

  let profile: Profile;
  let staffRole: string;

  if (supabaseConnected) {
    const { user, profile: userProfile } = await getCurrentUserAndProfile();
    if (!user) redirect("/auth/login");
    if (!userProfile) redirect("/onboarding");
    if (!userProfile.onboarding_completed) redirect("/onboarding");
    if (!canAccessStaffRoutes(userProfile.role)) redirect("/forbidden");
    profile = userProfile;
    staffRole = userProfile.role;
  } else {
    profile = DEMO_INSTRUCTOR_PROFILE;
    staffRole = "instructor";
  }

  // Find the student in demo data
  const student = DEMO_COHORT_STUDENTS.find((s) => s.profile_id === studentId);
  if (!student) redirect("/instructor");

  const enrollment = DEMO_ENROLLMENTS.find((e) => e.student_profile_id === studentId);
  const cohort = DEMO_COHORTS.find((c) => c.name === student.cohort_name);
  const org = DEMO_ORGANIZATIONS.find((o) => o.name === student.organization_name);
  const certificate = DEMO_CERTIFICATES.find((c) => c.profile_id === studentId);

  // Build module completion details
  const moduleDetails = modules.map((m) => {
    // For demo, infer completion from student summary
    const isComplete = student.modules_completed >= m.number;
    return {
      number: m.number,
      title: m.title.split("—")[0].trim(),
      icon: m.icon,
      completed: isComplete,
    };
  });

  return (
    <AppShell profile={profile}>
      <div className="mx-auto max-w-4xl px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-4 flex items-center gap-2 text-sm text-rise-muted">
          <Link href={staffRole === "admin" ? "/admin" : "/instructor"} className="hover:text-rise-navy">
            Dashboard
          </Link>
          <span>/</span>
          <span className="text-rise-navy">{student.student_name}</span>
        </div>

        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-rise-navy">Student Course Record</h1>
            <p className="mt-1 text-sm text-rise-muted">{student.student_name}</p>
          </div>
          <div className="flex gap-2">
            <PrintButton label="Print Record" />
          </div>
        </div>

        {/* Student info */}
        <Card className="mb-4">
          <CardTitle>Student Information</CardTitle>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <InfoRow label="Student" value={student.student_name} />
            <InfoRow label="Organization" value={student.organization_name} />
            <InfoRow label="Cohort" value={student.cohort_name} />
            <InfoRow label="Instructor" value={cohort?.instructor_name || "Unassigned"} />
            <InfoRow label="Enrollment Date" value={enrollment ? formatDate(enrollment.enrolled_at) : "—"} />
            <InfoRow label="Completion Date" value={student.has_certificate ? formatDate(daysAgoRef(5)) : "—"} />
          </div>
        </Card>

        {/* Overall progress */}
        <Card className="mb-4">
          <CardTitle>Overall Progress</CardTitle>
          <div className="mt-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-rise-muted">Course Progress</span>
              <span className="font-bold text-rise-navy">{student.overall_progress}%</span>
            </div>
            <div className="mt-1 h-3 overflow-hidden rounded-full bg-rise-border">
              <div
                className="h-full rounded-full bg-rise-blue"
                style={{ width: `${student.overall_progress}%` }}
              />
            </div>
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              <InfoRow label="Lessons Completed" value={`${student.lessons_completed}/${TOTAL_LESSONS}`} />
              <InfoRow label="Modules Completed" value={`${student.modules_completed}/6`} />
              <InfoRow label="Decision Labs" value={`${student.decision_labs_completed}/6`} />
              <InfoRow label="Blueprint Sections" value={`${student.blueprint_sections_completed}/6`} />
              <InfoRow label="Best Quiz Score" value={student.best_quiz_score !== null ? `${student.best_quiz_score}%` : "—"} />
              <InfoRow label="Quiz Passed" value={student.quiz_passed ? "Yes" : "No"} />
            </div>
          </div>
        </Card>

        {/* Module completion */}
        <Card className="mb-4">
          <CardTitle>Module Completion</CardTitle>
          <div className="mt-3 space-y-2">
            {moduleDetails.map((m) => (
              <div key={m.number} className="flex items-center gap-3 rounded-xl border border-rise-border p-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-rise-sky text-lg">{m.icon}</span>
                <div className="flex-1">
                  <p className="text-xs font-semibold uppercase tracking-wider text-rise-red">Module {m.number}</p>
                  <p className="text-sm text-rise-navy">{m.title}</p>
                </div>
                {m.completed ? (
                  <span className="rounded-full bg-rise-success-light px-3 py-1 text-xs font-semibold text-rise-success">✓ Complete</span>
                ) : (
                  <span className="rounded-full bg-rise-border px-3 py-1 text-xs font-medium text-rise-muted">Incomplete</span>
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* Final assessment & certificate */}
        <Card className="mb-4">
          <CardTitle>Final Assessment & Certificate</CardTitle>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <InfoRow label="Final Assessment" value={student.has_certificate ? "Passed" : "Not passed"} />
            <InfoRow label="Certificate ID" value={certificate?.certificate_id || "—"} />
            <InfoRow label="Certificate Status" value={certificate?.status || "Not issued"} />
            <InfoRow label="Completion Status" value={student.enrollment_status === "completed" ? "Completed" : "In Progress"} />
          </div>
        </Card>

        {/* Printable Course Completion Record */}
        <div className="mt-8 hidden print:block">
          <div className="rounded-2xl border-2 border-rise-navy bg-white p-8">
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-rise-navy text-lg font-bold text-white">
                R
              </div>
              <p className="mt-3 text-xs font-semibold uppercase tracking-[0.2em] text-rise-red">RISE USA</p>
              <p className="mt-1 text-xs uppercase tracking-wider text-rise-muted">
                Roadmap to Income, Savings, and Equity
              </p>
              <div className="mx-auto my-4 h-px w-32 bg-rise-border" />
              <p className="text-sm font-bold text-rise-navy">Course Completion Record</p>
              <p className="mt-4 text-sm text-rise-muted">This document certifies that</p>
              <p className="mt-2 text-xl font-bold text-rise-navy">{student.student_name}</p>
              <p className="mt-3 text-sm text-rise-muted">has completed all requirements of</p>
              <p className="mt-1 text-base font-semibold text-rise-navy">
                RISE USA: Roadmap to Income, Savings, and Equity
              </p>
            </div>

            <div className="mt-6 space-y-1">
              {moduleDetails.map((m) => (
                <div key={m.number} className="flex justify-between border-b border-rise-border py-1 text-sm">
                  <span className="text-rise-navy">Module {m.number}: {m.title}</span>
                  <span className="font-medium text-rise-success">{m.completed ? "✓ Completed" : "—"}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-between text-sm">
              <div>
                <p className="text-xs text-rise-muted">Total Course Status</p>
                <p className="font-medium text-rise-navy">{student.enrollment_status === "completed" ? "Completed" : "In Progress"}</p>
              </div>
              <div>
                <p className="text-xs text-rise-muted">Final Assessment</p>
                <p className="font-medium text-rise-navy">{student.has_certificate ? "Passed" : "Not passed"}</p>
              </div>
              <div>
                <p className="text-xs text-rise-muted">Certificate Number</p>
                <p className="font-mono text-rise-navy">{certificate?.certificate_id || "—"}</p>
              </div>
            </div>

            <p className="mt-6 text-center text-xs font-medium uppercase tracking-wider text-rise-blue">
              Build What Lasts
            </p>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-rise-muted">{label}</p>
      <p className="text-sm font-medium text-rise-navy">{value}</p>
    </div>
  );
}

// Helper to format a relative date for display
function daysAgoRef(days: number): string {
  return new Date(Date.now() - days * 86400000).toISOString();
}
