"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

interface Option {
  value: string;
  label: string;
}

interface EpisodeSearchBarProps {
  showOptions: Option[];
  guestOptions: Option[];
  categoryOptions: Option[];
}

export function EpisodeSearchBar({
  showOptions,
  guestOptions,
  categoryOptions,
}: EpisodeSearchBarProps) {
  const router = useRouter();
  const params = useSearchParams();

  const update = useCallback(
    (key: string, value: string) => {
      const sp = new URLSearchParams(params.toString());
      if (value && value !== "all") sp.set(key, value);
      else sp.delete(key);
      router.push(`/episodes?${sp.toString()}`);
    },
    [params, router]
  );

  const onSearch = useCallback(
    (value: string) => {
      const sp = new URLSearchParams(params.toString());
      if (value) sp.set("q", value);
      else sp.delete("q");
      router.push(`/episodes?${sp.toString()}`);
    },
    [params, router]
  );

  return (
    <div className="flex flex-col gap-3">
      {/* Search input */}
      <input
        type="text"
        placeholder="Search episodes by title, show, guest, or keywords…"
        defaultValue={params.get("q") ?? ""}
        onChange={(e) => onSearch(e.target.value)}
        className="w-full rounded-xl border border-studio-line bg-studio-surface px-4 py-3 text-sm text-studio-ink placeholder:text-studio-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-studio-gold"
      />

      {/* Filter dropdowns */}
      <div className="flex flex-wrap gap-3">
        <select
          value={params.get("show") ?? "all"}
          onChange={(e) => update("show", e.target.value)}
          className="rounded-xl border border-studio-line bg-studio-surface px-3 py-2 text-sm text-studio-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-studio-gold"
          aria-label="Filter by show"
        >
          <option value="all">All Shows</option>
          {showOptions.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>

        <select
          value={params.get("category") ?? "all"}
          onChange={(e) => update("category", e.target.value)}
          className="rounded-xl border border-studio-line bg-studio-surface px-3 py-2 text-sm text-studio-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-studio-gold"
          aria-label="Filter by category"
        >
          <option value="all">All Categories</option>
          {categoryOptions.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>

        <select
          value={params.get("guest") ?? "all"}
          onChange={(e) => update("guest", e.target.value)}
          className="rounded-xl border border-studio-line bg-studio-surface px-3 py-2 text-sm text-studio-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-studio-gold"
          aria-label="Filter by guest"
        >
          <option value="all">All Guests</option>
          {guestOptions.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
