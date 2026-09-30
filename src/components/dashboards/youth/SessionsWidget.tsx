import type { SessionInfo } from "@/lib/types";

export function SessionsWidget({ sessions }: { sessions: SessionInfo[] }) {
  if (sessions.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-sm text-havii-muted">No upcoming sessions scheduled.</p>
        <p className="mt-1 text-xs text-havii-muted">
          When you join a group or program, sessions will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {sessions.map((session) => (
        <div
          key={session.id}
          className="rounded-xl border border-havii-mist bg-white p-3"
        >
          <p className="text-sm font-medium text-havii-ink">{session.title}</p>
          {session.starts_at ? (
            <p className="mt-1 text-xs text-havii-muted">
              {new Date(session.starts_at).toLocaleDateString(undefined, {
                weekday: "short",
                month: "short",
                day: "numeric",
              })}
              {" at "}
              {new Date(session.starts_at).toLocaleTimeString(undefined, {
                hour: "numeric",
                minute: "2-digit",
              })}
            </p>
          ) : null}
          {session.location ? (
            <p className="mt-0.5 text-xs text-havii-muted">📍 {session.location}</p>
          ) : null}
        </div>
      ))}
    </div>
  );
}
