-- ============================================================================
-- RISE USA LMS — CMS Tables for Course Content Management
-- ============================================================================

-- CMS Modules table
CREATE TABLE IF NOT EXISTS cms_modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  number INTEGER NOT NULL DEFAULT 0,
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  objectives JSONB DEFAULT '[]'::jsonb,
  estimated_time TEXT,
  icon TEXT DEFAULT '📘',
  theme_color TEXT DEFAULT 'rise-navy',
  image_url TEXT,
  is_published BOOLEAN NOT NULL DEFAULT false,
  prerequisite_module_id UUID REFERENCES cms_modules(id) ON DELETE SET NULL,
  required_completion_pct INTEGER NOT NULL DEFAULT 100 CHECK (required_completion_pct >= 0 AND required_completion_pct <= 100),
  -- Module-level activity data (mirrors static course structure)
  key_terms JSONB DEFAULT '[]'::jsonb,
  real_life_scenario JSONB DEFAULT '{}'::jsonb,
  decision_lab JSONB DEFAULT '{}'::jsonb,
  workbook_activity JSONB DEFAULT '{}'::jsonb,
  knowledge_check JSONB DEFAULT '[]'::jsonb,
  reflection JSONB DEFAULT '{}'::jsonb,
  action_commitment JSONB DEFAULT '{}'::jsonb,
  blueprint_update JSONB DEFAULT '{}'::jsonb,
  -- Metadata
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- CMS Lessons table
CREATE TABLE IF NOT EXISTS cms_lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID NOT NULL REFERENCES cms_modules(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  objectives JSONB DEFAULT '[]'::jsonb,
  estimated_minutes INTEGER NOT NULL DEFAULT 15,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_required BOOLEAN NOT NULL DEFAULT true,
  is_published BOOLEAN NOT NULL DEFAULT false,
  rise_content_type TEXT CHECK (rise_content_type IN (
    'learn_it', 'know_the_terms', 'see_it_real_life', 'rise_decision_lab',
    'workbook_activity', 'knowledge_check', 'reflection',
    'action_commitment', 'rise_financial_blueprint'
  )),
  content JSONB DEFAULT '[]'::jsonb,
  instructor_notes TEXT,
  student_instructions TEXT,
  -- Metadata
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- CMS Activities table
CREATE TABLE IF NOT EXISTS cms_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id UUID REFERENCES cms_lessons(id) ON DELETE CASCADE,
  module_id UUID REFERENCES cms_modules(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  activity_type TEXT NOT NULL CHECK (activity_type IN (
    'text_lesson', 'video', 'image', 'downloadable_document', 'pdf',
    'powerpoint_resource_link', 'interactive_scenario', 'rise_decision_lab',
    'worksheet', 'reflection', 'discussion_prompt', 'knowledge_check',
    'quiz', 'assignment', 'financial_blueprint_activity', 'external_resource_link'
  )),
  rise_content_type TEXT CHECK (rise_content_type IN (
    'learn_it', 'know_the_terms', 'see_it_real_life', 'rise_decision_lab',
    'workbook_activity', 'knowledge_check', 'reflection',
    'action_commitment', 'rise_financial_blueprint'
  )),
  content JSONB DEFAULT '{}'::jsonb,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT false,
  instructor_notes TEXT,
  -- Metadata
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_cms_lessons_module_id ON cms_lessons(module_id);
CREATE INDEX IF NOT EXISTS idx_cms_lessons_sort_order ON cms_lessons(module_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_cms_activities_lesson_id ON cms_activities(lesson_id);
CREATE INDEX IF NOT EXISTS idx_cms_activities_sort_order ON cms_activities(lesson_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_cms_modules_number ON cms_modules(number);

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER IF NOT EXISTS trigger_cms_modules_updated_at
  BEFORE UPDATE ON cms_modules
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER IF NOT EXISTS trigger_cms_lessons_updated_at
  BEFORE UPDATE ON cms_lessons
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER IF NOT EXISTS trigger_cms_activities_updated_at
  BEFORE UPDATE ON cms_activities
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS Policies — only admins can manage CMS content
ALTER TABLE cms_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_activities ENABLE ROW LEVEL SECURITY;

-- Admins can do everything; others can read published content
CREATE POLICY cms_modules_admin_all ON cms_modules
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY cms_modules_read_published ON cms_modules
  FOR SELECT USING (is_published = true);

CREATE POLICY cms_lessons_admin_all ON cms_lessons
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY cms_lessons_read_published ON cms_lessons
  FOR SELECT USING (is_published = true);

CREATE POLICY cms_activities_admin_all ON cms_activities
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY cms_activities_read_published ON cms_activities
  FOR SELECT USING (is_published = true);
