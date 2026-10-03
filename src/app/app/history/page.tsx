import { redirect } from "next/navigation";
import { getAccessLevel, getSession } from "@/lib/session";
import { query } from "@/lib/db";
import { Card } from "@/components/ui/Card";

const MOOD_LABELS: Record<string, { label: string; emoji: string }> = {
  great: { label: "Great", emoji: "😄" },
  good: { label: "Good", emoji: "🙂" },
  okay: { label: "Okay", emoji: "😐" },
  low: { label: "Low", emoji: "😕" },
  struggling: { label: "Struggling", emoji: "😞" },
};

type CheckInRow = {
  id: string;
  mood: string;
  note: string | null;
  check_in_date: string;
};

export default async function HistoryPage() {
  const { level, profile } = await getAccessLevel();
  if (level !== "full" || !profile) redirect("/app/restricted");

  const session = await getSession();
  if (!session) redirect("/auth/login");

  const { rows } = await query<CheckInRow>(
    `SELECT id, mood, note, check_in_date::text
     FROM check_ins
     WHERE user_id = $1
     ORDER BY check_in_date DESC`,
    [session.userId]
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-havii-ink">Check-In History</h1>

      {rows.length === 0 ? (
        <Card>
          <p className="text-sm text-havii-muted">
            You haven&apos;t checked in yet. Your daily check-ins will appear here.
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {rows.map((row) => {
            const mood = MOOD_LABELS[row.mood] || { label: row.mood, emoji: "❓" };
            const date = new Date(row.check_in_date + "T00:00:00");
            return (
              <Card key={row.id}>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{mood.emoji}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-havii-ink">{mood.label}</span>
                      <span className="text-xs text-havii-muted">
                        {date.toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    {row.note ? (
                      <p className="mt-2 text-sm text-havii-muted whitespace-pre-wrap">
                        {row.note}
                      </p>
                    ) : null}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
