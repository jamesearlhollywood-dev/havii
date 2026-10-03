import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getEpisodeById, getAllShows, getAllGuests } from "@/lib/podcast-data";
import { EpisodeForm } from "@/components/admin/EpisodeForm";

export const metadata: Metadata = { title: "Edit Episode" };

export const dynamic = "force-dynamic";

export default async function EditEpisodePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [episode, shows, guests] = await Promise.all([
    getEpisodeById(id),
    getAllShows(),
    getAllGuests(),
  ]);

  if (!episode) notFound();

  return (
    <div>
      <div className="flex flex-col gap-1">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-studio-gold">
          Content Management
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-studio-ink sm:text-3xl">
          Edit Episode
        </h1>
        <p className="text-sm text-studio-muted">
          {episode.title} — update details, media, content, or publication status.
        </p>
      </div>

      <div className="mt-8">
        <EpisodeForm episode={episode} shows={shows} guests={guests} />
      </div>
    </div>
  );
}
