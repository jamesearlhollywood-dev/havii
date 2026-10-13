import { redirect } from "next/navigation";
import { getCurrentUserAndProfile } from "@/lib/profile";
import { hasValidSupabaseConfig } from "@/lib/supabase/server";
import { dashboardPathForRole } from "@/lib/roles";

export const dynamic = "force-dynamic";

export default async function OldStaffRoutePage() {
  if (!hasValidSupabaseConfig()) redirect("/dashboard");
  const { user, profile } = await getCurrentUserAndProfile();
  if (!user || !profile) redirect("/auth/login");
  redirect(dashboardPathForRole(profile.role));
}
