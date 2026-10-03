import type { Metadata } from "next";
import { AdminPlaceholder } from "@/components/visual/AdminPlaceholder";

export const metadata: Metadata = { title: "Episodes" };

export default function AdminEpisodesPage() {
  return (
    <AdminPlaceholder
      title="Episodes"
      description="Plan, produce, and publish episodes — audio, video, transcripts, show notes, guests, and scheduling."
      columns={[
        "Title",
        "Show",
        "Season / Episode",
        "Guest",
        "Status",
        "Publish date",
      ]}
    />
  );
}
