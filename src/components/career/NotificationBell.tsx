"use client";

import { useState, useEffect, useTransition } from "react";
import Link from "next/link";
import {
  getNotificationsAction,
  markNotificationReadAction,
  markAllNotificationsReadAction,
} from "@/actions/notifications";
import type { AppNotification } from "@/lib/career/types";

export function NotificationBell() {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [, startTransition] = useTransition();

  useEffect(() => {
    let active = true;
    getNotificationsAction().then((res) => {
      if (!active) return;
      if (!res.error) {
        setNotifications(res.notifications);
        setUnreadCount(res.unreadCount);
      }
      setLoaded(true);
    });
    return () => {
      active = false;
    };
  }, []);

  function handleBellClick() {
    const next = !open;
    setOpen(next);
  }

  function handleMarkAllRead() {
    startTransition(async () => {
      await markAllNotificationsReadAction();
      setNotifications((prev) =>
        prev.map((n) => (n.read_at ? n : { ...n, read_at: new Date().toISOString() }))
      );
      setUnreadCount(0);
    });
  }

  function handleMarkRead(id: string) {
    startTransition(async () => {
      await markNotificationReadAction(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read_at: new Date().toISOString() } : n))
      );
      setUnreadCount((c) => Math.max(0, c - 1));
    });
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={handleBellClick}
        className="relative rounded-lg p-2 text-career-slate hover:bg-career-surface hover:text-career-navy"
        aria-label="Notifications"
      >
        <BellIcon />
        {unreadCount > 0 && (
          <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-career-blue px-1 text-[10px] font-bold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <div className="absolute right-0 z-50 mt-2 w-80 max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl border border-career-border bg-white shadow-lg">
            <div className="flex items-center justify-between border-b border-career-border px-4 py-3">
              <p className="text-sm font-semibold text-career-navy">Notifications</p>
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={handleMarkAllRead}
                  className="text-xs font-medium text-career-blue hover:underline"
                >
                  Mark all read
                </button>
              )}
            </div>

            <div className="max-h-80 overflow-y-auto">
              {!loaded ? (
                <div className="px-4 py-6 text-center text-sm text-career-slate">
                  Loading…
                </div>
              ) : notifications.length === 0 ? (
                <div className="px-4 py-8 text-center">
                  <p className="text-sm text-career-slate">No notifications yet</p>
                  <p className="mt-1 text-xs text-career-slate">
                    Saved-search alerts and other real events appear here.
                  </p>
                </div>
              ) : (
                <ul className="divide-y divide-career-border">
                  {notifications.map((n) => (
                    <li key={n.id}>
                      <NotificationItem
                        notification={n}
                        onRead={() => handleMarkRead(n.id)}
                        onNavigate={() => setOpen(false)}
                      />
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="border-t border-career-border px-4 py-2">
              <Link
                href="/app/job-alerts"
                onClick={() => setOpen(false)}
                className="text-xs font-medium text-career-blue hover:underline"
              >
                Manage Job Alerts
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function NotificationItem({
  notification,
  onRead,
  onNavigate,
}: {
  notification: AppNotification;
  onRead: () => void;
  onNavigate: () => void;
}) {
  const unread = !notification.read_at;
  const content = (
    <div className={`px-4 py-3 ${unread ? "bg-blue-50/40" : ""}`}>
      <div className="flex items-start gap-2">
        <TypeDot type={notification.type} unread={unread} />
        <div className="min-w-0 flex-1">
          <p className={`text-sm ${unread ? "font-semibold text-career-navy" : "font-medium text-career-slate"}`}>
            {notification.title}
          </p>
          {notification.body && (
            <p className="mt-0.5 text-xs text-career-slate">{notification.body}</p>
          )}
          <p className="mt-1 text-[11px] text-career-slate">
            {timeAgo(notification.created_at)}
          </p>
        </div>
      </div>
    </div>
  );

  if (notification.link) {
    return (
      <Link href={notification.link} onClick={onNavigate} className="block hover:bg-career-surface">
        {content}
      </Link>
    );
  }
  return (
    <button type="button" onClick={onRead} className="block w-full text-left hover:bg-career-surface">
      {content}
    </button>
  );
}

function TypeDot({ type, unread }: { type: string; unread: boolean }) {
  const color =
    type === "job_alert"
      ? "bg-career-blue"
      : type === "interview_upcoming"
      ? "bg-amber-500"
      : type === "offer_reminder"
      ? "bg-emerald-500"
      : "bg-slate-400";
  return (
    <span
      className={`mt-1 h-2 w-2 shrink-0 rounded-full ${unread ? color : "bg-slate-300"}`}
    />
  );
}

function BellIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function timeAgo(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  const diff = Date.now() - d.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
