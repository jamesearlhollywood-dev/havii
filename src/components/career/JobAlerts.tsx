"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  runSavedSearchNowAction,
  pauseAlertAction,
  resumeAlertAction,
  deleteSavedSearchAction,
  listSavedSearchesAction,
} from "@/actions/saved-searches";
import { Button } from "@/components/ui/Button";
import { EditSearchModal } from "@/components/career/EditSearchModal";
import type { SavedJobSearch, AlertRunSummary } from "@/lib/career/types";
import type { NotificationChannelStatus } from "@/lib/career/notifications";

export function JobAlerts({
  initialSearches,
  apiConfigured,
  channelStatuses,
}: {
  initialSearches: SavedJobSearch[];
  apiConfigured: boolean;
  channelStatuses: NotificationChannelStatus[];
}) {
  const [searches, setSearches] = useState<SavedJobSearch[]>(initialSearches);
  const [editing, setEditing] = useState<SavedJobSearch | null>(null);
  const [runningId, setRunningId] = useState<string | null>(null);
  const [runSummary, setRunSummary] = useState<Record<string, AlertRunSummary | null>>({});
  const [actionError, setActionError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  async function refresh() {
    const res = await listSavedSearchesAction();
    if (!res.error) setSearches(res.searches);
  }

  function handleRun(id: string) {
    setActionError(null);
    setRunningId(id);
    startTransition(async () => {
      const summary = await runSavedSearchNowAction(id);
      setRunSummary((prev) => ({ ...prev, [id]: summary }));
      setRunningId(null);
      await refresh();
      router.refresh();
    });
  }

  function handlePause(id: string) {
    setActionError(null);
    startTransition(async () => {
      const res = await pauseAlertAction(id);
      if (res.error) setActionError(res.error);
      else await refresh();
    });
  }

  function handleResume(id: string) {
    setActionError(null);
    startTransition(async () => {
      const res = await resumeAlertAction(id);
      if (res.error) setActionError(res.error);
      else await refresh();
    });
  }

  function handleDelete(id: string) {
    setActionError(null);
    if (!confirm("Delete this saved search? Alert results will also be removed.")) return;
    startTransition(async () => {
      const res = await deleteSavedSearchAction(id);
      if (res.error) setActionError(res.error);
      else await refresh();
    });
  }

  function handleEditClose() {
    setEditing(null);
    startTransition(async () => {
      await refresh();
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-career-navy">Job Alerts</h1>
        <p className="mt-1 text-sm text-career-slate">
          Saved searches and automated alerts for new matching opportunities.
        </p>
      </div>

      {/* Jobs API status */}
      {!apiConfigured && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
          No jobs API provider is connected yet. You can save searches and run
          them manually; automatic alerts will surface results once a provider
          is connected.
        </div>
      )}

      {/* Notification channels */}
      <div className="rounded-xl border border-career-border bg-white p-4 shadow-sm">
        <p className="text-sm font-medium text-career-navy">Notification channels</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {channelStatuses.map((ch) => (
            <span
              key={ch.channel}
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
                ch.available
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-slate-100 text-slate-500"
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  ch.available ? "bg-emerald-500" : "bg-slate-400"
                }`}
              />
              {ch.channel === "in_app" ? "In-app" : ch.channel === "email" ? "Email" : "Push"}
            </span>
          ))}
        </div>
        <p className="mt-2 text-xs text-career-slate">
          {channelStatuses.find((c) => c.channel === "email")?.note}
        </p>
      </div>

      {actionError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {actionError}
        </div>
      )}

      {searches.length === 0 ? (
        <div className="rounded-xl border border-career-border bg-white p-12 text-center shadow-sm">
          <p className="text-base font-medium text-career-navy">No saved searches yet</p>
          <p className="mx-auto mt-2 max-w-md text-sm text-career-slate">
            Run a search on the{" "}
            <a href="/app/find-jobs" className="font-medium text-career-blue hover:underline">
              Find Jobs
            </a>{" "}
            page and click <strong>Save Search</strong> to start tracking
            opportunities and receive alerts.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {searches.map((s) => (
            <SearchCard
              key={s.id}
              search={s}
              running={runningId === s.id}
              summary={runSummary[s.id] ?? null}
              onRun={() => handleRun(s.id)}
              onEdit={() => setEditing(s)}
              onPause={() => handlePause(s.id)}
              onResume={() => handleResume(s.id)}
              onDelete={() => handleDelete(s.id)}
              disabled={isPending}
            />
          ))}
        </div>
      )}

      {editing && <EditSearchModal search={editing} onClose={handleEditClose} />}
    </div>
  );
}

function SearchCard({
  search,
  running,
  summary,
  onRun,
  onEdit,
  onPause,
  onResume,
  onDelete,
  disabled,
}: {
  search: SavedJobSearch;
  running: boolean;
  summary: AlertRunSummary | null;
  onRun: () => void;
  onEdit: () => void;
  onPause: () => void;
  onResume: () => void;
  onDelete: () => void;
  disabled: boolean;
}) {
  return (
    <div className="rounded-xl border border-career-border bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-semibold text-career-navy">{search.name}</h3>
            <StatusPill active={search.is_active} />
            <FreqPill frequency={search.alert_frequency} active={search.is_active} />
          </div>

          <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-sm sm:grid-cols-3">
            <Field label="Keywords" value={search.keywords || "Any"} />
            <Field label="Location" value={search.location || "Any"} />
            <Field
              label="Work arrangement"
              value={search.work_mode || (search.remote_only ? "Remote only" : "Any")}
            />
            <Field
              label="Minimum salary"
              value={search.minimum_salary != null ? `$${search.minimum_salary}` : "Any"}
            />
            <Field
              label="Min match score"
              value={search.minimum_match_score != null ? `${search.minimum_match_score}/100` : "None"}
            />
            <Field label="Last checked" value={formatDate(search.last_checked_at)} />
          </div>

          {summary && (
            <p className="mt-3 text-sm">
              {summary.error ? (
                <span className="text-red-600">{summary.error}</span>
              ) : !summary.searched ? (
                <span className="text-career-slate">
                  Jobs API not connected — no search run.
                </span>
              ) : (
                <span className="text-emerald-700">
                  Found {summary.totalFound} jobs · {summary.newResults} new ·{" "}
                  {summary.alerted} alerted
                  {summary.alerted === 0 ? " (no new matches)" : " ✓"}
                </span>
              )}
            </p>
          )}
        </div>

        <div className="flex shrink-0 flex-wrap gap-2">
          <Button size="sm" onClick={onRun} loading={running} disabled={disabled}>
            Run Search Now
          </Button>
          <Button size="sm" variant="outline" onClick={onEdit} disabled={disabled}>
            Edit
          </Button>
          {search.is_active ? (
            <Button size="sm" variant="outline" onClick={onPause} disabled={disabled}>
              Pause Alert
            </Button>
          ) : (
            <Button size="sm" variant="outline" onClick={onResume} disabled={disabled}>
              Resume Alert
            </Button>
          )}
          <Button size="sm" variant="danger" onClick={onDelete} disabled={disabled}>
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="text-xs text-career-slate">{label}</span>
      <p className="font-medium text-career-navy">{value}</p>
    </div>
  );
}

function StatusPill({ active }: { active: boolean }) {
  return (
    <span
      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
        active ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"
      }`}
    >
      {active ? "Active" : "Paused"}
    </span>
  );
}

function FreqPill({
  frequency,
  active,
}: {
  frequency: string;
  active: boolean;
}) {
  if (frequency === "Off" || !active) {
    return (
      <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-500">
        Alerts off
      </span>
    );
  }
  return (
    <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-career-blue">
      {frequency} alerts
    </span>
  );
}

function formatDate(iso: string | null): string {
  if (!iso) return "Never";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "Never";
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}
