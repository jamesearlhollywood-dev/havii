-- Resume upload & parsing: add parsed_data JSONB + storage bucket
-- Run after 202603140003_career_ai.sql

-- Store structured parsed resume data alongside raw_text
ALTER TABLE public.resumes
  ADD COLUMN IF NOT EXISTS parsed_data jsonb DEFAULT '{}'::jsonb;

-- Private storage bucket for uploaded resume files
INSERT INTO storage.buckets (id, name, public)
VALUES ('resumes', 'resumes', false)
ON CONFLICT (id) DO NOTHING;

-- RLS policies for the resumes storage bucket
-- Authenticated users can manage their own files (path prefix = user id)
CREATE POLICY "resumes_storage_select_own"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'resumes' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "resumes_storage_insert_own"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'resumes' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "resumes_storage_update_own"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'resumes' AND (storage.foldername(name))[1] = auth.uid()::text)
  WITH CHECK (bucket_id = 'resumes' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "resumes_storage_delete_own"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'resumes' AND (storage.foldername(name))[1] = auth.uid()::text);
