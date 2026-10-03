import Link from "next/link";
import type { Metadata } from "next";
import {
  getDashboardStats,
  getRecentActivity,
  getUpcomingSchedule,
} from "@/lib/podcast-data";
import {
  EPISODE_STATUS_LABELS,
  CONTACT_INQUIRY_LABELS,
  CONTACT_MESSAGE_LABELS,
} from "@/lib/podcast-types";

export const metadata: Metadata = { title: "Dashboard" };

function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: number;
  hint: string;
}) {
  return (
    <div className="rounded-2xl border border-studio-line bg-studio-charcoal p-5">
      <p className="text-xs uppercase tracking-wide text-studio-muted">{label}</p>
      <p className="mt-2 text-3xl font-semibold text-studio-ink">{value}</p>
      <p className="mt-1 text-xs text-studio-muted">{hint}</p>
    </div>
  );
}

const QUICK_ACTIONS = [
  { label: "Add New Show", href: "/admin/shows/new", icon: "plus" },
  { label: "Add New Episode", href: "/admin/episodes", icon: "play" },
  { label: "Add Guest", href: "/admin/guests", icon: "users" },
  { label: "View Production Queue", href: "/admin/production", icon: "sliders" },
  { label: "View Messages", href: "/admin/messages", icon: "mail" },
] as const;

function QuickActionIcon({ name }: { name: string }) {
  const p = {
    width: 18, height: 18, viewBox: "0 0 24 24", fill: "none",
    stroke: "currentColor", strokeWidth: 1.75, strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const, "aria-hidden": true,
  };
  switch (name) {
    case "plus": return (<svg {...p}><path d="M12 5v14M5 12h14" /></svg>);
    case "play": return (<svg {...p}><polygon points="6 4 20 12 6 20 6 4" /></svg>);
    case "users": return (<svg {...p}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></svg>);
    case "sliders": return (<svg {...p}><path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6" /></svg>);
    case "mail": return (<svg {...p}><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m2 7 10 6 10-6" /></svg>);
    default: return null;
  }
}

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
}

function formatDateTime(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short", day: "numeric", hour: "numeric", minute: "2-digit",
  });
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex items-center gap-3 py-6">
      <span className="h-2 w-2 rounded-full bg-studio-line" />
      <p className="text-sm text-studio-muted">{message}</p>
    </div>
  );
}

export default async function AdminDashboardPage() {
  const [stats, activity, schedule] = await Promise.all([
    getDashboardStats(),
    getRecentActivity(),
    getUpcomingSchedule(),
  ]);

  const hasActivity =
    activity.recentEpisodes.length > 0 ||
    activity.recentShows.length > 0 ||
    activity.recentGuests.length > 0 ||
    activity.recentMessages.length > 0;

  return (
    <div>
      <div className="flex flex-col gap-1">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-studio-gold">
          Studio Overview
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-studio-ink sm:text-3xl">
          Dashboard
        </h1>
        <p className="text-sm text-studio-muted">
          A snapshot of the James Hollywood III Studios network.
        </p>
      </div>

      {/* Summary cards */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Shows" value={stats.totalShows} hint="All statuses" />
        <StatCard label="Total Episodes" value={stats.totalEpisodes} hint="Across all shows" />
        <StatCard label="Published Episodes" value={stats.publishedEpisodes} hint="Live to public" />
        <StatCard label="Scheduled Episodes" value={stats.scheduledEpisodes} hint="Upcoming releases" />
        <StatCard label="Draft Episodes" value={stats.draftEpisodes} hint="In planning" />
        <StatCard label="Total Guests" value={stats.totalGuests} hint="All guests" />
        <StatCard label="Active Sponsors" value={stats.activeSponsors} hint="Current agreements" />
        <StatCard label="Unread Messages" value={stats.unreadMessages} hint="New inquiries" />
      </div>

      {/* Quick actions */}
      <div className="mt-8 rounded-2xl border border-studio-line bg-studio-charcoal p-6">
        <h2 className="text-lg font-semibold text-studio-ink">Quick Actions</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          {QUICK_ACTIONS.map((qa) => (
            <Link
              key={qa.label}
              href={qa.href}
              className="inline-flex items-center gap-2 rounded-xl border border-studio-line bg-studio-surface px-4 py-2.5 text-sm font-medium text-studio-ink transition hover:border-studio-gold/50 hover:text-studio-gold"
            >
              <QuickActionIcon name={qa.icon} />
              {qa.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {/* Recent activity */}
        <div className="rounded-2xl border border-studio-line bg-studio-charcoal p-6">
          <h2 className="text-lg font-semibold text-studio-ink">Recent Activity</h2>
          {!hasActivity ? (
            <div className="mt-4">
              <EmptyState message="No activity yet. Create shows and episodes to see updates here." />
            </div>
          ) : (
            <div className="mt-4 space-y-4">
              {activity.recentEpisodes.length > 0 && (
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-studio-gold">Recent Episodes</p>
                  <div className="mt-2 space-y-2">
                    {activity.recentEpisodes.map((ep) => (
                      <div key={ep.id} className="flex items-center justify-between border-b border-studio-line/50 pb-2 text-sm">
                        <span className="text-studio-ink">{ep.title}</span>
                        <span className="text-xs text-studio-muted">{EPISODE_STATUS_LABELS[ep.episode_status]} · {formatDate(ep.created_at)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {activity.recentShows.length > 0 && (
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-studio-gold">Recently Updated Shows</p>
                  <div className="mt-2 space-y-2">
                    {activity.recentShows.map((s) => (
                      <div key={s.id} className="flex items-center justify-between border-b border-studio-line/50 pb-2 text-sm">
                        <span className="text-studio-ink">{s.show_name}</span>
                        <span className="text-xs text-studio-muted">{formatDate(s.updated_at)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {activity.recentGuests.length > 0 && (
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-studio-gold">New Guests</p>
                  <div className="mt-2 space-y-2">
                    {activity.recentGuests.map((g) => (
                      <div key={g.id} className="flex items-center justify-between border-b border-studio-line/50 pb-2 text-sm">
                        <span className="text-studio-ink">{g.first_name} {g.last_name ?? ""}</span>
                        <span className="text-xs text-studio-muted">{formatDate(g.created_at)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {activity.recentMessages.length > 0 && (
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-studio-gold">New Messages</p>
                  <div className="mt-2 space-y-2">
                    {activity.recentMessages.map((m) => (
                      <div key={m.id} className="flex items-center justify-between border-b border-studio-line/50 pb-2 text-sm">
                        <span className="text-studio-ink">{m.name}</span>
                        <span className="text-xs text-studio-muted">{CONTACT_INQUIRY_LABELS[m.inquiry_type]} · {formatDate(m.created_at)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Upcoming schedule */}
        <div className="rounded-2xl border border-studio-line bg-studio-charcoal p-6">
          <h2 className="text-lg font-semibold text-studio-ink">Upcoming Schedule</h2>
          {schedule.length === 0 ? (
            <div className="mt-4">
              <EmptyState message="No upcoming recording or publish dates scheduled." />
            </div>
          ) : (
            <div className="mt-4 space-y-3">
              {schedule.map((item) => (
                <div key={item.id} className="flex items-center justify-between border-b border-studio-line/50 pb-3">
                  <div>
                    <p className="text-sm font-medium text-studio-ink">{item.title}</p>
                    {item.showName && (
                      <p className="text-xs text-studio-muted">{item.showName}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${item.type === "recording" ? "bg-blue-500/10 text-blue-400" : "bg-studio-gold/10 text-studio-gold"}`}>
                      {item.type === "recording" ? "Recording" : "Publish"}
                    </span>
                    <p className="mt-1 text-xs text-studio-muted">{formatDateTime(item.date)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
