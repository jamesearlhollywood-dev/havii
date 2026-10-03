import type { Metadata } from "next";
import { GuestForm } from "@/components/admin/GuestForm";

export const metadata: Metadata = { title: "Add Guest" };

export const dynamic = "force-dynamic";

export default function NewGuestPage() {
  return (
    <div>
      <div className="flex flex-col gap-1">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-studio-gold">
          Content Management
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-studio-ink sm:text-3xl">
          Add Guest
        </h1>
        <p className="text-sm text-studio-muted">
          Create a new guest profile. Email and phone are optional.
        </p>
      </div>

      <div className="mt-8">
        <GuestForm />
      </div>
    </div>
  );
}
