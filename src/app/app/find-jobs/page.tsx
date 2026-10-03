import { isJobsApiConfiguredAction } from "@/actions/find-jobs";
import { FindJobs } from "@/components/career/FindJobs";
import { JobRecommendations } from "@/components/career/JobRecommendations";

export const dynamic = "force-dynamic";
export const metadata = { title: "Find Jobs" };

export default async function FindJobsPage() {
  const apiConfigured = await isJobsApiConfiguredAction();
  return (
    <div className="space-y-8">
      <FindJobs apiConfigured={apiConfigured} />
      <JobRecommendations apiConfigured={apiConfigured} />
    </div>
  );
}
