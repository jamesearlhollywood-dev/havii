import { redirect } from "next/navigation";
import { getCurrentUserAndProfile } from "@/lib/profile";
import { createClient } from "@/lib/supabase/server";
import { AppShell } from "@/components/layout/AppShell";
import { GoalsWidget } from "@/components/dashboards/youth/GoalsWidget";
import type { Goal } from "@/lib/types";
import { Card, CardTitle } from "@/components/ui/Card";

export const dynamic = "force-dynamic";

export const metadata = { title: "My Goals" };

export default async function GoalsPage() {
  const { user, profile } = await getCurrentUserAndProfile();
  if (!user) redirect("/auth/login?next=/dashboard/goals");
  if (!profile || !profile.onboarding_completed) redirect("/onboarding");

  const supabase = await createClient();
  const { data: goals } = await supabase
    .from("goals")
    .select("*")
    .eq("profile_id", profile.id)
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <AppShell profile={profile}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-havii-ink">
            My Goals
          </h1>
          <p className="mt-1 text-sm text-havii-muted">
            Set goals and track your progress — one step at a time.
          </p>
        </div>

        <Card>
          <CardTitle className="mb-4 text-lg">Add a new goal</CardTitle>
          <GoalsWidget goals={(goals as Goal[]) ?? []} />
        </Card>

        {(goals as Goal[])?.length > 0 ? (
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-havii-ink">All goals</h2>
            {(goals as Goal[]).map((goal) => (
              <Card key={goal.id}>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <h3 className="text-base font-semibold text-havii-ink">
                      {goal.title}
                    </h3>
                    {goal.description ? (
                      <p className="mt-1 text-sm text-havii-muted">{goal.description}</p>
                    ) : null}
                    {goal.target_date ? (
                      <p className="mt-1 text-xs text-havii-muted">
                        Target: {new Date(goal.target_date).toLocaleDateString()}
                      </p>
                    ) : null}
                  </div>
                  <span className="text-sm font-semibold text-havii-teal-dark">
                    {goal.progress}%
                  </span>
                </div>
              </Card>
            ))}
          </div>
        ) : null}
      </div>
    </AppShell>
  );
}
