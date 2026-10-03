import type { Metadata } from "next";
import { AdminPlaceholder } from "@/components/visual/AdminPlaceholder";

export const metadata: Metadata = { title: "Messages" };

export default function AdminMessagesPage() {
  return (
    <AdminPlaceholder
      title="Messages"
      description="Inbound contact-form submissions — inquiry type, sender, message, and response status."
      columns={["Name", "Email", "Inquiry type", "Status", "Received"]}
    />
  );
}
