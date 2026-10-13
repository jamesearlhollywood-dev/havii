import { redirect } from "next/navigation";
import { getCurrentUserAndProfile } from "@/lib/profile";
import { hasValidSupabaseConfig } from "@/lib/supabase/server";
import { canAccessAdminRoutes } from "@/lib/roles";

export const dynamic = "force-dynamic";

export default async function OldAdminRoutePage() {
  if (!hasValidSupabaseConfig()) redirect("/admin");
  const { user, profile } = await getCurrentUserAndProfile();
  if (!user || !profile) redirect("/auth/login");
  if (!canAccessAdminRoutes(profile.role)) redirect("/forbidden");
  redirect("/admin");
}
