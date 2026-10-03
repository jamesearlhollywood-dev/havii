import { isJobsApiConfiguredAction } from "@/actions/find-jobs";
import { FindJobs } from "@/components/career/FindJobs";

export const dynamic = "force-dynamic";
export const metadata = { title: "Find Jobs" };

export default async function FindJobsPage() {
  const apiConfigured = await isJobsApiConfiguredAction();
  return <FindJobs apiConfigured={apiConfigured} />;
}
