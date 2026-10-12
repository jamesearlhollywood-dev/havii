"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { AppNotification } from "@/lib/types";

const NOTIFICATION_ICONS: Record<string, string> = {
  enrollment_confirmed: "✅",
  course_available: "📚",
  module_unlocked: "🔓",
  lab_due: "🔬",
  knowledge_check_available: "📝",
  knowledge_check_passed: "🎉",
  knowledge_check_retry: "🔄",
  instructor_feedback: "💬",
  blueprint_section_completed: "📋",
  final_assessment_unlocked: "🎯",
  course_completed: "🏆",
  certificate_issued: "🎓",
  progress_reminder: "📈",
  inactivity_reminder: "💪",
  announcement: "📢",
  admin_message: "📨",
  instructor_message: "✉️",
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function NotificationCenter({
  notifications,
  unreadCount,
}: {
  notifications: AppNotification[];
  unreadCount: number;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const recent = notifications.slice(0, 8);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="relative rounded-xl border border-rise-border bg-white p-2 text-rise-navy hover:bg-rise-sky"
        aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ""}`}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-rise-red px-1 text-[10px] font-bold text-white">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 max-w-[calc(100vw-2rem)] rounded-2xl border border-rise-border bg-white shadow-lg z-50">
          <div className="flex items-center justify-between border-b border-rise-border px-4 py-3">
            <h3 className="text-sm font-bold text-rise-navy">Notifications</h3>
            {unreadCount > 0 && (
              <form action="/api/notifications/mark-all-read" method="POST">
                <button
                  type="submit"
                  className="text-xs font-medium text-rise-blue-dark hover:underline"
                >
                  Mark all read
                </button>
              </form>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {recent.length === 0 ? (
              <p className="px-4 py-8 text-center text-sm text-rise-muted">
                No notifications yet.
              </p>
            ) : (
              recent.map((n) => (
                <Link
                  key={n.id}
                  href={n.link_url || "/notifications"}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex gap-3 border-b border-rise-border px-4 py-3 transition hover:bg-rise-sky",
                    !n.read_at && "bg-rise-blue-light/30"
                  )}
                >
                  <span className="text-lg shrink-0">
                    {NOTIFICATION_ICONS[n.type] || "🔔"}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className={cn("text-sm text-rise-navy truncate", !n.read_at && "font-semibold")}>
                      {n.title}
                    </p>
                    <p className="text-xs text-rise-muted line-clamp-2 mt-0.5">
                      {n.description}
                    </p>
                    <p className="text-[10px] text-rise-muted mt-1">
                      {timeAgo(n.created_at)}
                    </p>
                  </div>
                  {!n.read_at && (
                    <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-rise-blue" />
                  )}
                </Link>
              ))
            )}
          </div>

          <div className="border-t border-rise-border p-2">
            <Link
              href="/notifications"
              onClick={() => setOpen(false)}
              className="block rounded-lg px-3 py-2 text-center text-sm font-medium text-rise-blue-dark hover:bg-rise-sky"
            >
              View all notifications
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
