import type { Metadata } from "next";
import { AdminPlaceholder } from "@/components/visual/AdminPlaceholder";

export const metadata: Metadata = { title: "Sponsors" };

export default function AdminSponsorsPage() {
  return (
    <AdminPlaceholder
      title="Sponsors"
      description="Manage sponsor relationships — company, contact, sponsorship level, agreement status, and dates."
      columns={["Company", "Contact", "Level", "Status", "Term"]}
    />
  );
}
