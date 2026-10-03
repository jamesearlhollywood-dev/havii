"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { EpisodeWithShow, Show } from "@/lib/podcast-types";
import {
  EPISODE_STATUSES,
  EPISODE_STATUS_LABELS,
} from "@/lib/podcast-types";
import { ArtworkFrame } from "@/components/visual/ArtworkFrame";

type StatusFilter = "all" | (typeof EPISODE_STATUSES)[number];

const STATUS_FILTERS: { key: StatusFilter; label: string }[] = [
  { key: "all", label: "All" },
  ...EPISODE_STATUSES.map((s) => ({ key: s, label: EPISODE_STATUS_LABELS[s] })),
];

function statusBadge(status: string): string {
  const colors: Record<string, string> = {
    planned: "bg-studio-surface text-studio-muted",
    scheduled: "bg-blue-500/10 text-blue-400",
    recorded: "bg-purple-500/10 text-purple-400",
    editing: "bg-amber-500/10 text-amber-400",
    ready_for_review: "bg-cyan-500/10 text-cyan-400",
    published: "bg-studio-gold/10 text-studio-gold",
    archived: "bg-studio-line/40 text-studio-muted/80",
    recording: "bg-orange-500/10 text-orange-400",
  };
  return colors[status] ?? "bg-studio-surface text-studio-muted";
}

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function guestName(g: EpisodeWithShow["guest"]): string {
  if (!g) return "—";
  return [g.first_name, g.last_name].filter(Boolean).join(" ") || "—";
}

export function EpisodesTable({
  episodes,
  shows,
}: {
  episodes: EpisodeWithShow[];
  shows: Show[];
}) {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [showFilter, setShowFilter] = useState<string>("all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return episodes.filter((ep) => {
      if (statusFilter !== "all" && ep.episode_status !== statusFilter) return false;
      if (showFilter !== "all" && ep.show_id !== showFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        const haystack = [
          ep.title,
          ep.show?.show_name ?? "",
          guestName(ep.guest),
        ].join(" ").toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [episodes, statusFilter, showFilter, search]);

  return (
    <div>
      {/* Toolbar */}
      <div className="flex flex-col gap-4">
        {/* Search + Add */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <input
            type="text"
            placeholder="Search by title, guest, or show…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-studio-line bg-studio-surface px-3.5 py-2 text-sm text-studio-ink placeholder:text-studio-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-studio-gold sm:w-72"
          />
          <div className="flex items-center gap-3">
            <select
              value={showFilter}
              onChange={(e) => setShowFilter(e.target.value)}
              className="rounded-xl border border-studio-line bg-studio-surface px-3 py-2 text-sm text-studio-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-studio-gold"
            >
              <option value="all">All Shows</option>
              {shows.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.show_name}
                </option>
              ))}
            </select>
            <Link
              href="/admin/episodes/new"
              className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-studio-gold px-4 py-2 text-sm font-semibold text-studio-black transition hover:bg-studio-gold-light"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M12 5v14M5 12h14" />
              </svg>
              Add Episode
            </Link>
          </div>
        </div>

        {/* Status filters */}
        <div className="flex flex-wrap gap-2">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setStatusFilter(f.key)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                statusFilter === f.key
                  ? "bg-studio-gold/10 text-studio-gold"
                  : "text-studio-muted hover:bg-studio-surface hover:text-studio-ink"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table / empty state */}
      {filtered.length === 0 ? (
        <div className="mt-8 flex flex-col items-center justify-center rounded-2xl border border-studio-line bg-studio-charcoal py-16 text-center">
          <ArtworkFrame size="sm" label="GH3" subtitle="No Episodes" className="opacity-40" />
          <p className="mt-4 text-sm text-studio-muted">
            {episodes.length === 0
              ? "No episodes yet. Click \u201cAdd Episode\u201d to create your first episode."
              : "No episodes match the current filters."}
          </p>
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-studio-line bg-studio-charcoal">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-studio-line text-left">
                <th className="px-4 py-3 text-xs font-medium uppercase tracking-wide text-studio-muted">Episode</th>
                <th className="hidden px-4 py-3 text-xs font-medium uppercase tracking-wide text-studio-muted md:table-cell">Show</th>
                <th className="hidden px-4 py-3 text-xs font-medium uppercase tracking-wide text-studio-muted lg:table-cell">Guest</th>
                <th className="px-4 py-3 text-xs font-medium uppercase tracking-wide text-studio-muted">Status</th>
                <th className="hidden px-4 py-3 text-xs font-medium uppercase tracking-wide text-studio-muted lg:table-cell">Recording</th>
                <th className="hidden px-4 py-3 text-xs font-medium uppercase tracking-wide text-studio-muted sm:table-cell">Publish</th>
                <th className="hidden px-4 py-3 text-xs font-medium uppercase tracking-wide text-studio-muted lg:table-cell">Duration</th>
                <th className="hidden px-4 py-3 text-xs font-medium uppercase tracking-wide text-studio-muted xl:table-cell">Featured</th>
                <th className="hidden px-4 py-3 text-xs font-medium uppercase tracking-wide text-studio-muted lg:table-cell">Updated</th>
                <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wide text-studio-muted">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-studio-line">
              {filtered.map((ep) => (
                <tr key={ep.id} className="transition hover:bg-studio-surface/50">
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      {ep.cover_image ? (
                        <img
                          src={ep.cover_image}
                          alt={ep.title}
                          className="h-11 w-11 shrink-0 rounded-lg border border-studio-line object-cover"
                        />
                      ) : (
                        <div className="h-11 w-11 shrink-0">
                          <ArtworkFrame size="sm" label="GH3" subtitle="" className="h-11 w-11 !text-xs" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="truncate font-medium text-studio-ink">{ep.title}</p>
                        <p className="text-xs text-studio-muted">
                          {ep.episode_number ? `EP ${ep.episode_number}` : ""}
                          {ep.season_number ? ` · S${ep.season_number}` : ""}
                          {!ep.episode_number && !ep.season_number ? "—" : ""}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="hidden px-4 py-3.5 text-studio-muted md:table-cell">
                    {ep.show?.show_name ?? "—"}
                  </td>
                  <td className="hidden px-4 py-3.5 text-studio-muted lg:table-cell">
                    {guestName(ep.guest)}
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${statusBadge(ep.episode_status)}`}>
                      {EPISODE_STATUS_LABELS[ep.episode_status] ?? ep.episode_status}
                    </span>
                  </td>
                  <td className="hidden px-4 py-3.5 text-studio-muted lg:table-cell">
                    {formatDate(ep.recording_date)}
                  </td>
                  <td className="hidden px-4 py-3.5 text-studio-muted sm:table-cell">
                    {formatDate(ep.publish_date)}
                  </td>
                  <td className="hidden px-4 py-3.5 text-studio-muted lg:table-cell">
                    {ep.duration ?? "—"}
                  </td>
                  <td className="hidden px-4 py-3.5 xl:table-cell">
                    {ep.featured ? (
                      <span className="inline-block rounded-full bg-studio-gold/10 px-2 py-0.5 text-xs text-studio-gold">★</span>
                    ) : (
                      <span className="text-studio-muted/40">—</span>
                    )}
                  </td>
                  <td className="hidden px-4 py-3.5 text-studio-muted lg:table-cell">
                    {formatDate(ep.updated_at)}
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/episodes/${ep.id}`}
                        className="rounded-lg border border-studio-line px-3 py-1.5 text-xs font-medium text-studio-ink transition hover:border-studio-gold/50 hover:text-studio-gold"
                      >
                        Edit
                      </Link>
                      {ep.episode_status === "published" && ep.show?.slug && (
                        <Link
                          href={`/shows/${ep.show.slug}/episodes/${ep.slug}`}
                          className="rounded-lg border border-studio-line px-3 py-1.5 text-xs font-medium text-studio-ink transition hover:border-studio-gold/50 hover:text-studio-gold"
                        >
                          View
                        </Link>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
