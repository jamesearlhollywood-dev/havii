import { listContactsAction } from "@/actions/networking";
import { getJobApplications } from "@/actions/job-application";
import { NetworkView } from "@/components/career/NetworkView";
import { getUserName } from "@/lib/profile";

export const dynamic = "force-dynamic";
export const metadata = { title: "Network" };

export default async function NetworkPage() {
  const [contactsResult, jobs, userName] = await Promise.all([
    listContactsAction(),
    getJobApplications(),
    getUserName(),
  ]);

  const jobLookup = jobs.map((j) => ({
    id: j.id,
    title: j.title,
    company: j.company,
  }));

  return (
    <NetworkView
      initialContacts={contactsResult.contacts}
      jobs={jobLookup}
      userName={userName ?? "there"}
    />
  );
}
