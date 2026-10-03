import type { JobStatus } from "@/lib/career/types";

const statusStyles: Record<JobStatus, string> = {
  Saved: "bg-slate-100 text-slate-700",
  Applied: "bg-blue-100 text-blue-700",
  Interview: "bg-amber-100 text-amber-700",
  Offer: "bg-emerald-100 text-emerald-700",
  Rejected: "bg-red-100 text-red-700",
  Withdrawn: "bg-slate-100 text-slate-500",
};

export function StatusBadge({ status }: { status: JobStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyles[status] ?? statusStyles.Saved}`}
    >
      {status}
    </span>
  );
}
