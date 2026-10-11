"use client";

interface ReorderControlsProps {
  onUp: () => void;
  onDown: () => void;
  canUp: boolean;
  canDown: boolean;
  label?: string;
}

export function ReorderControls({ onUp, onDown, canUp, canDown, label }: ReorderControlsProps) {
  return (
    <div className="flex items-center gap-0.5" aria-label={label || "Reorder"}>
      <button
        type="button"
        onClick={onUp}
        disabled={!canUp}
        className="rounded-lg border border-rise-border bg-white p-1.5 text-rise-navy hover:bg-rise-sky disabled:opacity-30 disabled:cursor-not-allowed"
        aria-label="Move up"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M7 3L7 11M7 3L3 7M7 3L11 7" />
        </svg>
      </button>
      <button
        type="button"
        onClick={onDown}
        disabled={!canDown}
        className="rounded-lg border border-rise-border bg-white p-1.5 text-rise-navy hover:bg-rise-sky disabled:opacity-30 disabled:cursor-not-allowed"
        aria-label="Move down"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M7 11L7 3M7 11L3 7M7 11L11 7" />
        </svg>
      </button>
    </div>
  );
}
