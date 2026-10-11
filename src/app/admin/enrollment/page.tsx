import { redirect } from "next/navigation";
import { getCurrentUserAndProfile } from "@/lib/profile";
import { hasValidSupabaseConfig } from "@/lib/supabase/server";
import { AppShell } from "@/components/layout/AppShell";
import { canAccessAdminRoutes } from "@/lib/roles";
import { EnrollmentManager } from "@/components/enrollment/EnrollmentManager";
import {
  DEMO_ADMIN_PROFILE,
  DEMO_ORGANIZATIONS,
  DEMO_COHORTS,
  DEMO_ENROLLMENT_CODES,
  DEMO_ENROLLMENTS,
  DEMO_COHORT_STUDENTS,
  DEMO_ADMIN_SETTINGS,
} from "@/data/demo-data";
import type { Profile } from "@/lib/types";

export const dynamic = "force-dynamic";
export const metadata = { title: "Enrollment Management" };

export default async function EnrollmentPage() {
  const supabaseConnected = hasValidSupabaseConfig();

  let profile: Profile;

  if (supabaseConnected) {
    const { user, profile: userProfile } = await getCurrentUserAndProfile();
    if (!user) redirect("/auth/login?next=/admin/enrollment");
    if (!userProfile) redirect("/onboarding");
    if (!userProfile.onboarding_completed) redirect("/onboarding");
    if (!canAccessAdminRoutes(userProfile.role)) redirect("/forbidden");
    profile = userProfile;
  } else {
    profile = DEMO_ADMIN_PROFILE;
  }

  return (
    <AppShell profile={profile}>
      <div className="mx-auto max-w-7xl px-4 py-8">
        <h1 className="mb-2 text-3xl font-bold text-rise-navy">Enrollment Management</h1>
        <p className="mb-6 text-rise-muted">
          Enroll students, manage enrollment codes, and oversee cohort access.
        </p>
        <EnrollmentManager
          organizations={DEMO_ORGANIZATIONS}
          cohorts={DEMO_COHORTS}
          enrollmentCodes={DEMO_ENROLLMENT_CODES}
          enrollments={DEMO_ENROLLMENTS}
          students={DEMO_COHORT_STUDENTS}
          adminSettings={DEMO_ADMIN_SETTINGS}
          supabaseConnected={supabaseConnected}
        />
      </div>
    </AppShell>
  );
}
