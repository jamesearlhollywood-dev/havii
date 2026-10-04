"use client";

import Link from "next/link";
import type {
  CareerContact,
  ContactInteraction,
} from "@/lib/career/types";
import { contactName, isFollowUpDue } from "@/lib/career/networking";

export interface DashboardNetworkingData {
  dueFollowUps: CareerContact[];
  recentInteractions: {
    interaction: ContactInteraction;
    contactName: string;
    organization: string | null;
  }[];
  upcomingNetworkingTasks: {
    id: string;
    title: string;
    due_date: string | null;
    priority: string;
  }[];
}

/**
 * Dashboard widget — networking follow-ups, recent interactions, and
 * upcoming networking tasks. Only real stored data for the signed-in user.
 */
export function DashboardNetworking({ data }: { data: DashboardNetworkingData }) {
  const today = new Date().toISOString().slice(0, 10);
  const hasAny =
    data.dueFollowUps.length > 0 ||
    data.recentInteractions.length > 0 ||
    data.upcomingNetworkingTasks.length > 0;

  return (
    <div className="rounded-xl border border-career-border bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-career-border px-5 py-4">
        <h2 className="font-semibold text-career-navy">Networking Follow-Ups</h2>
        <Link
          href="/app/network"
          className="text-sm font-medium text-career-blue hover:underline"
        >
          View all
        </Link>
      </div>

      {!hasAny ? (
        <div className="px-5 py-8 text-center">
          <p className="text-sm text-career-slate">
            No networking follow-ups or interactions yet.
          </p>
          <Link
            href="/app/network"
            className="mt-3 inline-block rounded-lg bg-career-blue px-4 py-2 text-sm font-medium text-white hover:bg-career-blue-dark"
          >
            Build your network
          </Link>
        </div>
      ) : (
        <div className="grid gap-px bg-career-border md:grid-cols-3">
          {/* Due follow-ups */}
          <Panel title="Due for Follow-Up">
            {data.dueFollowUps.length === 0 ? (
              <Empty text="No follow-ups due." />
            ) : (
              <ul className="divide-y divide-career-border">
                {data.dueFollowUps.map((c) => (
                  <li key={c.id}>
                    <Link
                      href={`/app/network/${c.id}`}
                      className="flex items-center justify-between px-4 py-3 transition hover:bg-career-surface"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-career-navy">
                          {contactName(c)}
                        </p>
                        <p className="truncate text-xs text-career-slate">
                          {c.job_title || ""}{c.organization ? ` · ${c.organization}` : ""}
                        </p>
                      </div>
                      <span className="shrink-0 rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-medium text-amber-700">
                        Due {c.next_follow_up_date ? new Date(c.next_follow_up_date).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : ""}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Panel>

          {/* Recent interactions */}
          <Panel title="Recent Interactions">
            {data.recentInteractions.length === 0 ? (
              <Empty text="No interactions logged." />
            ) : (
              <ul className="divide-y divide-career-border">
                {data.recentInteractions.map(({ interaction, contactName: name, organization }) => (
                  <li key={interaction.id}>
                    <Link
                      href={`/app/network/${interaction.career_contact_id}`}
                      className="flex items-center justify-between px-4 py-3 transition hover:bg-career-surface"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-career-navy">
                          {name}
                        </p>
                        <div className="mt-0.5 flex items-center gap-1.5">
                          <span className="rounded-full bg-blue-50 px-1.5 py-0.5 text-[11px] font-medium text-career-blue">
                            {interaction.interaction_type}
                          </span>
                          {organization && (
                            <span className="truncate text-[11px] text-career-slate">{organization}</span>
                          )}
                        </div>
                      </div>
                      <span className="shrink-0 text-xs text-career-slate">
                        {new Date(interaction.interaction_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Panel>

          {/* Upcoming networking tasks */}
          <Panel title="Networking Tasks">
            {data.upcomingNetworkingTasks.length === 0 ? (
              <Empty text="No upcoming networking tasks." />
            ) : (
              <ul className="divide-y divide-career-border">
                {data.upcomingNetworkingTasks.map((t) => (
                  <li key={t.id}>
                    <Link
                      href="/app/tasks"
                      className="flex items-center justify-between px-4 py-3 transition hover:bg-career-surface"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-career-navy">{t.title}</p>
                        <p className="text-[11px] text-career-slate">{t.priority} priority</p>
                      </div>
                      <span className="shrink-0 text-xs text-career-slate">
                        {t.due_date ? new Date(t.due_date).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "—"}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </div>
      )}
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white">
      <p className="border-b border-career-border px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-career-slate">
        {title}
      </p>
      {children}
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return <p className="px-4 py-6 text-center text-xs text-career-slate">{text}</p>;
}
