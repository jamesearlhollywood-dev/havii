import type { Metadata } from "next";
import { getAllShows, getScheduleEvents } from "@/lib/podcast-data";
import { ScheduleView } from "@/components/admin/ScheduleView";

export const metadata: Metadata = { title: "Schedule" };

export const dynamic = "force-dynamic";

export default async function AdminSchedulePage() {
  const [shows, events] = await Promise.all([
    getAllShows(),
    getScheduleEvents(),
  ]);

  return (
    <div>
      <div className="flex flex-col gap-1">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-studio-gold">
          Studio Planning
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-studio-ink sm:text-3xl">
          Schedule
        </h1>
        <p className="text-sm text-studio-muted">
          Upcoming podcast recordings, guest interviews, and publication dates — derived from episode recording and publish dates.
        </p>
      </div>

      <div className="mt-8">
        <ScheduleView events={events} shows={shows} />
      </div>
    </div>
  );
}
