"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { GuestWithStats } from "@/lib/podcast-types";
import {
  GUEST_BOOKING_STATUSES,
  GUEST_BOOKING_LABELS,
} from "@/lib/podcast-types";
import { ArtworkFrame } from "@/components/visual/ArtworkFrame";

type StatusFilter = "all" | (typeof GUEST_BOOKING_STATUSES)[number];

const STATUS_FILTERS: { key: StatusFilter; label: string }[] = [
  { key: "all", label: "All" },
  ...GUEST_BOOKING_STATUSES.map((s) => ({
    key: s as StatusFilter,
    label: GUEST_BOOKING_LABELS[s],
  })),
];

function bookingBadge(status: string): string {
  const colors: Record<string, string> = {
    prospect: "bg-studio-surface text-studio-muted",
    invited: "bg-sky-500/10 text-sky-400",
    interested: "bg-teal-500/10 text-teal-400",
    scheduling: "bg-amber-500/10 text-amber-400",
    confirmed: "bg-blue-500/10 text-blue-400",
    recorded: "bg-purple-500/10 text-purple-400",
    published: "bg-studio-gold/10 text-studio-gold",
    declined: "bg-red-500/10 text-red-400",
    archived: "bg-studio-line/40 text-studio-muted/80",
    tentative: "bg-studio-surface text-studio-muted",
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

function formatDateTime(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function fullName(g: GuestWithStats): string {
  return [g.first_name, g.last_name].filter(Boolean).join(" ") || g.first_name;
}

function initials(g: GuestWithStats): string {
  return `${g.first_name[0] ?? ""}${g.last_name?.[0] ?? ""}`.toUpperCase();
}

export function GuestsTable({ guests }: { guests: GuestWithStats[] }) {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return guests.filter((g) => {
      if (statusFilter !== "all" && g.booking_status !== statusFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        const haystack = [
          g.first_name,
          g.last_name ?? "",
          g.organization ?? "",
          g.professional_title ?? "",
          g.email ?? "",
        ]
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [guests, statusFilter, search]);

  return (
    <div>
      {/* Toolbar */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <input
            type="text"
            placeholder="Search by name, organization, title, or email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-studio-line bg-studio-surface px-3.5 py-2 text-sm text-studio-ink placeholder:text-studio-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-studio-gold sm:w-80"
          />
          <Link
            href="/admin/guests/new"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-studio-gold px-4 py-2 text-sm font-semibold text-studio-black transition hover:bg-studio-gold-light"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
            Add Guest
          </Link>
        </div>

        {/* Booking-status filters */}
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
          <ArtworkFrame size="sm" label="GH3" subtitle="No Guests" className="opacity-40" />
          <p className="mt-4 text-sm text-studio-muted">
            {guests.length === 0
              ? "No guests yet. Click \u201cAdd Guest\u201d to create your first guest profile."
              : "No guests match the current filters."}
          </p>
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-studio-line bg-studio-charcoal">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-studio-line text-left">
                <th className="px-4 py-3 text-xs font-medium uppercase tracking-wide text-studio-muted">Guest</th>
                <th className="hidden px-4 py-3 text-xs font-medium uppercase tracking-wide text-studio-muted md:table-cell">Title</th>
                <th className="hidden px-4 py-3 text-xs font-medium uppercase tracking-wide text-studio-muted lg:table-cell">Organization</th>
                <th className="hidden px-4 py-3 text-xs font-medium uppercase tracking-wide text-studio-muted xl:table-cell">Email</th>
                <th className="hidden px-4 py-3 text-xs font-medium uppercase tracking-wide text-studio-muted xl:table-cell">Phone</th>
                <th className="px-4 py-3 text-xs font-medium uppercase tracking-wide text-studio-muted">Booking</th>
                <th className="hidden px-4 py-3 text-xs font-medium uppercase tracking-wide text-studio-muted sm:table-cell">Episodes</th>
                <th className="hidden px-4 py-3 text-xs font-medium uppercase tracking-wide text-studio-muted lg:table-cell">Next Recording</th>
                <th className="hidden px-4 py-3 text-xs font-medium uppercase tracking-wide text-studio-muted lg:table-cell">Updated</th>
                <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wide text-studio-muted">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-studio-line">
              {filtered.map((g) => (
                <tr key={g.id} className="transition hover:bg-studio-surface/50">
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="h-11 w-11 shrink-0 overflow-hidden rounded-full border border-studio-line bg-studio-surface">
                        {g.headshot ? (
                          <img
                            src={g.headshot}
                            alt={fullName(g)}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center font-mono text-xs font-bold text-studio-gold">
                            {initials(g)}
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-medium text-studio-ink">{fullName(g)}</p>
                        <p className="truncate text-xs text-studio-muted">
                          {g.professional_title ?? "—"}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="hidden px-4 py-3.5 text-studio-muted md:table-cell">
                    {g.professional_title ?? "—"}
                  </td>
                  <td className="hidden px-4 py-3.5 text-studio-muted lg:table-cell">
                    {g.organization ?? "—"}
                  </td>
                  <td className="hidden px-4 py-3.5 text-studio-muted xl:table-cell">
                    {g.email ?? "—"}
                  </td>
                  <td className="hidden px-4 py-3.5 text-studio-muted xl:table-cell">
                    {g.phone ?? "—"}
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${bookingBadge(g.booking_status)}`}>
                      {GUEST_BOOKING_LABELS[g.booking_status] ?? g.booking_status}
                    </span>
                  </td>
                  <td className="hidden px-4 py-3.5 text-studio-muted sm:table-cell">
                    {g.episode_count}
                  </td>
                  <td className="hidden px-4 py-3.5 text-studio-muted lg:table-cell">
                    {g.next_recording_date ? (
                      <div>
                        <p>{formatDateTime(g.next_recording_date)}</p>
                        {g.next_recording_title && (
                          <p className="truncate text-xs text-studio-muted/70">{g.next_recording_title}</p>
                        )}
                      </div>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="hidden px-4 py-3.5 text-studio-muted lg:table-cell">
                    {formatDate(g.updated_at)}
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/guests/${g.id}/edit`}
                        className="rounded-lg border border-studio-line px-3 py-1.5 text-xs font-medium text-studio-ink transition hover:border-studio-gold/50 hover:text-studio-gold"
                      >
                        Edit
                      </Link>
                      <Link
                        href={`/admin/guests/${g.id}`}
                        className="rounded-lg border border-studio-line px-3 py-1.5 text-xs font-medium text-studio-ink transition hover:border-studio-gold/50 hover:text-studio-gold"
                      >
                        Profile
                      </Link>
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
