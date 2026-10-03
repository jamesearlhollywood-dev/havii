import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getGuestWithRelations } from "@/lib/podcast-data";
import { GuestForm } from "@/components/admin/GuestForm";

export const metadata: Metadata = { title: "Edit Guest" };

export const dynamic = "force-dynamic";

export default async function EditGuestPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const guest = await getGuestWithRelations(id);
  if (!guest) notFound();

  return (
    <div>
      <div className="flex flex-col gap-1">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-studio-gold">
          Content Management
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-studio-ink sm:text-3xl">
          Edit Guest
        </h1>
        <p className="text-sm text-studio-muted">
          {[guest.first_name, guest.last_name].filter(Boolean).join(" ")} — update profile details, contact, and booking status.
        </p>
      </div>

      <div className="mt-8">
        <GuestForm guest={guest} />
      </div>
    </div>
  );
}
