import { redirect } from "next/navigation";
import { getCurrentUserAndProfile } from "@/lib/profile";
import { canAccessAdminRoutes } from "@/lib/roles";
import { AppShell } from "@/components/layout/AppShell";
import { AdminDashboard } from "@/components/dashboards/DashboardCards";

export const dynamic = "force-dynamic";

export const metadata = { title: "Admin" };

export default async function AdminRoutePage() {
  const { user, profile } = await getCurrentUserAndProfile();
  if (!user || !profile) redirect("/auth/login");
  if (!canAccessAdminRoutes(profile.role)) redirect("/forbidden");
  return (
    <AppShell profile={profile}>
      <AdminDashboard profile={profile} />
    </AppShell>
  );
}
