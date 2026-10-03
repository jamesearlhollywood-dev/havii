import type { Metadata } from "next";
import { getAllShows, getEpisodeCountByShow } from "@/lib/podcast-data";
import { ShowsTable } from "@/components/admin/ShowsTable";

export const metadata: Metadata = { title: "Shows" };

export const dynamic = "force-dynamic";

export default async function AdminShowsPage() {
  const shows = await getAllShows();
  const episodeCounts: Record<string, number> = {};
  await Promise.all(
    shows.map(async (s) => {
      episodeCounts[s.id] = await getEpisodeCountByShow(s.id);
    })
  );

  return (
    <div>
      <div className="flex flex-col gap-1">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-studio-gold">
          Content Management
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-studio-ink sm:text-3xl">
          Shows
        </h1>
        <p className="text-sm text-studio-muted">
          Manage every podcast series in the network — cover art, host, category, distribution links, and status.
        </p>
      </div>

      <div className="mt-8">
        <ShowsTable shows={shows} episodeCounts={episodeCounts} />
      </div>
    </div>
  );
}
