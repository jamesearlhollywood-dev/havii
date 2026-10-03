import type { Metadata } from "next";
import { getAllEpisodes, getAllProductionTasks } from "@/lib/podcast-data";
import { ProductionBoard } from "@/components/admin/ProductionBoard";
import { ArtworkFrame } from "@/components/visual/ArtworkFrame";

export const metadata: Metadata = { title: "Production" };

export const dynamic = "force-dynamic";

export default async function AdminProductionPage() {
  const [episodes, tasks] = await Promise.all([
    getAllEpisodes(),
    getAllProductionTasks(),
  ]);

  const tasksByEpisode = tasks.reduce<Record<string, typeof tasks>>((acc, t) => {
    if (t.episode_id) {
      (acc[t.episode_id] ??= []).push(t);
    }
    return acc;
  }, {});

  return (
    <div>
      <div className="flex flex-col gap-1">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-studio-gold">
          Production Workflow
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-studio-ink sm:text-3xl">
          Production Board
        </h1>
        <p className="text-sm text-studio-muted">
          Track every episode from idea to publication. Move cards between stages with the dropdown on each card.
        </p>
      </div>

      {episodes.length === 0 ? (
        <div className="mt-8 flex flex-col items-center justify-center rounded-2xl border border-studio-line bg-studio-charcoal py-16 text-center">
          <ArtworkFrame size="sm" label="GH3" subtitle="No Episodes" className="opacity-40" />
          <p className="mt-4 text-sm text-studio-muted">
            No episodes yet. Create an episode to populate the production board.
          </p>
        </div>
      ) : (
        <div className="mt-8">
          <ProductionBoard episodes={episodes} tasksByEpisode={tasksByEpisode} />
        </div>
      )}
    </div>
  );
}
