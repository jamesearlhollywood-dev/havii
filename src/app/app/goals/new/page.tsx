import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getAccessLevel } from "@/lib/session";
import { GoalForm } from "@/components/goals/GoalForm";

export const metadata: Metadata = { title: "New Goal" };

export default async function NewGoalPage() {
  const { level } = await getAccessLevel();
  if (level !== "full") redirect("/app/restricted");

  return <GoalForm />;
}
