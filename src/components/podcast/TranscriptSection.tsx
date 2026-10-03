"use client";

import { useMemo, useState } from "react";

interface TranscriptSectionProps {
  transcript: string;
}

export function TranscriptSection({ transcript }: TranscriptSectionProps) {
  const [expanded, setExpanded] = useState(false);
  const [query, setQuery] = useState("");

  const isLong = transcript.length > 2000;

  const displayText = useMemo(() => {
    if (!query.trim()) return transcript;
    // Highlight matching portions by splitting on the search term
    const term = query.trim();
    const parts = transcript.split(new RegExp(`(${term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi"));
    return parts;
  }, [transcript, query]);

  const hasResults = useMemo(() => {
    if (!query.trim()) return true;
    return transcript.toLowerCase().includes(query.trim().toLowerCase());
  }, [transcript, query]);

  return (
    <section className="mt-14">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold tracking-tight text-studio-ink">
          Transcript
        </h2>
        {isLong && (
          <button
            type="button"
            onClick={() => setExpanded((e) => !e)}
            className="text-sm font-medium text-studio-gold transition hover:text-studio-gold-light"
          >
            {expanded ? "Collapse" : "Expand full transcript"}
          </button>
        )}
      </div>

      {/* Search */}
      <div className="mt-4">
        <input
          type="text"
          placeholder="Search transcript…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-xl border border-studio-line bg-studio-surface px-3.5 py-2.5 text-sm text-studio-ink placeholder:text-studio-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-studio-gold"
        />
      </div>

      <div className="mt-4 rounded-2xl border border-studio-line bg-studio-charcoal p-6">
        {query.trim() && !hasResults ? (
          <p className="text-sm text-studio-muted">
            No matches found for &ldquo;{query}&rdquo;.
          </p>
        ) : (
          <div
            className={`text-sm leading-relaxed text-studio-muted sm:text-base ${
              isLong && !expanded ? "max-h-64 overflow-hidden" : ""
            }`}
          >
            {query.trim() && Array.isArray(displayText) ? (
              <p className="whitespace-pre-line">
                {displayText.map((part, i) =>
                  part.toLowerCase() === query.trim().toLowerCase() ? (
                    <mark key={i} className="rounded bg-studio-gold/30 text-studio-ink">
                      {part}
                    </mark>
                  ) : (
                    <span key={i}>{part}</span>
                  )
                )}
              </p>
            ) : (
              <p className="whitespace-pre-line">{transcript}</p>
            )}
          </div>
        )}
        {isLong && !expanded && (
          <div className="pointer-events-none mt-0 -mb-6 h-16 bg-gradient-to-t from-studio-charcoal to-transparent" />
        )}
      </div>
    </section>
  );
}
