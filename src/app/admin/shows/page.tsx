import type { Metadata } from "next";
import { AdminPlaceholder } from "@/components/visual/AdminPlaceholder";

export const metadata: Metadata = { title: "Shows" };

export default function AdminShowsPage() {
  return (
    <AdminPlaceholder
      title="Shows"
      description="Manage every podcast series in the network — cover art, host, category, distribution links, and publish status."
      columns={[
        "Show name",
        "Host",
        "Category",
        "Status",
        "Episodes",
        "Updated",
      ]}
    />
  );
}
