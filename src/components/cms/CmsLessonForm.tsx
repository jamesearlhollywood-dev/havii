"use client";

import { useState } from "react";
import type { CmsLesson } from "@/data/cms-types";
import { RISE_CONTENT_TYPES, type RiseContentType } from "@/data/cms-types";
import { ContentBlockEditor } from "./ContentBlockEditor";
import { VersionInfo } from "./VersionInfo";
import { RiseContentTypeBadge } from "./RiseContentTypeBadge";

interface CmsLessonFormProps {
  lesson: CmsLesson;
  onChange: (updates: Partial<CmsLesson>) => void;
  onPreview: () => void;
  onDuplicate: () => void;
}

export function CmsLessonForm({ lesson, onChange, onPreview, onDuplicate }: CmsLessonFormProps) {
  const [objectives, setObjectives] = useState(lesson.objectives.join("\n"));
  const [activeTab, setActiveTab] = useState<"content" | "settings" | "notes">("content");

  return (
    <div className="space-y-5">
      <VersionInfo
        createdAt={lesson.createdAt}
        updatedAt={lesson.updatedAt}
        updatedBy={lesson.updatedBy}
        status={lesson.status}
      />

      {/* Action buttons */}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onPreview}
          className="rounded-lg border border-rise-border bg-white px-3 py-1.5 text-sm font-medium text-rise-navy hover:bg-rise-sky"
        >
          👁 Preview as Student
        </button>
        <button
          type="button"
          onClick={onDuplicate}
          className="rounded-lg border border-rise-border bg-white px-3 py-1.5 text-sm font-medium text-rise-navy hover:bg-rise-sky"
        >
          📋 Duplicate Lesson
        </button>
      </div>

      {/* Title + Subtitle */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-rise-navy">Lesson Title</label>
          <input
            type="text"
            value={lesson.title}
            onChange={(e) => onChange({ title: e.target.value })}
            className="w-full rounded-xl border border-rise-border bg-white px-3.5 py-2.5 text-rise-navy"
          />
        </div>
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-rise-navy">Subtitle</label>
          <input
            type="text"
            value={lesson.subtitle}
            onChange={(e) => onChange({ subtitle: e.target.value })}
            className="w-full rounded-xl border border-rise-border bg-white px-3.5 py-2.5 text-rise-navy"
          />
        </div>
      </div>

      {/* RISE Content Type */}
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-rise-navy">RISE Content Type</label>
        <div className="flex flex-wrap gap-2">
          {RISE_CONTENT_TYPES.map((ct) => (
            <button
              key={ct.value}
              type="button"
              onClick={() => onChange({ riseContentType: lesson.riseContentType === ct.value ? null : ct.value as RiseContentType })}
              className={`rounded-lg border px-2.5 py-1.5 text-xs font-medium transition ${
                lesson.riseContentType === ct.value
                  ? `${ct.bgColor} ${ct.color} ${ct.borderColor} ring-2 ring-offset-1`
                  : "border-rise-border bg-white text-rise-muted hover:bg-rise-sky"
              }`}
            >
              <span className="mr-1">{ct.icon}</span>
              {ct.label}
            </button>
          ))}
        </div>
        {lesson.riseContentType && (
          <div className="mt-2 flex items-center gap-2">
            <span className="text-xs text-rise-muted">Student sees:</span>
            <RiseContentTypeBadge type={lesson.riseContentType} />
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-rise-border">
        {(["content", "settings", "notes"] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium capitalize transition-colors ${
              activeTab === tab
                ? "border-b-2 border-rise-navy text-rise-navy"
                : "text-rise-muted hover:text-rise-navy"
            }`}
          >
            {tab === "notes" ? "Instructor Notes" : tab}
          </button>
        ))}
      </div>

      {/* Content tab */}
      {activeTab === "content" && (
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-rise-navy">Student-Facing Instructions</label>
            <textarea
              value={lesson.studentInstructions || ""}
              onChange={(e) => onChange({ studentInstructions: e.target.value || null })}
              placeholder="Instructions shown to students at the top of the lesson (optional)"
              rows={2}
              className="w-full rounded-xl border border-rise-border bg-white px-3.5 py-2.5 text-rise-navy"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-rise-navy">Content Blocks</label>
            <ContentBlockEditor
              blocks={lesson.content}
              onChange={(content) => onChange({ content })}
            />
          </div>
        </div>
      )}

      {/* Settings tab */}
      {activeTab === "settings" && (
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-rise-navy">Description</label>
            <textarea
              value={lesson.description}
              onChange={(e) => onChange({ description: e.target.value })}
              rows={3}
              className="w-full rounded-xl border border-rise-border bg-white px-3.5 py-2.5 text-rise-navy"
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-rise-navy">
              Learning Objectives <span className="text-xs font-normal text-rise-muted">(one per line)</span>
            </label>
            <textarea
              value={objectives}
              onChange={(e) => {
                setObjectives(e.target.value);
                onChange({ objectives: e.target.value.split("\n").filter((s) => s.trim()) });
              }}
              rows={5}
              className="w-full rounded-xl border border-rise-border bg-white px-3.5 py-2.5 text-rise-navy"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-rise-navy">Estimated Minutes</label>
              <input
                type="number"
                value={lesson.estimatedMinutes}
                onChange={(e) => onChange({ estimatedMinutes: Number(e.target.value) })}
                className="w-full rounded-xl border border-rise-border bg-white px-3.5 py-2.5 text-rise-navy"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-rise-navy">Sort Order</label>
              <input
                type="number"
                value={lesson.sortOrder}
                onChange={(e) => onChange({ sortOrder: Number(e.target.value) })}
                className="w-full rounded-xl border border-rise-border bg-white px-3.5 py-2.5 text-rise-navy"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-rise-navy">Required / Optional</label>
              <select
                value={lesson.isRequired ? "required" : "optional"}
                onChange={(e) => onChange({ isRequired: e.target.value === "required" })}
                className="w-full rounded-xl border border-rise-border bg-white px-3.5 py-2.5 text-rise-navy"
              >
                <option value="required">Required</option>
                <option value="optional">Optional (Enrichment)</option>
              </select>
            </div>
          </div>
          {/* Published toggle */}
          <div className="flex items-center gap-3 rounded-xl border border-rise-border bg-rise-sky/30 p-4">
            <button
              type="button"
              onClick={() => onChange({ isPublished: !lesson.isPublished, status: !lesson.isPublished ? "published" : "draft" })}
              className={`relative h-6 w-11 rounded-full transition ${lesson.isPublished ? "bg-rise-success" : "bg-rise-border"}`}
            >
              <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${lesson.isPublished ? "left-5" : "left-0.5"}`} />
            </button>
            <div>
              <p className="text-sm font-medium text-rise-navy">
                {lesson.isPublished ? "Published" : "Draft (not visible to students)"}
              </p>
              <p className="text-xs text-rise-muted">
                {lesson.isPublished
                  ? "This lesson is visible to students."
                  : "Students cannot see this lesson until it is published."}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Instructor Notes tab */}
      {activeTab === "notes" && (
        <div className="space-y-2">
          <div className="rounded-lg bg-rise-warning-light px-3 py-2 text-xs text-rise-warning">
            ⚠️ Instructor notes are never shown to students.
          </div>
          <textarea
            value={lesson.instructorNotes || ""}
            onChange={(e) => onChange({ instructorNotes: e.target.value || null })}
            placeholder="Private notes for instructors and admins — not visible to students."
            rows={10}
            className="w-full rounded-xl border border-rise-border bg-white px-3.5 py-2.5 text-rise-navy"
          />
        </div>
      )}
    </div>
  );
}
