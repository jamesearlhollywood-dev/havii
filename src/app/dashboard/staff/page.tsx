import { redirect } from "next/navigation";
import { getCurrentUserAndProfile } from "@/lib/profile";
import { dashboardPathForRole } from "@/lib/roles";

export const dynamic = "force-dynamic";

export default async function OldStaffRoutePage() {
  const { user, profile } = await getCurrentUserAndProfile();
  if (!user || !profile) redirect("/auth/login");
  redirect(dashboardPathForRole(profile.role));
}
