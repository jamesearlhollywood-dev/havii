"use client";

import { useState } from "react";
import { saveResumeAction } from "@/actions/resume";
import type { ParsedResumeData } from "@/lib/career/types";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Alert } from "@/components/ui/Alert";
import { Card } from "@/components/ui/Card";

export function ResumeReview({
  rawText,
  parsedData,
  fileName,
  resumeName,
  file,
  onDone,
  onCancel,
}: {
  rawText: string;
  parsedData: ParsedResumeData;
  fileName: string;
  resumeName: string;
  file: File | null;
  onDone: () => void;
  onCancel: () => void;
}) {
  const [editable, setEditable] = useState<ParsedResumeData>(parsedData);
  const [name, setName] = useState(resumeName);
  const [targetRole, setTargetRole] = useState("");
  const [setPrimary, setSetPrimary] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("name", name);
      fd.append("target_role", targetRole);
      fd.append("is_primary", setPrimary ? "true" : "false");
      fd.append("raw_text", rawText);
      fd.append("parsed_data", JSON.stringify(editable));
      if (file) fd.append("file", file);

      const result = await saveResumeAction({ error: undefined, success: undefined }, fd);
      if (result.error) {
        setError(result.error);
      } else {
        onDone();
      }
    } catch (e) {
      if (e && typeof e === "object" && "digest" in e) throw e;
      setError(e instanceof Error ? e.message : "Failed to save resume.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      {error ? <Alert tone="error">{error}</Alert> : null}

      {/* Header info */}
      <div className="rounded-xl border border-career-border bg-white p-5 shadow-sm">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-career-slate">
              Original filename
            </p>
            <p className="mt-1 text-sm text-career-navy">{fileName}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-career-slate">
              Resume name
            </p>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1"
              placeholder="Resume name"
            />
          </div>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Input
            label="Target role"
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
            placeholder="e.g. Senior Software Engineer"
          />
          <div className="flex items-end">
            <label className="flex items-center gap-2 text-sm text-career-navy">
              <input
                type="checkbox"
                checked={setPrimary}
                onChange={(e) => setSetPrimary(e.target.checked)}
                className="h-4 w-4 rounded border-career-border"
              />
              Set as primary resume
            </label>
          </div>
        </div>
      </div>

      {/* Parsed info */}
      <Card>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-semibold text-career-navy">Extracted Information</h3>
          <Button
            type="button"
            variant={isEditing ? "outline" : "ghost"}
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? "Done editing" : "Edit parsed info"}
          </Button>
        </div>

        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <ParsedField
              label="Candidate name"
              value={editable.candidate_name}
              editable={isEditing}
              onChange={(v) => setEditable({ ...editable, candidate_name: v })}
            />
            <ParsedField
              label="Professional headline"
              value={editable.headline}
              editable={isEditing}
              onChange={(v) => setEditable({ ...editable, headline: v })}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-career-navy">
              Professional summary
            </label>
            {isEditing ? (
              <Textarea
                value={editable.summary || ""}
                onChange={(e) => setEditable({ ...editable, summary: e.target.value || null })}
                className="min-h-[80px]"
              />
            ) : (
              <p className="rounded-lg bg-career-bg px-3 py-2 text-sm text-career-navy">
                {editable.summary || <span className="text-career-slate italic">Not found</span>}
              </p>
            )}
          </div>

          {/* Skills */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-career-navy">
              Skills ({editable.skills.length})
            </label>
            {isEditing ? (
              <Textarea
                value={editable.skills.join(", ")}
                onChange={(e) =>
                  setEditable({
                    ...editable,
                    skills: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                  })
                }
                hint="Comma-separated"
                className="min-h-[60px]"
              />
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {editable.skills.length > 0 ? (
                  editable.skills.map((s, i) => (
                    <span key={i} className="rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-medium text-career-blue">
                      {s}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-career-slate italic">No skills found</span>
                )}
              </div>
            )}
          </div>

          {/* Keywords */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-career-navy">
              Keywords ({editable.keywords.length})
            </label>
            {isEditing ? (
              <Textarea
                value={editable.keywords.join(", ")}
                onChange={(e) =>
                  setEditable({
                    ...editable,
                    keywords: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                  })
                }
                hint="Comma-separated"
                className="min-h-[60px]"
              />
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {editable.keywords.length > 0 ? (
                  editable.keywords.map((k, i) => (
                    <span key={i} className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs text-career-slate">
                      {k}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-career-slate italic">No keywords found</span>
                )}
              </div>
            )}
          </div>

          {/* Work experience */}
          {editable.work_experience.length > 0 && (
            <div>
              <label className="mb-2 block text-sm font-medium text-career-navy">
                Work experience ({editable.work_experience.length})
              </label>
              <div className="space-y-2">
                {editable.work_experience.map((exp, i) => (
                  <div key={i} className="rounded-lg border border-career-border bg-career-bg px-3 py-2 text-sm">
                    <span className="font-medium text-career-navy">{exp.job_title || "—"}</span>
                    {exp.employer ? <span className="text-career-slate"> — {exp.employer}</span> : null}
                    {(exp.start_date || exp.end_date) && (
                      <span className="text-career-slate"> ({[exp.start_date, exp.end_date].filter(Boolean).join(" – ")})</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {editable.education.length > 0 && (
            <div>
              <label className="mb-2 block text-sm font-medium text-career-navy">
                Education ({editable.education.length})
              </label>
              <div className="space-y-2">
                {editable.education.map((edu, i) => (
                  <div key={i} className="rounded-lg border border-career-border bg-career-bg px-3 py-2 text-sm">
                    <span className="font-medium text-career-navy">{edu.degree || "—"}</span>
                    {edu.institution ? <span className="text-career-slate"> — {edu.institution}</span> : null}
                    {edu.field ? <span className="text-career-slate"> ({edu.field})</span> : null}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certifications */}
          {editable.certifications.length > 0 && (
            <div>
              <label className="mb-1.5 block text-sm font-medium text-career-navy">
                Certifications ({editable.certifications.length})
              </label>
              <ul className="list-inside list-disc text-sm text-career-navy">
                {editable.certifications.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </Card>

      {/* Resume text preview */}
      <Card>
        <button
          type="button"
          className="flex w-full items-center justify-between"
          onClick={() => setShowPreview(!showPreview)}
        >
          <span className="font-semibold text-career-navy">Resume text preview</span>
          <span className="text-sm text-career-blue">{showPreview ? "Hide" : "Show"}</span>
        </button>
        {showPreview && (
          <pre className="mt-3 max-h-80 overflow-auto rounded-lg bg-career-bg p-3 text-xs text-career-navy whitespace-pre-wrap">
            {rawText}
          </pre>
        )}
      </Card>

      {/* Actions */}
      <div className="flex flex-wrap justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="button" onClick={handleSave} loading={saving}>
          Save Resume
        </Button>
      </div>
    </div>
  );
}

function ParsedField({
  label,
  value,
  editable,
  onChange,
}: {
  label: string;
  value: string | null;
  editable: boolean;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-career-navy">{label}</label>
      {editable ? (
        <Input
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Not found"
        />
      ) : (
        <p className="rounded-lg bg-career-bg px-3 py-2 text-sm text-career-navy">
          {value || <span className="text-career-slate italic">Not found</span>}
        </p>
      )}
    </div>
  );
}
