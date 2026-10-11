"use client";

import { useState, useCallback } from "react";
import type { CmsModule, CmsLesson, CmsActivity } from "@/data/cms-types";
import { RISE_CONTENT_TYPES, ACTIVITY_TYPES, type RiseContentType, type ActivityType } from "@/data/cms-types";
import { CmsModuleForm } from "./CmsModuleForm";
import { CmsLessonForm } from "./CmsLessonForm";
import { CmsActivityForm } from "./CmsActivityForm";
import { CmsPreviewView } from "./CmsPreviewView";
import { ReorderControls } from "./ReorderControls";
import { RiseContentTypeBadge } from "./RiseContentTypeBadge";
import { ContentRenderer } from "@/components/course/ContentRenderer";

type View =
  | { type: "modules" }
  | { type: "module-detail"; moduleId: string }
  | { type: "lesson-editor"; moduleId: string; lessonId: string }
  | { type: "activity-editor"; moduleId: string; lessonId: string; activityId: string }
  | { type: "preview"; moduleId: string; lessonId: string };

function genId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function nowISO() {
  return new Date().toISOString();
}

export function CmsManager({
  initialModules,
  adminName,
  supabaseConnected,
}: {
  initialModules: CmsModule[];
  adminName: string;
  supabaseConnected: boolean;
}) {
  const [modules, setModules] = useState<CmsModule[]>(initialModules);
  const [view, setView] = useState<View>({ type: "modules" });
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  // -- Helpers --
  const updateModule = useCallback((moduleId: string, updates: Partial<CmsModule>) => {
    setModules((prev) =>
      prev.map((m) =>
        m.id === moduleId
          ? { ...m, ...updates, updatedAt: nowISO(), updatedBy: adminName }
          : m
      )
    );
    setSaveStatus("saved");
    setTimeout(() => setSaveStatus("idle"), 2000);
  }, [adminName]);

  const updateLesson = useCallback((moduleId: string, lessonId: string, updates: Partial<CmsLesson>) => {
    setModules((prev) =>
      prev.map((m) =>
        m.id === moduleId
          ? {
              ...m,
              lessons: m.lessons.map((l) =>
                l.id === lessonId
                  ? { ...l, ...updates, updatedAt: nowISO(), updatedBy: adminName }
                  : l
              ),
              updatedAt: nowISO(),
              updatedBy: adminName,
            }
          : m
      )
    );
    setSaveStatus("saved");
    setTimeout(() => setSaveStatus("idle"), 2000);
  }, [adminName]);

  const updateActivity = useCallback(
    (moduleId: string, lessonId: string, activityId: string, updates: Partial<CmsActivity>) => {
      setModules((prev) =>
        prev.map((m) =>
          m.id === moduleId
            ? {
                ...m,
                lessons: m.lessons.map((l) =>
                  l.id === lessonId
                    ? {
                        ...l,
                        activities: l.activities.map((a) =>
                          a.id === activityId
                            ? { ...a, ...updates, updatedAt: nowISO(), updatedBy: adminName }
                            : a
                        ),
                      }
                    : l
                ),
              }
            : m
        )
      );
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 2000);
    },
    [adminName]
  );

  // -- Module operations --
  function addModule() {
    const newModule: CmsModule = {
      id: genId("module"),
      number: modules.length + 1,
      title: "New Module",
      subtitle: "",
      description: "",
      objectives: [],
      estimatedTime: "",
      icon: "📘",
      themeColor: "rise-navy",
      imageUrl: null,
      isPublished: false,
      prerequisiteModuleId: null,
      requiredCompletionPct: 0,
      lessons: [],
      keyTerms: [],
      realLifeScenario: { title: "", setup: "", situation: "", prompt: "" },
      decisionLab: { id: genId("lab"), title: "", subtitle: "", instructions: "", fields: [], resultPrompt: "" },
      workbookActivity: { title: "", instructions: "", prompts: [] },
      knowledgeCheck: [],
      reflection: { prompt: "", placeholder: "" },
      actionCommitment: { prompt: "", placeholder: "" },
      blueprintUpdate: { sectionKey: "", sectionTitle: "", prompt: "", fields: [] },
      createdAt: nowISO(),
      updatedAt: nowISO(),
      updatedBy: adminName,
      status: "draft",
    };
    setModules((prev) => [...prev, newModule]);
    setView({ type: "module-detail", moduleId: newModule.id });
  }

  function deleteModule(moduleId: string) {
    if (!confirm("Delete this module and all its lessons? This will NOT reset existing student progress.")) return;
    setModules((prev) => prev.filter((m) => m.id !== moduleId));
    setView({ type: "modules" });
  }

  function reorderModules(index: number, dir: -1 | 1) {
    const target = index + dir;
    if (target < 0 || target >= modules.length) return;
    setModules((prev) => {
      const next = [...prev];
      [next[index], next[target]] = [next[target], next[index]];
      return next.map((m, i) => ({ ...m, number: i + 1 }));
    });
  }

  // -- Lesson operations --
  function addLesson(moduleId: string) {
    const newLesson: CmsLesson = {
      id: genId("lesson"),
      moduleId,
      title: "New Lesson",
      subtitle: "",
      description: "",
      objectives: [],
      estimatedMinutes: 15,
      sortOrder: 0,
      isRequired: true,
      isPublished: false,
      riseContentType: "learn_it",
      content: [],
      instructorNotes: null,
      studentInstructions: null,
      activities: [],
      createdAt: nowISO(),
      updatedAt: nowISO(),
      updatedBy: adminName,
      status: "draft",
    };
    setModules((prev) =>
      prev.map((m) =>
        m.id === moduleId
          ? { ...m, lessons: [...m.lessons, { ...newLesson, sortOrder: m.lessons.length }] }
          : m
      )
    );
    setView({ type: "lesson-editor", moduleId, lessonId: newLesson.id });
  }

  function deleteLesson(moduleId: string, lessonId: string) {
    if (!confirm("Delete this lesson? This will NOT reset existing student progress.")) return;
    setModules((prev) =>
      prev.map((m) =>
        m.id === moduleId
          ? { ...m, lessons: m.lessons.filter((l) => l.id !== lessonId) }
          : m
      )
    );
    setView({ type: "module-detail", moduleId });
  }

  function duplicateLesson(moduleId: string, lessonId: string) {
    setModules((prev) =>
      prev.map((m) => {
        if (m.id !== moduleId) return m;
        const lesson = m.lessons.find((l) => l.id === lessonId);
        if (!lesson) return m;
        const copy: CmsLesson = {
          ...lesson,
          id: genId("lesson"),
          title: `${lesson.title} (Copy)`,
          isPublished: false,
          status: "draft",
          createdAt: nowISO(),
          updatedAt: nowISO(),
          updatedBy: adminName,
          sortOrder: m.lessons.length,
          activities: lesson.activities.map((a) => ({
            ...a,
            id: genId("activity"),
            createdAt: nowISO(),
            updatedAt: nowISO(),
          })),
        };
        return { ...m, lessons: [...m.lessons, copy] };
      })
    );
  }

  function reorderLessons(moduleId: string, index: number, dir: -1 | 1) {
    setModules((prev) =>
      prev.map((m) => {
        if (m.id !== moduleId) return m;
        const target = index + dir;
        if (target < 0 || target >= m.lessons.length) return m;
        const lessons = [...m.lessons];
        [lessons[index], lessons[target]] = [lessons[target], lessons[index]];
        return { ...m, lessons: lessons.map((l, i) => ({ ...l, sortOrder: i })) };
      })
    );
  }

  // -- Activity operations --
  function addActivity(moduleId: string, lessonId: string) {
    const newActivity: CmsActivity = {
      id: genId("activity"),
      lessonId,
      moduleId,
      title: "New Activity",
      activityType: "text_lesson",
      riseContentType: null,
      content: {},
      sortOrder: 0,
      isPublished: false,
      instructorNotes: null,
      createdAt: nowISO(),
      updatedAt: nowISO(),
      updatedBy: adminName,
      status: "draft",
    };
    setModules((prev) =>
      prev.map((m) =>
        m.id === moduleId
          ? {
              ...m,
              lessons: m.lessons.map((l) =>
                l.id === lessonId
                  ? { ...l, activities: [...l.activities, { ...newActivity, sortOrder: l.activities.length }] }
                  : l
              ),
            }
          : m
      )
    );
    setView({ type: "activity-editor", moduleId, lessonId, activityId: newActivity.id });
  }

  function deleteActivity(moduleId: string, lessonId: string, activityId: string) {
    if (!confirm("Delete this activity?")) return;
    setModules((prev) =>
      prev.map((m) =>
        m.id === moduleId
          ? {
              ...m,
              lessons: m.lessons.map((l) =>
                l.id === lessonId
                  ? { ...l, activities: l.activities.filter((a) => a.id !== activityId) }
                  : l
              ),
            }
          : m
      )
    );
    setView({ type: "lesson-editor", moduleId, lessonId });
  }

  function duplicateActivity(moduleId: string, lessonId: string, activityId: string) {
    setModules((prev) =>
      prev.map((m) => {
        if (m.id !== moduleId) return m;
        return {
          ...m,
          lessons: m.lessons.map((l) => {
            if (l.id !== lessonId) return l;
            const act = l.activities.find((a) => a.id === activityId);
            if (!act) return l;
            const copy: CmsActivity = {
              ...act,
              id: genId("activity"),
              title: `${act.title} (Copy)`,
              isPublished: false,
              status: "draft",
              createdAt: nowISO(),
              updatedAt: nowISO(),
              sortOrder: l.activities.length,
            };
            return { ...l, activities: [...l.activities, copy] };
          }),
        };
      })
    );
  }

  function reorderActivities(moduleId: string, lessonId: string, index: number, dir: -1 | 1) {
    setModules((prev) =>
      prev.map((m) => {
        if (m.id !== moduleId) return m;
        return {
          ...m,
          lessons: m.lessons.map((l) => {
            if (l.id !== lessonId) return l;
            const target = index + dir;
            if (target < 0 || target >= l.activities.length) return l;
            const activities = [...l.activities];
            [activities[index], activities[target]] = [activities[target], activities[index]];
            return { ...l, activities: activities.map((a, i) => ({ ...a, sortOrder: i })) };
          }),
        };
      })
    );
  }

  // -- Render --
  const currentModule = view.type !== "modules" ? modules.find((m) => m.id === view.moduleId) : null;
  const currentLesson = view.type === "lesson-editor" || view.type === "preview" || view.type === "activity-editor"
    ? currentModule?.lessons.find((l) => l.id === view.lessonId)
    : null;
  const currentActivity = view.type === "activity-editor" && currentLesson
    ? currentLesson.activities.find((a) => a.id === view.activityId)
    : null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      {/* Save status indicator */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm">
          {saveStatus === "saving" && <span className="text-rise-muted">Saving…</span>}
          {saveStatus === "saved" && <span className="text-rise-success">✓ Changes saved</span>}
          {saveStatus === "error" && <span className="text-red-600">Error saving</span>}
        </div>
        {!supabaseConnected && (
          <span className="rounded-full bg-rise-warning-light px-3 py-1 text-xs font-medium text-rise-warning">
            ⚠ Supabase not connected — changes are session-only
          </span>
        )}
      </div>

      {/* MODULES LIST VIEW */}
      {view.type === "modules" && (
        <div>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-rise-navy">Content Management</h1>
              <p className="mt-1 text-sm text-rise-muted">
                Manage modules, lessons, and learning activities. Course → Module → Lesson → Activity.
              </p>
            </div>
            <button
              type="button"
              onClick={addModule}
              className="rounded-xl bg-rise-navy px-4 py-2.5 text-sm font-semibold text-white hover:bg-rise-navy-light"
            >
              + Add Module
            </button>
          </div>

          {/* Module grid */}
          <div className="space-y-3">
            {modules.map((m, i) => (
              <div
                key={m.id}
                className="rounded-2xl border border-rise-border bg-white p-5 shadow-sm"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex items-start gap-3">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-rise-sky text-2xl">
                      {m.icon}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold uppercase tracking-wider text-rise-red">
                          Module {m.number}
                        </span>
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${m.isPublished ? "bg-rise-success-light text-rise-success" : "bg-rise-warning-light text-rise-warning"}`}>
                          {m.isPublished ? "Published" : "Draft"}
                        </span>
                      </div>
                      <h3 className="mt-0.5 text-lg font-bold text-rise-navy">{m.title.split("—")[0]}</h3>
                      <p className="text-sm text-rise-muted">{m.subtitle}</p>
                      <div className="mt-1.5 flex flex-wrap gap-2 text-xs text-rise-muted">
                        <span>{m.lessons.length} lessons</span>
                        <span>·</span>
                        <span>{m.estimatedTime}</span>
                        <span>·</span>
                        <span>{m.objectives.length} objectives</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <ReorderControls
                      onUp={() => reorderModules(i, -1)}
                      onDown={() => reorderModules(i, 1)}
                      canUp={i > 0}
                      canDown={i < modules.length - 1}
                    />
                    <button
                      type="button"
                      onClick={() => setView({ type: "module-detail", moduleId: m.id })}
                      className="rounded-lg bg-rise-navy px-3 py-1.5 text-sm font-medium text-white hover:bg-rise-navy-light"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteModule(m.id)}
                      className="rounded-lg border border-rise-border bg-white p-1.5 text-red-500 hover:bg-red-50"
                      aria-label="Delete module"
                    >
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 3l8 8M11 3l-8 8" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODULE DETAIL VIEW */}
      {view.type === "module-detail" && currentModule && (
        <div>
          <button
            type="button"
            onClick={() => setView({ type: "modules" })}
            className="mb-4 text-sm font-medium text-rise-blue-dark hover:underline"
          >
            ← All Modules
          </button>

          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-rise-navy">
              {currentModule.icon} Module {currentModule.number}: {currentModule.title.split("—")[0]}
            </h1>
          </div>

          {/* Module settings */}
          <div className="mb-8 rounded-2xl border border-rise-border bg-white p-6">
            <h2 className="mb-4 text-lg font-bold text-rise-navy">Module Settings</h2>
            <CmsModuleForm
              module={currentModule}
              onChange={(updates) => updateModule(currentModule.id, updates)}
              moduleOptions={modules.map((m) => ({ id: m.id, title: m.title }))}
            />
          </div>

          {/* Lessons */}
          <div className="rounded-2xl border border-rise-border bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-rise-navy">Lessons ({currentModule.lessons.length})</h2>
              <button
                type="button"
                onClick={() => addLesson(currentModule.id)}
                className="rounded-lg bg-rise-navy px-3 py-1.5 text-sm font-medium text-white hover:bg-rise-navy-light"
              >
                + Add Lesson
              </button>
            </div>

            {currentModule.lessons.length === 0 ? (
              <p className="py-6 text-center text-sm text-rise-muted">No lessons yet. Click "Add Lesson" to create one.</p>
            ) : (
              <div className="space-y-2">
                {currentModule.lessons.map((lesson, i) => (
                  <div
                    key={lesson.id}
                    className="flex flex-col gap-2 rounded-xl border border-rise-border bg-rise-sky/20 p-3 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-rise-navy text-xs font-bold text-white">
                        {i + 1}
                      </span>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="text-sm font-semibold text-rise-navy">{lesson.title}</h4>
                          {lesson.riseContentType && (
                            <RiseContentTypeBadge type={lesson.riseContentType} size="sm" />
                          )}
                        </div>
                        <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-rise-muted">
                          <span>{lesson.estimatedMinutes} min</span>
                          <span>·</span>
                          <span>{lesson.content.length} blocks</span>
                          <span>·</span>
                          <span>{lesson.activities.length} activities</span>
                          <span>·</span>
                          <span>{lesson.isRequired ? "Required" : "Optional"}</span>
                          <span>·</span>
                          <span className={lesson.isPublished ? "text-rise-success" : "text-rise-warning"}>
                            {lesson.isPublished ? "Published" : "Draft"}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <ReorderControls
                        onUp={() => reorderLessons(currentModule.id, i, -1)}
                        onDown={() => reorderLessons(currentModule.id, i, 1)}
                        canUp={i > 0}
                        canDown={i < currentModule.lessons.length - 1}
                      />
                      <button
                        type="button"
                        onClick={() => setView({ type: "lesson-editor", moduleId: currentModule.id, lessonId: lesson.id })}
                        className="rounded-lg bg-rise-navy px-3 py-1.5 text-sm font-medium text-white hover:bg-rise-navy-light"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => duplicateLesson(currentModule.id, lesson.id)}
                        className="rounded-lg border border-rise-border bg-white p-1.5 text-rise-navy hover:bg-rise-sky"
                        aria-label="Duplicate lesson"
                        title="Duplicate"
                      >
                        📋
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteLesson(currentModule.id, lesson.id)}
                        className="rounded-lg border border-rise-border bg-white p-1.5 text-red-500 hover:bg-red-50"
                        aria-label="Delete lesson"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* LESSON EDITOR VIEW */}
      {view.type === "lesson-editor" && currentModule && currentLesson && (
        <div>
          <button
            type="button"
            onClick={() => setView({ type: "module-detail", moduleId: currentModule.id })}
            className="mb-4 text-sm font-medium text-rise-blue-dark hover:underline"
          >
            ← Back to Module {currentModule.number}
          </button>

          <div className="rounded-2xl border border-rise-border bg-white p-6">
            <h1 className="mb-4 text-xl font-bold text-rise-navy">Lesson Editor</h1>
            <CmsLessonForm
              lesson={currentLesson}
              onChange={(updates) => updateLesson(currentModule.id, currentLesson.id, updates)}
              onPreview={() => setView({ type: "preview", moduleId: currentModule.id, lessonId: currentLesson.id })}
              onDuplicate={() => duplicateLesson(currentModule.id, currentLesson.id)}
            />
          </div>

          {/* Activities within this lesson */}
          <div className="mt-6 rounded-2xl border border-rise-border bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-rise-navy">Learning Activities ({currentLesson.activities.length})</h2>
              <button
                type="button"
                onClick={() => addActivity(currentModule.id, currentLesson.id)}
                className="rounded-lg bg-rise-navy px-3 py-1.5 text-sm font-medium text-white hover:bg-rise-navy-light"
              >
                + Add Activity
              </button>
            </div>

            {currentLesson.activities.length === 0 ? (
              <p className="py-4 text-center text-sm text-rise-muted">
                No activities yet. Activities are additional learning items within this lesson (videos, worksheets, quizzes, etc.).
              </p>
            ) : (
              <div className="space-y-2">
                {currentLesson.activities.map((activity, i) => {
                  const typeMeta = ACTIVITY_TYPES.find((t) => t.value === activity.activityType);
                  return (
                    <div
                      key={activity.id}
                      className="flex flex-col gap-2 rounded-xl border border-rise-border bg-rise-sky/20 p-3 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-lg">{typeMeta?.icon || "📝"}</span>
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h4 className="text-sm font-semibold text-rise-navy">{activity.title}</h4>
                            {activity.riseContentType && (
                              <RiseContentTypeBadge type={activity.riseContentType} size="sm" />
                            )}
                          </div>
                          <p className="text-xs text-rise-muted">
                            {typeMeta?.label} · {activity.isPublished ? "Published" : "Draft"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <ReorderControls
                          onUp={() => reorderActivities(currentModule.id, currentLesson.id, i, -1)}
                          onDown={() => reorderActivities(currentModule.id, currentLesson.id, i, 1)}
                          canUp={i > 0}
                          canDown={i < currentLesson.activities.length - 1}
                        />
                        <button
                          type="button"
                          onClick={() => setView({ type: "activity-editor", moduleId: currentModule.id, lessonId: currentLesson.id, activityId: activity.id })}
                          className="rounded-lg bg-rise-navy px-3 py-1.5 text-sm font-medium text-white hover:bg-rise-navy-light"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => duplicateActivity(currentModule.id, currentLesson.id, activity.id)}
                          className="rounded-lg border border-rise-border bg-white p-1.5 hover:bg-rise-sky"
                          title="Duplicate"
                        >
                          📋
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteActivity(currentModule.id, currentLesson.id, activity.id)}
                          className="rounded-lg border border-rise-border bg-white p-1.5 text-red-500 hover:bg-red-50"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ACTIVITY EDITOR VIEW */}
      {view.type === "activity-editor" && currentModule && currentLesson && currentActivity && (
        <div>
          <button
            type="button"
            onClick={() => setView({ type: "lesson-editor", moduleId: currentModule.id, lessonId: currentLesson.id })}
            className="mb-4 text-sm font-medium text-rise-blue-dark hover:underline"
          >
            ← Back to Lesson
          </button>
          <div className="rounded-2xl border border-rise-border bg-white p-6">
            <h1 className="mb-4 text-xl font-bold text-rise-navy">Activity Editor</h1>
            <CmsActivityForm
              activity={currentActivity}
              onChange={(updates) => updateActivity(currentModule.id, currentLesson.id, currentActivity.id, updates)}
              onDuplicate={() => duplicateActivity(currentModule.id, currentLesson.id, currentActivity.id)}
            />
          </div>
        </div>
      )}

      {/* PREVIEW VIEW */}
      {view.type === "preview" && currentModule && currentLesson && (
        <CmsPreviewView
          lesson={currentLesson}
          module={currentModule}
          onBack={() => setView({ type: "lesson-editor", moduleId: currentModule.id, lessonId: currentLesson.id })}
        />
      )}
    </div>
  );
}
