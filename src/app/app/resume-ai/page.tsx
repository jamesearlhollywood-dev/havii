export const dynamic = "force-dynamic";
export const metadata = { title: "Resume AI" };

import { getResumes } from "@/actions/resume";
import { ResumeManager } from "@/components/career/ResumeManager";

export default async function ResumeAIPage() {
  const resumes = await getResumes();
  return <ResumeManager initialResumes={resumes} />;
}
