import { notFound } from "next/navigation";
import { getJobApplicationById } from "@/actions/job-application";
import { JobDetail } from "@/components/career/JobDetail";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const job = await getJobApplicationById(id);
  return { title: job?.title || "Job Detail" };
}

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const job = await getJobApplicationById(id);

  if (!job) notFound();

  return <JobDetail job={job} />;
}
