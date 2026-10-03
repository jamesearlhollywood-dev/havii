import Link from "next/link";
import type { GuestWithStats } from "@/lib/podcast-types";

function initials(first: string, last: string | null): string {
  return `${first[0] ?? ""}${last?.[0] ?? ""}`.toUpperCase();
}

function publicName(g: { first_name: string; last_name: string | null }): string {
  return [g.first_name, g.last_name].filter(Boolean).join(" ") || g.first_name;
}

/**
 * Reusable guest card for public episode pages and the guest directory.
 * Shows only public-facing information — never email, phone, notes, or
 * booking status.
 */
export function GuestCard({ guest }: { guest: GuestWithStats }) {
  return (
    <Link
      href={`/guests/${guest.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-studio-line bg-studio-charcoal transition hover:border-studio-gold/40"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        {guest.headshot ? (
          <img
            src={guest.headshot}
            alt={publicName(guest)}
            className="h-full w-full object-cover transition group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-studio-surface">
            <span className="font-mono text-3xl font-bold text-studio-gold">
              {initials(guest.first_name, guest.last_name)}
            </span>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-base font-semibold text-studio-ink">
          {publicName(guest)}
        </h3>
        {(guest.professional_title || guest.organization) && (
          <p className="mt-1 text-sm text-studio-gold">
            {[guest.professional_title, guest.organization]
              .filter(Boolean)
              .join(" · ")}
          </p>
        )}
        {guest.biography && (
          <p className="mt-2 line-clamp-3 text-sm text-studio-muted">
            {guest.biography}
          </p>
        )}
        <p className="mt-3 text-xs text-studio-muted">
          {guest.episode_count} {guest.episode_count === 1 ? "appearance" : "appearances"}
        </p>
      </div>
    </Link>
  );
}
