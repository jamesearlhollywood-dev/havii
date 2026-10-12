"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Select } from "@/components/ui/Select";
import { updateActivityReviewModeAction } from "@/actions/reviews";
import type { Rubric, ActivityReviewMode, ActivityPrivacyLevel, SubmissionType } from "@/lib/types";
import type { ActivityReviewConfig } from "@/data/review-demo-data";

const REVIEW_MODE_OPTIONS: { value: ActivityReviewMode; label: string }[] = [
  { value: "completion_only", label: "Completion only" },
  { value: "instructor_reviewed", label: "Instructor-reviewed" },
  { value: "scored", label: "Scored" },
  { value: "rubric_scored", label: "Rubric-scored" },
];

const PRIVACY_OPTIONS: { value: ActivityPrivacyLevel; label: string }[] = [
  { value: "student_instructor_only", label: "Student + Instructor only" },
  { value: "student_instructor_admin", label: "Student + Instructor + Admin" },
  { value: "org_visible_completion", label: "Org-visible completion status only" },
];

const TYPE_LABELS: Record<string, string> = {
  decision_lab: "Decision Lab",
  workbook: "Workbook",
  reflection: "Reflection",
  action_commitment: "Action Commitment",
  short_answer: "Short Answer",
  blueprint_section: "Blueprint Section",
  final_capstone: "Final Capstone",
};

export function ActivityReviewConfigManager({
  configs,
  rubrics,
}: {
  configs: ActivityReviewConfig[];
  rubrics: Rubric[];
}) {
  const [states, setStates] = useState<Record<string, { error?: string; success?: string }>>({});

  async function handleUpdate(activityId: string, e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.set("activity_id", activityId);
    const result = await updateActivityReviewModeAction({}, formData);
    setStates((prev) => ({ ...prev, [activityId]: result }));
  }

  const rubricOptions = [
    { value: "", label: "No rubric" },
    ...rubrics.map((r) => ({ value: r.id, label: r.title })),
  ];

  return (
    <div>
      <h2 className="mb-1 text-xl font-bold text-rise-navy">Activity Review Settings</h2>
      <p className="mb-4 text-sm text-rise-muted">
        Configure how each activity is reviewed and who can see student responses.
      </p>
      <div className="space-y-3">
        {configs.map((config) => (
          <Card key={config.activity_id}>
            <form onSubmit={(e) => handleUpdate(config.activity_id, e)}>
              <div className="mb-3">
                <h3 className="font-bold text-rise-navy">{config.activity_title}</h3>
                <p className="text-xs text-rise-muted">{TYPE_LABELS[config.submission_type] ?? config.submission_type}</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <Select
                  label="Review Mode"
                  name="review_mode"
                  options={REVIEW_MODE_OPTIONS}
                  defaultValue={config.review_mode}
                />
                <Select
                  label="Privacy Level"
                  name="privacy_level"
                  options={PRIVACY_OPTIONS}
                  defaultValue={config.privacy_level}
                />
                <Select
                  label="Rubric"
                  name="rubric_id"
                  options={rubricOptions}
                  defaultValue={config.rubric_id ?? ""}
                />
              </div>
              {states[config.activity_id]?.error && (
                <p className="mt-2 text-sm text-red-600">{states[config.activity_id]?.error}</p>
              )}
              {states[config.activity_id]?.success && (
                <p className="mt-2 text-sm text-rise-success">{states[config.activity_id]?.success}</p>
              )}
              <button
                type="submit"
                className="mt-3 rounded-lg bg-rise-navy px-4 py-2 text-sm font-medium text-white hover:bg-rise-navy-light"
              >
                Save
              </button>
            </form>
          </Card>
        ))}
      </div>
    </div>
  );
}
