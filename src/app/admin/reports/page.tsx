import { redirect } from "next/navigation";
import { getCurrentUserAndProfile } from "@/lib/profile";
import { hasValidSupabaseConfig } from "@/lib/supabase/server";
import { AppShell } from "@/components/layout/AppShell";
import { canAccessAdminRoutes } from "@/lib/roles";
import {
  DEMO_ADMIN_PROFILE,
  DEMO_ORGANIZATIONS,
  DEMO_COHORTS,
  DEMO_COHORT_STUDENTS,
  DEMO_CERTIFICATES,
} from "@/data/demo-data";
import { DEMO_MODULE_PERFORMANCE_DATA } from "@/data/analytics-demo-data";
import type { Profile } from "@/lib/types";
import { computeModulePerformance, computeConfidenceAnalysis } from "@/lib/analytics-utils";
import { CohortOutcomesReport } from "@/components/analytics/CohortOutcomesReport";
import { PrintButton } from "@/components/ui/PrintButton";
import { Alert } from "@/components/ui/Alert";
import {
  ExportEnrollmentButton,
  ExportProgressButton,
  ExportModuleCompletionButton,
  ExportAssessmentResultsButton,
  ExportKnowledgeCheckButton,
  ExportConfidenceButton,
  ExportCohortOutcomesButton,
} from "@/components/analytics/AnalyticsCsvExport";
import { fetchNotificationData } from "@/lib/notification-helpers";
import Link from "next/link";

export const dynamic = "force-dynamic";
export const metadata = { title: "Reports" };

export default async function AdminReportsPage() {
  const supabaseConnected = hasValidSupabaseConfig();

  let profile: Profile;

  if (supabaseConnected) {
    const { user, profile: userProfile } = await getCurrentUserAndProfile();
    if (!user) redirect("/auth/login?next=/admin/reports");
    if (!userProfile) redirect("/onboarding");
    if (!userProfile.onboarding_completed) redirect("/onboarding");
    if (!canAccessAdminRoutes(userProfile.role)) redirect("/forbidden");
    profile = userProfile;
  } else {
    profile = DEMO_ADMIN_PROFILE;
  }

  const students = DEMO_COHORT_STUDENTS;
  const modulePerformance = computeModulePerformance(students, DEMO_MODULE_PERFORMANCE_DATA);
  const confidenceAnalysis = computeConfidenceAnalysis(
    [],
    [],
    "system",
    "System-Wide"
  );

  // Build cohort outcomes report data
  const cohortName = "Fall 2025 — Period 3";
  const orgName = "Lincoln High School";
  const cohortStudents = students.filter((s) => s.cohort_name === cohortName);

  const { notifications, unreadCount } = await fetchNotificationData();

  return (
    <AppShell profile={profile} notifications={notifications} unreadCount={unreadCount}>
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-rise-navy">Downloadable Reports</h1>
            <p className="mt-1 text-sm text-rise-muted">Export data and generate printable reports</p>
          </div>
          <Link
            href="/admin/analytics"
            className="rounded-lg border border-rise-border bg-white px-4 py-2 text-sm font-semibold text-rise-navy hover:bg-rise-sky"
          >
            ← Back to Analytics
          </Link>
        </div>

        {/* CSV Exports */}
        <h2 className="mb-3 text-xl font-bold text-rise-navy">CSV Exports</h2>
        <p className="mb-4 text-sm text-rise-muted">
          Download structured data for external analysis, funder reporting, and record-keeping.
        </p>
        <div className="mb-8 flex flex-wrap gap-3">
          <ExportEnrollmentButton students={students} />
          <ExportProgressButton students={students} />
          <ExportModuleCompletionButton students={students} />
          <ExportAssessmentResultsButton students={students} />
          <ExportKnowledgeCheckButton modules={modulePerformance} />
          <ExportConfidenceButton analysis={confidenceAnalysis} />
          <ExportCohortOutcomesButton students={students} />
        </div>

        {/* Privacy notice */}
        <Alert tone="warning" className="mb-6">
          Reports exclude Social Security numbers, financial account information,
          passwords, private Financial Blueprint answers, and other sensitive information.
          Do not publicly rank students, schools, instructors, or organizations.
        </Alert>

        {/* Printable Cohort Outcomes Report */}
        <h2 className="mb-3 text-xl font-bold text-rise-navy">Printable Cohort Outcomes Report</h2>
        <div className="mb-4 flex gap-3">
          <PrintButton />
          <Link
            href="/admin/reports?anonymized=1"
            className="rounded-lg border border-rise-border bg-white px-4 py-2 text-sm font-semibold text-rise-navy hover:bg-rise-sky"
          >
            Anonymized Version
          </Link>
        </div>

        <CohortOutcomesReport
          organizationName={orgName}
          cohortName={cohortName}
          reportingPeriod="Sep 2025 – Jun 2026"
          students={cohortStudents}
          modulePerformance={modulePerformance}
          confidenceAnalysis={confidenceAnalysis}
        />

        {/* Anonymized report note */}
        <div className="mt-6">
          <Alert tone="info">
            <strong>Anonymized Reporting Mode:</strong> Available for funders and external stakeholders.
            Shows aggregated program outcomes without individual student names.
            If an anonymized cohort contains fewer than 5 students, student-level breakdowns are suppressed.
          </Alert>
        </div>
      </div>
    </AppShell>
  );
}
