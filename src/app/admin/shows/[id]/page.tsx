import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getShowById } from "@/lib/podcast-data";
import { ShowForm } from "@/components/admin/ShowForm";

export const metadata: Metadata = { title: "Edit Show" };

export const dynamic = "force-dynamic";

export default async function EditShowPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const show = await getShowById(id);
  if (!show) notFound();

  return (
    <div>
      <div className="flex flex-col gap-1">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-studio-gold">
          Content Management
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-studio-ink sm:text-3xl">
          Edit Show
        </h1>
        <p className="text-sm text-studio-muted">
          {show.show_name} — update details, distribution links, or status.
        </p>
      </div>

      <div className="mt-8">
        <ShowForm show={show} />
      </div>
    </div>
  );
}
