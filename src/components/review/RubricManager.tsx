"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { createRubricAction, updateRubricAction } from "@/actions/reviews";
import type { Rubric, RubricCriterion, SubmissionType } from "@/lib/types";

const TYPE_OPTIONS = [
  { value: "decision_lab", label: "Decision Lab" },
  { value: "workbook", label: "Workbook" },
  { value: "reflection", label: "Reflection" },
  { value: "action_commitment", label: "Action Commitment" },
  { value: "short_answer", label: "Short Answer" },
  { value: "blueprint_section", label: "Blueprint Section" },
  { value: "final_capstone", label: "Final Capstone" },
];

export function RubricManager({ rubrics }: { rubrics: Rubric[] }) {
  const [showForm, setShowForm] = useState(false);
  const [editingRubric, setEditingRubric] = useState<Rubric | null>(null);
  const [title, setTitle] = useState("");
  const [activityType, setActivityType] = useState<SubmissionType>("decision_lab");
  const [criteria, setCriteria] = useState<RubricCriterion[]>([]);
  const [state, setState] = useState<{ error?: string; success?: string }>({});
  const [pending, setPending] = useState(false);

  function startNew() {
    setEditingRubric(null);
    setTitle("");
    setActivityType("decision_lab");
    setCriteria([{ id: `c-${Date.now()}`, title: "", description: "" }]);
    setShowForm(true);
    setState({});
  }

  function startEdit(rubric: Rubric) {
    setEditingRubric(rubric);
    setTitle(rubric.title);
    setActivityType(rubric.activity_type);
    setCriteria(rubric.criteria.map((c) => ({ ...c })));
    setShowForm(true);
    setState({});
  }

  function addCriterion() {
    setCriteria([...criteria, { id: `c-${Date.now()}`, title: "", description: "" }]);
  }

  function removeCriterion(id: string) {
    setCriteria(criteria.filter((c) => c.id !== id));
  }

  function updateCriterion(id: string, field: "title" | "description", value: string) {
    setCriteria(criteria.map((c) => (c.id === id ? { ...c, [field]: value } : c)));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);

    const validCriteria = criteria.filter((c) => c.title.trim());
    if (!title.trim() || validCriteria.length === 0) {
      setState({ error: "Title and at least one criterion are required." });
      setPending(false);
      return;
    }

    const formData = new FormData();
    formData.set("title", title);
    formData.set("activity_type", activityType);
    formData.set("criteria", JSON.stringify(validCriteria));

    if (editingRubric) {
      formData.set("rubric_id", editingRubric.id);
      const result = await updateRubricAction({}, formData);
      setState(result);
    } else {
      const result = await createRubricAction({}, formData);
      setState(result);
    }

    setPending(false);
    if (state.success) setShowForm(false);
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-rise-navy">Rubric Templates</h2>
        <Button size="sm" onClick={startNew}>+ New Rubric</Button>
      </div>

      {showForm && (
        <Card className="mb-4 border-rise-blue">
          <h3 className="mb-4 font-bold text-rise-navy">
            {editingRubric ? "Edit Rubric" : "Create New Rubric"}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <Input
                label="Rubric Title"
                name="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Decision Lab Rubric"
              />
              <Select
                label="Activity Type"
                name="activity_type"
                options={TYPE_OPTIONS}
                value={activityType}
                onChange={(e) => setActivityType(e.target.value as SubmissionType)}
              />
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="text-sm font-medium text-rise-navy">Criteria</label>
                <Button type="button" size="sm" variant="ghost" onClick={addCriterion}>
                  + Add Criterion
                </Button>
              </div>
              <div className="space-y-3">
                {criteria.map((c, i) => (
                  <div key={c.id} className="rounded-lg border border-rise-border p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-rise-muted">Criterion {i + 1}</span>
                      {criteria.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeCriterion(c.id)}
                          className="text-xs text-rise-red hover:underline"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    <Input
                      name={`crit_title_${c.id}`}
                      placeholder="Criterion title (e.g. Financial Reasoning)"
                      value={c.title}
                      onChange={(e) => updateCriterion(c.id, "title", e.target.value)}
                      className="mt-2"
                    />
                    <Textarea
                      name={`crit_desc_${c.id}`}
                      placeholder="Description (what this criterion measures)"
                      value={c.description}
                      onChange={(e) => updateCriterion(c.id, "description", e.target.value)}
                      className="mt-2 min-h-[60px]"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Performance levels info */}
            <div className="rounded-lg bg-rise-sky p-3">
              <p className="text-xs font-semibold text-rise-muted">Performance Levels (standard for all rubrics):</p>
              <div className="mt-1 flex flex-wrap gap-2">
                <span className="rounded-full bg-white px-2.5 py-0.5 text-xs font-medium text-rise-navy">Beginning (1pt)</span>
                <span className="rounded-full bg-white px-2.5 py-0.5 text-xs font-medium text-rise-navy">Developing (2pt)</span>
                <span className="rounded-full bg-white px-2.5 py-0.5 text-xs font-medium text-rise-navy">Proficient (3pt)</span>
                <span className="rounded-full bg-white px-2.5 py-0.5 text-xs font-medium text-rise-navy">Strong (4pt)</span>
              </div>
            </div>

            {state.error && <p className="text-sm text-red-600">{state.error}</p>}
            {state.success && <p className="text-sm text-rise-success">{state.success}</p>}

            <div className="flex gap-3">
              <Button type="submit" size="sm" disabled={pending}>
                {pending ? "Saving…" : editingRubric ? "Update Rubric" : "Create Rubric"}
              </Button>
              <Button type="button" size="sm" variant="ghost" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Rubric list */}
      <div className="space-y-3">
        {rubrics.map((rubric) => (
          <Card key={rubric.id}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-rise-navy">{rubric.title}</h3>
                  {rubric.is_default && (
                    <span className="rounded-full bg-rise-sky px-2 py-0.5 text-xs font-semibold text-rise-navy">
                      Default
                    </span>
                  )}
                </div>
                <p className="mt-0.5 text-xs text-rise-muted">
                  {TYPE_OPTIONS.find((t) => t.value === rubric.activity_type)?.label} · {rubric.criteria.length} criteria
                </p>
                <div className="mt-3 space-y-1">
                  {rubric.criteria.map((c) => (
                    <div key={c.id} className="text-sm">
                      <span className="font-medium text-rise-navy">{c.title}</span>
                      <span className="ml-2 text-rise-muted">— {c.description}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {rubric.performance_levels.map((p) => (
                    <span key={p.level} className="rounded-full bg-rise-sky px-2.5 py-0.5 text-xs font-medium text-rise-navy">
                      {p.label} ({p.point_value}pt)
                    </span>
                  ))}
                </div>
              </div>
              {!rubric.is_default && (
                <Button size="sm" variant="outline" onClick={() => startEdit(rubric)}>
                  Edit
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
