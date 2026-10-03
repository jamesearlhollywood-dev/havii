import type { Metadata } from "next";
import { AdminPlaceholder } from "@/components/visual/AdminPlaceholder";

export const metadata: Metadata = { title: "Settings" };

export default function AdminSettingsPage() {
  return (
    <AdminPlaceholder
      title="Settings"
      description="Studio-wide configuration — branding, distribution defaults, team access, and integrations."
      columns={["Setting", "Value", "Updated"]}
    />
  );
}
