"use client";

export function PrintButton({ label = "Print Record" }: { label?: string }) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="rounded-xl bg-rise-navy px-4 py-2.5 text-sm font-semibold text-white hover:bg-rise-navy-light no-print"
    >
      {label}
    </button>
  );
}
