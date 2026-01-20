-- ============================================
-- HIRESIGHT - COPY THIS INTO SUPABASE SQL EDITOR
-- Creates all 8 tables with security
-- Time: 15 seconds
-- ============================================

-- TABLE 1: PROFILES (Recruiter Accounts)
-- ============================================
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  name text,
  role text NOT NULL DEFAULT 'recruiter',
  company text,
  phone text,
  avatar_url text,
  bio text,
  location text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);


-- TABLE 2: JOB_DESCRIPTIONS
-- ============================================
CREATE TABLE IF NOT EXISTS job_descriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recruiter_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  company text,
  description text NOT NULL,
  requirements text NOT NULL,
  required_skills text[] DEFAULT ARRAY[]::text[],
  preferred_skills text[] DEFAULT ARRAY[]::text[],
  min_experience integer DEFAULT 0,
  max_experience integer,
  education_level text,
  location text,
  job_type text DEFAULT 'full-time',
  salary_range text,
  status text DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE job_descriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Recruiters can view own jobs" ON job_descriptions FOR SELECT TO authenticated USING (recruiter_id = auth.uid());
CREATE POLICY "Recruiters can insert jobs" ON job_descriptions FOR INSERT TO authenticated WITH CHECK (recruiter_id = auth.uid());
CREATE POLICY "Recruiters can update own jobs" ON job_descriptions FOR UPDATE TO authenticated USING (recruiter_id = auth.uid()) WITH CHECK (recruiter_id = auth.uid());
CREATE POLICY "Recruiters can delete own jobs" ON job_descriptions FOR DELETE TO authenticated USING (recruiter_id = auth.uid());

CREATE INDEX IF NOT EXISTS idx_jobs_recruiter_id ON job_descriptions(recruiter_id);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON job_descriptions(status);


-- TABLE 3: RESUMES
-- ============================================
CREATE TABLE IF NOT EXISTS resumes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  file_name text NOT NULL,
  file_url text NOT NULL,
  file_size integer,
  file_type text NOT NULL,
  status text DEFAULT 'uploaded',
  candidate_name text,
  email text,
  phone text,
  source text DEFAULT 'manual',
  shortlisted boolean DEFAULT false,
  skills text[] DEFAULT ARRAY[]::text[],
  experience text[] DEFAULT ARRAY[]::text[],
  education text[] DEFAULT ARRAY[]::text[],
  years_of_experience integer DEFAULT 0,
  summary text,
  parsed_data jsonb,
  analysis_data jsonb,
  upload_date timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Recruiters can view own resumes" ON resumes FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Recruiters can insert resumes" ON resumes FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Recruiters can update own resumes" ON resumes FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "Recruiters can delete own resumes" ON resumes FOR DELETE TO authenticated USING (user_id = auth.uid());

CREATE INDEX IF NOT EXISTS idx_resumes_user_id ON resumes(user_id);
CREATE INDEX IF NOT EXISTS idx_resumes_candidate_name ON resumes(candidate_name);


-- TABLE 4: PARSED_RESUMES
-- ============================================
CREATE TABLE IF NOT EXISTS parsed_resumes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  resume_id uuid UNIQUE REFERENCES resumes(id) ON DELETE CASCADE,
  full_text text,
  summary text,
  skills text[],
  experience jsonb,
  education jsonb,
  certifications text[],
  languages text[],
  years_of_experience numeric DEFAULT 0,
  current_company text,
  current_position text,
  total_companies integer DEFAULT 0,
  keywords text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE parsed_resumes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Recruiters can view own parsed resumes" ON parsed_resumes FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM resumes WHERE resumes.id = parsed_resumes.resume_id AND resumes.user_id = auth.uid()));
CREATE POLICY "Recruiters can insert parsed resumes" ON parsed_resumes FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM resumes WHERE resumes.id = parsed_resumes.resume_id AND resumes.user_id = auth.uid()));
CREATE POLICY "Recruiters can update own parsed resumes" ON parsed_resumes FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM resumes WHERE resumes.id = parsed_resumes.resume_id AND resumes.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM resumes WHERE resumes.id = parsed_resumes.resume_id AND resumes.user_id = auth.uid()));

CREATE INDEX IF NOT EXISTS idx_parsed_resumes_resume_id ON parsed_resumes(resume_id);


-- TABLE 5: ANALYSIS_RESULTS
-- ============================================
CREATE TABLE IF NOT EXISTS analysis_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  resume_id uuid REFERENCES resumes(id) ON DELETE CASCADE,
  job_id uuid REFERENCES job_descriptions(id) ON DELETE CASCADE,
  match_score numeric DEFAULT 0,
  suitability text DEFAULT 'Not Suitable',
  matched_skills text[],
  missing_skills text[],
  summary text,
  insights jsonb,
  analyzed_at timestamptz DEFAULT now(),
  UNIQUE(resume_id, job_id)
);

ALTER TABLE analysis_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Recruiters can view own analysis" ON analysis_results FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM resumes WHERE resumes.id = analysis_results.resume_id AND resumes.user_id = auth.uid()));
CREATE POLICY "Recruiters can insert analysis" ON analysis_results FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM resumes WHERE resumes.id = analysis_results.resume_id AND resumes.user_id = auth.uid()));
CREATE POLICY "Recruiters can update own analysis" ON analysis_results FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM resumes WHERE resumes.id = analysis_results.resume_id AND resumes.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM resumes WHERE resumes.id = analysis_results.resume_id AND resumes.user_id = auth.uid()));

CREATE INDEX IF NOT EXISTS idx_analysis_resume_id ON analysis_results(resume_id);
CREATE INDEX IF NOT EXISTS idx_analysis_job_id ON analysis_results(job_id);


-- TABLE 6: CANDIDATE_STATUS
-- ============================================
CREATE TABLE IF NOT EXISTS candidate_status (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  resume_id uuid REFERENCES resumes(id) ON DELETE CASCADE,
  job_id uuid REFERENCES job_descriptions(id) ON DELETE CASCADE,
  status text DEFAULT 'under_review',
  notes text,
  updated_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(resume_id, job_id)
);

ALTER TABLE candidate_status ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Recruiters can view own candidate status" ON candidate_status FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM resumes WHERE resumes.id = candidate_status.resume_id AND resumes.user_id = auth.uid()));
CREATE POLICY "Recruiters can insert candidate status" ON candidate_status FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM resumes WHERE resumes.id = candidate_status.resume_id AND resumes.user_id = auth.uid()));
CREATE POLICY "Recruiters can update own candidate status" ON candidate_status FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM resumes WHERE resumes.id = candidate_status.resume_id AND resumes.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM resumes WHERE resumes.id = candidate_status.resume_id AND resumes.user_id = auth.uid()));

CREATE INDEX IF NOT EXISTS idx_candidate_status_resume_id ON candidate_status(resume_id);
CREATE INDEX IF NOT EXISTS idx_candidate_status_job_id ON candidate_status(job_id);


-- TABLE 7: APPLICATIONS
-- ============================================
CREATE TABLE IF NOT EXISTS applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  resume_id uuid NOT NULL REFERENCES resumes(id) ON DELETE CASCADE,
  job_id uuid NOT NULL REFERENCES job_descriptions(id) ON DELETE CASCADE,
  candidate_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  match_score numeric DEFAULT 0,
  suitability text DEFAULT 'not-suitable',
  matched_skills text[] DEFAULT ARRAY[]::text[],
  missing_skills text[] DEFAULT ARRAY[]::text[],
  insights jsonb DEFAULT '[]'::jsonb,
  status text DEFAULT 'under-review',
  applied_at timestamptz DEFAULT now(),
  reviewed_at timestamptz,
  reviewed_by uuid REFERENCES auth.users(id),
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Recruiters can view own applications" ON applications FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM resumes WHERE resumes.id = applications.resume_id AND resumes.user_id = auth.uid()));
CREATE POLICY "Recruiters can insert applications" ON applications FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM resumes WHERE resumes.id = applications.resume_id AND resumes.user_id = auth.uid()));
CREATE POLICY "Recruiters can update own applications" ON applications FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM resumes WHERE resumes.id = applications.resume_id AND resumes.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM resumes WHERE resumes.id = applications.resume_id AND resumes.user_id = auth.uid()));

CREATE INDEX IF NOT EXISTS idx_applications_resume_id ON applications(resume_id);
CREATE INDEX IF NOT EXISTS idx_applications_job_id ON applications(job_id);


-- TABLE 8: INTERVIEWS
-- ============================================
CREATE TABLE IF NOT EXISTS interviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id uuid REFERENCES applications(id) ON DELETE SET NULL,
  candidate_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  recruiter_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  job_id uuid NOT NULL REFERENCES job_descriptions(id) ON DELETE CASCADE,
  title text NOT NULL,
  scheduled_date date NOT NULL,
  scheduled_time time NOT NULL,
  duration_minutes integer DEFAULT 60,
  meeting_link text,
  meeting_platform text,
  location text,
  interview_type text DEFAULT 'technical',
  status text DEFAULT 'scheduled',
  interviewer_notes text,
  rating integer,
  recommendation text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE interviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Recruiters can view own interviews" ON interviews FOR SELECT TO authenticated USING (recruiter_id = auth.uid());
CREATE POLICY "Recruiters can insert interviews" ON interviews FOR INSERT TO authenticated WITH CHECK (recruiter_id = auth.uid());
CREATE POLICY "Recruiters can update own interviews" ON interviews FOR UPDATE TO authenticated USING (recruiter_id = auth.uid()) WITH CHECK (recruiter_id = auth.uid());
CREATE POLICY "Recruiters can delete own interviews" ON interviews FOR DELETE TO authenticated USING (recruiter_id = auth.uid());

CREATE INDEX IF NOT EXISTS idx_interviews_recruiter_id ON interviews(recruiter_id);
CREATE INDEX IF NOT EXISTS idx_interviews_job_id ON interviews(job_id);


-- AUTO-UPDATE TIMESTAMPS
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_resumes_updated_at BEFORE UPDATE ON resumes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_parsed_resumes_updated_at BEFORE UPDATE ON parsed_resumes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_job_descriptions_updated_at BEFORE UPDATE ON job_descriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_candidate_status_updated_at BEFORE UPDATE ON candidate_status FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_interviews_updated_at BEFORE UPDATE ON interviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_applications_updated_at BEFORE UPDATE ON applications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


-- AUTO-CREATE PROFILE ON SIGNUP
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role, created_at, updated_at)
  VALUES (NEW.id, NEW.email, 'recruiter', now(), now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- SUCCESS MESSAGE
-- ============================================
SELECT '✅ SUCCESS! All 8 tables created with security enabled!' as message;
