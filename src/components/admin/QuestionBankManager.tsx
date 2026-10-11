"use client";

import { useState, useMemo } from "react";
import {
  QUESTION_BANK,
  ALL_ASSESSMENTS,
  filterQuestions,
} from "@/data/assessment-data";
import {
  TOPIC_LABELS,
  DIFFICULTY_LABELS,
  QUESTION_TYPE_LABELS,
  type QuestionType,
  type Difficulty,
  type TopicTag,
} from "@/data/assessment-types";
import { modules } from "@/data/course";
import { Card } from "@/components/ui/Card";

export function QuestionBankManager() {
  const [search, setSearch] = useState("");
  const [filterModule, setFilterModule] = useState("");
  const [filterTopic, setFilterTopic] = useState("");
  const [filterDifficulty, setFilterDifficulty] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterPublished, setFilterPublished] = useState("");
  const [showAssessments, setShowAssessments] = useState(false);

  const filtered = useMemo(
    () =>
      filterQuestions({
        search,
        moduleId: filterModule || undefined,
        topic: filterTopic || undefined,
        difficulty: filterDifficulty || undefined,
        type: filterType || undefined,
        published: filterPublished || undefined,
      }),
    [search, filterModule, filterTopic, filterDifficulty, filterType, filterPublished],
  );

  const publishedCount = QUESTION_BANK.filter((q) => q.published).length;
  const draftCount = QUESTION_BANK.filter((q) => !q.published).length;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-rise-navy">Question Bank & Assessments</h1>
          <p className="mt-1 text-sm text-rise-muted">
            {QUESTION_BANK.length} questions · {publishedCount} published · {draftCount} draft
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setShowAssessments(false)}
            className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
              !showAssessments ? "bg-rise-navy text-white" : "border border-rise-border bg-white text-rise-navy hover:bg-rise-sky"
            }`}
          >
            Question Bank
          </button>
          <button
            type="button"
            onClick={() => setShowAssessments(true)}
            className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
              showAssessments ? "bg-rise-navy text-white" : "border border-rise-border bg-white text-rise-navy hover:bg-rise-sky"
            }`}
          >
            Assessments ({ALL_ASSESSMENTS.length})
          </button>
        </div>
      </div>

      {showAssessments ? (
        <AssessmentList />
      ) : (
        <>
          {/* Filters */}
          <Card className="mb-4">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
              <input
                type="text"
                placeholder="Search questions..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="rounded-lg border border-rise-border bg-white px-3 py-2 text-sm text-rise-navy lg:col-span-2"
              />
              <select
                value={filterModule}
                onChange={(e) => setFilterModule(e.target.value)}
                className="rounded-lg border border-rise-border bg-white px-3 py-2 text-sm text-rise-navy"
              >
                <option value="">All Modules</option>
                {modules.map((m) => (
                  <option key={m.id} value={m.id}>Module {m.number}</option>
                ))}
              </select>
              <select
                value={filterTopic}
                onChange={(e) => setFilterTopic(e.target.value)}
                className="rounded-lg border border-rise-border bg-white px-3 py-2 text-sm text-rise-navy"
              >
                <option value="">All Topics</option>
                {Object.entries(TOPIC_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
              <select
                value={filterDifficulty}
                onChange={(e) => setFilterDifficulty(e.target.value)}
                className="rounded-lg border border-rise-border bg-white px-3 py-2 text-sm text-rise-navy"
              >
                <option value="">All Difficulty</option>
                {Object.entries(DIFFICULTY_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="rounded-lg border border-rise-border bg-white px-3 py-2 text-sm text-rise-navy"
              >
                <option value="">All Types</option>
                {Object.entries(QUESTION_TYPE_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>
            <div className="mt-3 flex items-center gap-3">
              <select
                value={filterPublished}
                onChange={(e) => setFilterPublished(e.target.value)}
                className="rounded-lg border border-rise-border bg-white px-3 py-2 text-sm text-rise-navy"
              >
                <option value="">All Statuses</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
              <span className="text-sm text-rise-muted">{filtered.length} results</span>
            </div>
          </Card>

          {/* Question list */}
          <div className="space-y-3">
            {filtered.map((q) => {
              const mod = modules.find((m) => m.id === q.moduleId);
              return (
                <Card key={q.id}>
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-start">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-md bg-rise-navy px-2 py-0.5 text-[10px] font-semibold uppercase text-white">
                          {QUESTION_TYPE_LABELS[q.type]}
                        </span>
                        <span className="rounded-md bg-rise-sky px-2 py-0.5 text-[10px] font-medium text-rise-muted">
                          {DIFFICULTY_LABELS[q.difficulty]}
                        </span>
                        <span className="rounded-md bg-rise-red/10 px-2 py-0.5 text-[10px] font-medium text-rise-red">
                          {TOPIC_LABELS[q.topic]}
                        </span>
                        {mod && (
                          <span className="text-[10px] text-rise-muted">Module {mod.number}</span>
                        )}
                        <span className="text-[10px] text-rise-muted">{q.points} pt</span>
                        {q.published ? (
                          <span className="rounded-md bg-rise-success-light px-2 py-0.5 text-[10px] font-semibold text-rise-success">
                            Published
                          </span>
                        ) : (
                          <span className="rounded-md bg-rise-border px-2 py-0.5 text-[10px] font-medium text-rise-muted">
                            Draft
                          </span>
                        )}
                      </div>
                      <p className="mt-2 text-sm font-medium text-rise-navy">{q.question}</p>
                      {q.options && (
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {q.options.map((opt, i) => {
                            const isCorrect =
                              q.correctAnswer === opt ||
                              (Array.isArray(q.correctAnswer) && q.correctAnswer.includes(opt));
                            return (
                              <span
                                key={i}
                                className={`rounded-md px-2 py-1 text-xs ${
                                  isCorrect
                                    ? "bg-rise-success-light text-rise-success"
                                    : "bg-rise-sky text-rise-muted"
                                }`}
                              >
                                {isCorrect && "✓ "}{opt}
                              </span>
                            );
                          })}
                        </div>
                      )}
                      {q.type === "calculation" && (
                        <p className="mt-1 text-xs text-rise-muted">
                          Answer: {q.unit || "$"}{q.numericAnswer ?? q.correctAnswer}
                          {q.acceptableRangeLow !== q.acceptableRangeHigh &&
                            ` (range: ${q.acceptableRangeLow}–${q.acceptableRangeHigh})`}
                        </p>
                      )}
                      {q.type === "fill_in_blank" && (
                        <p className="mt-1 text-xs text-rise-muted">Answer: {q.correctAnswer}</p>
                      )}
                      {q.type === "short_answer" && q.acceptableKeywords && (
                        <p className="mt-1 text-xs text-rise-muted">
                          Keywords: {q.acceptableKeywords.join(", ")}
                        </p>
                      )}
                      {q.explanation && (
                        <p className="mt-1 text-xs italic text-rise-muted">{q.explanation}</p>
                      )}
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <button
                        type="button"
                        className="rounded-lg border border-rise-border bg-white px-3 py-1.5 text-xs font-semibold text-rise-navy hover:bg-rise-sky"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="rounded-lg border border-rise-border bg-white px-3 py-1.5 text-xs font-semibold text-rise-navy hover:bg-rise-sky"
                      >
                        Duplicate
                      </button>
                      <button
                        type="button"
                        className="rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-semibold text-rise-red hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </Card>
              );
            })}
            {filtered.length === 0 && (
              <Card>
                <p className="py-8 text-center text-sm text-rise-muted">
                  No questions match your filters.
                </p>
              </Card>
            )}
          </div>
        </>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Assessment List — shows all configured assessments
// ---------------------------------------------------------------------------
function AssessmentList() {
  return (
    <div className="space-y-4">
      {ALL_ASSESSMENTS.map((a) => {
        const mod = modules.find((m) => m.id === a.moduleId);
        return (
          <Card key={a.id}>
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className={`rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase text-white ${
                    a.type === "final_assessment" ? "bg-rise-gold" : "bg-rise-navy"
                  }`}>
                    {a.type.replace(/_/g, " ")}
                  </span>
                  {a.published ? (
                    <span className="rounded-md bg-rise-success-light px-2 py-0.5 text-[10px] font-semibold text-rise-success">
                      Published
                    </span>
                  ) : (
                    <span className="rounded-md bg-rise-border px-2 py-0.5 text-[10px] font-medium text-rise-muted">
                      Draft
                    </span>
                  )}
                </div>
                <h3 className="mt-1 text-lg font-bold text-rise-navy">{a.title}</h3>
                <p className="text-sm text-rise-muted">{a.description}</p>
                <div className="mt-2 flex flex-wrap gap-3 text-xs text-rise-muted">
                  <span>{a.questionIds.length} questions</span>
                  <span>Pass: {a.passingScore}%</span>
                  <span>Retakes: {a.maxRetakes === null ? "Unlimited" : a.maxRetakes}</span>
                  <span>Feedback: {a.feedbackMode === "immediate" ? "Per question" : "After submit"}</span>
                  <span>Randomize: {a.randomizeQuestions ? "Yes" : "No"}</span>
                  {mod && <span>Module {mod.number}</span>}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  className="rounded-lg border border-rise-border bg-white px-3 py-1.5 text-xs font-semibold text-rise-navy hover:bg-rise-sky"
                >
                  Edit
                </button>
                <button
                  type="button"
                  className="rounded-lg border border-rise-border bg-white px-3 py-1.5 text-xs font-semibold text-rise-navy hover:bg-rise-sky"
                >
                  Preview
                </button>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
