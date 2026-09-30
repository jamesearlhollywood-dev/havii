import { redirect } from "next/navigation";
import { getCurrentUserAndProfile } from "@/lib/profile";
import { createClient } from "@/lib/supabase/server";
import { AppShell } from "@/components/layout/AppShell";
import { Card, CardDescription, CardTitle, ComingNextBadge } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import type { SessionInfo } from "@/lib/types";

export const dynamic = "force-dynamic";

export const metadata = { title: "My Group" };

type EnrollmentWithCohort = {
  cohort_id: string;
  status: string;
  cohort: {
    id: string;
    name: string;
    starts_on: string | null;
    ends_on: string | null;
    program: {
      name: string;
      description: string | null;
    } | null;
  };
};

type Resource = {
  id: string;
  title: string;
  description: string | null;
  url: string | null;
};

export default async function GroupPage() {
  const { user, profile } = await getCurrentUserAndProfile();
  if (!user) redirect("/auth/login?next=/dashboard/group");
  if (!profile || !profile.onboarding_completed) redirect("/onboarding");

  const supabase = await createClient();

  // Fetch enrollments with cohort and program info
  const { data: enrollmentsData } = await supabase
    .from("enrollments")
    .select(
      "cohort_id, status, cohort:cohorts(id, name, starts_on, ends_on, program:programs(name, description))"
    )
    .eq("profile_id", profile.id)
    .eq("status", "enrolled");

  const enrollments = (enrollmentsData as unknown as EnrollmentWithCohort[]) ?? [];

  // Fetch upcoming sessions for enrolled cohorts
  const cohortIds = enrollments.map((e) => e.cohort_id);
  let sessions: SessionInfo[] = [];
  if (cohortIds.length > 0) {
    const { data: sessionsData } = await supabase
      .from("sessions")
      .select("id, cohort_id, title, starts_at, ends_at, location")
      .in("cohort_id", cohortIds)
      .gte("starts_at", new Date().toISOString())
      .order("starts_at", { ascending: true })
      .limit(10);
    sessions = (sessionsData as SessionInfo[]) ?? [];
  }

  // Fetch published youth resources (workbook)
  const { data: resourcesData } = await supabase
    .from("resources")
    .select("id, title, description, url")
    .eq("published", true);
  const resources = (resourcesData as Resource[]) ?? [];

  const nextSession = sessions[0] ?? null;

  return (
    <AppShell profile={profile}>
      <div className="space-y-5">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-havii-ink">
            My Group
          </h1>
          <p className="mt-1 text-sm text-havii-muted">
            Your cohort, sessions, and program resources.
          </p>
        </div>

        {enrollments.length === 0 ? (
          /* Empty state for users without a group */
          <Card className="border-havii-mist bg-havii-sand/40">
            <CardTitle className="text-lg">No group yet</CardTitle>
            <CardDescription className="mt-2">
              You&apos;re not enrolled in a cohort yet. Your mentor or HAVII staff
              will assign you to a group when one is available. Check back soon!
            </CardDescription>
            <div className="mt-4">
              <Link href="/dashboard">
                <Button size="sm" variant="outline">Back to home</Button>
              </Link>
            </div>
          </Card>
        ) : (
          <>
            {/* Cohort info */}
            {enrollments.map((enrollment) => (
              <Card key={enrollment.cohort_id}>
                <CardTitle className="text-lg">{enrollment.cohort?.name}</CardTitle>
                {enrollment.cohort?.program?.name ? (
                  <p className="mt-1 text-sm font-medium text-havii-teal">
                    {enrollment.cohort.program.name}
                  </p>
                ) : null}
                {enrollment.cohort?.program?.description ? (
                  <CardDescription className="mt-2">
                    {enrollment.cohort.program.description}
                  </CardDescription>
                ) : null}
                {enrollment.cohort?.starts_on && enrollment.cohort?.ends_on ? (
                  <p className="mt-3 text-xs text-havii-muted">
                    {new Date(enrollment.cohort.starts_on).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                    {" — "}
                    {new Date(enrollment.cohort.ends_on).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                  </p>
                ) : null}
              </Card>
            ))}

            {/* Next meeting */}
            {nextSession ? (
              <Card className="border-havii-teal/30 bg-gradient-to-br from-white to-havii-teal/5">
                <CardTitle className="text-base">Next Meeting</CardTitle>
                <div className="mt-3 space-y-1">
                  <p className="text-base font-semibold text-havii-ink">
                    {nextSession.title}
                  </p>
                  {nextSession.starts_at ? (
                    <p className="text-sm text-havii-muted">
                      {new Date(nextSession.starts_at).toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}
                      {" at "}
                      {new Date(nextSession.starts_at).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })}
                    </p>
                  ) : null}
                  {nextSession.location ? (
                    <p className="text-sm text-havii-muted">📍 {nextSession.location}</p>
                  ) : null}
                </div>
              </Card>
            ) : (
              <Card>
                <CardTitle className="text-base">No upcoming meetings</CardTitle>
                <CardDescription className="mt-2">
                  There are no scheduled sessions right now. New sessions will appear here once they&apos;re added.
                </CardDescription>
              </Card>
            )}

            {/* All upcoming sessions */}
            {sessions.length > 1 ? (
              <div className="space-y-3">
                <h2 className="text-lg font-semibold text-havii-ink">All Sessions</h2>
                {sessions.map((session) => (
                  <Card key={session.id}>
                    <p className="text-sm font-medium text-havii-ink">{session.title}</p>
                    {session.starts_at ? (
                      <p className="mt-1 text-xs text-havii-muted">
                        {new Date(session.starts_at).toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })}
                        {" at "}
                        {new Date(session.starts_at).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })}
                      </p>
                    ) : null}
                    {session.location ? (
                      <p className="mt-0.5 text-xs text-havii-muted">📍 {session.location}</p>
                    ) : null}
                  </Card>
                ))}
              </div>
            ) : null}

            {/* Workbook / Resources */}
            {resources.length > 0 ? (
              <div className="space-y-3">
                <h2 className="text-lg font-semibold text-havii-ink">Workbook & Resources</h2>
                {resources.map((resource) => (
                  <Card key={resource.id}>
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">📘</span>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-havii-ink">{resource.title}</p>
                        {resource.description ? (
                          <p className="mt-1 text-xs text-havii-muted">{resource.description}</p>
                        ) : null}
                        {resource.url ? (
                          <a
                            href={resource.url}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-2 inline-block text-sm font-medium text-havii-teal hover:underline"
                          >
                            Open resource →
                          </a>
                        ) : null}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : null}
          </>
        )}

        {/* Mentor matching — always shown for youth */}
        <Card>
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-lg">Find a mentor</CardTitle>
            <ComingNextBadge />
          </div>
          <CardDescription className="mt-2">
            Mentor matching opens soon. We&apos;ll never show fake mentors — real connections only.
          </CardDescription>
        </Card>
      </div>
    </AppShell>
  );
}
