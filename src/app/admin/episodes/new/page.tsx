import type { Metadata } from "next";
import { getAllShows, getAllGuests } from "@/lib/podcast-data";
import { EpisodeForm } from "@/components/admin/EpisodeForm";

export const metadata: Metadata = { title: "Add Episode" };

export const dynamic = "force-dynamic";

export default async function NewEpisodePage() {
  const [shows, guests] = await Promise.all([getAllShows(), getAllGuests()]);

  if (shows.length === 0) {
    return (
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-studio-ink">
          Add New Episode
        </h1>
        <p className="mt-4 text-sm text-studio-muted">
          You need at least one podcast show before creating an episode.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col gap-1">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-studio-gold">
          Content Management
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-studio-ink sm:text-3xl">
          Add New Episode
        </h1>
        <p className="text-sm text-studio-muted">
          Create a new episode for a podcast show in the network.
        </p>
      </div>

      <div className="mt-8">
        <EpisodeForm shows={shows} guests={guests} />
      </div>
    </div>
  );
}
