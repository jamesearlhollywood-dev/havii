import Link from "next/link";
import { getUpcomingRecordings } from "@/lib/podcast-data";
import { EPISODE_STATUS_LABELS } from "@/lib/podcast-types";

function formatDateTime(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export async function UpcomingRecordings() {
  const recordings = await getUpcomingRecordings(6);

  if (recordings.length === 0) {
    return (
      <div className="rounded-2xl border border-studio-line bg-studio-charcoal p-6">
        <h2 className="text-lg font-semibold text-studio-ink">Upcoming Recordings</h2>
        <div className="mt-4 flex flex-col items-center justify-center rounded-xl border border-dashed border-studio-line py-10 text-center">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-studio-muted/40" aria-hidden>
            <rect x="9" y="2" width="6" height="12" rx="3" />
            <path d="M5 10a7 7 0 0 0 14 0M12 17v5" />
          </svg>
          <p className="mt-3 text-sm text-studio-muted">
            No upcoming recordings scheduled.
          </p>
          <Link
            href="/admin/episodes"
            className="mt-3 text-xs font-medium text-studio-gold transition hover:text-studio-gold-light"
          >
            Schedule a recording →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-studio-line bg-studio-charcoal p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-studio-ink">Upcoming Recordings</h2>
        <Link
          href="/admin/schedule"
          className="text-xs font-medium text-studio-gold transition hover:text-studio-gold-light"
        >
          View schedule →
        </Link>
      </div>
      <div className="mt-4 space-y-3">
        {recordings.map((r) => (
          <Link
            key={r.id}
            href={`/admin/episodes/${r.id}`}
            className="flex flex-col gap-2 border-b border-studio-line/50 pb-3 transition hover:text-studio-gold sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="min-w-0">
              <p className="truncate font-medium text-studio-ink">{r.title}</p>
              <p className="text-xs text-studio-muted">
                {r.showName ?? "—"}
                {r.guestName ? ` · ${r.guestName}` : ""}
              </p>
            </div>
            <div className="flex items-center gap-3 sm:shrink-0">
              <span className="rounded-full bg-blue-500/10 px-2.5 py-0.5 text-xs font-medium text-blue-400">
                {EPISODE_STATUS_LABELS[r.episodeStatus as keyof typeof EPISODE_STATUS_LABELS] ?? r.episodeStatus}
              </span>
              <span className="text-xs text-studio-muted">
                {formatDateTime(r.recordingDate)}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
