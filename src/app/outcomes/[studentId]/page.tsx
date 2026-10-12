import { redirect } from "next/navigation";
import { getCurrentUserAndProfile } from "@/lib/profile";
import { hasValidSupabaseConfig } from "@/lib/supabase/server";
import { AppShell } from "@/components/layout/AppShell";
import { canAccessStaffRoutes } from "@/lib/roles";
import {
  DEMO_INSTRUCTOR_PROFILE,
  DEMO_ADMIN_PROFILE,
} from "@/data/demo-data";
import type { Profile } from "@/lib/types";
import { StudentOutcomesProfileView } from "@/components/analytics/StudentOutcomesProfile";
import { getStudentOutcomesProfile } from "@/actions/analytics";
import { fetchNotificationData } from "@/lib/notification-helpers";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ studentId: string }>;
}) {
  const { studentId } = await params;
  const student = await getStudentOutcomesProfile(studentId);
  return { title: student ? `Outcomes: ${student.student_name}` : "Student Outcomes" };
}

export default async function StudentOutcomesPage({
  params,
}: {
  params: Promise<{ studentId: string }>;
}) {
  const { studentId } = await params;
  const supabaseConnected = hasValidSupabaseConfig();

  let profile: Profile;
  let staffRole: string;

  if (supabaseConnected) {
    const { user, profile: userProfile } = await getCurrentUserAndProfile();
    if (!user) redirect("/auth/login");
    if (!userProfile) redirect("/onboarding");
    if (!userProfile.onboarding_completed) redirect("/onboarding");
    if (!canAccessStaffRoutes(userProfile.role)) redirect("/forbidden");
    profile = userProfile;
    staffRole = userProfile.role;
  } else {
    profile = DEMO_INSTRUCTOR_PROFILE;
    staffRole = "instructor";
  }

  const student = await getStudentOutcomesProfile(studentId);
  if (!student) {
    redirect(staffRole === "admin" ? "/admin/analytics" : "/instructor/analytics");
  }

  const backHref = staffRole === "admin" ? "/admin/analytics" : "/instructor/analytics";
  const { notifications, unreadCount } = await fetchNotificationData();

  return (
    <AppShell profile={profile} notifications={notifications} unreadCount={unreadCount}>
      <div className="mx-auto max-w-4xl px-4 py-8">
        <StudentOutcomesProfileView student={student} backHref={backHref} />
      </div>
    </AppShell>
  );
}
