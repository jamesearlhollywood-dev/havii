<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-adds the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# HAVII — Base44 dev environment notes

## Stack
Next.js 16 (App Router) + React 19 + TypeScript + Tailwind v4. Backend is an **external hosted Supabase project** (Postgres, Auth, RLS) — there is no local database in compose. Supabase SQL migrations live in `supabase/migrations/` and must be applied to the Supabase project directly (not run in compose).

## Running
`docker compose -f docker-compose.base44.yml up -d` — node:22 image, source bind-mounted at `/app`, runs `next dev -H 0.0.0.0 -p 3000`. Port 3000 is the preview entry point. Live reload is active.

## Credentials
The app needs `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` (external Supabase project). Repo-level placeholders in `.env.base44-defaults` let the app boot and render public pages (`/`, `/help`) without credentials; real values from `/run/base44/app.env` override them. Auth, onboarding, and dashboards will not work until real Supabase credentials are supplied and the Phase 1 migration is applied to that project.

## Next.js preview origin
`next.config.ts` sets `allowedDevOrigins` from `BASE44_PUBLIC_HOST_SUFFIX` so the preview origin can load dev assets/HMR. Do not hardcode the host.

## Quirks
- Middleware (`src/lib/supabase/middleware.ts`) returns early when Supabase env is missing, so public routes render even without credentials.
- A browser-extension hydration warning (`data-gr-ext-installed`) may appear in logs; it is cosmetic, not an app bug.
