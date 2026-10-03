-- HAVII personal goals + action steps migration
-- Run against an existing database that already has the foundation schema.

CREATE TABLE IF NOT EXISTS goals (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  description TEXT,
  category    TEXT NOT NULL CHECK (category IN
              ('well-being','school','career','relationships','personal-growth')),
  target_date DATE,
  status      TEXT NOT NULL DEFAULT 'active'
              CHECK (status IN ('active','completed','archived')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS goals_user_id_idx ON goals(user_id);
CREATE INDEX IF NOT EXISTS goals_user_status_idx ON goals(user_id, status, created_at DESC);

CREATE TRIGGER goals_set_updated_at
  BEFORE UPDATE ON goals
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE IF NOT EXISTS goal_steps (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  goal_id    UUID NOT NULL REFERENCES goals(id) ON DELETE CASCADE,
  user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title      TEXT NOT NULL,
  completed  BOOLEAN NOT NULL DEFAULT false,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS goal_steps_goal_idx ON goal_steps(goal_id, sort_order);
CREATE INDEX IF NOT EXISTS goal_steps_user_idx ON goal_steps(user_id);

CREATE TRIGGER goal_steps_set_updated_at
  BEFORE UPDATE ON goal_steps
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
CREATE POLICY goals_rls ON goals FOR ALL USING (
  user_id = NULLIF(current_setting('app.current_user_id', true), '')::uuid
);

ALTER TABLE goal_steps ENABLE ROW LEVEL SECURITY;
CREATE POLICY goal_steps_rls ON goal_steps FOR ALL USING (
  user_id = NULLIF(current_setting('app.current_user_id', true), '')::uuid
);
