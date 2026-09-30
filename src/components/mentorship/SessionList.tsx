"use client";

import { useActionState, useState } from "react";
import { requestSessionAction, confirmSessionAction, cancelSessionAction, type ActionResult } from "@/actions/mentorship";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Alert } from "@/components/ui/Alert";
import type { MentorSession } from "@/lib/types";

const initial: ActionResult = {};

function RequestSessionForm({ matchId }: { matchId: string }) {
  const [state, action, pending] = useActionState(requestSessionAction, initial);
  const [showForm, setShowForm] = useState(false);

  if (!showForm) {
    return <Button size="sm" onClick={() => setShowForm(true)}>Request a session</Button>;
  }

  return (
    <div className="space-y-4 rounded-2xl border border-havii-mist bg-havii-sand/30 p-4">
      <h3 className="font-medium text-havii-ink">Request a session</h3>
      {state.error ? <Alert tone="error" className="text-sm">{state.error}</Alert> : null}
      {state.success ? <Alert tone="success" className="text-sm">{state.success}</Alert> : null}
      <form action={action} className="space-y-3">
        <input type="hidden" name="match_id" value={matchId} />
        <Input name="title" label="Session title" defaultValue="Mentor session" />
        <Input name="starts_at" label="Date & time" type="datetime-local" required />
        <Input name="ends_at" label="End time (optional)" type="datetime-local" />
        <Input name="location" label="Location" defaultValue="Virtual" />
        <input type="hidden" name="timezone" value={Intl.DateTimeFormat().resolvedOptions().timeZone || "America/New_York"} />
        <Textarea name="notes" label="Notes (optional)" />
        <div className="flex gap-2">
          <Button type="submit" size="sm" loading={pending}>Submit</Button>
          <Button type="button" size="sm" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
        </div>
      </form>
    </div>
  );
}

function SessionActions({ session }: { session: MentorSession }) {
  const [confirmState, confirmAction, confirmPending] = useActionState(confirmSessionAction, initial);
  const [cancelState, cancelAction, cancelPending] = useActionState(cancelSessionAction, initial);
  const [showCancel, setShowCancel] = useState(false);

  if (session.status === "cancelled" || session.status === "completed") return null;

  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {session.status === "scheduled" && (
        <div className="space-y-1">
          {confirmState.error ? <p className="text-xs text-red-600">{confirmState.error}</p> : null}
          {confirmState.success ? <p className="text-xs text-green-600">{confirmState.success}</p> : null}
          <form action={confirmAction}>
            <input type="hidden" name="session_id" value={session.id} />
            <Button type="submit" size="sm" loading={confirmPending}>Confirm</Button>
          </form>
        </div>
      )}
      {!showCancel ? (
        <button className="text-sm text-red-600 hover:underline" onClick={() => setShowCancel(true)}>
          Cancel session
        </button>
      ) : (
        <div className="space-y-1">
          {cancelState.error ? <p className="text-xs text-red-600">{cancelState.error}</p> : null}
          <form action={cancelAction} className="flex gap-2 items-end">
            <input type="hidden" name="session_id" value={session.id} />
            <Input name="cancel_reason" label="Reason" placeholder="Optional" />
            <Button type="submit" size="sm" variant="outline" loading={cancelPending}>Confirm cancel</Button>
            <Button type="button" size="sm" variant="ghost" onClick={() => setShowCancel(false)}>Close</Button>
          </form>
        </div>
      )}
    </div>
  );
}

export function SessionList({ sessions, matchId }: { sessions: MentorSession[]; matchId: string }) {
  const upcoming = sessions.filter((s) => s.status !== "cancelled" && s.status !== "completed");
  const past = sessions.filter((s) => s.status === "completed" || (s.status === "cancelled"));

  return (
    <div className="space-y-4">
      {/* Request new session */}
      <RequestSessionForm matchId={matchId} />

      {/* Upcoming */}
      {upcoming.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-base font-semibold text-havii-ink">Upcoming</h2>
          {upcoming.map((s) => (
            <div key={s.id} className="rounded-2xl border border-havii-mist bg-white p-4 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <p className="font-medium text-havii-ink">{s.title}</p>
                <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  s.status === "confirmed" ? "bg-green-100 text-green-700" :
                  s.status === "cancelled" ? "bg-red-100 text-red-700" :
                  "bg-amber-100 text-amber-700"
                }`}>
                  {s.status}
                </span>
              </div>
              {s.starts_at && (
                <p className="text-sm text-havii-muted">
                  {new Date(s.starts_at).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
                  {" at "}
                  {new Date(s.starts_at).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
                  {s.timezone ? ` (${s.timezone})` : ""}
                </p>
              )}
              {s.ends_at && (
                <p className="text-xs text-havii-muted">
                  Until {new Date(s.ends_at).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
                </p>
              )}
              {s.location && <p className="text-sm text-havii-muted">📍 {s.location}</p>}
              {s.notes && <p className="text-sm text-havii-muted">{s.notes}</p>}
              <SessionActions session={s} />
            </div>
          ))}
        </div>
      )}

      {/* Past */}
      {past.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-base font-semibold text-havii-ink">Past</h2>
          {past.map((s) => (
            <div key={s.id} className="rounded-2xl border border-havii-mist bg-havii-sand/20 p-3 space-y-1">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-medium text-havii-ink">{s.title}</p>
                <span className="text-xs text-havii-muted">{s.status}</span>
              </div>
              {s.starts_at && (
                <p className="text-xs text-havii-muted">
                  {new Date(s.starts_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  {" at "}
                  {new Date(s.starts_at).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
                  {s.timezone ? ` (${s.timezone})` : ""}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {sessions.length === 0 && (
        <p className="text-sm text-havii-muted">No sessions yet. Request one above.</p>
      )}
    </div>
  );
}
