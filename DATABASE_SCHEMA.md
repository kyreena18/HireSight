# HireSight Database Schema Design

## Complete Database Architecture

### Overview
The HireSight platform uses Supabase (PostgreSQL) with Row Level Security (RLS) for secure data access. The schema supports AI-powered resume parsing, job matching, and recruitment workflows.

---

## Tables

### 1. **profiles** (User Profiles)
Stores extended user information beyond authentication.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PRIMARY KEY, FK → auth.users | User ID (from Supabase Auth) |
| name | text | NULLABLE | Full name of the user |
| role | text | NOT NULL, CHECK(candidate/recruiter) | User role type |
| avatar_url | text | NULLABLE | Profile picture URL |
| bio | text | NULLABLE | User biography |
| company | text | NULLABLE | Company name (for recruiters) |
| location | text | NULLABLE | User location |
| created_at | timestamptz | DEFAULT now() | Profile creation timestamp |
| updated_at | timestamptz | DEFAULT now() | Last update timestamp |

**Indexes:**
- Primary: `id`
- Index: `role` (for filtering users by role)

**RLS Policies:**
- Users can read their own profile
- Users can update their own profile
- Recruiters can read other recruiters' profiles
- Recruiters can read candidate profiles

---

### 2. **resumes** (Resume Storage & Parsing)
Stores uploaded resumes with parsed data and AI analysis.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PRIMARY KEY, DEFAULT gen_random_uuid() | Unique resume ID |
| user_id | uuid | NOT NULL, FK → auth.users | Owner of the resume (candidate) |
| file_name | text | NOT NULL | Original filename |
| file_url | text | NOT NULL | Storage URL for the file |
| file_size | integer | NULLABLE | File size in bytes |
| file_type | text | NOT NULL | File extension (pdf, docx) |
| status | text | DEFAULT 'parsing', CHECK | Processing status |
| skills | text[] | DEFAULT ARRAY[] | Extracted skills array |
| experience | text[] | DEFAULT ARRAY[] | Work experience entries |
| education | text[] | DEFAULT ARRAY[] | Education entries |
| years_of_experience | integer | DEFAULT 0 | Total years of experience |
| email | text | NULLABLE | Extracted email from resume |
| phone | text | NULLABLE | Extracted phone number |
| summary | text | NULLABLE | Resume summary (first 500 chars) |
| parsed_data | jsonb | NULLABLE | Complete parsed data |
| analysis_data | jsonb | NULLABLE | AI analysis results |
| upload_date | timestamptz | DEFAULT now() | Upload timestamp |
| created_at | timestamptz | DEFAULT now() | Creation timestamp |
| updated_at | timestamptz | DEFAULT now() | Last update timestamp |

**Status Values:** `parsing`, `parsed`, `error`

**Indexes:**
- Primary: `id`
- Index: `user_id` (for user's resumes)
- Index: `status` (for filtering)
- GIN Index: `skills` (for array search)
- GIN Index: `parsed_data` (for JSONB search)

**RLS Policies:**
- Candidates can CRUD their own resumes
- Recruiters can read all parsed resumes
- Recruiters cannot modify candidate resumes

---

### 3. **job_descriptions** (Job Postings)
Stores job postings created by recruiters.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PRIMARY KEY, DEFAULT gen_random_uuid() | Unique job ID |
| recruiter_id | uuid | NOT NULL, FK → auth.users | Recruiter who posted |
| title | text | NOT NULL | Job title |
| company | text | NULLABLE | Company name |
| description | text | NOT NULL | Full job description |
| requirements | text | NOT NULL | Job requirements |
| required_skills | text[] | DEFAULT ARRAY[] | Required skills array |
| preferred_skills | text[] | DEFAULT ARRAY[] | Preferred skills array |
| min_experience | integer | DEFAULT 0 | Minimum years experience |
| max_experience | integer | NULLABLE | Maximum years experience |
| education_level | text | NULLABLE | Required education level |
| location | text | NULLABLE | Job location |
| job_type | text | DEFAULT 'full-time' | Employment type |
| salary_range | text | NULLABLE | Salary range |
| status | text | DEFAULT 'active' | Job status (active/closed) |
| created_at | timestamptz | DEFAULT now() | Creation timestamp |
| updated_at | timestamptz | DEFAULT now() | Last update timestamp |

**Indexes:**
- Primary: `id`
- Index: `recruiter_id`
- Index: `status`
- GIN Index: `required_skills` (for skill matching)

**RLS Policies:**
- Recruiters can CRUD their own jobs
- All authenticated users can read active jobs
- Candidates cannot modify jobs

---

### 4. **applications** (Job Applications)
Stores job applications with AI matching scores.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PRIMARY KEY, DEFAULT gen_random_uuid() | Unique application ID |
| resume_id | uuid | NOT NULL, FK → resumes | Resume used for application |
| job_id | uuid | NOT NULL, FK → job_descriptions | Job being applied to |
| candidate_id | uuid | NOT NULL, FK → auth.users | Candidate applying |
| match_score | numeric | DEFAULT 0 | AI matching score (0-100) |
| suitability | text | DEFAULT 'not-suitable' | AI suitability rating |
| matched_skills | text[] | DEFAULT ARRAY[] | Skills that match job |
| missing_skills | text[] | DEFAULT ARRAY[] | Skills candidate lacks |
| insights | jsonb | DEFAULT '[]' | AI-generated insights |
| status | text | DEFAULT 'under-review' | Application status |
| applied_at | timestamptz | DEFAULT now() | Application timestamp |
| reviewed_at | timestamptz | NULLABLE | Review timestamp |
| reviewed_by | uuid | NULLABLE, FK → auth.users | Recruiter who reviewed |
| notes | text | NULLABLE | Recruiter notes |
| created_at | timestamptz | DEFAULT now() | Creation timestamp |
| updated_at | timestamptz | DEFAULT now() | Last update timestamp |

**Status Values:** `under-review`, `shortlisted`, `rejected`, `interview-scheduled`, `offered`, `hired`

**Suitability Values:** `not-suitable`, `moderate`, `good`, `excellent`

**Indexes:**
- Primary: `id`
- Index: `candidate_id`
- Index: `job_id`
- Index: `resume_id`
- Index: `status`
- Composite: `(job_id, candidate_id)` UNIQUE (prevent duplicate applications)

**RLS Policies:**
- Candidates can read their own applications
- Candidates can create applications
- Recruiters can read applications for their jobs
- Recruiters can update applications for their jobs

---

### 5. **interviews** (Interview Scheduling)
Stores scheduled interviews between candidates and recruiters.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PRIMARY KEY, DEFAULT gen_random_uuid() | Unique interview ID |
| application_id | uuid | NOT NULL, FK → applications | Related application |
| candidate_id | uuid | NOT NULL, FK → auth.users | Candidate being interviewed |
| recruiter_id | uuid | NOT NULL, FK → auth.users | Interviewer |
| job_id | uuid | NOT NULL, FK → job_descriptions | Job position |
| title | text | NOT NULL | Interview title |
| scheduled_date | date | NOT NULL | Interview date |
| scheduled_time | time | NOT NULL | Interview time |
| duration_minutes | integer | DEFAULT 60 | Duration in minutes |
| meeting_link | text | NULLABLE | Virtual meeting link |
| meeting_platform | text | NULLABLE | Platform (Zoom, Teams, etc.) |
| location | text | NULLABLE | Physical location (if in-person) |
| interview_type | text | DEFAULT 'technical' | Interview type |
| status | text | DEFAULT 'scheduled' | Interview status |
| interviewer_notes | text | NULLABLE | Notes from interviewer |
| rating | integer | NULLABLE | Interview rating (1-5) |
| recommendation | text | NULLABLE | Hire recommendation |
| created_at | timestamptz | DEFAULT now() | Creation timestamp |
| updated_at | timestamptz | DEFAULT now() | Last update timestamp |

**Status Values:** `scheduled`, `completed`, `cancelled`, `rescheduled`, `no-show`

**Interview Types:** `technical`, `hr`, `behavioral`, `cultural-fit`, `final`

**Indexes:**
- Primary: `id`
- Index: `candidate_id`
- Index: `recruiter_id`
- Index: `application_id`
- Index: `scheduled_date`

**RLS Policies:**
- Candidates can read their own interviews
- Recruiters can CRUD interviews they created
- Both parties can view shared interviews

---

## Relationships

```
auth.users (1) ──────┬───── (M) profiles
                     │
                     ├───── (M) resumes
                     │
                     ├───── (M) job_descriptions (as recruiter)
                     │
                     ├───── (M) applications (as candidate)
                     │
                     └───── (M) interviews (as candidate/recruiter)

resumes (1) ────────────── (M) applications

job_descriptions (1) ───┬─ (M) applications
                        │
                        └─ (M) interviews

applications (1) ──────── (M) interviews
```

---

## Data Flow

### Resume Upload Flow
1. Candidate uploads resume → **resumes** table (status: `parsing`)
2. Backend parses resume → Updates **resumes** (status: `parsed`)
3. Extracted data populates: `skills`, `experience`, `education`, `parsed_data`
4. Resume now searchable by recruiters

### Job Application Flow
1. Candidate applies to job → Creates **applications** record
2. AI computes match score → Updates `match_score`, `matched_skills`, `missing_skills`
3. Application visible to recruiter → **applications** (status: `under-review`)
4. Recruiter reviews → Updates `status`, `reviewed_at`, `notes`

### Interview Scheduling Flow
1. Recruiter schedules interview → Creates **interviews** record
2. Both parties notified → Read access via RLS
3. Interview occurs → Recruiter updates `status`, `notes`, `rating`
4. Recommendation made → Updates `recommendation`

---

## Security (Row Level Security)

All tables have RLS enabled with the following principles:

1. **Ownership**: Users can only modify their own data
2. **Role-based access**: Recruiters have read access to candidate data
3. **Contextual access**: Access granted based on relationships (e.g., recruiter can see applications for their jobs)
4. **No public access**: All data requires authentication

---

## Performance Optimizations

1. **Indexes on foreign keys** for JOIN performance
2. **GIN indexes on arrays** for skill matching
3. **Composite indexes** for common query patterns
4. **Partial indexes** for status filtering
5. **JSONB indexes** for parsed_data queries

---

## Future Enhancements

### Planned Additions
1. **resume_embeddings** table for vector similarity search
2. **notifications** table for real-time alerts
3. **messages** table for in-app communication
4. **analytics_events** table for tracking
5. **saved_searches** table for recruiter preferences
6. **candidate_notes** table for recruiter annotations

### Scalability Considerations
- Partition large tables by date ranges
- Archive old applications/interviews
- Implement full-text search with PostgreSQL FTS
- Add caching layer for frequent queries
- Use materialized views for analytics

---

## Sample Data Sizes (Production Estimates)

| Table | Estimated Rows/Year | Growth Rate |
|-------|---------------------|-------------|
| profiles | 10,000 | Steady |
| resumes | 50,000 | High |
| job_descriptions | 5,000 | Moderate |
| applications | 200,000 | Very High |
| interviews | 20,000 | Moderate |

---

## Backup & Recovery

- **Daily automated backups** via Supabase
- **Point-in-time recovery** available
- **Audit logs** for data changes
- **Soft deletes** for critical tables (future)

