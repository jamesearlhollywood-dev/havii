import { isJobsApiConfiguredAction } from "@/actions/find-jobs";
import { listSavedSearchesAction } from "@/actions/saved-searches";
import { JobAlerts } from "@/components/career/JobAlerts";
import { getNotificationChannelStatuses } from "@/lib/career/notifications";

export const dynamic = "force-dynamic";
export const metadata = { title: "Job Alerts" };

export default async function JobAlertsPage() {
  const [apiConfigured, searchesResult] = await Promise.all([
    isJobsApiConfiguredAction(),
    listSavedSearchesAction(),
  ]);

  return (
    <JobAlerts
      initialSearches={searchesResult.searches}
      apiConfigured={apiConfigured}
      channelStatuses={getNotificationChannelStatuses()}
    />
  );
}
