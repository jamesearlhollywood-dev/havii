import Link from "next/link";
import type { EpisodeWithShow, ProductionTask } from "@/lib/podcast-types";
import {
  EPISODE_STATUS_LABELS,
  GUEST_BOOKING_LABELS,
  TASK_DONE_STATUSES,
} from "@/lib/podcast-types";
import { ProductionTaskList } from "@/components/admin/ProductionTaskList";

function formatDate(iso: string | null): string {
  if (!iso) return "Not set";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function guestName(g: EpisodeWithShow["guest"]): string {
  if (!g) return "No guest assigned";
  return [g.first_name, g.last_name].filter(Boolean).join(" ") || g.first_name;
}

/**
 * Production overview panel shown on the admin episode page: stage, dates,
 * guest status, completion progress, overdue items, and the task checklist.
 */
export function EpisodeProductionPanel({
  episode,
  tasks,
}: {
  episode: EpisodeWithShow;
  tasks: ProductionTask[];
}) {
  const total = tasks.length;
  const done = tasks.filter((t) => TASK_DONE_STATUSES.includes(t.status)).length;
  const pct = total ? Math.round((done / total) * 100) : 0;
  const overdue = tasks.filter(
    (t) =>
      t.due_date &&
      new Date(t.due_date) < new Date(new Date().toDateString()) &&
      !TASK_DONE_STATUSES.includes(t.status)
  );

  // Workflow guidance: surface what matters at the current stage.
  let guidance: string | null = null;
  if (episode.episode_status === "recorded") {
    guidance = "Episode recorded — editing tasks should be in progress.";
  } else if (episode.episode_status === "ready_for_review") {
    const ready =
      Boolean(episode.audio_url) &&
      Boolean(episode.short_description || episode.full_description) &&
      Boolean(episode.publish_date);
    guidance = ready
      ? "Audio, description, and publish date are complete — ready to publish."
      : "Before publishing, confirm audio, description, and publish date are complete.";
  } else if (episode.episode_status === "published") {
    guidance = "Episode is published and live on the public site.";
  }

  return (
    <section className="mt-8 rounded-2xl border border-studio-line bg-studio-charcoal p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-studio-ink">Production</h2>
        <Link
          href="/admin/production"
          className="text-xs font-medium text-studio-gold transition hover:text-studio-gold-light"
        >
          View on board →
        </Link>
      </div>

      {/* Stage + dates + guest status */}
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <InfoTile label="Production Stage" value={EPISODE_STATUS_LABELS[episode.episode_status]} />
        <InfoTile label="Recording Date" value={formatDate(episode.recording_date)} />
        <InfoTile label="Publish Date" value={formatDate(episode.publish_date)} />
        <InfoTile
          label="Guest Status"
          value={
            episode.guest
              ? GUEST_BOOKING_LABELS[episode.guest.booking_status]
              : "No guest"
          }
        />
      </div>

      <p className="mt-1 text-xs text-studio-muted/70">
        Guest: {guestName(episode.guest)}
      </p>

      {guidance && (
        <p className="mt-4 rounded-xl border border-studio-gold/20 bg-studio-gold/5 px-4 py-2.5 text-sm text-studio-gold/90">
          {guidance}
        </p>
      )}

      {/* Completion + overdue */}
      <div className="mt-5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-studio-ink">Production Tasks</h3>
          <span className="text-xs text-studio-muted">
            {done}/{total} complete · {pct}%
          </span>
        </div>

        {overdue.length > 0 && (
          <p className="mt-2 text-xs font-medium text-red-400">
            {overdue.length} overdue {overdue.length === 1 ? "item" : "items"}
          </p>
        )}

        <div className="mt-3">
          <ProductionTaskList episodeId={episode.id} tasks={tasks} />
        </div>
      </div>
    </section>
  );
}

function InfoTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-studio-line bg-studio-surface p-3">
      <p className="text-xs uppercase tracking-wide text-studio-muted">{label}</p>
      <p className="mt-1 text-sm font-medium text-studio-ink">{value}</p>
    </div>
  );
}
