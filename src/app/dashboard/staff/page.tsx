import { redirect } from "next/navigation";
import { getCurrentUserAndProfile } from "@/lib/profile";
import { canAccessStaffRoutes } from "@/lib/roles";
import { AppShell } from "@/components/layout/AppShell";
import { StaffDashboard } from "@/components/dashboards/DashboardCards";

export const dynamic = "force-dynamic";

export const metadata = { title: "Staff" };

export default async function StaffRoutePage() {
  const { user, profile } = await getCurrentUserAndProfile();
  if (!user || !profile) redirect("/auth/login");
  if (!canAccessStaffRoutes(profile.role)) redirect("/forbidden");
  return (
    <AppShell profile={profile}>
      <StaffDashboard profile={profile} />
    </AppShell>
  );
}
