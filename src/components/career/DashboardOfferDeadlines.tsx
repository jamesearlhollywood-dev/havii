"use client";

import Link from "next/link";

interface OfferDeadline {
  id: string;
  company: string;
  role_title: string | null;
  response_deadline: string;
  offer_status: string;
}

export function DashboardOfferDeadlines({ deadlines }: { deadlines: OfferDeadline[] }) {
  if (deadlines.length === 0) return null;

  return (
    <div className="rounded-xl border border-career-border bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-career-border px-5 py-4">
        <h2 className="font-semibold text-career-navy">Upcoming Offer Deadlines</h2>
        <Link href="/app/offers" className="text-sm font-medium text-career-blue hover:underline">
          View all
        </Link>
      </div>
      <div className="divide-y divide-career-border">
        {deadlines.map((d) => {
          const days = daysUntil(d.response_deadline);
          return (
            <Link
              key={d.id}
              href="/app/offers"
              className="flex items-center justify-between px-5 py-3.5 transition hover:bg-career-surface"
            >
              <div className="min-w-0">
                <p className="font-medium text-career-navy">{d.company}</p>
                <p className="text-xs text-career-slate">
                  {d.role_title || "Offer"} · due {formatDate(d.response_deadline)}
                </p>
              </div>
              <span
                className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${
                  days != null && days <= 2
                    ? "bg-red-50 text-red-600"
                    : days != null && days <= 5
                    ? "bg-amber-50 text-amber-700"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                {days == null ? "—" : days === 0 ? "Today" : days === 1 ? "1 day" : `${days} days`}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function daysUntil(dateStr: string): number | null {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return null;
  d.setHours(0, 0, 0, 0);
  return Math.round((d.getTime() - today.getTime()) / 86400000);
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
