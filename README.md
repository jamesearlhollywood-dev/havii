# HAVII (Phase 1)

**HAVII** is a youth wellness, mentorship, and personal-development platform by **Together For You, Inc.** for ages 13–24.

> A place to connect, grow, and find support.

This repository contains **Phase 1**: auth, profiles, onboarding, role dashboards, safety/help page, and database foundations with RLS. Phase 2+ features are stubbed in SQL only.

## Stack

- Next.js (App Router) + React + TypeScript + Tailwind CSS
- Supabase (Postgres, Auth, RLS) via `@supabase/ssr` + `@supabase/supabase-js`

## Prerequisites

- Node.js 20+ (Node 22+ recommended for latest Supabase JS)
- A Supabase project (free tier is fine)
- npm

## Setup

### 1. Install dependencies

```bash
cd /workspace/havii   # or your clone path
npm install
```

### 2. Configure environment

```bash
cp .env.example .env.local
```

Fill in:

| Variable | Notes |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL from Supabase → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `anon` `public` key |
| `NEXT_PUBLIC_SITE_URL` | e.g. `http://localhost:3000` for local auth redirects |

**Never** expose the Supabase **service role** key via `NEXT_PUBLIC_*`. Service role is server-only and must not ship to the browser.

### 3. Run SQL migrations

In the Supabase SQL Editor (or CLI), run in order:

1. `supabase/migrations/202603140001_phase1_core.sql` — profiles, role tables, RLS, `is_staff_or_admin()`, auth trigger
2. `supabase/migrations/202603140002_phase2_stubs.sql` — Phase 2+ stub tables (deny-all / staff-only)

Confirm Auth → URL configuration allows your site URL and redirects to `/auth/callback`.

### 4. Start the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Script | Purpose |
|---|---|
| `npm run dev` | Local development server |
| `npm run build` | Production build |
| `npm run start` | Serve production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript `tsc --noEmit` |

## Roles

| Role | Public signup? |
|---|---|
| `youth` | Yes |
| `mentor` | Yes |
| `caregiver` | Yes |
| `community_partner` | Yes |
| `staff` | No (invitation / ops only) |
| `administrator` | No (invitation / ops only) |

Role is stored on `profiles` and enforced with **RLS + server checks**. Never trust role from the client alone.

## Key routes

- `/` — marketing landing
- `/auth/sign-up`, `/auth/login`, `/auth/forgot-password`, `/auth/reset-password`, `/auth/verify`
- `/auth/callback` — Supabase PKCE exchange
- `/onboarding` — role-specific onboarding (persists to Supabase)
- `/dashboard` — role-routed home
- `/dashboard/staff`, `/dashboard/admin` — protected shells
- `/help` — Get Help / crisis resources (not an emergency service)
- `/coming-next/find-a-mentor` — matching placeholder
- `/forbidden` — unauthorized role

## Safety

HAVII is **not** an emergency service and is **not** monitored 24/7. The `/help` page points people to emergency services and 988. No clinical diagnosis features.

## Project layout

```
src/app/                 App Router pages
src/components/          UI, layout, auth, onboarding, dashboards
src/lib/supabase/        Browser + server clients, middleware session helper
src/actions/             Server actions (auth, onboarding)
supabase/migrations/     SQL migrations with RLS
```

## Phase 1 report

See `PHASE1_REPORT.md` for implementation status, build results, and known gaps.

## License / affiliation

HAVII has its own product identity while lightly affiliating with Together For You, Inc.
