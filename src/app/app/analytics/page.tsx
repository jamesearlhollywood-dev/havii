export const dynamic = "force-dynamic";
export const metadata = { title: "Analytics" };

import { getAnalyticsAction, listGoalsAction } from "@/actions/analytics";
import { AnalyticsView } from "@/components/career/analytics/AnalyticsView";

export default async function AnalyticsPage() {
  const [analyticsResult, goalsResult] = await Promise.all([
    getAnalyticsAction("all"),
    listGoalsAction(),
  ]);

  return (
    <AnalyticsView
      initialMetrics={analyticsResult.metrics}
      initialGoals={goalsResult.goals}
      loadError={analyticsResult.error}
    />
  );
}
