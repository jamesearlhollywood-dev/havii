"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Show } from "@/lib/podcast-types";
import { SHOW_STATUS_LABELS } from "@/lib/podcast-types";
import { ArtworkFrame } from "@/components/visual/ArtworkFrame";

type FilterKey = "all" | "active" | "draft" | "archived";

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "active", label: "Active" },
  { key: "draft", label: "Draft" },
  { key: "archived", label: "Archived" },
];

function statusBadge(status: string) {
  const colors: Record<string, string> = {
    active: "bg-studio-gold/10 text-studio-gold",
    draft: "bg-studio-surface text-studio-muted",
    paused: "bg-blue-500/10 text-blue-400",
    archived: "bg-studio-line/40 text-studio-muted/80",
  };
  return colors[status] ?? "bg-studio-surface text-studio-muted";
}

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
}

export function ShowsTable({
  shows,
  episodeCounts,
}: {
  shows: Show[];
  episodeCounts: Record<string, number>;
}) {
  const [filter, setFilter] = useState<FilterKey>("all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return shows.filter((s) => {
      if (filter !== "all" && s.status !== filter) return false;
      if (search && !s.show_name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [shows, filter, search]);

  return (
    <div>
      {/* Toolbar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                filter === f.key
                  ? "bg-studio-gold/10 text-studio-gold"
                  : "text-studio-muted hover:bg-studio-surface hover:text-studio-ink"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search shows…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-studio-line bg-studio-surface px-3.5 py-2 text-sm text-studio-ink placeholder:text-studio-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-studio-gold sm:w-64"
          />
          <Link
            href="/admin/shows/new"
            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-studio-gold px-4 py-2 text-sm font-semibold text-studio-black transition hover:bg-studio-gold-light"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
            Add Show
          </Link>
        </div>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="mt-8 flex flex-col items-center justify-center rounded-2xl border border-studio-line bg-studio-charcoal py-16 text-center">
          <ArtworkFrame size="sm" label="GH3" subtitle="No Shows" className="opacity-40" />
          <p className="mt-4 text-sm text-studio-muted">
            {shows.length === 0
              ? "No shows yet. Click “Add Show” to create your first podcast series."
              : "No shows match the current filter."}
          </p>
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-studio-line bg-studio-charcoal">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-studio-line text-left">
                <th className="px-5 py-3 text-xs font-medium uppercase tracking-wide text-studio-muted">Show</th>
                <th className="hidden px-5 py-3 text-xs font-medium uppercase tracking-wide text-studio-muted md:table-cell">Host</th>
                <th className="hidden px-5 py-3 text-xs font-medium uppercase tracking-wide text-studio-muted lg:table-cell">Category</th>
                <th className="px-5 py-3 text-xs font-medium uppercase tracking-wide text-studio-muted">Status</th>
                <th className="hidden px-5 py-3 text-xs font-medium uppercase tracking-wide text-studio-muted sm:table-cell">Episodes</th>
                <th className="hidden px-5 py-3 text-xs font-medium uppercase tracking-wide text-studio-muted lg:table-cell">Updated</th>
                <th className="px-5 py-3 text-right text-xs font-medium uppercase tracking-wide text-studio-muted">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-studio-line">
              {filtered.map((show) => (
                <tr key={show.id} className="transition hover:bg-studio-surface/50">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      {show.cover_image ? (
                        <img
                          src={show.cover_image}
                          alt={show.show_name}
                          className="h-12 w-12 shrink-0 rounded-lg border border-studio-line object-cover"
                        />
                      ) : (
                        <div className="h-12 w-12 shrink-0">
                          <ArtworkFrame size="sm" label="GH3" subtitle="" className="h-12 w-12 !text-lg" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="truncate font-medium text-studio-ink">{show.show_name}</p>
                        <p className="truncate text-xs text-studio-muted">/{show.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="hidden px-5 py-4 text-studio-muted md:table-cell">{show.host_name ?? "—"}</td>
                  <td className="hidden px-5 py-4 text-studio-muted lg:table-cell">{show.category ?? "—"}</td>
                  <td className="px-5 py-4">
                    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${statusBadge(show.status)}`}>
                      {SHOW_STATUS_LABELS[show.status] ?? show.status}
                    </span>
                  </td>
                  <td className="hidden px-5 py-4 text-studio-muted sm:table-cell">{episodeCounts[show.id] ?? 0}</td>
                  <td className="hidden px-5 py-4 text-studio-muted lg:table-cell">{formatDate(show.updated_at)}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/shows/${show.id}`}
                        className="rounded-lg border border-studio-line px-3 py-1.5 text-xs font-medium text-studio-ink transition hover:border-studio-gold/50 hover:text-studio-gold"
                      >
                        Edit
                      </Link>
                      {show.status === "active" && (
                        <Link
                          href={`/shows/${show.slug}`}
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
