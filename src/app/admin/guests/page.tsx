import type { Metadata } from "next";
import { AdminPlaceholder } from "@/components/visual/AdminPlaceholder";

export const metadata: Metadata = { title: "Guests" };

export default function AdminGuestsPage() {
  return (
    <AdminPlaceholder
      title="Guests"
      description="Manage guest profiles — bios, headshots, contact details, social links, and booking status."
      columns={["Name", "Title", "Organization", "Booking status", "Episodes"]}
    />
  );
}
