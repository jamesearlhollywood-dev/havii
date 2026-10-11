import { redirect } from "next/navigation";
import { getCurrentUserAndProfile } from "@/lib/profile";
import { hasValidSupabaseConfig } from "@/lib/supabase/server";
import { AppShell } from "@/components/layout/AppShell";
import { CertificateManager } from "@/components/admin/CertificateManager";
import { canAccessAdminRoutes } from "@/lib/roles";
import { DEMO_ADMIN_PROFILE, DEMO_CERTIFICATES, DEMO_CERTIFICATE_AUDIT } from "@/data/demo-data";
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

  return (
    <AppShell profile={profile}>
      <CertificateManager
        certificates={DEMO_CERTIFICATES}
        auditLog={DEMO_CERTIFICATE_AUDIT}
        supabaseConnected={supabaseConnected}
      />
    </AppShell>
  );
}
