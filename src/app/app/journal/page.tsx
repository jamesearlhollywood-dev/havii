import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getAccessLevel } from "@/lib/session";
import { getJournalEntries } from "@/actions/journal";
import { JournalList } from "@/components/journal/JournalList";

export const metadata: Metadata = { title: "Journal" };

export default async function JournalPage() {
  const { level } = await getAccessLevel();
  if (level !== "full") redirect("/app/restricted");

  const entries = await getJournalEntries();

  return <JournalList entries={entries} />;
}
