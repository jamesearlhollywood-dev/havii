import Link from "next/link";
import type { EpisodeWithShow } from "@/lib/podcast-types";
import { ArtworkFrame } from "@/components/visual/ArtworkFrame";

function formatDate(iso: string | null): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

interface EpisodeCardProps {
  episode: EpisodeWithShow;
  compact?: boolean;
}

export function EpisodeCard({ episode, compact = false }: EpisodeCardProps) {
  const showSlug = episode.show?.slug ?? "";
  const href = `/shows/${showSlug}/episodes/${episode.slug}`;

  return (
    <Link
      href={href}
      className="group flex flex-col overflow-hidden rounded-2xl border border-studio-line bg-studio-charcoal transition hover:border-studio-gold/40"
    >
      {/* Artwork */}
      <div className={`relative ${compact ? "aspect-square" : "aspect-square"} overflow-hidden`}>
        {episode.cover_image ? (
          <img
            src={episode.cover_image}
            alt={episode.title}
            className="h-full w-full object-cover transition group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <ArtworkFrame size="md" label="GH3" subtitle={episode.show?.show_name ?? ""} />
          </div>
        )}
        {/* Play overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-studio-black/40 opacity-0 transition group-hover:opacity-100">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-studio-gold text-studio-black">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <polygon points="6 4 20 12 6 20 6 4" />
            </svg>
          </span>
        </div>
        {episode.episode_number != null && (
          <span className="absolute left-3 top-3 rounded-full bg-studio-black/80 px-2.5 py-0.5 text-xs font-medium text-studio-gold backdrop-blur">
            EP {episode.episode_number}
          </span>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-studio-gold">
          {episode.show?.show_name ?? ""}
        </p>
        <h3 className="mt-1 line-clamp-2 text-base font-semibold text-studio-ink">
          {episode.title}
        </h3>
        {episode.short_description && (
          <p className="mt-2 line-clamp-2 text-sm text-studio-muted">
            {episode.short_description}
          </p>
        )}
        <div className="mt-3 flex items-center gap-3 text-xs text-studio-muted">
          {episode.publish_date && <span>{formatDate(episode.publish_date)}</span>}
          {episode.duration && (
            <>
              {episode.publish_date && <span>·</span>}
              <span>{episode.duration}</span>
            </>
          )}
        </div>
        <div className="mt-4">
          <span className="inline-flex items-center gap-1.5 rounded-lg border border-studio-line px-3 py-1.5 text-xs font-medium text-studio-ink transition group-hover:border-studio-gold/50 group-hover:text-studio-gold">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <polygon points="6 4 20 12 6 20 6 4" />
            </svg>
            Listen
          </span>
        </div>
      </div>
    </Link>
  );
}
