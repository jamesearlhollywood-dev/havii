import type { Metadata } from "next";
import { AdminPlaceholder } from "@/components/visual/AdminPlaceholder";

export const metadata: Metadata = { title: "Production" };

export default function AdminProductionPage() {
  return (
    <AdminPlaceholder
      title="Production"
      description="Track production tasks per episode — recording, editing, mixing, artwork, and publishing workflow."
      columns={["Task", "Episode", "Assigned to", "Status", "Due date"]}
    />
  );
}
