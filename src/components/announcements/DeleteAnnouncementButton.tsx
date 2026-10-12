"use client";

import { useState } from "react";
import { deleteAnnouncement } from "@/actions/announcements";

export function DeleteAnnouncementButton({ announcementId }: { announcementId: string }) {
  const [confirming, setConfirming] = useState(false);

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="text-xs font-medium text-rise-red hover:underline"
      >
        Delete
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-rise-muted">Are you sure?</span>
      <button
        type="button"
        onClick={async () => {
          await deleteAnnouncement(announcementId);
          window.location.reload();
        }}
        className="text-xs font-bold text-rise-red hover:underline"
      >
        Yes, delete
      </button>
      <button
        type="button"
        onClick={() => setConfirming(false)}
        className="text-xs font-medium text-rise-muted hover:underline"
      >
        Cancel
      </button>
    </div>
  );
}
