import type { Metadata } from "next";
import { Waveform } from "@/components/visual/Waveform";

export const metadata: Metadata = { title: "Dashboard" };

const SUMMARY_CARDS = [
  { label: "Shows", value: "—", hint: "Published & draft" },
  { label: "Episodes", value: "—", hint: "Across all shows" },
  { label: "Guests", value: "—", hint: "Confirmed & invited" },
  { label: "Messages", value: "—", hint: "New inquiries" },
];

export default function AdminDashboardPage() {
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
          A snapshot of the James Hollywood III Studios network. Live counts
          will populate once content is added.
        </p>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {SUMMARY_CARDS.map((card) => (
          <div
            key={card.label}
            className="rounded-2xl border border-studio-line bg-studio-charcoal p-5"
          >
            <p className="text-xs uppercase tracking-wide text-studio-muted">
              {card.label}
            </p>
            <p className="mt-2 text-3xl font-semibold text-studio-ink">
              {card.value}
            </p>
            <p className="mt-1 text-xs text-studio-muted">{card.hint}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-studio-line bg-studio-charcoal p-6">
        <h2 className="text-lg font-semibold text-studio-ink">
          Recent activity
        </h2>
        <Waveform bars={64} className="mt-4 h-10 w-full opacity-40" />
        <p className="mt-4 text-sm text-studio-muted">
          Recent episodes, production tasks, and messages will appear here once
          the studio is populated.
        </p>
      </div>
    </div>
  );
}
