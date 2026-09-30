<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# HAVII — Mobile-First Youth Wellness App

## Architecture
- Next.js 16 + Supabase (auth, DB, RLS). Tailwind CSS v4.
- Server actions for mutations (`src/actions/`). No API routes except auth callback + logout.
- `AppShell` wraps all authenticated pages. Non-staff roles get bottom navigation (Home, My Group, Journal, Goals, Support). Staff/admin get a desktop-style header without bottom nav.

## Mobile-First Design
- Youth content uses `max-w-md` (448px) — single column, no horizontal scroll.
- Bottom nav: `BottomNav` component, `md:hidden` (mobile only), fixed bottom with safe-area padding.
- Onboarding: multi-step wizard (`OnboardingForm.tsx`) — one task per screen, progress bar, Back/Continue/Finish. All form fields stay in the DOM (hidden steps use Tailwind `hidden` = `display:none`, which still submits). Server action unchanged.
- `globals.css` prevents horizontal scroll and adds `env(safe-area-inset-bottom)` support.

## PWA
- `public/manifest.json` + `public/icon.svg` make the app installable (Add to Home Screen on iOS, Install on Android).
- `layout.tsx` exports `viewport` with `themeColor`, `viewportFit: "cover"` for notch/safe areas, and links the manifest.

## Key Routes
- `/` — marketing landing (mobile-first)
- `/auth/sign-up`, `/auth/login` — auth (max-w-md, centered)
- `/onboarding` — multi-step wizard (redirects if not authed)
- `/dashboard` — role-based dashboard (youth gets mood check-in, sessions, mentor, quick links)
- `/dashboard/group` — My Group (placeholder, Coming Next)
- `/dashboard/goals` — Goals (full list + create)
- `/dashboard/journal` — Journal (private)
- `/help` — Support (uses AppShell when authed, MarketingHeader when not)
- `/dashboard/staff`, `/dashboard/admin` — staff/admin only, no bottom nav

## Verification
- `docker compose -f docker-compose.base44.yml up -d` then curl localhost:3000
- Check `/` (200), `/help` (200), `/auth/sign-up` (200), `/onboarding` (307 redirect = auth working)
- Supabase env vars required: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Dev server uses `--webpack` (not Turbopack) to avoid Server Actions errors
