import { getJobApplications } from "@/actions/job-application";
import { JobTracker } from "@/components/career/JobTracker";

export const dynamic = "force-dynamic";
export const metadata = { title: "Job Tracker" };

export default async function JobTrackerPage() {
  const jobs = await getJobApplications();
  return <JobTracker jobs={jobs} />;
}
