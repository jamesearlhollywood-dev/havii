import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PublicPage } from "@/components/layout/PublicNav";
import { ArtworkFrame } from "@/components/visual/ArtworkFrame";
import { AudioPlayer } from "@/components/podcast/AudioPlayer";
import { TranscriptSection } from "@/components/podcast/TranscriptSection";
import { ShowNotesSection } from "@/components/podcast/ShowNotesSection";
import { EpisodeCard } from "@/components/podcast/EpisodeCard";
import {
  getPublishedEpisodeBySlug,
  getRelatedEpisodes,
} from "@/lib/podcast-data";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; episodeSlug: string }>;
}): Promise<Metadata> {
  const { slug, episodeSlug } = await params;
  const episode = await getPublishedEpisodeBySlug(slug, episodeSlug);
  if (!episode) return { title: "Episode Not Found" };
  return {
    title: episode.title,
    description: episode.short_description ?? undefined,
  };
}

function formatDate(iso: string | null): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function guestDisplayName(g: {
  first_name: string;
  last_name: string | null;
  professional_title: string | null;
  organization: string | null;
}): string {
  const name = [g.first_name, g.last_name].filter(Boolean).join(" ");
  const title = [g.professional_title, g.organization].filter(Boolean).join(", ");
  return title ? `${name} — ${title}` : name;
}

export default async function EpisodePage({
  params,
}: {
  params: Promise<{ slug: string; episodeSlug: string }>;
}) {
  const { slug, episodeSlug } = await params;
  const episode = await getPublishedEpisodeBySlug(slug, episodeSlug);

  // RLS already limits public reads to published episodes, but we double-check
  // server-side so direct URLs to drafts/scheduled episodes return 404.
  if (!episode || episode.episode_status !== "published") notFound();

  const related = await getRelatedEpisodes(episode.show_id, episode.id);
  const showSlug = episode.show?.slug ?? slug;

  return (
    <PublicPage>
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-studio-muted" aria-label="Breadcrumb">
        <Link href="/shows" className="transition hover:text-studio-gold">Shows</Link>
        <span className="text-studio-muted/50">/</span>
        <Link href={`/shows/${showSlug}`} className="transition hover:text-studio-gold">
          {episode.show?.show_name ?? "Show"}
        </Link>
        <span className="text-studio-muted/50">/</span>
        <span className="truncate text-studio-ink">{episode.title}</span>
      </nav>

      {/* Header */}
      <div className="mt-6 grid gap-8 lg:grid-cols-[auto_1fr]">
        <div className="mx-auto lg:mx-0">
          <div className="relative">
            <div className="absolute -inset-3 rounded-3xl border border-studio-gold/20" />
            {episode.cover_image ? (
              <img
                src={episode.cover_image}
                alt={episode.title}
                className="relative h-48 w-48 rounded-2xl border border-studio-line object-cover sm:h-56 sm:w-56"
              />
            ) : (
              <ArtworkFrame size="lg" label="GH3" subtitle={episode.show?.show_name ?? ""} />
            )}
          </div>
        </div>

        <div className="flex flex-col justify-center">
          {episode.show?.show_name && (
            <Link
              href={`/shows/${showSlug}`}
              className="text-xs font-medium uppercase tracking-[0.2em] text-studio-gold transition hover:text-studio-gold-light"
            >
              {episode.show.show_name}
            </Link>
          )}
          <div className="mt-2 flex items-center gap-3 text-sm text-studio-muted">
            {episode.episode_number != null && <span>Episode {episode.episode_number}</span>}
            {episode.season_number != null && (
              <span>· Season {episode.season_number}</span>
            )}
            {episode.publish_date && (
              <span>· {formatDate(episode.publish_date)}</span>
            )}
            {episode.duration && <span>· {episode.duration}</span>}
          </div>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-studio-ink sm:text-4xl">
            {episode.title}
          </h1>
          {episode.short_description && (
            <p className="mt-3 text-lg text-studio-muted">{episode.short_description}</p>
          )}

          {/* Share buttons */}
          <div className="mt-6 flex flex-wrap gap-3">
            <ShareButtons />
            <Link
              href={`/shows/${showSlug}`}
              className="inline-flex items-center gap-2 rounded-xl border border-studio-line px-4 py-2.5 text-sm font-medium text-studio-ink transition hover:border-studio-gold/50 hover:text-studio-gold"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="m12 19-7-7 7-7M5 12h14" />
              </svg>
              Back to Show
            </Link>
          </div>
        </div>
      </div>

      {/* Audio player */}
      <div className="mt-10">
        <AudioPlayer
          audioUrl={episode.audio_url}
          title={episode.title}
          showName={episode.show?.show_name ?? ""}
          coverImage={episode.cover_image}
        />
      </div>

      {/* Featured guest */}
      {episode.guest && (
        <section className="mt-14">
          <h2 className="text-xl font-semibold tracking-tight text-studio-ink">
            Featured Guest
          </h2>
          <div className="mt-4 flex flex-col items-start gap-6 rounded-2xl border border-studio-line bg-studio-charcoal p-6 sm:flex-row sm:items-center">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full border border-studio-gold/40 bg-studio-surface">
              {episode.guest.headshot ? (
                <img
                  src={episode.guest.headshot}
                  alt={episode.guest.first_name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="font-mono text-lg font-bold text-studio-gold">
                  {episode.guest.first_name[0]}
                  {episode.guest.last_name?.[0] ?? ""}
                </span>
              )}
            </div>
            <div>
              <p className="text-lg font-semibold text-studio-ink">
                {guestDisplayName(episode.guest)}
              </p>
              {episode.guest.biography && (
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-studio-muted">
                  {episode.guest.biography}
                </p>
              )}
              <div className="mt-3 flex flex-wrap gap-3">
                <Link
                  href={`/guests/${episode.guest.id}`}
                  className="text-xs font-medium text-studio-gold transition hover:text-studio-gold-light"
                >
                  View guest profile →
                </Link>
                {episode.guest.website && (
                  <a
                    href={episode.guest.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-medium text-studio-gold transition hover:text-studio-gold-light"
                  >
                    Website ↗
                  </a>
                )}
                {episode.guest.linkedin_url && (
                  <a
                    href={episode.guest.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-medium text-studio-gold transition hover:text-studio-gold-light"
                  >
                    LinkedIn ↗
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Full description */}
      {episode.full_description && (
        <section className="mt-14">
          <h2 className="text-xl font-semibold tracking-tight text-studio-ink">
            About This Episode
          </h2>
          <div className="mt-4 rounded-2xl border border-studio-line bg-studio-charcoal p-6">
            <p className="whitespace-pre-line text-sm leading-relaxed text-studio-muted sm:text-base">
              {episode.full_description}
            </p>
          </div>
        </section>
      )}

      {/* Show notes */}
      {episode.show_notes && (
        <ShowNotesSection showNotes={episode.show_notes} />
      )}

      {/* Transcript */}
      {episode.transcript && (
        <TranscriptSection transcript={episode.transcript} />
      )}

      {/* Related episodes */}
      {related.length > 0 && (
        <section className="mt-14">
          <h2 className="text-xl font-semibold tracking-tight text-studio-ink">
            More from {episode.show?.show_name ?? "This Show"}
          </h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((ep) => (
              <EpisodeCard key={ep.id} episode={ep} compact />
            ))}
          </div>
        </section>
      )}
    </PublicPage>
  );
}

function ShareButtons() {
  return (
    <>
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
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4" />
        </svg>
        Share
      </button>
      <button
        type="button"
        onClick={() => {
          if (navigator.clipboard) navigator.clipboard.writeText(window.location.href);
        }}
        className="inline-flex items-center gap-2 rounded-xl border border-studio-line px-4 py-2.5 text-sm font-medium text-studio-ink transition hover:border-studio-gold/50 hover:text-studio-gold"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
        Copy Link
      </button>
    </>
  );
}
