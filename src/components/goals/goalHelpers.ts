import type { GoalStatus } from "@/lib/goalConstants";
import { GOAL_CATEGORIES } from "@/lib/goalConstants";

export function categoryLabel(value: string): string {
  return GOAL_CATEGORIES.find((c) => c.value === value)?.label ?? value;
}

export function statusLabel(status: GoalStatus): string {
  switch (status) {
    case "active":
      return "Active";
    case "completed":
      return "Completed";
    case "archived":
      return "Archived";
  }
}

export function statusTone(status: GoalStatus): string {
  switch (status) {
    case "active":
      return "bg-havii-teal/10 text-havii-teal-dark";
    case "completed":
      return "bg-emerald-100 text-emerald-800";
    case "archived":
      return "bg-havii-sand text-havii-muted";
  }
}

export function formatDate(iso: string): string {
  return new Date(iso + "T00:00:00").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
