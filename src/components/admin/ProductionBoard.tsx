"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { EpisodeWithShow, ProductionTask } from "@/lib/podcast-types";
import {
  PRODUCTION_STAGES,
  PRODUCTION_STAGE_LABELS,
  EPISODE_STATUS_LABELS,
  stageForEpisode,
} from "@/lib/podcast-types";
import { moveEpisodeStageAction } from "@/actions/production";

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function guestName(g: EpisodeWithShow["guest"]): string {
  if (!g) return "—";
  return [g.first_name, g.last_name].filter(Boolean).join(" ") || "—";
}

function isOverdue(ep: EpisodeWithShow, tasks: ProductionTask[]): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  // Overdue task with a past due date that isn't complete/cancelled.
  if (
    tasks.some(
      (t) =>
        t.due_date &&
        new Date(t.due_date) < today &&
        t.status !== "completed" &&
        t.status !== "cancelled"
    )
  ) {
    return true;
  }
  // Recording date passed but episode not yet recorded.
  if (
    ep.recording_date &&
    new Date(ep.recording_date) < today &&
    !["recorded", "editing", "review", "ready_for_review", "published"].includes(
      ep.episode_status
    )
  ) {
    return true;
  }
  return false;
}

function taskSummary(tasks: ProductionTask[]): { done: number; total: number } {
  const done = tasks.filter(
    (t) => t.status === "completed" || t.status === "cancelled"
  ).length;
  return { done, total: tasks.length };
}

/** Inline stage selector that submits the server action on change. */
function StageSelect({
  episodeId,
  currentStage,
}: {
  episodeId: string;
  currentStage: string;
}) {
  return (
    <form action={moveEpisodeStageAction} className="shrink-0">
      <input type="hidden" name="id" value={episodeId} />
      <select
        name="episode_status"
        defaultValue={currentStage}
        aria-label="Move to stage"
        onChange={(e) => e.currentTarget.form?.requestSubmit()}
        className="w-full rounded-lg border border-studio-line bg-studio-surface px-2 py-1.5 text-xs text-studio-ink focus:outline-none focus-visible:ring-1 focus-visible:ring-studio-gold"
      >
        {PRODUCTION_STAGES.map((s) => (
          <option key={s} value={s}>
            {PRODUCTION_STAGE_LABELS[s]}
          </option>
        ))}
      </select>
    </form>
  );
}

interface ProductionBoardProps {
  episodes: EpisodeWithShow[];
  tasksByEpisode: Record<string, ProductionTask[]>;
}

export function ProductionBoard({
  episodes,
  tasksByEpisode,
}: ProductionBoardProps) {
  const [mobileStage, setMobileStage] = useState<string>(PRODUCTION_STAGES[0]);

  // Bucket episodes by production stage.
  const columns = useMemo(() => {
    const map = new Map<string, EpisodeWithShow[]>();
    for (const stage of PRODUCTION_STAGES) map.set(stage, []);
    for (const ep of episodes) {
      if (ep.episode_status === "archived") continue;
      const stage = stageForEpisode(ep.episode_status);
      map.get(stage)?.push(ep);
    }
    return map;
  }, [episodes]);

  const mobileColumn = columns.get(mobileStage) ?? [];

  return (
    <div>
      {/* Desktop / tablet: horizontal Kanban columns */}
      <div className="hidden overflow-x-auto pb-2 md:block">
        <div className="flex min-w-max gap-4">
          {PRODUCTION_STAGES.map((stage) => {
            const items = columns.get(stage) ?? [];
            return (
              <div key={stage} className="w-72 shrink-0">
                <div className="flex items-center justify-between rounded-t-xl border border-b-0 border-studio-line bg-studio-surface px-3 py-2.5">
                  <h3 className="text-sm font-semibold text-studio-ink">
                    {PRODUCTION_STAGE_LABELS[stage]}
                  </h3>
                  <span className="rounded-full bg-studio-charcoal px-2 py-0.5 text-xs text-studio-muted">
                    {items.length}
                  </span>
                </div>
                <div className="space-y-3 rounded-b-xl border border-t-0 border-studio-line bg-studio-black/30 p-3 min-h-[120px]">
                  {items.length === 0 ? (
                    <p className="px-1 py-6 text-center text-xs text-studio-muted/60">
                      No episodes
                    </p>
                  ) : (
                    items.map((ep) => (
                      <BoardCard
                        key={ep.id}
                        episode={ep}
                        tasks={tasksByEpisode[ep.id] ?? []}
                      />
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile: grouped list with a stage selector */}
      <div className="md:hidden">
        <div className="mb-4 flex flex-wrap gap-2">
          {PRODUCTION_STAGES.map((stage) => (
            <button
              key={stage}
              onClick={() => setMobileStage(stage)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                mobileStage === stage
                  ? "bg-studio-gold/10 text-studio-gold"
                  : "text-studio-muted hover:bg-studio-surface hover:text-studio-ink"
              }`}
            >
              {PRODUCTION_STAGE_LABELS[stage]} ({columns.get(stage)?.length ?? 0})
            </button>
          ))}
        </div>
        <div className="space-y-3">
          {mobileColumn.length === 0 ? (
            <div className="rounded-2xl border border-studio-line bg-studio-charcoal py-10 text-center">
              <p className="text-sm text-studio-muted">No episodes in this stage.</p>
            </div>
          ) : (
            mobileColumn.map((ep) => (
              <BoardCard
                key={ep.id}
                episode={ep}
                tasks={tasksByEpisode[ep.id] ?? []}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function BoardCard({
  episode,
  tasks,
}: {
  episode: EpisodeWithShow;
  tasks: ProductionTask[];
}) {
  const overdue = isOverdue(episode, tasks);
  const { done, total } = taskSummary(tasks);
  const stage = stageForEpisode(episode.episode_status);

  return (
    <div className="rounded-xl border border-studio-line bg-studio-charcoal p-3">
      <div className="flex items-start justify-between gap-2">
        <Link
          href={`/admin/episodes/${episode.id}`}
          className="line-clamp-2 text-sm font-medium text-studio-ink transition hover:text-studio-gold"
        >
          {episode.title}
        </Link>
        {overdue && (
          <span className="shrink-0 rounded-full bg-red-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase text-red-400">
            Overdue
          </span>
        )}
      </div>

      <p className="mt-1 text-xs text-studio-muted">
        {episode.show?.show_name ?? "—"}
      </p>

      <div className="mt-2 space-y-1 text-xs text-studio-muted">
        <p>
          <span className="text-studio-muted/60">Guest:</span>{" "}
          {guestName(episode.guest)}
        </p>
        <p>
          <span className="text-studio-muted/60">Recording:</span>{" "}
          {formatDate(episode.recording_date)}
        </p>
        <p>
          <span className="text-studio-muted/60">Publish:</span>{" "}
          {formatDate(episode.publish_date)}
        </p>
      </div>

      {total > 0 && (
        <div className="mt-2">
          <div className="flex items-center justify-between text-xs text-studio-muted">
            <span>Tasks</span>
            <span>
              {done}/{total}
            </span>
          </div>
          <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-studio-line">
            <div
              className="h-full rounded-full bg-studio-gold"
              style={{ width: `${total ? Math.round((done / total) * 100) : 0}%` }}
            />
          </div>
        </div>
      )}

      <div className="mt-3 flex items-center gap-2">
        <span className="text-xs text-studio-muted/60">Move:</span>
        <StageSelect episodeId={episode.id} currentStage={stage} />
      </div>
      <p className="mt-2 text-[10px] uppercase tracking-wide text-studio-muted/50">
        {EPISODE_STATUS_LABELS[episode.episode_status]}
      </p>
    </div>
  );
}
