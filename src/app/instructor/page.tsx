import { redirect } from "next/navigation";
import { getCurrentUserAndProfile } from "@/lib/profile";
import { hasValidSupabaseConfig } from "@/lib/supabase/server";
import { AppShell } from "@/components/layout/AppShell";
import { Card, CardDescription } from "@/components/ui/Card";
import { modules, TOTAL_LESSONS } from "@/data/course";
import { displayName } from "@/lib/utils";
import { canAccessInstructorRoutes } from "@/lib/roles";
import { InstructorProgressDashboard } from "@/components/instructor/InstructorProgressDashboard";
import {
  DEMO_INSTRUCTOR_PROFILE,
  DEMO_COHORT_STUDENTS,
  DEMO_COHORTS,
  DEMO_ADMIN_SETTINGS,
} from "@/data/demo-data";
import type { Profile, StudentProgressSummary } from "@/lib/types";
import { fetchNotificationData } from "@/lib/notification-helpers";
import { getActiveAnnouncements } from "@/actions/announcements";

export const dynamic = "force-dynamic";
export const metadata = { title: "Instructor Dashboard" };

export default async function InstructorPage() {
  const supabaseConnected = hasValidSupabaseConfig();

  let profile: Profile;
  let students: StudentProgressSummary[];
  let cohorts: { id: string; name: string }[];
  let stalledThreshold: number;

  if (supabaseConnected) {
    const { user, profile: userProfile } = await getCurrentUserAndProfile();
    if (!user) redirect("/auth/login?next=/instructor");
    if (!userProfile) redirect("/onboarding");
    if (!userProfile.onboarding_completed) redirect("/onboarding");
    if (!canAccessInstructorRoutes(userProfile.role)) redirect("/forbidden");
    profile = userProfile;

    // Real data fetching would go here — for now, use empty arrays
    // since Supabase isn't connected. The demo fallback below handles
    // the case where Supabase isn't configured.
    students = [];
    cohorts = [];
    stalledThreshold = 14;
  } else {
    profile = DEMO_INSTRUCTOR_PROFILE;
    students = DEMO_COHORT_STUDENTS;
    cohorts = DEMO_COHORTS.map((c) => ({ id: c.id, name: c.name }));
    stalledThreshold = DEMO_ADMIN_SETTINGS.stalled_threshold_days;
  }

  // Stats
  const totalStudents = students.length;
  const activeStudents = students.filter((s) => s.lessons_completed > 0 && !s.is_stalled && s.enrollment_status !== "completed" && s.enrollment_status !== "withdrawn").length;
  const stalledStudents = students.filter((s) => s.is_stalled).length;
  const completedStudents = students.filter((s) => s.has_certificate || s.enrollment_status === "completed").length;

  const { notifications, unreadCount } = await fetchNotificationData();
  const activeAnnouncements = await getActiveAnnouncements();

  return (
    <AppShell profile={profile} notifications={notifications} unreadCount={unreadCount}>
      <div className="mx-auto max-w-7xl px-4 py-8">
        <h1 className="mb-6 text-3xl font-bold text-rise-navy">Instructor Dashboard</h1>

        {/* Stats */}
        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <p className="text-sm text-rise-muted">Total Students</p>
            <p className="mt-1 text-2xl font-bold text-rise-navy">{totalStudents}</p>
          </Card>
          <Card>
            <p className="text-sm text-rise-muted">Active</p>
            <p className="mt-1 text-2xl font-bold text-rise-navy">{activeStudents}</p>
          </Card>
          <Card>
            <p className="text-sm text-rise-muted">Stalled ({stalledThreshold}+ days)</p>
            <p className="mt-1 text-2xl font-bold text-rise-warning">{stalledStudents}</p>
          </Card>
          <Card>
            <p className="text-sm text-rise-muted">Completed</p>
            <p className="mt-1 text-2xl font-bold text-rise-success">{completedStudents}</p>
          </Card>
        </div>

        {/* Progress monitoring */}
        <h2 className="mb-4 text-xl font-bold text-rise-navy">Student Progress Monitoring</h2>
        {students.length > 0 ? (
          <InstructorProgressDashboard
            students={students}
            cohorts={cohorts}
            stalledThreshold={stalledThreshold}
          />
        ) : (
          <Card>
            <CardDescription>
              No students enrolled yet. When students are enrolled in your cohorts,
              their progress will appear here with stalled detection, quiz scores,
              and completion tracking.
            </CardDescription>
          </Card>
        )}
      </div>
    </AppShell>
  );
}
