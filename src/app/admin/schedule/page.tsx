import type { Metadata } from "next";
import { AdminPlaceholder } from "@/components/visual/AdminPlaceholder";

export const metadata: Metadata = { title: "Schedule" };

export default function AdminSchedulePage() {
  return (
    <AdminPlaceholder
      title="Schedule"
      description="Plan recording sessions and episode release dates across the network calendar."
      columns={["Date", "Episode", "Type", "Assignee", "Status"]}
    />
  );
}
