import { notFound } from "next/navigation";
import {
  getContactAction,
  listInteractionsAction,
} from "@/actions/networking";
import { getJobApplications } from "@/actions/job-application";
import { ContactDetail } from "@/components/career/ContactDetail";
import { getUserName } from "@/lib/profile";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { contact } = await getContactAction(id);
  return { title: contact ? `${contact.first_name} ${contact.last_name ?? ""}`.trim() : "Contact" };
}

export default async function ContactDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [{ contact }, interactionsResult, jobs, userName] = await Promise.all([
    getContactAction(id),
    listInteractionsAction(id),
    getJobApplications(),
    getUserName(),
  ]);

  if (!contact) notFound();

  const jobLookup = jobs.map((j) => ({
    id: j.id,
    title: j.title,
    company: j.company,
  }));

  return (
    <ContactDetail
      contact={contact}
      interactions={interactionsResult.interactions}
      jobs={jobLookup}
      userName={userName ?? "there"}
    />
  );
}
