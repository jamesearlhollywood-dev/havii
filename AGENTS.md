<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Career AI — Development Notes

## Overview
Career AI is a career management platform built on Next.js 16 (App Router) + React 19 + TypeScript + Tailwind CSS v4 + Supabase. It was transformed from the original HAVII youth wellness platform.

## Architecture
- **Routes**: Career AI app lives under `/app/*` (protected by middleware). Auth pages under `/auth/*`. Legacy HAVII routes (`/dashboard`, `/onboarding`) redirect to `/app/dashboard`.
- **Layout**: `src/app/app/layout.tsx` provides the sidebar + mobile nav shell + a header bar with the in-app notification bell. Sidebar is in `src/components/career/Sidebar.tsx`.
- **Database**: Supabase (remote). Tables: `career_profiles`, `job_applications`, `resumes`, `generated_documents`, `interview_sessions`, `saved_job_searches`, `job_alert_results`, `notifications`, `job_match_analyses`, `career_tasks` — all with RLS (user can only CRUD own rows). Migrations under `supabase/migrations/`.
- **Jobs API**: Provider-agnostic abstraction in `src/lib/career/jobs-api.ts`. No provider connected yet; UI shows "API not connected" state. Register providers via `registerJobsProvider()`.
- **Saved Searches & Job Alerts**: `src/lib/career/job-alerts.ts` runs the alert pipeline (load active searches → query jobs API → normalize → dedupe → compare seen → match → record → notify). External jobs API logic stays in `jobs-api.ts`, separate from alert scheduling. `runAllDueAlerts()` is ready for a scheduled Base44 backend job. Actions in `src/actions/saved-searches.ts`.
- **Notifications**: `src/lib/career/notifications.ts` is a provider-agnostic dispatch layer (in-app always on; email/push no-op until a provider is connected — never faked). The header `NotificationBell` reads real rows from the `notifications` table only. Actions in `src/actions/notifications.ts`.
- **Career Tasks**: `src/actions/career-tasks.ts` handles CRUD + follow-up reminder creation. Tasks optionally link to a job application; "Add Follow-Up Reminder" on a JobApplication creates a Follow-Up CareerTask automatically (3/5/7 days or custom date). Reminder *scheduling* is decoupled from task storage in `src/lib/career/task-reminders.ts` (`processDueTaskReminders()` — ready for a scheduled Base44 backend job; dedupes via the notifications table, no reminder-tracking column in the task table). Dashboard shows Today's Tasks + Upcoming Deadlines.
- **Server actions**: `src/actions/career-profile.ts`, `src/actions/job-application.ts`, `src/actions/find-jobs.ts`, `src/actions/saved-searches.ts`, `src/actions/notifications.ts`, `src/actions/career-tasks.ts`.
- **Types**: `src/lib/career/types.ts` — domain types (JobStatus, WorkMode, EmploymentType, entity interfaces, NormalizedJobResult, SavedJobSearch, JobAlertResult, AlertFrequency, AppNotification, CareerTask, TaskType, TaskPriority, TaskStatus).

## Color palette
White, slate, dark navy (#0f172a), blue accents (#2563eb). Defined in `src/app/globals.css` as `--career-*` variables. Legacy `--havii-*` variables are aliased to the new palette so existing UI components inherit the new look.

## Supabase setup
- Env vars: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` (delivered via `/run/base44/app.env`).
- The SQL migration must be applied to the Supabase project (SQL Editor or CLI) before career features work.
- The auth trigger was updated to set `onboarding_completed = true` for new users (Career AI has no role-based onboarding).

## Verification
- `npm run typecheck` — TypeScript check
- `npm run lint` — ESLint
- `npm run dev` — dev server on port 3000
- Health: `curl http://localhost:3000/` → 200
