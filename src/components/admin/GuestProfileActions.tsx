"use client";

import { useActionState, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { Alert } from "@/components/ui/Alert";
import {
  updateGuestBookingStatusAction,
  addGuestNoteAction,
  type GuestActionState,
} from "@/actions/guests";
import { GUEST_BOOKING_STATUSES, GUEST_BOOKING_LABELS } from "@/lib/podcast-types";

const initial: GuestActionState = {};

const bookingOptions = GUEST_BOOKING_STATUSES.map((s) => ({
  value: s,
  label: GUEST_BOOKING_LABELS[s],
}));

export function BookingStatusUpdater({
  guestId,
  currentStatus,
}: {
  guestId: string;
  currentStatus: string;
}) {
  const [status, setStatus] = useState(currentStatus);
  const [state, action, pending] = useActionState(updateGuestBookingStatusAction, initial);

  return (
    <form action={action} className="space-y-3">
      <input type="hidden" name="id" value={guestId} />
      {state.error ? <Alert tone="error">{state.error}</Alert> : null}
      {state.success ? <Alert tone="success">{state.success}</Alert> : null}
      <div className="space-y-1.5">
        <label htmlFor={`booking-${guestId}`} className="block text-sm font-medium text-studio-ink">
          Booking Status
        </label>
        <div className="flex gap-2">
          <select
            id={`booking-${guestId}`}
            name="booking_status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="flex-1 rounded-xl border border-studio-line bg-studio-surface px-3.5 py-2.5 text-studio-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-studio-gold"
          >
            {bookingOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <Button type="submit" loading={pending} size="md">
            Update
          </Button>
        </div>
      </div>
    </form>
  );
}

export function AddNoteForm({ guestId }: { guestId: string }) {
  const [state, action, pending] = useActionState(addGuestNoteAction, initial);

  return (
    <form action={action} className="space-y-3">
      <input type="hidden" name="id" value={guestId} />
      {state.error ? <Alert tone="error">{state.error}</Alert> : null}
      {state.success ? <Alert tone="success">{state.success}</Alert> : null}
      <Textarea
        name="note"
        label="Add Internal Note"
        hint="Timestamped and prepended to the notes log. Admins only."
        placeholder="Spoke with assistant, confirmed availability for Oct 15…"
        className="min-h-[90px]"
      />
      <Button type="submit" variant="secondary" loading={pending}>
        Add Note
      </Button>
    </form>
  );
}
