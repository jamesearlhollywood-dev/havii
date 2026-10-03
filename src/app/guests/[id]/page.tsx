import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PublicPage } from "@/components/layout/PublicNav";
import { ArtworkFrame } from "@/components/visual/ArtworkFrame";
import { EpisodeCard } from "@/components/podcast/EpisodeCard";
import { getPublicGuestById } from "@/lib/podcast-data";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const profile = await getPublicGuestById(id);
  if (!profile) return { title: "Guest Not Found" };
  const name = [profile.guest.first_name, profile.guest.last_name]
    .filter(Boolean)
    .join(" ");
  return { title: name, description: profile.guest.biography ?? undefined };
}

function formatDate(iso: string | null): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function fullName(g: { first_name: string; last_name: string | null }): string {
  return [g.first_name, g.last_name].filter(Boolean).join(" ") || g.first_name;
}

function initials(g: { first_name: string; last_name: string | null }): string {
  return `${g.first_name[0] ?? ""}${g.last_name?.[0] ?? ""}`.toUpperCase();
}

export default async function PublicGuestPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const profile = await getPublicGuestById(id);

  // Not public unless the guest appears on at least one published episode.
  if (!profile) notFound();

  const { guest, episodes } = profile;
  const name = fullName(guest);

  return (
    <PublicPage>
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-studio-muted" aria-label="Breadcrumb">
        <Link href="/guests" className="transition hover:text-studio-gold">
          Guests
        </Link>
        <span className="text-studio-muted/50">/</span>
        <span className="truncate text-studio-ink">{name}</span>
      </nav>

      {/* Header */}
      <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-center">
        <div className="h-28 w-28 shrink-0 overflow-hidden rounded-2xl border border-studio-gold/30 bg-studio-surface">
          {guest.headshot ? (
            <img
              src={guest.headshot}
              alt={name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <ArtworkFrame size="md" label="GH3" subtitle="" />
            </div>
          )}
        </div>
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-studio-ink sm:text-4xl">
            {name}
          </h1>
          {(guest.professional_title || guest.organization) && (
            <p className="mt-2 text-sm text-studio-gold">
              {[guest.professional_title, guest.organization]
                .filter(Boolean)
                .join(" · ")}
            </p>
          )}
          {guest.website && (
            <a
              href={guest.website}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-studio-gold transition hover:text-studio-gold-light"
            >
              Website ↗
            </a>
          )}
        </div>
      </div>

      {/* Biography */}
      {guest.biography && (
        <section className="mt-12">
          <h2 className="text-xl font-semibold tracking-tight text-studio-ink">
            About
          </h2>
          <div className="mt-4 rounded-2xl border border-studio-line bg-studio-charcoal p-6">
            <p className="whitespace-pre-line text-sm leading-relaxed text-studio-muted sm:text-base">
              {guest.biography}
            </p>
          </div>
        </section>
      )}

      {/* Social links — public only */}
      {(guest.linkedin_url || guest.instagram_url || guest.facebook_url) && (
        <section className="mt-8">
          <div className="flex flex-wrap gap-3">
            {guest.linkedin_url && (
              <a
                href={guest.linkedin_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-studio-line px-4 py-2.5 text-sm font-medium text-studio-ink transition hover:border-studio-gold/50 hover:text-studio-gold"
              >
                LinkedIn ↗
              </a>
            )}
            {guest.instagram_url && (
              <a
                href={guest.instagram_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-studio-line px-4 py-2.5 text-sm font-medium text-studio-ink transition hover:border-studio-gold/50 hover:text-studio-gold"
              >
                Instagram ↗
              </a>
            )}
            {guest.facebook_url && (
              <a
                href={guest.facebook_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-studio-line px-4 py-2.5 text-sm font-medium text-studio-ink transition hover:border-studio-gold/50 hover:text-studio-gold"
              >
                Facebook ↗
              </a>
            )}
          </div>
        </section>
      )}

      {/* Published appearances */}
      <section className="mt-12">
        <h2 className="text-xl font-semibold tracking-tight text-studio-ink">
          Appearances
        </h2>
        <p className="mt-1 text-sm text-studio-muted">
          {episodes.length} published {episodes.length === 1 ? "episode" : "episodes"}
        </p>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {episodes.map((ep) => (
            <EpisodeCard key={ep.id} episode={ep} compact />
          ))}
        </div>
      </section>
    </PublicPage>
  );
}
