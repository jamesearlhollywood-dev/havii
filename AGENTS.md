<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Together For You, Inc. (TFY) — Project Notes

## Two surfaces in one app
- **Public nonprofit website** (`/`, `/about`, `/programs`, `/impact`, `/research`, `/get-involved`, `/donate`, `/contact`) — marketing site built with the TFY design system. Uses `SiteHeader` + `SiteFooter` (or `SiteShell` for interior pages).
- **HAVII youth platform** (`/auth/*`, `/onboarding`, `/dashboard/*`, `/help`) — the app product. Uses `AppShell` for authenticated pages and `MarketingHeader` for legacy landing surfaces.

## Design system (TFY)
- Colors live in `src/app/globals.css` as `--tfy-*` tokens (Navy `#0F172A`, Blue `#2C5282`, Gold `#B8860B`, Parchment `#F8F7F2`). Legacy `--havii-*` tokens are kept so existing app routes still render.
- Fonts: **Fraunces** (serif headings, `font-display` class) + **Inter** (body). Loaded via `next/font/google` in `src/app/layout.tsx`.
- Homepage sections are individual components in `src/components/site/sections/`. The homepage composes them in `src/app/page.tsx`.
- `PhotoPlaceholder` (`src/components/site/PhotoPlaceholder.tsx`) stands in for photography — swap with real `<Image>` when assets arrive.

## Supabase env quirk
- `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are required secrets. If the URL is missing or **not a valid http(s) URL**, the middleware (`src/lib/supabase/middleware.ts`) skips session refresh and continues — this is intentional so the public site renders even when Supabase isn't configured. The HAVII auth/dashboard features still need a valid Supabase project.
- The browser Supabase client (`src/lib/supabase/client.ts`) is defined but currently unused.

## Dev environment
- Run with: `docker compose -f docker-compose.base44.yml up -d`
- Node 22 image, source bind-mounted, `npm ci` runs only when `node_modules/.package-lock.json` is absent (first boot). Dev server: `next dev -H 0.0.0.0 -p 3000` with `WATCHPACK_POLLING=true` for bind-mount hot reload.
- `allowedDevOrigins` in `next.config.ts` is built from `BASE44_PUBLIC_HOST_SUFFIX` so the preview origin can load dev assets/HMR.
- Healthcheck uses `node -e fetch(...)`. First boot needs ~2 min for `npm ci` + compile.

## Verify
- `curl -s -o /dev/null -w '%{http_code}' http://localhost:3000/` → 200
- Public routes should all return 200; protected routes (`/dashboard`, `/onboarding`) redirect to `/auth/login` when logged out.
