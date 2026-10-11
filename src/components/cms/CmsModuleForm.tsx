"use client";

import { useState } from "react";
import type { CmsModule } from "@/data/cms-types";
import { VersionInfo } from "./VersionInfo";

interface CmsModuleFormProps {
  module: CmsModule;
  onChange: (updates: Partial<CmsModule>) => void;
  moduleOptions: { id: string; title: string }[];
}

export function CmsModuleForm({ module, onChange, moduleOptions }: CmsModuleFormProps) {
  const [objectives, setObjectives] = useState(module.objectives.join("\n"));

  return (
    <div className="space-y-5">
      <VersionInfo
        createdAt={module.createdAt}
        updatedAt={module.updatedAt}
        updatedBy={module.updatedBy}
        status={module.status}
      />

      {/* Title */}
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-rise-navy">Module Title</label>
        <input
          type="text"
          value={module.title}
          onChange={(e) => onChange({ title: e.target.value })}
          className="w-full rounded-xl border border-rise-border bg-white px-3.5 py-2.5 text-rise-navy"
        />
      </div>

      {/* Subtitle */}
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-rise-navy">Subtitle</label>
        <input
          type="text"
          value={module.subtitle}
          onChange={(e) => onChange({ subtitle: e.target.value })}
          className="w-full rounded-xl border border-rise-border bg-white px-3.5 py-2.5 text-rise-navy"
        />
      </div>

      {/* Description */}
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-rise-navy">Description / Overview</label>
        <textarea
          value={module.description}
          onChange={(e) => onChange({ description: e.target.value })}
          rows={4}
          className="w-full rounded-xl border border-rise-border bg-white px-3.5 py-2.5 text-rise-navy"
        />
      </div>

      {/* Objectives */}
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
          rows={6}
          className="w-full rounded-xl border border-rise-border bg-white px-3.5 py-2.5 text-rise-navy"
        />
      </div>

      {/* Grid: Estimated time, Icon, Module number */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-rise-navy">Estimated Time</label>
          <input
            type="text"
            value={module.estimatedTime}
            onChange={(e) => onChange({ estimatedTime: e.target.value })}
            placeholder="e.g., 3–4 hours"
            className="w-full rounded-xl border border-rise-border bg-white px-3.5 py-2.5 text-rise-navy"
          />
        </div>
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-rise-navy">Icon (emoji)</label>
          <input
            type="text"
            value={module.icon}
            onChange={(e) => onChange({ icon: e.target.value })}
            placeholder="🏦"
            className="w-full rounded-xl border border-rise-border bg-white px-3.5 py-2.5 text-rise-navy"
          />
        </div>
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-rise-navy">Module Number / Order</label>
          <input
            type="number"
            value={module.number}
            onChange={(e) => onChange({ number: Number(e.target.value) })}
            className="w-full rounded-xl border border-rise-border bg-white px-3.5 py-2.5 text-rise-navy"
          />
        </div>
      </div>

      {/* Grid: Image URL, Prerequisite, Required completion */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-rise-navy">Module Image URL</label>
          <input
            type="url"
            value={module.imageUrl || ""}
            onChange={(e) => onChange({ imageUrl: e.target.value || null })}
            placeholder="https://..."
            className="w-full rounded-xl border border-rise-border bg-white px-3.5 py-2.5 text-rise-navy"
          />
        </div>
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-rise-navy">Prerequisite Module</label>
          <select
            value={module.prerequisiteModuleId || ""}
            onChange={(e) => onChange({ prerequisiteModuleId: e.target.value || null })}
            className="w-full rounded-xl border border-rise-border bg-white px-3.5 py-2.5 text-rise-navy"
          >
            <option value="">None</option>
            {moduleOptions
              .filter((m) => m.id !== module.id)
              .map((m) => (
                <option key={m.id} value={m.id}>{m.title.split("—")[0]}</option>
              ))}
          </select>
        </div>
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-rise-navy">Required Completion %</label>
          <input
            type="number"
            min={0}
            max={100}
            value={module.requiredCompletionPct}
            onChange={(e) => onChange({ requiredCompletionPct: Number(e.target.value) })}
            className="w-full rounded-xl border border-rise-border bg-white px-3.5 py-2.5 text-rise-navy"
          />
        </div>
      </div>

      {/* Published toggle */}
      <div className="flex items-center gap-3 rounded-xl border border-rise-border bg-rise-sky/30 p-4">
        <button
          type="button"
          onClick={() => onChange({ isPublished: !module.isPublished, status: !module.isPublished ? "published" : "draft" })}
          className={`relative h-6 w-11 rounded-full transition ${module.isPublished ? "bg-rise-success" : "bg-rise-border"}`}
        >
          <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${module.isPublished ? "left-5" : "left-0.5"}`} />
        </button>
        <div>
          <p className="text-sm font-medium text-rise-navy">
            {module.isPublished ? "Published" : "Draft (not visible to students)"}
          </p>
          <p className="text-xs text-rise-muted">
            {module.isPublished
              ? "This module is visible to students."
              : "Students cannot see this module until it is published."}
          </p>
        </div>
      </div>
    </div>
  );
}
