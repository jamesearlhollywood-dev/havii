import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getAccessLevel } from "@/lib/session";
import { JournalEditor } from "@/components/journal/JournalEditor";

export const metadata: Metadata = { title: "New Entry" };

export default async function NewEntryPage() {
  const { level } = await getAccessLevel();
  if (level !== "full") redirect("/app/restricted");

  return <JournalEditor />;
}
