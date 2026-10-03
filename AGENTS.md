<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## HAVII notes

- Custom auth: JWT session cookie (`havii_session`), bcrypt passwords, Postgres. Access
  levels in `src/lib/session.ts` (`getAccessLevel`): guest / onboarding / restricted /
  full / ineligible. App routes under `/app` require `full` access; others redirect to
  `/app/restricted`.
- Server Actions use `useActionState` + `revalidatePath` to refresh server-component
  data after mutations (no client-side data fetching). CSRF handled via
  `experimental.serverActions.allowedOrigins` in `next.config.ts`.
- DB schema in `db/init.sql` (fresh DBs) + `db/migrations/00NN_*.sql` (existing DBs).
  RLS policies use `app.current_user_id` session var; server actions also enforce
  ownership via `user_id` in WHERE clauses. To apply a migration to the running DB:
  `docker compose -f docker-compose.base44.yml exec -T db psql -U havii -d havii < db/migrations/NN.sql`
- Features: daily check-ins, private journal (`/app/journal`), personal goals with
  action steps (`/app/goals`). Goals enforce ownership on both `goals` and
  `goal_steps`; step mutations cross-check the parent goal's `user_id`.
- Mobile-first; bottom nav (`src/components/layout/BottomNav.tsx`) has 5 tabs:
  Home, Journal, Goals, History, Account.
