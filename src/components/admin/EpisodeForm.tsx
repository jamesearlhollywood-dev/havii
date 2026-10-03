"use client";

import { useActionState, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Alert } from "@/components/ui/Alert";
import { saveEpisodeAction, type EpisodeActionState } from "@/actions/episodes";
import {
  EPISODE_STATUSES,
  EPISODE_STATUS_LABELS,
} from "@/lib/podcast-types";
import type { EpisodeWithShow, Show, Guest } from "@/lib/podcast-types";

const initial: EpisodeActionState = {};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Convert an ISO timestamp to the value a datetime-local input expects. */
function toDateTimeLocal(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  const tzOffset = d.getTimezoneOffset() * 60000;
  return new Date(d.getTime() - tzOffset).toISOString().slice(0, 16);
}

interface EpisodeFormProps {
  episode?: EpisodeWithShow | null;
  shows: Show[];
  guests: Guest[];
}

export function EpisodeForm({ episode, shows, guests }: EpisodeFormProps) {
  const router = useRouter();
  const [state, action, pending] = useActionState(saveEpisodeAction, initial);
  const isEdit = Boolean(episode);

  const [title, setTitle] = useState(episode?.title ?? "");
  const [slug, setSlug] = useState(episode?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(episode?.slug));

  const statusOptions = EPISODE_STATUSES.map((s) => ({
    value: s,
    label: EPISODE_STATUS_LABELS[s],
  }));

  const guestOptions = [
    { value: "", label: "No guest" },
    ...guests.map((g) => ({
      value: g.id,
      label: [g.first_name, g.last_name].filter(Boolean).join(" "),
    })),
  ];

  const showOptions = shows.map((s) => ({
    value: s.id,
    label: s.show_name,
  }));

  return (
    <form action={action} className="space-y-6">
      {state.error ? <Alert tone="error">{state.error}</Alert> : null}

      <input type="hidden" name="id" value={episode?.id ?? ""} />
      <input type="hidden" name="action_type" id="action_type" value="save" />

      {/* Core details */}
      <div className="rounded-2xl border border-studio-line bg-studio-charcoal p-6">
        <h2 className="text-lg font-semibold text-studio-ink">Episode Details</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label htmlFor="show_id" className="block text-sm font-medium text-studio-ink">
              Podcast Show <span className="text-red-400">*</span>
            </label>
            <select
              id="show_id"
              name="show_id"
              required
              defaultValue={episode?.show_id ?? ""}
              className="w-full rounded-xl border border-studio-line bg-studio-surface px-3.5 py-2.5 text-studio-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-studio-gold"
            >
              <option value="" disabled>
                Select a show…
              </option>
              {showOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          <Input
            name="title"
            label="Episode Title"
            required
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (!slugTouched) setSlug(slugify(e.target.value));
            }}
            placeholder="Grace Beyond the Struggle"
          />
          <Input
            name="slug"
            label="Slug"
            hint="URL-safe identifier, auto-generated from title"
            value={slug}
            onChange={(e) => {
              setSlug(e.target.value);
              setSlugTouched(true);
            }}
            placeholder="grace-beyond-the-struggle"
          />
          <Input
            name="episode_number"
            label="Episode Number"
            type="number"
            min={1}
            defaultValue={episode?.episode_number ?? ""}
            placeholder="1"
          />
          <Input
            name="season_number"
            label="Season Number"
            type="number"
            min={1}
            defaultValue={episode?.season_number ?? ""}
            placeholder="1"
          />
        </div>
        <div className="mt-4">
          <Textarea
            name="short_description"
            label="Short Description"
            defaultValue={episode?.short_description ?? ""}
            placeholder="A one-line summary for episode listings."
            className="min-h-[60px]"
          />
        </div>
        <div className="mt-4">
          <Textarea
            name="full_description"
            label="Full Description"
            defaultValue={episode?.full_description ?? ""}
            placeholder="Detailed description shown on the episode page."
          />
        </div>
      </div>

      {/* Media */}
      <div className="rounded-2xl border border-studio-line bg-studio-charcoal p-6">
        <h2 className="text-lg font-semibold text-studio-ink">Media</h2>
        <p className="mt-1 text-sm text-studio-muted">
          Audio and cover image can be added later — they are not required while the episode is in production.
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Input
            name="cover_image"
            label="Cover Image URL"
            defaultValue={episode?.cover_image ?? ""}
            placeholder="https://…"
          />
          <Input
            name="audio_url"
            label="Audio URL"
            hint="Direct link to the MP3 or podcast-hosted audio file"
            defaultValue={episode?.audio_url ?? ""}
            placeholder="https://…/episode.mp3"
          />
          <Input
            name="video_url"
            label="Video URL"
            defaultValue={episode?.video_url ?? ""}
            placeholder="https://youtube.com/…"
          />
          <Input
            name="duration"
            label="Duration"
            defaultValue={episode?.duration ?? ""}
            placeholder="45:30"
          />
        </div>
      </div>

      {/* Content */}
      <div className="rounded-2xl border border-studio-line bg-studio-charcoal p-6">
        <h2 className="text-lg font-semibold text-studio-ink">Content</h2>
        <div className="mt-4">
          <Textarea
            name="show_notes"
            label="Show Notes"
            hint="Supports ## headings, - bullet points, and [link text](url)"
            defaultValue={episode?.show_notes ?? ""}
            placeholder={"## Topics\n- Introduction\n- Main discussion\n\n## Resources\n- [Example](https://example.com)"}
            className="min-h-[140px]"
          />
        </div>
        <div className="mt-4">
          <Textarea
            name="transcript"
            label="Transcript"
            defaultValue={episode?.transcript ?? ""}
            placeholder="Full episode transcript…"
            className="min-h-[140px]"
          />
        </div>
      </div>

      {/* Scheduling & status */}
      <div className="rounded-2xl border border-studio-line bg-studio-charcoal p-6">
        <h2 className="text-lg font-semibold text-studio-ink">Scheduling & Status</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label htmlFor="guest_id" className="block text-sm font-medium text-studio-ink">
              Guest
            </label>
            <select
              id="guest_id"
              name="guest_id"
              defaultValue={episode?.guest_id ?? ""}
              className="w-full rounded-xl border border-studio-line bg-studio-surface px-3.5 py-2.5 text-studio-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-studio-gold"
            >
              {guestOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <label htmlFor="episode_status" className="block text-sm font-medium text-studio-ink">
              Episode Status
            </label>
            <select
              id="episode_status"
              name="episode_status"
              defaultValue={episode?.episode_status ?? "planned"}
              className="w-full rounded-xl border border-studio-line bg-studio-surface px-3.5 py-2.5 text-studio-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-studio-gold"
            >
              {statusOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          <Input
            name="recording_date"
            label="Recording Date"
            type="datetime-local"
            defaultValue={toDateTimeLocal(episode?.recording_date ?? null)}
          />
          <Input
            name="publish_date"
            label="Publish Date"
            type="datetime-local"
            defaultValue={toDateTimeLocal(episode?.publish_date ?? null)}
          />
        </div>
        <div className="mt-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="featured"
              defaultChecked={episode?.featured ?? false}
              className="h-5 w-5 rounded border-studio-line bg-studio-surface text-studio-gold focus:ring-studio-gold"
            />
            <span className="text-sm font-medium text-studio-ink">
              Featured Episode
            </span>
            <span className="text-xs text-studio-muted">
              Show on the homepage when published
            </span>
          </label>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/episodes")}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="secondary"
          loading={pending}
          onClick={() => {
            document.getElementById("action_type")?.setAttribute("value", "save");
          }}
        >
          {isEdit ? "Save Changes" : "Save Draft"}
        </Button>
        <Button
          type="submit"
          loading={pending}
          onClick={() => {
            document.getElementById("action_type")?.setAttribute("value", "publish");
          }}
        >
          Publish
        </Button>
      </div>
    </form>
  );
}
