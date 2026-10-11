"use client";

import type { CmsActivity } from "@/data/cms-types";
import { ACTIVITY_TYPES, RISE_CONTENT_TYPES, type ActivityType, type RiseContentType } from "@/data/cms-types";
import { VersionInfo } from "./VersionInfo";
import { RiseContentTypeBadge } from "./RiseContentTypeBadge";

interface CmsActivityFormProps {
  activity: CmsActivity;
  onChange: (updates: Partial<CmsActivity>) => void;
  onDuplicate: () => void;
}

export function CmsActivityForm({ activity, onChange, onDuplicate }: CmsActivityFormProps) {
  return (
    <div className="space-y-5">
      <VersionInfo
        createdAt={activity.createdAt}
        updatedAt={activity.updatedAt}
        updatedBy={activity.updatedBy}
        status={activity.status}
      />

      {/* Duplicate button */}
      <button
        type="button"
        onClick={onDuplicate}
        className="rounded-lg border border-rise-border bg-white px-3 py-1.5 text-sm font-medium text-rise-navy hover:bg-rise-sky"
      >
        📋 Duplicate Activity
      </button>

      {/* Title */}
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-rise-navy">Activity Title</label>
        <input
          type="text"
          value={activity.title}
          onChange={(e) => onChange({ title: e.target.value })}
          className="w-full rounded-xl border border-rise-border bg-white px-3.5 py-2.5 text-rise-navy"
        />
      </div>

      {/* Activity Type */}
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-rise-navy">Activity Type</label>
        <select
          value={activity.activityType}
          onChange={(e) => onChange({ activityType: e.target.value as ActivityType })}
          className="w-full rounded-xl border border-rise-border bg-white px-3.5 py-2.5 text-rise-navy"
        >
          {ACTIVITY_TYPES.map((at) => (
            <option key={at.value} value={at.value}>
              {at.icon} {at.label}
            </option>
          ))}
        </select>
      </div>

      {/* RISE Content Type */}
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-rise-navy">RISE Content Type</label>
        <div className="flex flex-wrap gap-2">
          {RISE_CONTENT_TYPES.map((ct) => (
            <button
              key={ct.value}
              type="button"
              onClick={() => onChange({ riseContentType: activity.riseContentType === ct.value ? null : ct.value as RiseContentType })}
              className={`rounded-lg border px-2.5 py-1.5 text-xs font-medium transition ${
                activity.riseContentType === ct.value
                  ? `${ct.bgColor} ${ct.color} ${ct.borderColor} ring-2 ring-offset-1`
                  : "border-rise-border bg-white text-rise-muted hover:bg-rise-sky"
              }`}
            >
              <span className="mr-1">{ct.icon}</span>
              {ct.label}
            </button>
          ))}
        </div>
        {activity.riseContentType && (
          <div className="mt-2 flex items-center gap-2">
            <span className="text-xs text-rise-muted">Student sees:</span>
            <RiseContentTypeBadge type={activity.riseContentType} />
          </div>
        )}
      </div>

      {/* Content (JSON editor for now — type-specific editors can be added later) */}
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-rise-navy">
          Activity Content <span className="text-xs font-normal text-rise-muted">(JSON)</span>
        </label>
        <textarea
          value={JSON.stringify(activity.content, null, 2)}
          onChange={(e) => {
            try {
              const parsed = JSON.parse(e.target.value);
              onChange({ content: parsed });
            } catch {
              // ignore invalid JSON while typing
            }
          }}
          rows={8}
          className="w-full rounded-xl border border-rise-border bg-white px-3.5 py-2.5 font-mono text-sm text-rise-navy"
        />
      </div>

      {/* Instructor notes */}
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-rise-navy">
          Instructor Notes <span className="text-xs font-normal text-rise-muted">(hidden from students)</span>
        </label>
        <textarea
          value={activity.instructorNotes || ""}
          onChange={(e) => onChange({ instructorNotes: e.target.value || null })}
          rows={3}
          className="w-full rounded-xl border border-rise-border bg-white px-3.5 py-2.5 text-rise-navy"
        />
      </div>

      {/* Published toggle */}
      <div className="flex items-center gap-3 rounded-xl border border-rise-border bg-rise-sky/30 p-4">
        <button
          type="button"
          onClick={() => onChange({ isPublished: !activity.isPublished, status: !activity.isPublished ? "published" : "draft" })}
          className={`relative h-6 w-11 rounded-full transition ${activity.isPublished ? "bg-rise-success" : "bg-rise-border"}`}
        >
          <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${activity.isPublished ? "left-5" : "left-0.5"}`} />
        </button>
        <div>
          <p className="text-sm font-medium text-rise-navy">
            {activity.isPublished ? "Published" : "Draft (not visible to students)"}
          </p>
        </div>
      </div>
    </div>
  );
}
