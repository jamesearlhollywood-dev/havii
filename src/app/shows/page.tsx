import type { Metadata } from "next";
import Link from "next/link";
import { PublicPage } from "@/components/layout/PublicNav";
import { ArtworkFrame } from "@/components/visual/ArtworkFrame";
import { getPublicShows } from "@/lib/podcast-data";
import { SHOW_STATUS_LABELS } from "@/lib/podcast-types";

export const metadata: Metadata = { title: "Shows" };

export const dynamic = "force-dynamic";

export default async function ShowsPage() {
  const shows = await getPublicShows();

  return (
    <PublicPage>
      <div className="flex flex-col gap-2">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-studio-gold">
          The Network
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-studio-ink sm:text-4xl">
          Shows
        </h1>
        <p className="max-w-xl text-sm text-studio-muted sm:text-base">
          Browse every podcast series in the James Hollywood III Studios network.
        </p>
      </div>

      {shows.length === 0 ? (
        <div className="mt-12 flex flex-col items-center justify-center rounded-2xl border border-studio-line bg-studio-charcoal py-20 text-center">
          <ArtworkFrame size="md" label="GH3" subtitle="Coming Soon" />
          <p className="mt-6 text-sm text-studio-muted">
            Shows will appear here once they are published. The Grace Beyond Podcast Show is coming soon.
          </p>
          <Link
            href="/"
            className="mt-4 rounded-lg border border-studio-line px-4 py-2 text-sm text-studio-ink transition hover:border-studio-gold/50 hover:text-studio-gold"
          >
            Back to home
          </Link>
        </div>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {shows.map((show) => (
            <Link
              key={show.id}
              href={`/shows/${show.slug}`}
              className="group flex flex-col overflow-hidden rounded-2xl border border-studio-line bg-studio-charcoal transition hover:border-studio-gold/40"
            >
              <div className="relative aspect-square overflow-hidden">
                {show.cover_image ? (
                  <img
                    src={show.cover_image}
                    alt={show.show_name}
                    className="h-full w-full object-cover transition group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <ArtworkFrame size="lg" label="GH3" subtitle={show.show_name} />
                  </div>
                )}
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h2 className="text-lg font-semibold text-studio-ink">{show.show_name}</h2>
                <p className="mt-1 text-sm text-studio-muted">
                  Hosted by {show.host_name ?? "James Hollywood III"}
                </p>
                {show.short_description && (
                  <p className="mt-3 text-sm text-studio-muted line-clamp-2">
                    {show.short_description}
                  </p>
                )}
                <div className="mt-4 flex items-center gap-2">
                  {show.category && (
                    <span className="rounded-full bg-studio-surface px-2.5 py-0.5 text-xs text-studio-muted">
                      {show.category}
                    </span>
                  )}
                  <span className="ml-auto text-sm font-medium text-studio-gold transition group-hover:underline">
                    View →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </PublicPage>
  );
}
