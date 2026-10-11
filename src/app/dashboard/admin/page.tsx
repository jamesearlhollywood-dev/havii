import { redirect } from "next/navigation";
import { getCurrentUserAndProfile } from "@/lib/profile";
import { canAccessAdminRoutes } from "@/lib/roles";

export const dynamic = "force-dynamic";

export default async function OldAdminRoutePage() {
  const { user, profile } = await getCurrentUserAndProfile();
  if (!user || !profile) redirect("/auth/login");
  if (!canAccessAdminRoutes(profile.role)) redirect("/forbidden");
  redirect("/admin");
}
