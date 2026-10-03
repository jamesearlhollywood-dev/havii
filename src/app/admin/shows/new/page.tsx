import type { Metadata } from "next";
import { ShowForm } from "@/components/admin/ShowForm";

export const metadata: Metadata = { title: "Add Show" };

export const dynamic = "force-dynamic";

export default function NewShowPage() {
  return (
    <div>
      <div className="flex flex-col gap-1">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-studio-gold">
          Content Management
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-studio-ink sm:text-3xl">
          Add New Show
        </h1>
        <p className="text-sm text-studio-muted">
          Create a new podcast series for the James Hollywood III Studios network.
        </p>
      </div>

      <div className="mt-8">
        <ShowForm />
      </div>
    </div>
  );
}
