import type { Metadata } from "next";
import { PublicPage } from "@/components/layout/PublicNav";
import { ArtworkFrame } from "@/components/visual/ArtworkFrame";
import { GuestCard } from "@/components/podcast/GuestCard";
import { getPublicGuests } from "@/lib/podcast-data";

export const metadata: Metadata = { title: "Guests" };

export const dynamic = "force-dynamic";

export default async function GuestsPage() {
  const guests = await getPublicGuests();

  return (
    <PublicPage>
      <div className="flex flex-col gap-1">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-studio-gold">
          The Voices
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-studio-ink sm:text-4xl">
          Guests
        </h1>
        <p className="text-sm text-studio-muted">
          The remarkable people who share their stories across the James Hollywood III Studios network.
        </p>
      </div>

      {guests.length === 0 ? (
        <div className="mt-10 flex flex-col items-center justify-center rounded-2xl border border-studio-line bg-studio-charcoal py-16 text-center">
          <ArtworkFrame size="md" label="GH3" subtitle="Guests" className="opacity-40" />
          <p className="mt-4 text-sm text-studio-muted">
            Guest profiles will appear here once episodes are published.
          </p>
        </div>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {guests.map((g) => (
            <GuestCard key={g.id} guest={g} />
          ))}
        </div>
      )}
    </PublicPage>
  );
}
