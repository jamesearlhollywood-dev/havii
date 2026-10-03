"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Show } from "@/lib/podcast-types";
import type { ScheduleEvent } from "@/lib/podcast-data";

type EventTypeFilter = "all" | "recording" | "publication";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function eventBadge(type: ScheduleEvent["type"]): string {
  return type === "recording"
    ? "bg-blue-500/15 text-blue-400"
    : "bg-studio-gold/15 text-studio-gold";
}

function sameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatFull(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

interface ScheduleViewProps {
  events: ScheduleEvent[];
  shows: Show[];
}

export function ScheduleView({ events, shows }: ScheduleViewProps) {
  const [view, setView] = useState<"calendar" | "list">("calendar");
  const [showFilter, setShowFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<EventTypeFilter>("all");
  const [cursor, setCursor] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });

  const filtered = useMemo(() => {
    return events.filter((e) => {
      if (showFilter !== "all") {
        // Match by show name since events carry showName (not show id).
        const show = shows.find((s) => s.id === showFilter);
        if (!show || e.showName !== show.show_name) return false;
      }
      if (typeFilter !== "all" && e.type !== typeFilter) return false;
      return true;
    });
  }, [events, showFilter, typeFilter, shows]);

  // Calendar grid for the cursor month.
  const gridDays = useMemo(() => {
    const year = cursor.getFullYear();
    const month = cursor.getMonth();
    const first = new Date(year, month, 1);
    const startDay = first.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells: (Date | null)[] = [];
    for (let i = 0; i < startDay; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
    while (cells.length % 7 !== 0) cells.push(null);
    return cells;
  }, [cursor]);

  const monthLabel = cursor.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  // Capture "now" once on mount so the upcoming list doesn't call Date.now()
  // during render (which the purity rule disallows).
  const [now] = useState(() => Date.now());
  const upcoming = useMemo(() => {
    return filtered
      .filter((e) => new Date(e.date).getTime() >= now)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [filtered, now]);

  return (
    <div>
      {/* Controls */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setView("calendar")}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                view === "calendar"
                  ? "bg-studio-gold/10 text-studio-gold"
                  : "text-studio-muted hover:bg-studio-surface hover:text-studio-ink"
              }`}
            >
              Calendar
            </button>
            <button
              onClick={() => setView("list")}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                view === "list"
                  ? "bg-studio-gold/10 text-studio-gold"
                  : "text-studio-muted hover:bg-studio-surface hover:text-studio-ink"
              }`}
            >
              Upcoming list
            </button>
          </div>
          <div className="flex flex-wrap items-center gap-2">
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
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as EventTypeFilter)}
              className="rounded-xl border border-studio-line bg-studio-surface px-3 py-2 text-sm text-studio-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-studio-gold"
            >
              <option value="all">All Events</option>
              <option value="recording">Recordings</option>
              <option value="publication">Publications</option>
            </select>
          </div>
        </div>
      </div>

      {/* Calendar view */}
      {view === "calendar" ? (
        <div className="mt-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-studio-ink">{monthLabel}</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))
                }
                className="rounded-lg border border-studio-line px-3 py-1.5 text-sm text-studio-ink transition hover:border-studio-gold/50 hover:text-studio-gold"
              >
                ‹ Prev
              </button>
              <button
                onClick={() => {
                  const d = new Date();
                  setCursor(new Date(d.getFullYear(), d.getMonth(), 1));
                }}
                className="rounded-lg border border-studio-line px-3 py-1.5 text-sm text-studio-ink transition hover:border-studio-gold/50 hover:text-studio-gold"
              >
                Today
              </button>
              <button
                onClick={() =>
                  setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))
                }
                className="rounded-lg border border-studio-line px-3 py-1.5 text-sm text-studio-ink transition hover:border-studio-gold/50 hover:text-studio-gold"
              >
                Next ›
              </button>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="rounded-2xl border border-studio-line bg-studio-charcoal py-12 text-center">
              <p className="text-sm text-studio-muted">
                No scheduled recordings or publications match these filters.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-studio-line bg-studio-charcoal">
              <div className="grid min-w-[640px] grid-cols-7">
                {WEEKDAYS.map((d) => (
                  <div
                    key={d}
                    className="border-b border-studio-line px-2 py-2 text-center text-xs font-medium uppercase tracking-wide text-studio-muted"
                  >
                    {d}
                  </div>
                ))}
                {gridDays.map((day, i) => {
                  if (!day)
                    return <div key={i} className="min-h-[96px] border-b border-r border-studio-line/60" />;
                  const dayEvents = filtered.filter((e) => sameDay(new Date(e.date), day));
                  const isToday = sameDay(day, new Date());
                  return (
                    <div
                      key={i}
                      className="min-h-[96px] border-b border-r border-studio-line/60 p-1.5"
                    >
                      <p
                        className={`mb-1 text-xs font-medium ${
                          isToday ? "text-studio-gold" : "text-studio-muted"
                        }`}
                      >
                        {day.getDate()}
                      </p>
                      <div className="space-y-1">
                        {dayEvents.slice(0, 3).map((e) => (
                          <Link
                            key={e.id}
                            href={`/admin/episodes/${e.episodeId}`}
                            className={`block truncate rounded px-1.5 py-0.5 text-[10px] font-medium ${eventBadge(
                              e.type
                            )}`}
                            title={e.title}
                          >
                            {formatTime(e.date)} {e.title}
                          </Link>
                        ))}
                        {dayEvents.length > 3 && (
                          <p className="px-1.5 text-[10px] text-studio-muted">
                            +{dayEvents.length - 3} more
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Upcoming list view */
        <div className="mt-6">
          {upcoming.length === 0 ? (
            <div className="rounded-2xl border border-studio-line bg-studio-charcoal py-12 text-center">
              <p className="text-sm text-studio-muted">
                No upcoming recordings or publications scheduled.
              </p>
            </div>
          ) : (
            <ul className="space-y-3">
              {upcoming.map((e) => (
                <li
                  key={e.id}
                  className="flex flex-col gap-3 rounded-2xl border border-studio-line bg-studio-charcoal p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <Link
                      href={`/admin/episodes/${e.episodeId}`}
                      className="font-medium text-studio-ink transition hover:text-studio-gold"
                    >
                      {e.title}
                    </Link>
                    {e.showName && (
                      <p className="text-xs text-studio-muted">{e.showName}</p>
                    )}
                    {e.guestName && (
                      <p className="text-xs text-studio-muted/70">Guest: {e.guestName}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${eventBadge(
                        e.type
                      )}`}
                    >
                      {e.type === "recording" ? "Recording" : "Publication"}
                    </span>
                    <span className="text-sm text-studio-muted">
                      {formatFull(e.date)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
