"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Alert } from "@/components/ui/Alert";
import { saveShowAction, type ShowActionState } from "@/actions/shows";
import {
  SHOW_STATUSES,
  SHOW_STATUS_LABELS,
  SHOW_CATEGORIES,
} from "@/lib/podcast-types";
import type { Show } from "@/lib/podcast-types";

const initial: ShowActionState = {};

export function ShowForm({ show }: { show?: Show | null }) {
  const router = useRouter();
  const [state, action, pending] = useActionState(saveShowAction, initial);
  const isEdit = Boolean(show);

  const statusOptions = SHOW_STATUSES.map((s) => ({
    value: s,
    label: SHOW_STATUS_LABELS[s],
  }));

  return (
    <form action={action} className="space-y-6">
      {state.error ? <Alert tone="error">{state.error}</Alert> : null}

      <input type="hidden" name="id" value={show?.id ?? ""} />
      <input type="hidden" name="action_type" id="action_type" value="save" />

      {/* Basic info */}
      <div className="rounded-2xl border border-studio-line bg-studio-charcoal p-6">
        <h2 className="text-lg font-semibold text-studio-ink">Show Details</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Input
            name="show_name"
            label="Show Name"
            required
            defaultValue={show?.show_name ?? ""}
            placeholder="Grace Beyond Podcast Show"
          />
          <Input
            name="slug"
            label="Slug"
            hint="URL-safe identifier, e.g. grace-beyond"
            defaultValue={show?.slug ?? ""}
            placeholder="grace-beyond"
          />
          <Input
            name="host_name"
            label="Host Name"
            required
            defaultValue={show?.host_name ?? ""}
            placeholder="James Hollywood III"
          />
          <Input
            name="category"
            label="Category"
            defaultValue={show?.category ?? ""}
            placeholder="Faith / Personal Development"
            list="category-list"
          />
          <datalist id="category-list">
            {SHOW_CATEGORIES.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
        </div>
        <div className="mt-4">
          <Textarea
            name="short_description"
            label="Short Description"
            defaultValue={show?.short_description ?? ""}
            placeholder="A one-line summary for listings."
            className="min-h-[60px]"
          />
        </div>
        <div className="mt-4">
          <Textarea
            name="full_description"
            label="Full Description"
            defaultValue={show?.full_description ?? ""}
            placeholder="Detailed description for the show page."
          />
        </div>
      </div>

      {/* Cover image + status */}
      <div className="rounded-2xl border border-studio-line bg-studio-charcoal p-6">
        <h2 className="text-lg font-semibold text-studio-ink">Presentation</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Input
            name="cover_image"
            label="Cover Image URL"
            hint="Link to the cover artwork image"
            defaultValue={show?.cover_image ?? ""}
            placeholder="https://…"
          />
          <div className="space-y-1.5">
            <label htmlFor="status" className="block text-sm font-medium text-studio-ink">
              Status
            </label>
            <select
              id="status"
              name="status"
              defaultValue={show?.status ?? "draft"}
              className="w-full rounded-xl border border-studio-line bg-studio-surface px-3.5 py-2.5 text-studio-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-studio-gold"
            >
              {statusOptions.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Distribution links */}
      <div className="rounded-2xl border border-studio-line bg-studio-charcoal p-6">
        <h2 className="text-lg font-semibold text-studio-ink">Distribution Links</h2>
        <p className="mt-1 text-sm text-studio-muted">All optional. Leave blank until the links are available.</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Input name="spotify_url" label="Spotify URL" defaultValue={show?.spotify_url ?? ""} placeholder="https://open.spotify.com/…" />
          <Input name="apple_podcast_url" label="Apple Podcasts URL" defaultValue={show?.apple_podcast_url ?? ""} placeholder="https://podcasts.apple.com/…" />
          <Input name="youtube_url" label="YouTube URL" defaultValue={show?.youtube_url ?? ""} placeholder="https://youtube.com/…" />
          <Input name="rss_feed_url" label="RSS Feed URL" defaultValue={show?.rss_feed_url ?? ""} placeholder="https://feeds.example.com/…" />
          <Input name="website_url" label="Website URL" defaultValue={show?.website_url ?? ""} placeholder="https://…" />
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/shows")}
        >
          Cancel
        </Button>
        <Button type="submit" variant="secondary" loading={pending}>
          Save Draft
        </Button>
        <Button
          type="submit"
          loading={pending}
          onClick={() => {
            document.getElementById("action_type")?.setAttribute("value", "publish");
          }}
        >
          {isEdit ? "Save & Activate" : "Publish / Activate"}
        </Button>
      </div>
    </form>
  );
}
