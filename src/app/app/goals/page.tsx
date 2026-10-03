import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getAccessLevel } from "@/lib/session";
import { getGoals } from "@/actions/goals";
import type { GoalStatus } from "@/lib/goalConstants";
import { GoalList } from "@/components/goals/GoalList";

export const metadata: Metadata = { title: "Goals" };

function isValidTab(v: string): v is GoalStatus {
  return v === "active" || v === "completed" || v === "archived";
}

export default async function GoalsPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { level } = await getAccessLevel();
  if (level !== "full") redirect("/app/restricted");

  const params = await searchParams;
  const tabParam = params.tab ?? "";
  const initialTab = isValidTab(tabParam) ? tabParam : "active";

  // Fetch all statuses so tabs show accurate counts.
  const [active, completed, archived] = await Promise.all([
    getGoals("active"),
    getGoals("completed"),
    getGoals("archived"),
  ]);

  return <GoalList goals={[...active, ...completed, ...archived]} initialTab={initialTab} />;
}
