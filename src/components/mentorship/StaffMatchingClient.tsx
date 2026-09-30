"use client";

import { useActionState, useState } from "react";
import { createMatchAction, updateMatchStatusAction, type ActionResult } from "@/actions/mentorship";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { Textarea } from "@/components/ui/Textarea";

const initial: ActionResult = {};

type YouthRequest = {
  id: string;
  interests: string[] | null;
  help_areas: string[] | null;
  availability_notes: string | null;
  status: string;
  created_at: string;
  youth_profile: {
    id: string;
    profile: {
      id: string;
      first_name: string | null;
      preferred_name: string | null;
      city: string | null;
      state: string | null;
    };
  };
};

type ApprovedMentor = {
  id: string;
  profession: string | null;
  mentoring_interests: string[] | null;
  support_areas: string[] | null;
  profile: {
    first_name: string | null;
    preferred_name: string | null;
  };
};

type MatchInfo = {
  id: string;
  status: string;
  notes: string | null;
  matched_by: string | null;
  status_changed_by: string | null;
  status_changed_at: string | null;
  created_at: string;
  youth_profile: {
    profile: {
      first_name: string | null;
      preferred_name: string | null;
    };
  };
  mentor_profile: {
    profession: string | null;
    profile: {
      first_name: string | null;
      preferred_name: string | null;
    };
  };
};

function CreateMatchForm({ requests, mentors }: { requests: YouthRequest[]; mentors: ApprovedMentor[] }) {
  const [state, action, pending] = useActionState(createMatchAction, initial);
  const [youthId, setYouthId] = useState("");
  const [mentorId, setMentorId] = useState("");

  return (
    <div className="space-y-4 rounded-2xl border border-havii-mist bg-white p-4">
      <h3 className="font-semibold text-havii-ink">Create a match</h3>
      {state.error ? <Alert tone="error" className="text-sm">{state.error}</Alert> : null}
      {state.success ? <Alert tone="success" className="text-sm">{state.success}</Alert> : null}
      <form action={action} className="space-y-4">
        <div>
          <label className="text-sm font-medium text-havii-ink block mb-1.5">Youth (from requests)</label>
          <select
            name="youth_profile_id"
            value={youthId}
            onChange={(e) => setYouthId(e.target.value)}
            className="w-full rounded-xl border border-havii-mist bg-white px-3 py-2.5 text-sm text-havii-ink"
          >
            <option value="">Select youth…</option>
            {requests.map((r) => (
              <option key={r.id} value={r.youth_profile.id}>
                {r.youth_profile.profile.preferred_name || r.youth_profile.profile.first_name || "Unknown"} — {r.help_areas?.join(", ") || "No areas"}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium text-havii-ink block mb-1.5">Mentor (approved)</label>
          <select
            name="mentor_profile_id"
            value={mentorId}
            onChange={(e) => setMentorId(e.target.value)}
            className="w-full rounded-xl border border-havii-mist bg-white px-3 py-2.5 text-sm text-havii-ink"
          >
            <option value="">Select mentor…</option>
            {mentors.map((m) => (
              <option key={m.id} value={m.id}>
                {m.profile.preferred_name || m.profile.first_name || "Unknown"} — {m.profession || "No profession"}
              </option>
            ))}
          </select>
        </div>
        <Textarea name="notes" label="Match notes (optional)" hint="Why this match?" />
        <Button type="submit" size="sm" loading={pending} disabled={!youthId || !mentorId}>
          Create Match
        </Button>
      </form>
    </div>
  );
}

function MatchStatusUpdater({ match }: { match: MatchInfo }) {
  const [state, action, pending] = useActionState(updateMatchStatusAction, initial);
  const youthName = match.youth_profile.profile.preferred_name || match.youth_profile.profile.first_name || "Youth";
  const mentorName = match.mentor_profile.profile.preferred_name || match.mentor_profile.profile.first_name || "Mentor";

  const statusColors: Record<string, string> = {
    active: "bg-green-100 text-green-700",
    paused: "bg-amber-100 text-amber-700",
    ended: "bg-gray-100 text-gray-600",
    proposed: "bg-blue-100 text-blue-700",
    declined: "bg-red-100 text-red-700",
  };

  return (
    <div className="rounded-2xl border border-havii-mist bg-white p-4 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-medium text-havii-ink">{youthName} ↔ {mentorName}</p>
          {match.mentor_profile.profession && (
            <p className="text-xs text-havii-muted">{match.mentor_profile.profession}</p>
          )}
        </div>
        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap ${statusColors[match.status] || ""}`}>
          {match.status}
        </span>
      </div>

      {match.notes && <p className="text-sm text-havii-muted">{match.notes}</p>}

      {/* Audit info */}
      <div className="text-xs text-havii-muted border-t border-havii-mist pt-2">
        <p>Created: {new Date(match.created_at).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })}</p>
        {match.status_changed_at && (
          <p>Last changed: {new Date(match.status_changed_at).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })}</p>
        )}
        {match.status_changed_by && (
          <p>Changed by: {match.status_changed_by.slice(0, 8)}…</p>
        )}
      </div>

      {state.error ? <Alert tone="error" className="text-sm">{state.error}</Alert> : null}
      {state.success ? <Alert tone="success" className="text-sm">{state.success}</Alert> : null}

      {match.status !== "ended" && (
        <form action={action} className="flex flex-wrap gap-2 pt-2 border-t border-havii-mist">
          <input type="hidden" name="match_id" value={match.id} />
          {match.status === "active" && (
            <>
              <input type="hidden" name="status" value="paused" />
              <Button type="submit" size="sm" variant="outline" loading={pending}>Pause</Button>
            </>
          )}
          {match.status === "paused" && (
            <>
              <input type="hidden" name="status" value="active" />
              <Button type="submit" size="sm" loading={pending}>Reactivate</Button>
            </>
          )}
          {match.status !== "ended" && (
            <>
              <button type="button" className="text-sm text-red-600 hover:underline" onClick={(e) => {
                e.preventDefault();
                const form = (e.target as HTMLElement).closest('form');
                if (form) {
                  const statusInput = form.querySelector('input[name="status"]') as HTMLInputElement;
                  statusInput.value = "ended";
                  form.requestSubmit();
                }
              }}>End match</button>
            </>
          )}
        </form>
      )}
    </div>
  );
}

export function StaffMatchingClient({
  requests,
  mentors,
  matches,
}: {
  requests: YouthRequest[];
  mentors: ApprovedMentor[];
  matches: MatchInfo[];
}) {
  return (
    <div className="space-y-5">
      {/* Create match */}
      <CreateMatchForm requests={requests} mentors={mentors} />

      {/* Active matches */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-havii-ink">
          Active Matches ({matches.filter(m => m.status === "active" || m.status === "paused").length})
        </h2>
        {matches.length > 0 ? (
          matches.map((m) => <MatchStatusUpdater key={m.id} match={m} />)
        ) : (
          <p className="text-sm text-havii-muted">No matches yet.</p>
        )}
      </div>

      {/* Pending requests */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-havii-ink">
          Pending Youth Requests ({requests.length})
        </h2>
        {requests.length > 0 ? (
          requests.map((r) => (
            <div key={r.id} className="rounded-2xl border border-havii-mist bg-white p-4 space-y-2">
              <p className="font-medium text-havii-ink">
                {r.youth_profile.profile.preferred_name || r.youth_profile.profile.first_name || "Unknown"}
              </p>
              {r.interests && r.interests.length > 0 && (
                <p className="text-sm text-havii-muted">Interests: {r.interests.join(", ")}</p>
              )}
              {r.help_areas && r.help_areas.length > 0 && (
                <p className="text-sm text-havii-muted">Needs: {r.help_areas.join(", ")}</p>
              )}
              {r.availability_notes && (
                <p className="text-sm text-havii-muted">Availability: {r.availability_notes}</p>
              )}
              <p className="text-xs text-havii-muted">Requested: {new Date(r.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p>
            </div>
          ))
        ) : (
          <p className="text-sm text-havii-muted">No pending requests.</p>
        )}
      </div>
    </div>
  );
}
