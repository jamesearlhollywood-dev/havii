import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PublicPage } from "@/components/layout/PublicNav";
import { ArtworkFrame } from "@/components/visual/ArtworkFrame";
import { Waveform } from "@/components/visual/Waveform";
import { getShowBySlug, getPublishedEpisodesByShow } from "@/lib/podcast-data";
import { EPISODE_STATUS_LABELS } from "@/lib/podcast-types";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const show = await getShowBySlug(slug);
  if (!show) return { title: "Show Not Found" };
  return {
    title: show.show_name,
    description: show.short_description ?? show.full_description ?? undefined,
  };
}

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
}

function PlatformLinks({ show }: { show: { spotify_url: string | null; apple_podcast_url: string | null; youtube_url: string | null; rss_feed_url: string | null; website_url: string | null } }) {
  const links: { url: string | null; label: string }[] = [
    { url: show.spotify_url, label: "Spotify" },
    { url: show.apple_podcast_url, label: "Apple Podcasts" },
    { url: show.youtube_url, label: "YouTube" },
    { url: show.website_url, label: "Website" },
    { url: show.rss_feed_url, label: "RSS" },
  ];
  const active = links.filter((l) => l.url);
  if (active.length === 0) return null;

  return (
    <div className="mt-6 flex flex-wrap gap-3">
      {active.map((l) => (
        <a
          key={l.label}
          href={l.url!}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-xl border border-studio-line bg-studio-surface px-4 py-2.5 text-sm font-medium text-studio-ink transition hover:border-studio-gold/50 hover:text-studio-gold"
        >
          {l.label}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17 17 7M7 7h10v10" /></svg>
        </a>
      ))}
    </div>
  );
}

function ShareButton({ slug }: { slug: string }) {
  return (
    <button
      type="button"
      onClick={() => {
        if (navigator.share) {
          navigator.share({ url: window.location.href }).catch(() => {});
        } else if (navigator.clipboard) {
          navigator.clipboard.writeText(window.location.href);
        }
      }}
      className="inline-flex items-center gap-2 rounded-xl border border-studio-line px-4 py-2.5 text-sm font-medium text-studio-ink transition hover:border-studio-gold/50 hover:text-studio-gold"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4" /></svg>
      Share
    </button>
  );
}

export default async function ShowPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const show = await getShowBySlug(slug);
  if (!show) notFound();

  const episodes = await getPublishedEpisodesByShow(show.id);
  const hasLinks = Boolean(
    show.spotify_url || show.apple_podcast_url || show.youtube_url || show.rss_feed_url || show.website_url
  );

  return (
    <PublicPage>
      {/* Cover + header */}
      <div className="grid gap-8 lg:grid-cols-[auto_1fr]">
        <div className="mx-auto lg:mx-0">
          <div className="relative">
            <div className="absolute -inset-3 rounded-3xl border border-studio-gold/20" />
            {show.cover_image ? (
              <img
                src={show.cover_image}
                alt={show.show_name}
                className="relative h-56 w-56 rounded-2xl border border-studio-line object-cover sm:h-64 sm:w-64"
              />
            ) : (
              <ArtworkFrame size="lg" label="GH3" subtitle={show.show_name} />
            )}
          </div>
        </div>

        <div className="flex flex-col justify-center">
          {show.category && (
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-studio-gold">
              {show.category}
            </p>
          )}
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-studio-ink sm:text-4xl">
            {show.show_name}
          </h1>
          <p className="mt-2 text-lg text-studio-muted">
            Hosted by {show.host_name ?? "James Hollywood III"}
          </p>

          {hasLinks && <PlatformLinks show={show} />}

          <div className="mt-6 flex flex-wrap gap-3">
            <ShareButton slug={show.slug} />
            <Link
              href="/episodes"
              className="inline-flex items-center gap-2 rounded-xl border border-studio-line px-4 py-2.5 text-sm font-medium text-studio-ink transition hover:border-studio-gold/50 hover:text-studio-gold"
            >
              Browse all episodes
            </Link>
          </div>
        </div>
      </div>

      {/* Latest Episodes */}
      <section className="mt-14">
        <h2 className="text-xl font-semibold tracking-tight text-studio-ink">
          Latest Episodes
        </h2>
        {episodes.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-studio-line bg-studio-charcoal p-8 text-center">
            <Waveform bars={48} className="mx-auto h-10 w-full opacity-30" />
            <p className="mt-4 text-sm text-studio-muted">
              No episodes published yet. Check back soon — new episodes from {show.show_name} are on the way.
            </p>
          </div>
        ) : (
          <div className="mt-4 space-y-3">
            {episodes.map((ep) => (
              <Link
                key={ep.id}
                href={`/episodes#${ep.slug}`}
                className="flex items-center gap-4 rounded-2xl border border-studio-line bg-studio-charcoal p-4 transition hover:border-studio-gold/40"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-studio-line bg-studio-surface">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-studio-gold"><polygon points="6 4 20 12 6 20 6 4" /></svg>
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-studio-ink">{ep.title}</p>
                  <p className="text-xs text-studio-muted">
                    {formatDate(ep.publish_date)}
                    {ep.duration ? ` · ${ep.duration}` : ""}
                  </p>
                </div>
                {ep.short_description && (
                  <p className="hidden truncate text-sm text-studio-muted lg:block lg:max-w-xs">
                    {ep.short_description}
                  </p>
                )}
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* About the Show */}
      {show.full_description && (
        <section className="mt-14">
          <h2 className="text-xl font-semibold tracking-tight text-studio-ink">
            About the Show
          </h2>
          <div className="mt-4 rounded-2xl border border-studio-line bg-studio-charcoal p-6">
            <p className="whitespace-pre-line text-sm leading-relaxed text-studio-muted sm:text-base">
              {show.full_description}
            </p>
          </div>
        </section>
      )}

      {/* Host section */}
      <section className="mt-14">
        <h2 className="text-xl font-semibold tracking-tight text-studio-ink">
          Host
        </h2>
        <div className="mt-4 flex flex-col items-start gap-6 rounded-2xl border border-studio-line bg-studio-charcoal p-6 sm:flex-row sm:items-center">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border border-studio-gold/40 bg-studio-surface">
            <span className="font-mono text-lg font-bold text-studio-gold">
              {(show.host_name ?? "GH").split(" ").map((w) => w[0]).slice(0, 2).join("")}
            </span>
          </div>
          <div>
            <p className="text-lg font-semibold text-studio-ink">{show.host_name ?? "Host"}</p>
            <p className="mt-1 text-sm text-studio-muted">
              {show.short_description ?? "Host of " + show.show_name}
            </p>
          </div>
        </div>
      </section>

      {/* Guest highlights placeholder */}
      <section className="mt-14">
        <h2 className="text-xl font-semibold tracking-tight text-studio-ink">
          Guest Highlights
        </h2>
        <div className="mt-4 rounded-2xl border border-studio-line bg-studio-charcoal p-8 text-center">
          <p className="text-sm text-studio-muted">
            Guest information will appear here as episodes are published.
          </p>
        </div>
      </section>
    </PublicPage>
  );
}
