import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getAccessLevel } from "@/lib/session";
import { getGoalWithSteps } from "@/actions/goals";
import { GoalDetail } from "@/components/goals/GoalDetail";

export const metadata: Metadata = { title: "Goal" };

export default async function GoalDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { level } = await getAccessLevel();
  if (level !== "full") redirect("/app/restricted");

  const { id } = await params;
  const goal = await getGoalWithSteps(id);
  if (!goal) redirect("/app/goals");

  return <GoalDetail goal={goal} />;
}
