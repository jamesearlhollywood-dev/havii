import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getAccessLevel } from "@/lib/session";
import { getJournalEntry } from "@/actions/journal";
import { JournalEntryDetail } from "@/components/journal/JournalEntryDetail";

export const metadata: Metadata = { title: "Journal Entry" };

export default async function EntryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { level } = await getAccessLevel();
  if (level !== "full") redirect("/app/restricted");

  const { id } = await params;
  const entry = await getJournalEntry(id);
  if (!entry) redirect("/app/journal");

  return <JournalEntryDetail entry={entry} />;
}
