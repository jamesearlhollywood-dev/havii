"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Alert } from "@/components/ui/Alert";
import { saveGuestAction, type GuestActionState } from "@/actions/guests";
import {
  GUEST_BOOKING_STATUSES,
  GUEST_BOOKING_LABELS,
} from "@/lib/podcast-types";
import type { Guest } from "@/lib/podcast-types";

const initial: GuestActionState = {};

const bookingOptions = GUEST_BOOKING_STATUSES.map((s) => ({
  value: s,
  label: GUEST_BOOKING_LABELS[s],
}));

interface GuestFormProps {
  guest?: Guest | null;
}

export function GuestForm({ guest }: GuestFormProps) {
  const router = useRouter();
  const [state, action, pending] = useActionState(saveGuestAction, initial);

  return (
    <form action={action} className="space-y-6">
      {state.error ? <Alert tone="error">{state.error}</Alert> : null}
      {state.success ? <Alert tone="success">{state.success}</Alert> : null}

      <input type="hidden" name="id" value={guest?.id ?? ""} />

      {/* Identity */}
      <div className="rounded-2xl border border-studio-line bg-studio-charcoal p-6">
        <h2 className="text-lg font-semibold text-studio-ink">Guest Details</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Input
            name="first_name"
            label="First Name"
            required
            defaultValue={guest?.first_name ?? ""}
            placeholder="Maya"
          />
          <Input
            name="last_name"
            label="Last Name"
            defaultValue={guest?.last_name ?? ""}
            placeholder="Johnson"
          />
          <Input
            name="professional_title"
            label="Professional Title"
            defaultValue={guest?.professional_title ?? ""}
            placeholder="Author & Speaker"
          />
          <Input
            name="organization"
            label="Organization"
            defaultValue={guest?.organization ?? ""}
            placeholder="Maya Johnson Media"
          />
        </div>
        <div className="mt-4">
          <Textarea
            name="biography"
            label="Biography"
            defaultValue={guest?.biography ?? ""}
            placeholder="A short bio shown on the guest's public profile."
            className="min-h-[120px]"
          />
        </div>
        <div className="mt-4">
          <Input
            name="headshot"
            label="Headshot URL"
            defaultValue={guest?.headshot ?? ""}
            placeholder="https://…/headshot.jpg"
          />
        </div>
      </div>

      {/* Contact */}
      <div className="rounded-2xl border border-studio-line bg-studio-charcoal p-6">
        <h2 className="text-lg font-semibold text-studio-ink">Contact</h2>
        <p className="mt-1 text-sm text-studio-muted">
          Email and phone are optional and never shown publicly.
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Input
            name="email"
            type="email"
            label="Email"
            defaultValue={guest?.email ?? ""}
            placeholder="maya@example.com"
          />
          <Input
            name="phone"
            label="Phone"
            defaultValue={guest?.phone ?? ""}
            placeholder="+1 (555) 123-4567"
          />
        </div>
      </div>

      {/* Web & social */}
      <div className="rounded-2xl border border-studio-line bg-studio-charcoal p-6">
        <h2 className="text-lg font-semibold text-studio-ink">Web & Social</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Input
            name="website"
            label="Website"
            defaultValue={guest?.website ?? ""}
            placeholder="https://…"
          />
          <Input
            name="linkedin_url"
            label="LinkedIn URL"
            defaultValue={guest?.linkedin_url ?? ""}
            placeholder="https://linkedin.com/in/…"
          />
          <Input
            name="instagram_url"
            label="Instagram URL"
            defaultValue={guest?.instagram_url ?? ""}
            placeholder="https://instagram.com/…"
          />
          <Input
            name="facebook_url"
            label="Facebook URL"
            defaultValue={guest?.facebook_url ?? ""}
            placeholder="https://facebook.com/…"
          />
        </div>
      </div>

      {/* Booking & internal notes */}
      <div className="rounded-2xl border border-studio-line bg-studio-charcoal p-6">
        <h2 className="text-lg font-semibold text-studio-ink">Booking & Notes</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label htmlFor="booking_status" className="block text-sm font-medium text-studio-ink">
              Booking Status
            </label>
            <select
              id="booking_status"
              name="booking_status"
              defaultValue={guest?.booking_status ?? "prospect"}
              className="w-full rounded-xl border border-studio-line bg-studio-surface px-3.5 py-2.5 text-studio-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-studio-gold"
            >
              {bookingOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="mt-4">
          <Textarea
            name="notes"
            label="Internal Notes"
            hint="Visible to admins only — never displayed publicly."
            defaultValue={guest?.notes ?? ""}
            placeholder="Outreach history, preferences, logistics…"
            className="min-h-[120px]"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
        >
          Cancel
        </Button>
        <Button type="submit" loading={pending}>
          {guest ? "Save Changes" : "Create Guest"}
        </Button>
      </div>
    </form>
  );
}
