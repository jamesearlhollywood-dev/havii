import { redirect } from "next/navigation";
import { getCurrentUserAndProfile } from "@/lib/profile";
import { hasValidSupabaseConfig } from "@/lib/supabase/server";
import { AppShell } from "@/components/layout/AppShell";
import { CmsManager } from "@/components/cms/CmsManager";
import { modules } from "@/data/course";
import type { CmsModule, CmsLesson } from "@/data/cms-types";
import { canAccessAdminRoutes } from "@/lib/roles";
import { fullName } from "@/lib/utils";
import type { Profile } from "@/lib/types";

export const dynamic = "force-dynamic";
export const metadata = { title: "Content Management" };

// Convert static CourseModule to CmsModule format
function staticToCmsModule(mod: typeof modules[0], index: number): CmsModule {
  return {
    id: mod.id,
    number: mod.number,
    title: mod.title,
    subtitle: mod.subtitle,
    description: mod.overview,
    objectives: mod.objectives,
    estimatedTime: mod.estimatedTime,
    icon: mod.icon,
    themeColor: mod.themeColor,
    imageUrl: null,
    isPublished: true,
    prerequisiteModuleId: index > 0 ? modules[index - 1].id : null,
    requiredCompletionPct: 100,
    lessons: mod.lessons.map((l, li): CmsLesson => ({
      id: l.id,
      moduleId: mod.id,
      title: l.title,
      subtitle: l.subtitle,
      description: l.subtitle,
      objectives: [],
      estimatedMinutes: l.estimatedMinutes,
      sortOrder: li,
      isRequired: l.isRequired,
      isPublished: true,
      riseContentType: "learn_it",
      content: l.content,
      instructorNotes: null,
      studentInstructions: null,
      activities: [],
      createdAt: new Date("2025-01-01").toISOString(),
      updatedAt: new Date("2025-01-01").toISOString(),
      updatedBy: "RISE USA",
      status: "published",
    })),
    keyTerms: mod.keyTerms,
    realLifeScenario: mod.realLifeScenario,
    decisionLab: mod.decisionLab,
    workbookActivity: mod.workbookActivity,
    knowledgeCheck: mod.knowledgeCheck,
    reflection: mod.reflection,
    actionCommitment: mod.actionCommitment,
    blueprintUpdate: mod.blueprintUpdate,
    createdAt: new Date("2025-01-01").toISOString(),
    updatedAt: new Date("2025-01-01").toISOString(),
    updatedBy: "RISE USA",
    status: "published",
  };
}

// Fallback profile for demo mode when Supabase isn't connected
const DEMO_PROFILE: Profile = {
  id: "demo-admin",
  user_id: "demo-admin",
  first_name: "Admin",
  last_name: "User",
  preferred_name: "Admin",
  date_of_birth: null,
  role: "admin",
  pronouns: null,
  phone: null,
  city: null,
  state: null,
  profile_photo_url: null,
  onboarding_completed: true,
  account_status: "active",
  organization_id: null,
  created_at: "2025-01-01T00:00:00.000Z",
  updated_at: "2025-01-01T00:00:00.000Z",
};

export default async function CmsPage() {
  const supabaseConnected = hasValidSupabaseConfig();

  let profile: Profile;

  if (supabaseConnected) {
    const { user, profile: userProfile } = await getCurrentUserAndProfile();
    if (!user) redirect("/auth/login?next=/admin/cms");
    if (!userProfile) redirect("/onboarding");
    if (!userProfile.onboarding_completed) redirect("/onboarding");
    if (!canAccessAdminRoutes(userProfile.role)) redirect("/forbidden");
    profile = userProfile;
  } else {
    // Demo mode — Supabase not connected, show CMS with static data
    profile = DEMO_PROFILE;
  }

  // Use static data as the source. When Supabase CMS tables exist,
  // we'll load from the database and fall back to static data.
  const cmsModules = modules.map(staticToCmsModule);

  const adminName = fullName(profile);

  return (
    <AppShell profile={profile}>
      <CmsManager
        initialModules={cmsModules}
        adminName={adminName}
        supabaseConnected={supabaseConnected}
      />
    </AppShell>
  );
}
