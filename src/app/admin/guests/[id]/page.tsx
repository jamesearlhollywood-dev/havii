import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getGuestWithRelations } from "@/lib/podcast-data";
import { GUEST_BOOKING_LABELS, EPISODE_STATUS_LABELS } from "@/lib/podcast-types";
import {
  BookingStatusUpdater,
  AddNoteForm,
} from "@/components/admin/GuestProfileActions";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const guest = await getGuestWithRelations(id);
  if (!guest) return { title: "Guest Not Found" };
  const name = [guest.first_name, guest.last_name].filter(Boolean).join(" ");
  return { title: `Guest · ${name}` };
}

function bookingBadge(status: string): string {
  const colors: Record<string, string> = {
    prospect: "bg-studio-surface text-studio-muted",
    invited: "bg-sky-500/10 text-sky-400",
    interested: "bg-teal-500/10 text-teal-400",
    scheduling: "bg-amber-500/10 text-amber-400",
    confirmed: "bg-blue-500/10 text-blue-400",
    recorded: "bg-purple-500/10 text-purple-400",
    published: "bg-studio-gold/10 text-studio-gold",
    declined: "bg-red-500/10 text-red-400",
    archived: "bg-studio-line/40 text-studio-muted/80",
    tentative: "bg-studio-surface text-studio-muted",
  };
  return colors[status] ?? "bg-studio-surface text-studio-muted";
}

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatDateTime(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function fullName(g: { first_name: string; last_name: string | null }): string {
  return [g.first_name, g.last_name].filter(Boolean).join(" ") || g.first_name;
}

function initials(g: { first_name: string; last_name: string | null }): string {
  return `${g.first_name[0] ?? ""}${g.last_name?.[0] ?? ""}`.toUpperCase();
}

function episodeHref(ep: { show: { slug: string } | null; id: string }): string {
  return `/admin/episodes/${ep.id}`;
}

export default async function GuestProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const guest = await getGuestWithRelations(id);
  if (!guest) notFound();

  const name = fullName(guest);

  return (
    <div>
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-studio-muted" aria-label="Breadcrumb">
        <Link href="/admin/guests" className="transition hover:text-studio-gold">
          Guests
        </Link>
        <span className="text-studio-muted/50">/</span>
        <span className="truncate text-studio-ink">{name}</span>
      </nav>

      {/* Header */}
      <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="h-24 w-24 shrink-0 overflow-hidden rounded-2xl border border-studio-gold/30 bg-studio-surface">
            {guest.headshot ? (
              <img
                src={guest.headshot}
                alt={name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center font-mono text-2xl font-bold text-studio-gold">
                {initials(guest)}
              </div>
            )}
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-studio-ink sm:text-3xl">
              {name}
            </h1>
            {(guest.professional_title || guest.organization) && (
              <p className="mt-1 text-sm text-studio-gold">
                {[guest.professional_title, guest.organization]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
            )}
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <span
                className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${bookingBadge(
                  guest.booking_status
                )}`}
              >
                {GUEST_BOOKING_LABELS[guest.booking_status] ?? guest.booking_status}
              </span>
              <span className="text-xs text-studio-muted">
                {guest.episode_count} {guest.episode_count === 1 ? "episode" : "episodes"}
              </span>
            </div>
          </div>
        </div>

        {/* Admin actions */}
        <div className="flex flex-wrap gap-2">
          <Link
            href={`/admin/guests/${guest.id}/edit`}
            className="inline-flex items-center gap-2 rounded-xl bg-studio-gold px-4 py-2 text-sm font-semibold text-studio-black transition hover:bg-studio-gold-light"
          >
            Edit Guest
          </Link>
          <Link
            href={`/admin/episodes/new?guest=${guest.id}`}
            className="inline-flex items-center gap-2 rounded-xl border border-studio-line bg-studio-surface px-4 py-2 text-sm font-medium text-studio-ink transition hover:border-studio-gold/50 hover:text-studio-gold"
          >
            Add to Episode
          </Link>
          <Link
            href={`/admin/episodes/new?guest=${guest.id}`}
            className="inline-flex items-center gap-2 rounded-xl border border-studio-line bg-studio-charcoal px-4 py-2 text-sm font-medium text-studio-ink transition hover:border-studio-gold/50 hover:text-studio-gold"
          >
            Schedule Recording
          </Link>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {/* Left: bio + episodes */}
        <div className="space-y-6 lg:col-span-2">
          {guest.biography && (
            <section className="rounded-2xl border border-studio-line bg-studio-charcoal p-6">
              <h2 className="text-lg font-semibold text-studio-ink">Biography</h2>
              <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-studio-muted">
                {guest.biography}
              </p>
            </section>
          )}

          {/* Upcoming recordings */}
          <section className="rounded-2xl border border-studio-line bg-studio-charcoal p-6">
            <h2 className="text-lg font-semibold text-studio-ink">
              Upcoming Recording Dates
            </h2>
            {guest.upcoming.length === 0 ? (
              <p className="mt-3 text-sm text-studio-muted">
                No upcoming recordings scheduled for this guest.
              </p>
            ) : (
              <ul className="mt-3 space-y-3">
                {guest.upcoming.map((ep) => (
                  <li
                    key={ep.id}
                    className="flex items-center justify-between border-b border-studio-line/50 pb-3"
                  >
                    <div>
                      <Link
                        href={episodeHref(ep)}
                        className="font-medium text-studio-ink transition hover:text-studio-gold"
                      >
                        {ep.title}
                      </Link>
                      <p className="text-xs text-studio-muted">
                        {ep.show?.show_name ?? "—"}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="rounded-full bg-blue-500/10 px-2.5 py-0.5 text-xs text-blue-400">
                        {EPISODE_STATUS_LABELS[ep.episode_status]}
                      </span>
                      <p className="mt-1 text-xs text-studio-muted">
                        {formatDateTime(ep.recording_date)}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Past appearances */}
          <section className="rounded-2xl border border-studio-line bg-studio-charcoal p-6">
            <h2 className="text-lg font-semibold text-studio-ink">
              Episodes Featuring This Guest
            </h2>
            {guest.episodes.length === 0 ? (
              <p className="mt-3 text-sm text-studio-muted">
                This guest has not appeared on any episodes yet.
              </p>
            ) : (
              <ul className="mt-3 divide-y divide-studio-line/50">
                {guest.episodes.map((ep) => (
                  <li
                    key={ep.id}
                    className="flex items-center justify-between py-3"
                  >
                    <div className="min-w-0">
                      <Link
                        href={episodeHref(ep)}
                        className="truncate font-medium text-studio-ink transition hover:text-studio-gold"
                      >
                        {ep.title}
                      </Link>
                      <p className="text-xs text-studio-muted">
                        {ep.show?.show_name ?? "—"}
                        {ep.episode_number ? ` · EP ${ep.episode_number}` : ""}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          ep.episode_status === "published"
                            ? "bg-studio-gold/10 text-studio-gold"
                            : "bg-studio-surface text-studio-muted"
                        }`}
                      >
                        {EPISODE_STATUS_LABELS[ep.episode_status]}
                      </span>
                      <span className="hidden text-xs text-studio-muted sm:inline">
                        {formatDate(ep.recording_date ?? ep.publish_date)}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        {/* Right: contact, social, status, notes */}
        <div className="space-y-6">
          {/* Contact (admin only) */}
          <section className="rounded-2xl border border-studio-line bg-studio-charcoal p-6">
            <h2 className="text-base font-semibold text-studio-ink">
              Contact Information
            </h2>
            <dl className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between gap-3">
                <dt className="text-studio-muted">Email</dt>
                <dd className="text-studio-ink">
                  {guest.email ? (
                    <a href={`mailto:${guest.email}`} className="hover:text-studio-gold">
                      {guest.email}
                    </a>
                  ) : (
                    "—"
                  )}
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-studio-muted">Phone</dt>
                <dd className="text-studio-ink">{guest.phone ?? "—"}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-studio-muted">Website</dt>
                <dd className="text-studio-ink">
                  {guest.website ? (
                    <a
                      href={guest.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-studio-gold"
                    >
                      Visit ↗
                    </a>
                  ) : (
                    "—"
                  )}
                </dd>
              </div>
            </dl>
          </section>

          {/* Social */}
          <section className="rounded-2xl border border-studio-line bg-studio-charcoal p-6">
            <h2 className="text-base font-semibold text-studio-ink">Social Links</h2>
            <div className="mt-3 flex flex-col gap-2 text-sm">
              {[
                { label: "LinkedIn", url: guest.linkedin_url },
                { label: "Instagram", url: guest.instagram_url },
                { label: "Facebook", url: guest.facebook_url },
              ].map((s) => (
                <div key={s.label} className="flex justify-between gap-3">
                  <span className="text-studio-muted">{s.label}</span>
                  {s.url ? (
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-studio-gold hover:text-studio-gold-light"
                    >
                      View ↗
                    </a>
                  ) : (
                    <span className="text-studio-muted">—</span>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Booking status updater */}
          <section className="rounded-2xl border border-studio-line bg-studio-charcoal p-6">
            <h2 className="text-base font-semibold text-studio-ink">Booking Status</h2>
            <div className="mt-3">
              <BookingStatusUpdater
                guestId={guest.id}
                currentStatus={guest.booking_status}
              />
            </div>
          </section>

          {/* Internal notes */}
          <section className="rounded-2xl border border-studio-line bg-studio-charcoal p-6">
            <h2 className="text-base font-semibold text-studio-ink">Internal Notes</h2>
            {guest.notes ? (
              <p className="mt-3 whitespace-pre-line rounded-xl border border-studio-line bg-studio-surface p-3 text-xs leading-relaxed text-studio-muted">
                {guest.notes}
              </p>
            ) : (
              <p className="mt-3 text-xs text-studio-muted">No notes recorded.</p>
            )}
            <div className="mt-4">
              <AddNoteForm guestId={guest.id} />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
