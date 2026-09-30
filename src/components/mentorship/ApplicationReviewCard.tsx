"use client";

import { useActionState } from "react";
import { approveMentorAction, declineMentorAction, type ActionResult } from "@/actions/mentorship";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import type { MentorProfile } from "@/lib/types";

const initial: ActionResult = {};

function ApproveButton({ mentorProfileId }: { mentorProfileId: string }) {
  const [state, action, pending] = useActionState(approveMentorAction, initial);
  return (
    <div className="space-y-2">
      {state.error ? <Alert tone="error" className="text-sm">{state.error}</Alert> : null}
      {state.success ? <Alert tone="success" className="text-sm">{state.success}</Alert> : null}
      <form action={action}>
        <input type="hidden" name="mentor_profile_id" value={mentorProfileId} />
        <Button type="submit" size="sm" loading={pending}>Approve</Button>
      </form>
    </div>
  );
}

function DeclineButton({ mentorProfileId }: { mentorProfileId: string }) {
  const [state, action, pending] = useActionState(declineMentorAction, initial);
  return (
    <div className="space-y-2">
      {state.error ? <Alert tone="error" className="text-sm">{state.error}</Alert> : null}
      {state.success ? <Alert tone="success" className="text-sm">{state.success}</Alert> : null}
      <form action={action}>
        <input type="hidden" name="mentor_profile_id" value={mentorProfileId} />
        <Button type="submit" size="sm" variant="outline" loading={pending}>Decline</Button>
      </form>
    </div>
  );
}

export function ApplicationReviewCard({ mentor }: { mentor: MentorProfile & { profile?: { first_name: string | null; preferred_name: string | null; city: string | null; state: string | null } } }) {
  const name = mentor.profile?.preferred_name || mentor.profile?.first_name || "Unknown";
  const statusLabels: Record<string, string> = {
    application_not_started: "Not started",
    pending_application: "In progress",
    submitted: "Submitted",
    under_review: "Under review",
    approved: "Approved",
    declined: "Declined",
    withdrawn: "Withdrawn",
  };

  return (
    <div className="rounded-2xl border border-havii-mist bg-white p-4 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-medium text-havii-ink">{name}</p>
          {mentor.profession && <p className="text-sm text-havii-muted">{mentor.profession}</p>}
          {mentor.profile?.city && mentor.profile?.state && (
            <p className="text-xs text-havii-muted">{mentor.profile.city}, {mentor.profile.state}</p>
          )}
        </div>
        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap ${
          mentor.application_status === "approved" ? "bg-green-100 text-green-700" :
          mentor.application_status === "declined" ? "bg-red-100 text-red-700" :
          mentor.application_status === "submitted" ? "bg-amber-100 text-amber-700" :
          "bg-havii-sand text-havii-muted"
        }`}>
          {statusLabels[mentor.application_status] || mentor.application_status}
        </span>
      </div>

      {mentor.background_summary && (
        <p className="text-sm text-havii-muted">{mentor.background_summary}</p>
      )}

      {mentor.mentoring_interests && mentor.mentoring_interests.length > 0 && (
        <p className="text-sm text-havii-ink">
          <span className="font-medium">Interests:</span> {mentor.mentoring_interests.join(", ")}
        </p>
      )}

      {mentor.support_areas && mentor.support_areas.length > 0 && (
        <p className="text-sm text-havii-ink">
          <span className="font-medium">Support areas:</span> {mentor.support_areas.join(", ")}
        </p>
      )}

      {mentor.availability_notes && (
        <p className="text-sm text-havii-muted">
          <span className="font-medium">Availability:</span> {mentor.availability_notes}
        </p>
      )}

      {(mentor.application_status === "submitted" || mentor.application_status === "under_review") && (
        <div className="flex gap-2 pt-2 border-t border-havii-mist">
          <ApproveButton mentorProfileId={mentor.id} />
          <DeclineButton mentorProfileId={mentor.id} />
        </div>
      )}
    </div>
  );
}
