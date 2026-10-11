-- ============================================================================
-- RISE USA LMS — Assessment Engine & Certificate Schema
-- ============================================================================

-- Assessment Questions (Question Bank)
CREATE TABLE IF NOT EXISTS assessment_questions (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN (
    'multiple_choice', 'multiple_select', 'true_false', 'matching',
    'fill_in_blank', 'short_answer', 'scenario', 'calculation'
  )),
  question TEXT NOT NULL,
  options JSONB DEFAULT '[]',
  correct_answer JSONB,
  matches JSONB,
  explanation TEXT,
  points INTEGER DEFAULT 1,
  difficulty TEXT DEFAULT 'foundational' CHECK (difficulty IN ('foundational', 'applied', 'advanced')),
  topic TEXT,
  module_id TEXT,
  lesson_id TEXT,
  assessment_id TEXT,
  published BOOLEAN DEFAULT false,
  numeric_answer DECIMAL,
  acceptable_range_low DECIMAL,
  acceptable_range_high DECIMAL,
  unit TEXT,
  acceptable_keywords JSONB DEFAULT '[]',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Assessment Configs
CREATE TABLE IF NOT EXISTS assessment_configs (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('knowledge_check', 'final_assessment', 'practice')),
  module_id TEXT,
  description TEXT,
  question_ids JSONB DEFAULT '[]',
  passing_score INTEGER DEFAULT 70,
  max_retakes INTEGER,
  feedback_mode TEXT DEFAULT 'after_submit' CHECK (feedback_mode IN ('immediate', 'after_submit')),
  randomize_questions BOOLEAN DEFAULT false,
  randomize_answers BOOLEAN DEFAULT false,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Assessment Attempts
CREATE TABLE IF NOT EXISTS assessment_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  assessment_id TEXT NOT NULL,
  assessment_type TEXT NOT NULL,
  module_id TEXT,
  attempt_number INTEGER NOT NULL,
  started_at TIMESTAMPTZ NOT NULL,
  submitted_at TIMESTAMPTZ,
  score INTEGER NOT NULL DEFAULT 0,
  percentage INTEGER NOT NULL DEFAULT 0,
  passed BOOLEAN NOT NULL DEFAULT false,
  responses JSONB DEFAULT '{}',
  question_results JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (profile_id, assessment_id, attempt_number)
);

-- Index for common queries
CREATE INDEX IF NOT EXISTS idx_assessment_attempts_profile ON assessment_attempts(profile_id);
CREATE INDEX IF NOT EXISTS idx_assessment_attempts_assessment ON assessment_attempts(assessment_id);
CREATE INDEX IF NOT EXISTS idx_assessment_attempts_module ON assessment_attempts(module_id);

-- Extend certificates table with org/cohort/instructor fields
ALTER TABLE certificates
  ADD COLUMN IF NOT EXISTS organization_name TEXT,
  ADD COLUMN IF NOT EXISTS cohort_name TEXT,
  ADD COLUMN IF NOT EXISTS instructor_name TEXT;

-- Certificate Audit Log
CREATE TABLE IF NOT EXISTS certificate_audit (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  certificate_id TEXT NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('issued', 'revoked', 'reissued', 'manually_issued')),
  performed_by UUID REFERENCES profiles(id),
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_certificate_audit_cert ON certificate_audit(certificate_id);

-- ============================================================================
-- Row Level Security
-- ============================================================================

-- Assessment questions: admins can manage, others can read published
ALTER TABLE assessment_questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admins_manage_questions" ON assessment_questions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );
CREATE POLICY "anyone_read_published_questions" ON assessment_questions
  FOR SELECT USING (published = true);

-- Assessment configs: admins can manage, others can read published
ALTER TABLE assessment_configs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admins_manage_configs" ON assessment_configs
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );
CREATE POLICY "anyone_read_published_configs" ON assessment_configs
  FOR SELECT USING (published = true);

-- Assessment attempts: students see their own, staff can view all
ALTER TABLE assessment_attempts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "students_view_own_attempts" ON assessment_attempts
  FOR SELECT USING (profile_id = auth.uid());
CREATE POLICY "students_insert_own_attempts" ON assessment_attempts
  FOR INSERT WITH CHECK (profile_id = auth.uid());
CREATE POLICY "staff_view_all_attempts" ON assessment_attempts
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'instructor', 'org_manager')
    )
  );

-- Certificate audit: admins can view all, others can view their own
ALTER TABLE certificate_audit ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admins_view_audit" ON certificate_audit
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );
CREATE POLICY "admins_insert_audit" ON certificate_audit
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );
