import type { Metadata } from "next";
import { getAllEpisodes, getAllShows } from "@/lib/podcast-data";
import { EpisodesTable } from "@/components/admin/EpisodesTable";

export const metadata: Metadata = { title: "Episodes" };

export const dynamic = "force-dynamic";

export default async function AdminEpisodesPage() {
  const [episodes, shows] = await Promise.all([getAllEpisodes(), getAllShows()]);

  return (
    <div>
      <div className="flex flex-col gap-1">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-studio-gold">
          Content Management
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-studio-ink sm:text-3xl">
          Episodes
        </h1>
        <p className="text-sm text-studio-muted">
          Plan, produce, and publish episodes — audio, video, transcripts, show notes, guests, and scheduling.
        </p>
      </div>

      <div className="mt-8">
        <EpisodesTable episodes={episodes} shows={shows} />
      </div>
    </div>
  );
}
