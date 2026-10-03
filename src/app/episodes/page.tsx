import type { Metadata } from "next";
import { PublicPage } from "@/components/layout/PublicNav";
import { EpisodeCard } from "@/components/podcast/EpisodeCard";
import { EpisodeSearchBar } from "@/components/podcast/EpisodeSearchBar";
import { EmptyState } from "@/components/podcast/EmptyState";
import {
  searchPublishedEpisodes,
  getPublicShows,
  getAllGuests,
} from "@/lib/podcast-data";

export const metadata: Metadata = { title: "Episodes" };

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ q?: string; show?: string; guest?: string; category?: string }>;
}

export default async function EpisodesPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const query = sp.q ?? "";
  const showId = sp.show && sp.show !== "all" ? sp.show : undefined;
  const guestId = sp.guest && sp.guest !== "all" ? sp.guest : undefined;
  const category = sp.category && sp.category !== "all" ? sp.category : undefined;

  const hasFilters = Boolean(query || showId || guestId || category);

  const [episodes, shows, guests] = await Promise.all([
    hasFilters
      ? searchPublishedEpisodes(query, { showId, guestId, category })
      : searchPublishedEpisodes("", {}),
    getPublicShows(),
    getAllGuests(),
  ]);

  // Derive unique categories from active shows
  const categoryOptions = Array.from(
    new Set(shows.map((s) => s.category).filter(Boolean))
  ).map((c) => ({ value: c as string, label: c as string }));

  const showOptions = shows.map((s) => ({ value: s.id, label: s.show_name }));
  const guestOptions = guests
    .filter((g) => g.first_name)
    .map((g) => ({
      value: g.id,
      label: [g.first_name, g.last_name].filter(Boolean).join(" "),
    }));

  return (
    <PublicPage>
      <div className="flex flex-col gap-2">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-studio-gold">
          Listen
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-studio-ink sm:text-4xl">
          Episodes
        </h1>
        <p className="max-w-xl text-sm text-studio-muted sm:text-base">
          Every episode across the network — full conversations, show notes, and transcripts.
        </p>
      </div>

      <div className="mt-8">
        <EpisodeSearchBar
          showOptions={showOptions}
          guestOptions={guestOptions}
          categoryOptions={categoryOptions}
        />
      </div>

      <div className="mt-8">
        {episodes.length === 0 ? (
          <EmptyState
            title={hasFilters ? "No episodes found" : "No episodes yet"}
            message={
              hasFilters
                ? "Try adjusting your search or filters to find what you're looking for."
                : "Episodes will appear here once they are published. Check back soon — new conversations are on the way."
            }
          />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {episodes.map((ep) => (
              <EpisodeCard key={ep.id} episode={ep} />
            ))}
          </div>
        )}
      </div>
    </PublicPage>
  );
}
