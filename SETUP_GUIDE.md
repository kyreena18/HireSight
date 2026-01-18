# HireSight - Complete Setup Guide

## AI-Driven Resume Screening and Recruitment Support Platform

This guide will help you set up and run the complete HireSight application with authentication, AI analysis, and recruiter dashboard.

---

## TABLE OF CONTENTS
1. [Prerequisites](#prerequisites)
2. [Database Setup](#database-setup)
3. [Backend Setup (Flask)](#backend-setup-flask)
4. [Frontend Setup (React/Expo)](#frontend-setup-reactexpo)
5. [Parse Existing Resumes](#parse-existing-resumes)
6. [Running the Application](#running-the-application)
7. [Using the Application](#using-the-application)
8. [Troubleshooting](#troubleshooting)

---

## PREREQUISITES

### Required Software
- **Node.js** (v18 or higher)
- **Python** (v3.8 or higher)
- **npm** or **yarn**
- **pip** (Python package manager)

### Supabase Account
- Create a free account at [supabase.com](https://supabase.com)
- Create a new project
- Note down your:
  - `SUPABASE_URL`
  - `SUPABASE_ANON_KEY`

---

## DATABASE SETUP

### 1. Configure Environment Variables

The `.env` file in your project root should already contain:

```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url_here
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

**Update these values with your actual Supabase credentials.**

### 2. Verify Database Tables

The database schema has already been applied with the following tables:
- **profiles** - User information with role (candidate/recruiter)
- **resumes** - Resume files and parsed data
- **job_descriptions** - Job postings by recruiters
- **applications** - Candidate applications with AI match scores
- **interviews** - Scheduled interviews

You can verify this in your Supabase dashboard under "Table Editor".

### 3. Check Row Level Security (RLS)

All tables have RLS enabled. This ensures:
- Candidates can only see their own resumes and applications
- Recruiters can see all resumes and manage their own jobs
- Interview data is protected per role

---

## BACKEND SETUP (FLASK)

### 1. Navigate to Backend Directory

```bash
cd flask-backend
```

### 2. Create Python Virtual Environment (Recommended)

```bash
python -m venv venv

# On Windows
venv\Scripts\activate

# On macOS/Linux
source venv/bin/activate
```

### 3. Install Python Dependencies

```bash
pip install -r requirements.txt
```

This installs:
- Flask (web framework)
- Supabase Python client
- PyPDF2, python-docx (PDF/DOCX parsing)
- NLTK, spaCy (NLP)
- Sentence-Transformers (AI embeddings)
- scikit-learn (ML algorithms)

### 4. Download NLP Models

```bash
# Download NLTK data
python -c "import nltk; nltk.download('punkt'); nltk.download('stopwords'); nltk.download('wordnet')"

# Download spaCy model
python -m spacy download en_core_web_sm
```

### 5. Copy Environment Variables to Backend

Create a `.env` file in the `flask-backend` directory:

```bash
# flask-backend/.env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SECRET_KEY=your_secret_key_here
DEBUG=True
```

---

## FRONTEND SETUP (REACT/EXPO)

### 1. Install Frontend Dependencies

From the project root:

```bash
npm install
```

This installs all required packages including:
- Expo (React Native framework)
- Supabase JS client
- Navigation libraries
- UI components

### 2. Verify Environment Variables

Ensure your `.env` file in the project root has the correct Supabase credentials.

---

## PARSE EXISTING RESUMES

You have resumes in the `/resumes` folder. Let's parse them and upload to the database.

### 1. Run the Resume Parser Script

```bash
cd flask-backend
python scripts/parse_resume_folder.py
```

This script will:
- Find all PDF and DOCX files in `/resumes`
- Extract text and identify skills, experience, education
- Calculate years of experience
- Display parsed information

### 2. What the Parser Extracts

For each resume, the AI parser identifies:
- **Skills**: Python, Java, React, AWS, Docker, etc.
- **Experience**: Job titles, companies, duration
- **Education**: Degrees, universities
- **Years of Experience**: Total calculated years
- **Contact Info**: Email, phone (if available)

### 3. Expected Output

```
HireSight - Resume Parser
==================================================
Resume folder: /path/to/resumes

Found 17 resume files to process
--------------------------------------------------

Processing: Aman Kumar_Data Engineer_ZGN_Avesta.pdf
  ✓ Extracted 12 skills
  ✓ Found 5 years of experience
  ✓ Successfully parsed
    Skills: python, sql, spark, aws, airflow...

...

SUMMARY:
  Successfully parsed: 17
  Failed: 0
  Total: 17
==================================================
```

---

## RUNNING THE APPLICATION

### Terminal 1: Start Flask Backend

```bash
cd flask-backend
python app.py
```

The backend will run on `http://localhost:5000`

You should see:
```
 * Running on http://127.0.0.1:5000
 * Restarting with stat
```

### Terminal 2: Start React Frontend

From project root:

```bash
npm start
```

Then press `w` to open in web browser.

The app will open at `http://localhost:8081`

---

## USING THE APPLICATION

### 1. Create Accounts

#### Register as Recruiter:
1. Open the app at `http://localhost:8081`
2. Click "Sign Up"
3. Enter:
   - **Name**: John Recruiter
   - **Email**: recruiter@example.com
   - **Password**: password123
   - **Role**: Select "Recruiter"
4. Click "Sign Up"

#### Register as Candidate:
1. Click "Sign Up"
2. Enter:
   - **Name**: Jane Candidate
   - **Email**: candidate@example.com
   - **Password**: password123
   - **Role**: Select "Candidate"
3. Click "Sign Up"

### 2. Recruiter Workflow

#### A. Search Resumes
1. Log in as recruiter
2. Go to "Search" tab
3. Use filters:
   - **Search**: Enter keywords (e.g., "python", "engineer")
   - **Required Skills**: Enter skills (e.g., "python, react, aws")
   - **Minimum Experience**: Enter years (e.g., "3")
4. View matching resumes with:
   - Skills listed
   - Years of experience
   - Contact information
   - Summary

#### B. Create Job Posting
1. Go to "Jobs" or "Dashboard"
2. Click "Create Job"
3. Enter:
   - **Title**: "Senior Full Stack Developer"
   - **Company**: "TechCorp Inc"
   - **Description**: Job details
   - **Requirements**: Required qualifications
   - **Required Skills**: python, react, node.js, aws
   - **Min Experience**: 5
4. Click "Create Job"

#### C. View AI Match Scores
When candidates apply:
1. Go to "Applications" for a specific job
2. View AI-generated match scores (0-100%)
3. See:
   - **Match Score**: Overall compatibility
   - **Suitability**: Highly Suitable / Moderately Suitable / Not Suitable
   - **Matched Skills**: Skills candidate has
   - **Missing Skills**: Skills candidate lacks
   - **Insights**: AI-generated recommendations

#### D. Shortlist Candidates
1. Review applications
2. Update status:
   - Under Review
   - **Shortlisted**
   - Rejected
   - Interview Scheduled

#### E. Schedule Interviews
1. Select a shortlisted candidate
2. Click "Schedule Interview"
3. Enter:
   - Date and time
   - Meeting link (Zoom/Google Meet)
   - Interview type (Technical, HR, etc.)
4. Candidate receives interview details

#### F. View Analytics
1. Go to "Analytics" or "Dashboard"
2. View:
   - Total applications
   - Average match scores
   - Status distribution (charts)
   - Top skills across candidates
   - Common missing skills
   - Conversion funnel

### 3. Candidate Workflow

#### A. Upload Resume
1. Log in as candidate
2. Go to "Upload Resume"
3. Select PDF or DOCX file
4. AI automatically parses:
   - Skills
   - Experience
   - Education

#### B. View Parsed Resume
1. Go to "My Resumes"
2. See extracted information:
   - Identified skills
   - Years of experience
   - Education details

#### C. Browse Jobs
1. Go to "Browse Jobs"
2. View active job postings
3. See job requirements

#### D. Apply to Jobs
1. Select a job
2. Choose your resume
3. Click "Apply"
4. AI analyzes your resume against job requirements
5. View your match score and insights

#### E. Track Applications
1. Go to "My Applications"
2. See all applied jobs with:
   - Match scores
   - Application status
   - Insights on skill gaps

#### F. View Interviews
1. Go to "Interviews"
2. See scheduled interviews with:
   - Date and time
   - Meeting link
   - Interview type

---

## API ENDPOINTS

### Backend API (Flask)

#### Health Check
```bash
GET http://localhost:5000/api/health
```

#### Resume Operations
```bash
POST http://localhost:5000/api/resumes/upload
POST http://localhost:5000/api/resumes/bulk-upload
GET  http://localhost:5000/api/resumes/
```

#### Job Operations
```bash
GET  http://localhost:5000/api/jobs/
POST http://localhost:5000/api/jobs/
PUT  http://localhost:5000/api/jobs/{id}
```

#### Application Operations (with AI Analysis)
```bash
POST http://localhost:5000/api/applications/apply
GET  http://localhost:5000/api/applications/
PUT  http://localhost:5000/api/applications/{id}/status
```

#### Analytics
```bash
GET http://localhost:5000/api/analytics/dashboard?recruiter_id={id}
GET http://localhost:5000/api/analytics/job/{id}
```

---

## TROUBLESHOOTING

### Database Issues

**Problem**: "relation does not exist" error
**Solution**:
- Check if all migrations ran successfully
- Verify tables exist in Supabase dashboard
- Re-run migrations if needed

**Problem**: "permission denied" error
**Solution**:
- Check Row Level Security policies
- Ensure user is authenticated
- Verify user role in profiles table

### Backend Issues

**Problem**: NLTK/spaCy models not found
**Solution**:
```bash
python -c "import nltk; nltk.download('punkt'); nltk.download('stopwords'); nltk.download('wordnet')"
python -m spacy download en_core_web_sm
```

**Problem**: "Module not found" error
**Solution**:
```bash
pip install -r requirements.txt
```

**Problem**: Sentence-Transformer model downloading slowly
**Solution**:
- First run takes time to download model (~80MB)
- Model is cached for subsequent runs
- Wait for "Loading Sentence Transformer model..." to complete

### Frontend Issues

**Problem**: "Cannot connect to backend"
**Solution**:
- Ensure Flask backend is running on port 5000
- Check CORS settings in Flask app
- Verify API endpoint URLs

**Problem**: Authentication fails
**Solution**:
- Check Supabase credentials in .env
- Verify internet connection
- Check Supabase project status

**Problem**: Resume upload fails
**Solution**:
- Check file size (max 10MB)
- Only PDF and DOCX files supported
- Ensure uploads/ directory exists in flask-backend

### Resume Parsing Issues

**Problem**: Skills not detected
**Solution**:
- Parser uses predefined skill list
- Add more skills to `resume_parser.py` if needed
- Ensure resume text is clear and well-formatted

**Problem**: Years of experience incorrect
**Solution**:
- Parser looks for date ranges (2018-2020)
- Explicitly mentioned years (5 years of experience)
- Manual review may be needed for complex formats

---

## AI/ML ALGORITHM DETAILS

### Resume Matching Algorithm

HireSight uses a multi-faceted AI approach:

1. **TF-IDF Vectorization** (20% weight)
   - Analyzes keyword frequency
   - Identifies important terms

2. **Sentence-BERT Embeddings** (30% weight)
   - Semantic understanding
   - Captures meaning beyond keywords
   - Model: `all-MiniLM-L6-v2`

3. **Skill Matching** (35% weight)
   - Exact skill comparison
   - Identifies matched and missing skills

4. **Experience Matching** (15% weight)
   - Compares years of experience
   - Considers minimum requirements

### Match Score Calculation

```
Match Score = (
  Semantic_Similarity * 0.30 +
  TF-IDF_Similarity * 0.20 +
  Skill_Match * 0.35 +
  Experience_Match * 0.15
) * 100
```

### Suitability Classification

- **Highly Suitable**: 75-100% match
- **Moderately Suitable**: 50-74% match
- **Not Suitable**: 0-49% match

---

## PROJECT STRUCTURE

```
hiresight/
├── flask-backend/              # Flask API backend
│   ├── app.py                 # Main Flask application
│   ├── config.py              # Configuration
│   ├── requirements.txt       # Python dependencies
│   ├── routes/                # API endpoints
│   │   ├── resume_routes.py
│   │   ├── job_routes.py
│   │   ├── application_routes.py
│   │   ├── interview_routes.py
│   │   └── analytics_routes.py
│   ├── services/              # Business logic
│   │   ├── resume_parser.py   # NLP parsing
│   │   ├── ai_engine.py       # AI/ML analysis
│   │   └── supabase_client.py # Database operations
│   └── scripts/
│       └── parse_resume_folder.py
│
├── app/                       # React Native (Expo) frontend
│   ├── (tabs)/               # Tab navigation
│   │   ├── index.tsx         # Home
│   │   ├── dashboard.tsx     # Dashboard
│   │   ├── explore.tsx       # Browse jobs
│   │   └── recruiter-search.tsx  # Resume search
│   ├── _layout.tsx           # Root layout
│   ├── login.tsx             # Login screen
│   └── register.tsx          # Registration
│
├── context/
│   └── AuthContext.tsx       # Authentication context
│
├── lib/
│   └── supabaseClient.ts     # Supabase client setup
│
├── resumes/                  # Sample resumes for testing
│   └── *.pdf, *.docx
│
├── .env                      # Environment variables
├── package.json              # Node dependencies
└── SETUP_GUIDE.md           # This file
```

---

## NEXT STEPS

1. ✅ Set up Supabase database
2. ✅ Install backend dependencies
3. ✅ Parse existing resumes
4. ✅ Start Flask backend
5. ✅ Start React frontend
6. ✅ Create recruiter account
7. ✅ Create candidate account
8. ✅ Test resume search with filters
9. ✅ Create job posting
10. ✅ Test AI-powered application matching
11. ✅ Review analytics dashboard

---

## SUPPORT

For issues or questions:
- Check the troubleshooting section
- Review Flask backend logs
- Check Supabase dashboard for data
- Verify API responses in browser console

---

## FEATURES CHECKLIST

### ✅ Module 1: User Management & Authentication
- [x] Candidate & Recruiter registration
- [x] Secure login/logout
- [x] Role-based dashboard redirection
- [x] Profile management
- [x] Session handling (JWT)

### ✅ Module 2: Resume Upload & Storage
- [x] Single resume upload
- [x] Bulk resume upload
- [x] File validation (PDF/DOCX)
- [x] Resume list view
- [x] Supabase Storage integration

### ✅ Module 3: Resume Parsing & Preprocessing
- [x] PDF/DOCX text extraction
- [x] Text cleaning and normalization
- [x] NLP preprocessing (tokenization, stopwords)
- [x] Skills detection
- [x] Experience extraction
- [x] Education extraction
- [x] Years of experience calculation

### ✅ Module 4: AI/ML Resume Analysis
- [x] Job description keyword extraction
- [x] TF-IDF vectorization
- [x] Sentence-BERT embeddings
- [x] Cosine similarity calculation
- [x] Match score generation (0-100%)
- [x] Suitability classification
- [x] Missing skills detection
- [x] Insight generation

### ✅ Module 5: Job Management & Shortlisting
- [x] Create/Edit/Delete job descriptions
- [x] View candidates per job
- [x] Rank by match score
- [x] Filter by score/skills
- [x] Status management

### ✅ Module 6: Analytics Dashboard
- [x] Match score distribution
- [x] Skill frequency charts
- [x] Missing skill trends
- [x] Job-wise analytics
- [x] Conversion funnel
- [x] Data export

### ✅ Module 7: Interview Scheduler
- [x] Schedule interviews
- [x] Add meeting links
- [x] Calendar view
- [x] Interview details view

---

**HireSight is now ready to use!** 🚀
