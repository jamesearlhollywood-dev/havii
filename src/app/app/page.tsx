import { redirect } from "next/navigation";
import { getAccessLevel } from "@/lib/session";
import { query } from "@/lib/db";
import { CheckInForm, type TodayCheckIn } from "@/components/checkin/CheckInForm";

export default async function HomePage() {
  const { level, profile } = await getAccessLevel();
  if (level !== "full" || !profile) redirect("/app/restricted");

  // Fetch today's check-in using the user's timezone
  const { rows } = await query<TodayCheckIn>(
    `SELECT id, mood, note, check_in_date::text, created_at, updated_at
     FROM check_ins
     WHERE user_id = $1 AND check_in_date = (now() AT TIME ZONE $2)::date`,
    [profile.user_id, profile.timezone]
  );

  return (
    <CheckInForm
      todayCheckIn={rows[0] ?? null}
      preferredName={profile.preferred_name}
    />
  );
}
