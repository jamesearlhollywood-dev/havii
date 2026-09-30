import { redirect } from "next/navigation";
import { getCurrentUserAndProfile } from "@/lib/profile";
import { createClient } from "@/lib/supabase/server";
import { AppShell } from "@/components/layout/AppShell";
import { JournalWidget } from "@/components/dashboards/youth/JournalWidget";
import type { JournalEntry } from "@/lib/types";
import { Card, CardTitle } from "@/components/ui/Card";

export const dynamic = "force-dynamic";

export const metadata = { title: "My Journal" };

export default async function JournalPage() {
  const { user, profile } = await getCurrentUserAndProfile();
  if (!user) redirect("/auth/login?next=/dashboard/journal");
  if (!profile || !profile.onboarding_completed) redirect("/onboarding");

  const supabase = await createClient();
  const { data: entries } = await supabase
    .from("journal_entries")
    .select("*")
    .eq("profile_id", profile.id)
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <AppShell profile={profile}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-havii-ink sm:text-3xl">
            My Journal
          </h1>
          <p className="mt-1 text-sm text-havii-muted">
            🔒 Your journal is private. Only you can see your entries.
          </p>
        </div>

        <Card>
          <CardTitle className="mb-4">Write a new entry</CardTitle>
          <JournalWidget entries={(entries as JournalEntry[]) ?? []} />
        </Card>

        {(entries as JournalEntry[])?.length > 0 ? (
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-havii-ink">All entries</h2>
            {(entries as JournalEntry[]).map((entry) => (
              <Card key={entry.id} id={entry.id}>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-base font-semibold text-havii-ink">
                      {entry.title || "Untitled entry"}
                    </h3>
                    <p className="mt-1 text-xs text-havii-muted">
                      {new Date(entry.created_at).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
                <p className="mt-3 whitespace-pre-wrap text-sm text-havii-ink">
                  {entry.body}
                </p>
              </Card>
            ))}
          </div>
        ) : null}
      </div>
    </AppShell>
  );
}
