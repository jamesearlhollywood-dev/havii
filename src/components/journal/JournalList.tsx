"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import type { JournalEntry } from "@/actions/journal";
import { Button } from "@/components/ui/Button";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function preview(body: string): string {
  const text = body.replace(/\n+/g, " ").trim();
  return text.length > 120 ? text.slice(0, 120) + "…" : text;
}

export function JournalList({ entries }: { entries: JournalEntry[] }) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search.trim()) return entries;
    const q = search.toLowerCase();
    return entries.filter(
      (e) =>
        (e.title?.toLowerCase().includes(q) ?? false) ||
        e.body.toLowerCase().includes(q)
    );
  }, [entries, search]);

  const isEmpty = entries.length === 0;
  const noResults = !isEmpty && filtered.length === 0;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-havii-ink">Journal</h1>
        <Link href="/app/journal/new" className="shrink-0">
          <Button size="sm">+ New Entry</Button>
        </Link>
      </div>

      <p className="text-xs text-havii-muted">
        Your journal is private. Only you can read, edit, or delete your entries.
        Mentors, caregivers, and HAVII staff cannot see your journal.
      </p>

      {isEmpty ? (
        <div className="rounded-2xl border border-havii-mist bg-white p-8 text-center">
          <p className="text-base font-medium text-havii-ink">
            Your journal starts here.
          </p>
          <p className="mt-1 text-sm text-havii-muted">
            Write what&apos;s on your mind, at your own pace.
          </p>
          <Link href="/app/journal/new" className="mt-4 inline-block">
            <Button size="lg">Write your first entry</Button>
          </Link>
        </div>
      ) : (
        <>
          <div>
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search your entries…"
              aria-label="Search journal entries"
              className="w-full rounded-xl border border-havii-mist bg-white px-3.5 py-2.5 text-sm text-havii-ink placeholder:text-havii-muted shadow-sm transition focus:outline-none focus-visible:ring-2 focus-visible:ring-havii-teal focus-visible:border-havii-teal"
            />
          </div>

          {noResults ? (
            <p className="py-8 text-center text-sm text-havii-muted">
              No entries match &ldquo;{search}&rdquo;.
            </p>
          ) : (
            <ul className="space-y-3">
              {filtered.map((entry) => (
                <li key={entry.id}>
                  <Link
                    href={`/app/journal/${entry.id}`}
                    className="block rounded-2xl border border-havii-mist bg-white p-4 shadow-sm transition hover:border-havii-teal/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-havii-teal"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <h2 className="font-medium text-havii-ink line-clamp-1">
                        {entry.title || "Untitled"}
                      </h2>
                      <span className="shrink-0 text-xs text-havii-muted">
                        {formatDate(entry.created_at)}
                      </span>
                    </div>
                    <p className="mt-1.5 text-sm text-havii-muted line-clamp-2 whitespace-pre-wrap">
                      {preview(entry.body)}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}
