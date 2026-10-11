"use client";

import { useState } from "react";
import { submitDecisionLab } from "@/actions/progress";
import type { DecisionLab as DecisionLabType } from "@/data/course-types";
import { Alert } from "@/components/ui/Alert";

export function DecisionLab({
  moduleId,
  lab,
  alreadySubmitted,
}: {
  moduleId: string;
  lab: DecisionLabType;
  alreadySubmitted: boolean;
}) {
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(alreadySubmitted);

  function setValue(id: string, value: any) {
    setResponses((prev) => ({ ...prev, [id]: value }));
  }

  async function handleSubmit() {
    setSubmitting(true);
    try {
      await submitDecisionLab(moduleId, lab.id, responses);
      setSubmitted(true);
    } catch {
      // ignore
    }
    setSubmitting(false);
  }

  if (submitted) {
    return (
      <div className="space-y-6">
        <div className="rounded-2xl border border-rise-success/30 bg-rise-success-light p-6 text-center">
          <div className="text-4xl">✓</div>
          <p className="mt-2 text-lg font-bold text-rise-success">Decision Lab Submitted!</p>
          <p className="mt-1 text-sm text-rise-muted">{lab.resultPrompt}</p>
        </div>
        <div className="rounded-2xl border border-rise-border bg-white p-5">
          <h3 className="text-base font-bold text-rise-navy">Your Responses</h3>
          <div className="mt-3 space-y-2">
            {lab.fields.map((f) => {
              const val = responses[f.id] ?? (alreadySubmitted ? "Submitted" : "");
              if (f.type === "calculated") return null;
              return (
                <div key={f.id} className="flex justify-between border-b border-rise-border pb-2 text-sm">
                  <span className="text-rise-muted">{f.label}</span>
                  <span className="font-medium text-rise-navy">
                    {Array.isArray(val) ? val.join(", ") : String(val || "—")}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
        <a
          href={`/course/module/${moduleId}`}
          className="inline-block rounded-xl bg-rise-navy px-5 py-2.5 text-sm font-semibold text-white hover:bg-rise-navy-light"
        >
          Back to Module
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-6">
    <Alert tone="info">{lab.instructions}</Alert>

    <div className="space-y-4">
      {lab.fields.map((field) => {
        if (field.type === "calculated") {
          return (
            <div key={field.id} className="rounded-xl border border-rise-border bg-rise-sky/30 p-4">
              <p className="text-sm font-medium text-rise-navy">{field.label}</p>
              {field.description && (
                <p className="mt-1 text-xs text-rise-muted">{field.description}</p>
              )}
            </div>
          );
        }

        if (field.type === "radio" && field.options) {
          return (
            <div key={field.id} className="rounded-xl border border-rise-border bg-white p-4">
              <p className="text-sm font-medium text-rise-navy">{field.label}</p>
              <div className="mt-3 space-y-2">
                {field.options.map((opt) => (
                  <label
                    key={opt.id}
                    className={`flex cursor-pointer items-start gap-2.5 rounded-lg border px-3 py-2.5 text-sm transition ${
                      responses[field.id] === opt.id
                        ? "border-rise-blue bg-rise-sky"
                        : "border-rise-border hover:bg-rise-sky/50"
                    }`}
                  >
                    <input
                      type="radio"
                      name={field.id}
                      checked={responses[field.id] === opt.id}
                      onChange={() => setValue(field.id, opt.id)}
                      className="mt-0.5 accent-rise-navy"
                    />
                    <div>
                      <span className="font-medium text-rise-navy">{opt.label}</span>
                      {opt.description && (
                        <p className="mt-0.5 text-xs text-rise-muted">{opt.description}</p>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            </div>
          );
        }

        if (field.type === "checkbox" && field.options) {
          return (
            <div key={field.id} className="rounded-xl border border-rise-border bg-white p-4">
              <p className="text-sm font-medium text-rise-navy">{field.label}</p>
              <div className="mt-3 space-y-2">
                {field.options.map((opt) => {
                  const checked = Array.isArray(responses[field.id]) && responses[field.id].includes(opt.id);
                  return (
                    <label
                      key={opt.id}
                      className={`flex cursor-pointer items-start gap-2.5 rounded-lg border px-3 py-2.5 text-sm transition ${
                        checked ? "border-rise-blue bg-rise-sky" : "border-rise-border hover:bg-rise-sky/50"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => {
                          const current = Array.isArray(responses[field.id]) ? responses[field.id] : [];
                          setValue(field.id, checked ? current.filter((v: string) => v !== opt.id) : [...current, opt.id]);
                        }}
                        className="mt-0.5 accent-rise-navy"
                      />
                      <div>
                        <span className="font-medium text-rise-navy">{opt.label}</span>
                        {opt.description && (
                          <p className="mt-0.5 text-xs text-rise-muted">{opt.description}</p>
                        )}
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          );
        }

        if (field.type === "number") {
          return (
            <div key={field.id} className="rounded-xl border border-rise-border bg-white p-4">
              <label className="text-sm font-medium text-rise-navy">{field.label}</label>
              {field.description && (
                <p className="mt-1 text-xs text-rise-muted">{field.description}</p>
              )}
              <div className="mt-2 flex items-center gap-2">
                {field.unit === "$" && <span className="text-sm text-rise-muted">$</span>}
                <input
                  type="number"
                  value={responses[field.id] ?? ""}
                  onChange={(e) => setValue(field.id, e.target.value)}
                  placeholder={field.placeholder}
                  className="w-full rounded-lg border border-rise-border bg-white px-3 py-2 text-sm text-rise-navy focus:outline-none focus-visible:ring-2 focus-visible:ring-rise-blue"
                />
                {field.unit && field.unit !== "$" && <span className="text-sm text-rise-muted">{field.unit}</span>}
              </div>
            </div>
          );
        }

        // text / default
        return (
          <div key={field.id} className="rounded-xl border border-rise-border bg-white p-4">
            <label className="text-sm font-medium text-rise-navy">{field.label}</label>
            {field.description && (
              <p className="mt-1 text-xs text-rise-muted">{field.description}</p>
            )}
            <textarea
              value={responses[field.id] ?? ""}
              onChange={(e) => setValue(field.id, e.target.value)}
              placeholder={field.placeholder}
              className="mt-2 min-h-[80px] w-full rounded-lg border border-rise-border bg-white px-3 py-2 text-sm text-rise-navy focus:outline-none focus-visible:ring-2 focus-visible:ring-rise-blue"
            />
          </div>
        );
      })}
    </div>

    <button
      type="button"
      onClick={handleSubmit}
      disabled={submitting}
      className="w-full rounded-xl bg-rise-navy px-6 py-3.5 text-sm font-semibold text-white hover:bg-rise-navy-light disabled:opacity-50"
    >
      {submitting ? "Submitting..." : "Submit Decision Lab"}
    </button>
  </div>
  );
}
