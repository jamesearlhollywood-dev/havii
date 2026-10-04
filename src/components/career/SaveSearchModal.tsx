"use client";

import { useState, useTransition } from "react";
import { saveSavedSearchAction } from "@/actions/saved-searches";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { ALERT_FREQUENCIES, type AlertFrequency } from "@/lib/career/types";

/** Current filter state passed from the Find Jobs search form. */
export interface CurrentFilters {
  keywords: string;
  location: string;
  remote_only: boolean;
  work_mode: string;
  employment_type: string;
  minimum_salary: string;
  date_posted: string;
}

const frequencyOptions = ALERT_FREQUENCIES.map((f) => ({ value: f, label: f }));

export function SaveSearchModal({
  open,
  onClose,
  filters,
}: {
  open: boolean;
  onClose: () => void;
  filters: CurrentFilters;
}) {
  const [name, setName] = useState("");
  const [alertsEnabled, setAlertsEnabled] = useState(true);
  const [frequency, setFrequency] = useState<AlertFrequency>("Daily");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  if (!open) return null;

  function handleClose() {
    setName("");
    setAlertsEnabled(true);
    setFrequency("Daily");
    setError("");
    setSuccess(false);
    onClose();
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please give your search a name.");
      return;
    }
    setError("");
    startTransition(async () => {
      const res = await saveSavedSearchAction({
        name: name.trim(),
        keywords: filters.keywords,
        location: filters.location,
        remote_only: filters.remote_only,
        work_mode: filters.work_mode || null,
        employment_type: filters.employment_type || null,
        minimum_salary: filters.minimum_salary ? Number(filters.minimum_salary) : null,
        date_posted: filters.date_posted || null,
        minimum_match_score: null,
        is_active: true,
        alert_frequency: alertsEnabled ? frequency : "Off",
      });
      if (res.error) {
        setError(res.error);
      } else {
        setSuccess(true);
        setTimeout(handleClose, 900);
      }
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-career-navy/50 p-4">
      <div className="w-full max-w-lg rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-career-border px-5 py-4">
          <h2 className="text-lg font-semibold text-career-navy">Save This Search</h2>
          <button
            type="button"
            onClick={handleClose}
            className="rounded-lg p-1 text-career-slate hover:bg-career-surface"
            aria-label="Close"
          >
            <CloseIcon />
          </button>
        </div>

        {success ? (
          <div className="px-5 py-10 text-center">
            <p className="font-medium text-emerald-700">Search saved ✓</p>
            <p className="mt-1 text-sm text-career-slate">
              Find it anytime under Job Alerts.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-5 px-5 py-5">
            <Input
              label="Search name"
              placeholder="e.g. Senior React roles, remote"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />

            {/* Review current filters */}
            <div>
              <p className="mb-2 text-sm font-medium text-career-navy">Current filters</p>
              <div className="grid grid-cols-2 gap-2 rounded-lg border border-career-border bg-career-surface/50 p-3 text-sm">
                <FilterRow label="Keywords" value={filters.keywords || "Any"} />
                <FilterRow label="Location" value={filters.location || "Any"} />
                <FilterRow label="Remote only" value={filters.remote_only ? "Yes" : "No"} />
                <FilterRow label="Work mode" value={filters.work_mode || "Any"} />
                <FilterRow label="Employment" value={filters.employment_type || "Any"} />
                <FilterRow label="Min salary" value={filters.minimum_salary ? `$${filters.minimum_salary}` : "Any"} />
                <FilterRow label="Date posted" value={filters.date_posted || "Any time"} />
              </div>
            </div>

            {/* Alerts */}
            <div className="space-y-3 rounded-lg border border-career-border p-3">
              <label className="flex items-center justify-between">
                <span className="text-sm font-medium text-career-navy">
                  Enable job alerts
                </span>
                <input
                  type="checkbox"
                  checked={alertsEnabled}
                  onChange={(e) => setAlertsEnabled(e.target.checked)}
                  className="h-4 w-4 rounded border-career-border text-career-blue focus:ring-career-blue"
                />
              </label>
              {alertsEnabled && (
                <Select
                  label="Alert frequency"
                  options={frequencyOptions}
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value as AlertFrequency)}
                />
              )}
              <p className="text-xs text-career-slate">
                When new jobs match, you&apos;ll see them in your in-app
                notifications. Email and push alerts activate once a provider is
                connected.
              </p>
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <div className="flex justify-end gap-2">
              <Button type="button" variant="secondary" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit" loading={isPending}>
                Save Search
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

function FilterRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="text-xs text-career-slate">{label}</span>
      <p className="font-medium text-career-navy">{value}</p>
    </div>
  );
}

function CloseIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}
