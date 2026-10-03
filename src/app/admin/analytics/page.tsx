import type { Metadata } from "next";
import { AdminPlaceholder } from "@/components/visual/AdminPlaceholder";

export const metadata: Metadata = { title: "Analytics" };

export default function AdminAnalyticsPage() {
  return (
    <AdminPlaceholder
      title="Analytics"
      description="Listenership and engagement metrics across shows and episodes — listens, downloads, and trends."
      columns={["Show / Episode", "Listens", "Downloads", "Trend", "Period"]}
    />
  );
}
