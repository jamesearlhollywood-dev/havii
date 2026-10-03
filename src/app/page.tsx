import Link from "next/link";
import { PublicHeader, PublicFooter } from "@/components/layout/PublicNav";
import { ArtworkFrame } from "@/components/visual/ArtworkFrame";
import { Waveform } from "@/components/visual/Waveform";
import { EpisodeCard } from "@/components/podcast/EpisodeCard";
import { getFeaturedEpisodes } from "@/lib/podcast-data";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const featuredEpisodes = await getFeaturedEpisodes();

  return (
    <div className="flex min-h-screen flex-col bg-studio-black">
      <PublicHeader />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-studio-line">
        <div className="pointer-events-none absolute inset-0 opacity-[0.04]">
          <Waveform bars={120} className="absolute bottom-0 h-full w-full" />
        </div>
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:py-24 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.25em] text-studio-gold">
              James Hollywood III Studios
            </p>
            <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-tight text-studio-ink sm:text-5xl lg:text-6xl">
              Stories of grace, <br className="hidden sm:block" />
              beyond the expected.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-studio-muted">
              A premium podcast network and content studio. Home of the{" "}
              <span className="font-medium text-studio-ink">
                Grace Beyond Podcast Show
              </span>{" "}
              by James Hollywood III — conversations that elevate, inspire, and
              go deeper.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/episodes"
                className="inline-flex items-center justify-center rounded-xl bg-studio-gold px-6 py-3 text-sm font-semibold text-studio-black transition hover:bg-studio-gold-light"
              >
                Listen Now
              </Link>
              <Link
                href="/shows"
                className="inline-flex items-center justify-center rounded-xl border border-studio-line px-6 py-3 text-sm font-semibold text-studio-ink transition hover:border-studio-gold/50 hover:text-studio-gold"
              >
                Explore Shows
              </Link>
            </div>
          </div>

          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              <div className="absolute -inset-4 rounded-3xl border border-studio-gold/20" />
              <ArtworkFrame
                size="xl"
                label="GH3"
                subtitle="Grace Beyond"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured show strip */}
      <section className="border-b border-studio-line bg-studio-charcoal">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <div className="flex flex-col gap-8 sm:flex-row sm:items-center">
            <ArtworkFrame size="md" label="GH3" subtitle="Grace Beyond" />
            <div className="flex-1">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-studio-gold">
                Now Streaming
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-studio-ink">
                Grace Beyond Podcast Show
              </h2>
              <p className="mt-2 text-sm text-studio-muted">
                Hosted by James Hollywood III. New episodes arriving soon.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                <Link
                  href="/shows"
                  className="rounded-lg border border-studio-line px-4 py-2 text-sm text-studio-ink transition hover:border-studio-gold/50 hover:text-studio-gold"
                >
                  Show details
                </Link>
                <Link
                  href="/episodes"
                  className="rounded-lg border border-studio-line px-4 py-2 text-sm text-studio-ink transition hover:border-studio-gold/50 hover:text-studio-gold"
                >
                  Browse episodes
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Episodes */}
      {featuredEpisodes.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-16">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-studio-gold">
                Featured
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-studio-ink">
                Featured Episodes
              </h2>
            </div>
            <Link
              href="/episodes"
              className="hidden rounded-lg border border-studio-line px-4 py-2 text-sm text-studio-ink transition hover:border-studio-gold/50 hover:text-studio-gold sm:inline-flex"
            >
              All Episodes →
            </Link>
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredEpisodes.map((ep) => (
              <EpisodeCard key={ep.id} episode={ep} />
            ))}
          </div>
        </section>
      )}

      {/* Network pillars */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-2xl font-semibold tracking-tight text-studio-ink">
          The Network
        </h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            ["Shows", "Premium podcast series across the network."],
            ["Episodes", "Deep conversations, on demand and in order."],
            ["Guests", "The voices and stories behind every episode."],
          ].map(([title, body]) => (
            <div
              key={title}
              className="rounded-2xl border border-studio-line bg-studio-charcoal p-6"
            >
              <h3 className="text-lg font-semibold text-studio-ink">{title}</h3>
              <p className="mt-2 text-sm text-studio-muted">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
