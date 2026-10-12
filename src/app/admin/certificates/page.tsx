import { redirect } from "next/navigation";
import { getCurrentUserAndProfile } from "@/lib/profile";
import { hasValidSupabaseConfig } from "@/lib/supabase/server";
import { AppShell } from "@/components/layout/AppShell";
import { CertificateManager } from "@/components/admin/CertificateManager";
import { canAccessAdminRoutes } from "@/lib/roles";
import { DEMO_ADMIN_PROFILE, DEMO_CERTIFICATES, DEMO_CERTIFICATE_AUDIT, DEMO_COHORT_STUDENTS } from "@/data/demo-data";
import type { Profile } from "@/lib/types";

export const dynamic = "force-dynamic";
export const metadata = { title: "Certificate Management" };

export default async function AdminCertificatesPage() {
  const supabaseConnected = hasValidSupabaseConfig();

  let profile: Profile;

  if (supabaseConnected) {
    const { user, profile: userProfile } = await getCurrentUserAndProfile();
    if (!user) redirect("/auth/login?next=/admin/certificates");
    if (!userProfile) redirect("/onboarding");
    if (!userProfile.onboarding_completed) redirect("/onboarding");
    if (!canAccessAdminRoutes(userProfile.role)) redirect("/forbidden");
    profile = userProfile;
  } else {
    profile = DEMO_ADMIN_PROFILE;
  }

  // Students eligible for manual certificate issue (demo data)
  const eligibleStudents = DEMO_COHORT_STUDENTS
    .filter((s) => s.enrollment_status !== "withdrawn" && s.enrollment_status !== "invited")
    .map((s) => ({
      profile_id: s.profile_id,
      student_name: s.student_name,
      organization_name: s.organization_name,
      cohort_name: s.cohort_name,
      eligible_for_completion: s.eligible_for_completion,
    }));

  return (
    <AppShell profile={profile}>
      <CertificateManager
        certificates={DEMO_CERTIFICATES}
        auditLog={DEMO_CERTIFICATE_AUDIT}
        supabaseConnected={supabaseConnected}
        eligibleStudents={eligibleStudents}
      />
    </AppShell>
  );
}
