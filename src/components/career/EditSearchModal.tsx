"use client";

import { useState, useTransition } from "react";
import { updateSavedSearchAction } from "@/actions/saved-searches";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import {
  WORK_MODES,
  EMPLOYMENT_TYPES,
  ALERT_FREQUENCIES,
  type SavedJobSearch,
  type AlertFrequency,
  type SavedSearchInput,
} from "@/lib/career/types";

const workModeOptions = [
  { value: "", label: "Any" },
  ...WORK_MODES.map((w) => ({ value: w, label: w })),
];
const employmentOptions = [
  { value: "", label: "Any" },
  ...EMPLOYMENT_TYPES.map((e) => ({ value: e, label: e })),
];
const datePostedOptions = [
  { value: "", label: "Any time" },
  { value: "24h", label: "Past 24 hours" },
  { value: "7d", label: "Past week" },
  { value: "30d", label: "Past month" },
];
const frequencyOptions = ALERT_FREQUENCIES.map((f) => ({ value: f, label: f }));

export function EditSearchModal({
  search,
  onClose,
}: {
  search: SavedJobSearch;
  onClose: () => void;
}) {
  const [name, setName] = useState(search.name);
  const [keywords, setKeywords] = useState(search.keywords);
  const [location, setLocation] = useState(search.location);
  const [remoteOnly, setRemoteOnly] = useState(search.remote_only);
  const [workMode, setWorkMode] = useState(search.work_mode ?? "");
  const [employmentType, setEmploymentType] = useState(search.employment_type ?? "");
  const [salaryMin, setSalaryMin] = useState(
    search.minimum_salary != null ? String(search.minimum_salary) : ""
  );
  const [datePosted, setDatePosted] = useState(search.date_posted ?? "");
  const [minMatch, setMinMatch] = useState(
    search.minimum_match_score != null ? String(search.minimum_match_score) : ""
  );
  const [alertsEnabled, setAlertsEnabled] = useState(
    search.alert_frequency !== "Off"
  );
  const [frequency, setFrequency] = useState<AlertFrequency>(
    search.alert_frequency === "Off" ? "Daily" : search.alert_frequency
  );
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleClose() {
    onClose();
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please give your search a name.");
      return;
    }
    setError("");
    const input: SavedSearchInput = {
      name: name.trim(),
      keywords,
      location,
      remote_only: remoteOnly,
      work_mode: workMode || null,
      employment_type: employmentType || null,
      minimum_salary: salaryMin ? Number(salaryMin) : null,
      date_posted: datePosted || null,
      minimum_match_score: minMatch ? Number(minMatch) : null,
      is_active: true,
      alert_frequency: alertsEnabled ? frequency : "Off",
    };
    startTransition(async () => {
      const res = await updateSavedSearchAction(search.id, input);
      if (res.error) {
        setError(res.error);
      } else {
        handleClose();
      }
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-career-navy/50 p-4">
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-career-border px-5 py-4">
          <h2 className="text-lg font-semibold text-career-navy">Edit Search</h2>
          <button
            type="button"
            onClick={handleClose}
            className="rounded-lg p-1 text-career-slate hover:bg-career-surface"
            aria-label="Close"
          >
            <CloseIcon />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4 px-5 py-5">
          <Input
            label="Search name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Keywords"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
            />
            <Input
              label="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
            <Select
              label="Work arrangement"
              options={workModeOptions}
              value={workMode}
              onChange={(e) => setWorkMode(e.target.value)}
            />
            <Select
              label="Employment type"
              options={employmentOptions}
              value={employmentType}
              onChange={(e) => setEmploymentType(e.target.value)}
            />
            <Input
              label="Minimum salary"
              type="number"
              value={salaryMin}
              onChange={(e) => setSalaryMin(e.target.value)}
            />
            <Select
              label="Date posted"
              options={datePostedOptions}
              value={datePosted}
              onChange={(e) => setDatePosted(e.target.value)}
            />
            <Input
              label="Minimum match score (0-100)"
              type="number"
              value={minMatch}
              onChange={(e) => setMinMatch(e.target.value)}
            />
          </div>

          <label className="flex items-center gap-2 text-sm text-career-slate">
            <input
              type="checkbox"
              checked={remoteOnly}
              onChange={(e) => setRemoteOnly(e.target.checked)}
              className="h-4 w-4 rounded border-career-border text-career-blue focus:ring-career-blue"
            />
            Remote jobs only
          </label>

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
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" loading={isPending}>
              Save Changes
            </Button>
          </div>
        </form>
      </div>
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
