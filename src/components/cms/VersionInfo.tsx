import { formatDate } from "@/lib/utils";
import type { ContentStatus } from "@/data/cms-types";

interface VersionInfoProps {
  createdAt: string;
  updatedAt: string;
  updatedBy: string | null;
  status: ContentStatus;
}

export function VersionInfo({ createdAt, updatedAt, updatedBy, status }: VersionInfoProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 text-xs text-rise-muted">
      <span className="flex items-center gap-1">
        <span className={`rounded-full px-2 py-0.5 font-medium ${status === "published" ? "bg-rise-success-light text-rise-success" : "bg-rise-warning-light text-rise-warning"}`}>
          {status === "published" ? "Published" : "Draft"}
        </span>
      </span>
      <span>Created: {formatDate(createdAt)}</span>
      <span>Last updated: {formatDate(updatedAt)}</span>
      {updatedBy && <span>Updated by: {updatedBy}</span>}
    </div>
  );
}
