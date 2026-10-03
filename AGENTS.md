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
- **Layout**: `src/app/app/layout.tsx` provides the sidebar + mobile nav shell. Sidebar is in `src/components/career/Sidebar.tsx`.
- **Database**: Supabase (remote). Tables: `career_profiles`, `job_applications`, `resumes`, `generated_documents`, `interview_sessions` — all with RLS (user can only CRUD own rows). Migration: `supabase/migrations/202603140003_career_ai.sql`.
- **Jobs API**: Provider-agnostic abstraction in `src/lib/career/jobs-api.ts`. No provider connected yet; UI shows "API not connected" state. Register providers via `registerJobsProvider()`.
- **Server actions**: `src/actions/career-profile.ts`, `src/actions/job-application.ts`, `src/actions/find-jobs.ts`.
- **Types**: `src/lib/career/types.ts` — domain types (JobStatus, WorkMode, EmploymentType, entity interfaces, NormalizedJobResult).

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
