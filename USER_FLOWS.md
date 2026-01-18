# HireSight User Flows

## Complete User Journey Documentation

---

## CANDIDATE FLOW

### 1. ONBOARDING FLOW

```
┌─────────────────────────────────────────────────────────────┐
│                    CANDIDATE JOURNEY                         │
└─────────────────────────────────────────────────────────────┘

START
  │
  ├─→ [Visit HireSight] → http://localhost:8081
  │
  ├─→ [See Login Page]
  │   └─→ No account? → Click "Sign Up"
  │
  ├─→ [Registration Page] /register
  │   ├─→ Enter Full Name: "John Candidate"
  │   ├─→ Enter Email: "john@example.com"
  │   ├─→ Enter Password: "securepass123"
  │   ├─→ Select Role: Click "Candidate" button
  │   └─→ Click "Sign Up"
  │
  ├─→ [Account Created]
  │   ├─→ Profile created in database
  │   ├─→ Auth token generated
  │   └─→ Session stored
  │
  └─→ [Auto Redirect] → /(tabs)/dashboard
      │
      └─→ ✅ LOGGED IN AS CANDIDATE
```

**What Happens Behind the Scenes:**
1. Supabase creates auth.users record
2. Profile trigger creates profiles record with role='candidate'
3. JWT token issued and stored
4. User redirected to candidate dashboard

---

### 2. DASHBOARD VIEW (Candidate)

```
┌─────────────────────────────────────────────────────────────┐
│                  CANDIDATE DASHBOARD                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Welcome back, John!                                         │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Resumes     │  │ Applications │  │  Interviews  │      │
│  │              │  │              │  │              │      │
│  │      2       │  │      5       │  │      1       │      │
│  │  Uploaded    │  │  Submitted   │  │  Scheduled   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                              │
│  Recent Activity:                                            │
│  • Applied to "Senior Developer" at TechCorp                │
│  • Interview scheduled for Jan 25                           │
│  • Resume parsed successfully                               │
│                                                              │
│  Profile Completion: ████████░░ 80%                         │
│                                                              │
└─────────────────────────────────────────────────────────────┘

BOTTOM TABS:
┌─────────┬─────────┬─────────┐
│ 🏠 Home │ 💼 Jobs │ 📊 Dash │
└─────────┴─────────┴─────────┘
```

**Available Actions:**
- View statistics
- Quick access to recent applications
- See upcoming interviews
- Check profile completion

---

### 3. RESUME UPLOAD FLOW

```
[Home Tab] → Click "Upload Resume"
  │
  ├─→ [File Picker Opens]
  │   └─→ Select resume.pdf or resume.docx
  │
  ├─→ [File Selected]
  │   ├─→ Show preview: "resume.pdf (245 KB)"
  │   └─→ Click "Upload"
  │
  ├─→ [Upload Process]
  │   ├─→ Progress bar: ████████░░ 80%
  │   ├─→ File uploaded to Supabase Storage
  │   └─→ Database record created (status: 'parsing')
  │
  ├─→ [Auto-Parse Triggered] 🤖
  │   ├─→ Backend receives webhook/trigger
  │   ├─→ AI parser extracts:
  │   │   • Skills: ["Python", "React", "SQL", "AWS"]
  │   │   • Experience: ["Senior Dev at XYZ Corp (3 years)"]
  │   │   • Education: ["BS Computer Science - MIT"]
  │   │   • Years: 5 years
  │   │   • Email: john@example.com
  │   │   • Phone: +1-555-1234
  │   └─→ Duration: ~8 seconds
  │
  ├─→ [Parsing Complete]
  │   ├─→ Status updated: 'parsed'
  │   ├─→ Success notification shown
  │   └─→ Resume now SEARCHABLE by recruiters
  │
  └─→ [View Parsed Resume]
      ├─→ See extracted skills
      ├─→ See experience breakdown
      ├─→ Download original file
      └─→ Edit/Delete options
```

**Database Flow:**
```sql
-- Step 1: Upload
INSERT INTO resumes (user_id, file_name, file_url, status)
VALUES ('uuid', 'resume.pdf', 'storage/url', 'parsing');

-- Step 2: Parse (Backend)
UPDATE resumes SET
  status = 'parsed',
  skills = ARRAY['Python', 'React', 'SQL'],
  experience = ARRAY['Senior Dev at XYZ Corp'],
  years_of_experience = 5,
  email = 'john@example.com',
  parsed_data = '{"raw_text": "...", "entities": {...}}'
WHERE id = 'resume_id';
```

**IMPORTANT:** Resume is now visible to ALL recruiters in search!

---

### 4. JOB BROWSING FLOW

```
[Jobs Tab] → Browse Available Jobs
  │
  ├─→ [Job List View]
  │   │
  │   ├─→ 📌 Senior Python Developer
  │   │   TechCorp • Remote • $120k-$150k
  │   │   Skills: Python, Django, AWS
  │   │   Posted 2 days ago
  │   │
  │   ├─→ 📌 React Frontend Engineer
  │   │   StartupXYZ • San Francisco • $100k-$130k
  │   │   Skills: React, TypeScript, GraphQL
  │   │   Posted 1 week ago
  │   │
  │   └─→ 📌 Full Stack Developer
  │       MegaCorp • New York • $110k-$140k
  │       Skills: Node.js, React, MongoDB
  │       Posted 3 days ago
  │
  ├─→ [Click on Job] → View Details
  │   │
  │   ├─→ Full job description
  │   ├─→ Requirements
  │   ├─→ Company info
  │   ├─→ YOUR MATCH: 85% 🎯
  │   │   ✅ Matched Skills: Python, AWS
  │   │   ⚠️ Missing Skills: Django
  │   │
  │   └─→ [Apply Button]
  │
  └─→ [Click Apply]
      │
      ├─→ Select Resume (if multiple)
      │   • resume_v1.pdf ⭐ (Latest)
      │   • old_resume.docx
      │
      ├─→ Click "Submit Application"
      │
      ├─→ [AI Matching Process] 🤖
      │   ├─→ Compare resume skills vs job requirements
      │   ├─→ Calculate match score: 85/100
      │   ├─→ Identify matched skills
      │   ├─→ Identify missing skills
      │   └─→ Generate insights
      │
      ├─→ [Application Created]
      │   └─→ Status: "under-review"
      │
      └─→ ✅ Success! Application submitted
          "You'll be notified when the recruiter reviews your application"
```

**Application Record Created:**
```json
{
  "id": "app_uuid",
  "resume_id": "resume_uuid",
  "job_id": "job_uuid",
  "candidate_id": "user_uuid",
  "match_score": 85,
  "suitability": "good",
  "matched_skills": ["Python", "AWS", "React"],
  "missing_skills": ["Django"],
  "status": "under-review",
  "applied_at": "2026-01-18T10:30:00Z"
}
```

---

### 5. TRACKING APPLICATIONS

```
[Home Tab] → My Applications
  │
  └─→ [Applications List]
      │
      ├─→ ⏳ Senior Python Developer @ TechCorp
      │   Status: Under Review
      │   Match: 85%
      │   Applied: 2 days ago
      │
      ├─→ ⭐ React Engineer @ StartupXYZ
      │   Status: Shortlisted
      │   Match: 92%
      │   Applied: 1 week ago
      │   → Interview scheduled for Jan 25
      │
      ├─→ ❌ Full Stack Dev @ MegaCorp
      │   Status: Rejected
      │   Match: 65%
      │   Applied: 2 weeks ago
      │   Reason: "Looking for more Django experience"
      │
      └─→ [Click on Application] → View Details
          ├─→ Timeline of status changes
          ├─→ Recruiter notes (if shared)
          ├─→ Interview details (if scheduled)
          └─→ Withdraw application option
```

**Status Progression:**
```
under-review → shortlisted → interview-scheduled → offered → hired
            ↓
         rejected
```

---

### 6. INTERVIEW FLOW

```
[Notification] → "Interview Scheduled!"
  │
  ├─→ [Interviews Tab]
  │   │
  │   └─→ 📅 Upcoming Interview
  │       │
  │       ├─→ Position: Senior Python Developer
  │       ├─→ Company: TechCorp
  │       ├─→ Date: Jan 25, 2026
  │       ├─→ Time: 2:00 PM (60 minutes)
  │       ├─→ Type: Technical Interview
  │       ├─→ Platform: Zoom
  │       ├─→ Link: [Join Meeting]
  │       └─→ Interviewer: Sarah Recruiter
  │
  ├─→ [Day of Interview]
  │   └─→ Click "Join Meeting" → Opens Zoom link
  │
  ├─→ [After Interview]
  │   ├─→ Status updated to "completed"
  │   └─→ Wait for recruiter decision
  │
  └─→ [Outcome Notification]
      ├─→ ✅ "Congratulations! Moving to next round"
      │   or
      └─→ ❌ "Thank you for your time..."
```

---

## RECRUITER FLOW

### 1. RECRUITER ONBOARDING

```
START
  │
  ├─→ [Visit HireSight]
  │
  ├─→ [Registration] /register
  │   ├─→ Enter Name: "Sarah Recruiter"
  │   ├─→ Enter Email: "sarah@techcorp.com"
  │   ├─→ Enter Password: "recruiterpass123"
  │   ├─→ Select Role: Click "Recruiter" button ⭐
  │   └─→ Click "Sign Up"
  │
  └─→ [Auto Redirect] → /(tabs)/dashboard
      │
      └─→ ✅ LOGGED IN AS RECRUITER
```

**Recruiter Dashboard Tabs:**
```
┌──────────┬──────────┬──────────┬──────────┐
│ 📊 Dash  │ 🏠 Home  │ 💼 Jobs  │ 🔍Search│ ⭐ EXTRA TAB
└──────────┴──────────┴──────────┴──────────┘
```

---

### 2. RECRUITER DASHBOARD

```
┌─────────────────────────────────────────────────────────────┐
│                  RECRUITER DASHBOARD                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Welcome back, Sarah!                                        │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Active Jobs  │  │ Applications │  │  Interviews  │      │
│  │              │  │              │  │              │      │
│  │      8       │  │     45       │  │      6       │      │
│  │  Posted      │  │  Received    │  │  Scheduled   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                              │
│  Top Performing Jobs:                                        │
│  • Senior Python Developer - 15 applications                │
│  • React Engineer - 12 applications                         │
│  • Full Stack Developer - 18 applications                   │
│                                                              │
│  Recent Activity:                                            │
│  • New application from John Candidate (Match: 85%)         │
│  • Interview completed for Jane Doe                         │
│  • New job posted: "DevOps Engineer"                        │
│                                                              │
│  📊 Analytics:                                              │
│  • Application Rate: +15% this week                         │
│  • Average Match Score: 78%                                 │
│  • Top Skill Demand: Python (45%), React (38%)             │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

### 3. JOB POSTING FLOW

```
[Jobs Tab] → Click "Create New Job"
  │
  ├─→ [Job Creation Form]
  │   │
  │   ├─→ Job Title: "Senior Python Developer"
  │   ├─→ Company: "TechCorp"
  │   ├─→ Location: "Remote"
  │   ├─→ Job Type: "Full-time"
  │   ├─→ Salary Range: "$120,000 - $150,000"
  │   │
  │   ├─→ Description:
  │   │   "We're looking for an experienced Python developer..."
  │   │
  │   ├─→ Requirements:
  │   │   "• 5+ years Python experience
  │   │    • Django framework expertise
  │   │    • AWS cloud knowledge..."
  │   │
  │   ├─→ Required Skills:
  │   │   Add: "Python" ✅
  │   │   Add: "Django" ✅
  │   │   Add: "AWS" ✅
  │   │   Add: "PostgreSQL" ✅
  │   │
  │   ├─→ Preferred Skills:
  │   │   Add: "Docker" ✅
  │   │   Add: "Kubernetes" ✅
  │   │
  │   ├─→ Experience: Min: 5 years, Max: 10 years
  │   │
  │   └─→ Education: "Bachelor's Degree in CS or related"
  │
  ├─→ [Preview Job Posting]
  │   └─→ Review all details
  │
  ├─→ Click "Publish Job"
  │   │
  │   ├─→ Job saved to database
  │   ├─→ Status: "active"
  │   └─→ NOW VISIBLE TO ALL CANDIDATES
  │
  └─→ ✅ Job Posted Successfully!
```

**Database Record:**
```sql
INSERT INTO job_descriptions (
  recruiter_id, title, company, description, requirements,
  required_skills, preferred_skills, min_experience, job_type, status
) VALUES (
  'recruiter_uuid', 'Senior Python Developer', 'TechCorp',
  'Description...', 'Requirements...',
  ARRAY['Python', 'Django', 'AWS', 'PostgreSQL'],
  ARRAY['Docker', 'Kubernetes'],
  5, 'full-time', 'active'
);
```

---

### 4. RESUME SEARCH FLOW ⭐ KEY FEATURE

```
[Search Tab] → AI-Powered Resume Search
  │
  ├─→ [Search Interface]
  │   │
  │   ├─→ Search by Skills:
  │   │   Input: "Python, Django, AWS"
  │   │   [Add Skill +]
  │   │
  │   ├─→ Experience Range:
  │   │   Min: [ 3 ] years
  │   │   Max: [ 7 ] years
  │   │
  │   ├─→ Education Level:
  │   │   ☐ Bachelor's
  │   │   ☐ Master's
  │   │   ☐ PhD
  │   │
  │   └─→ [Search Button] 🔍
  │
  ├─→ [Backend Search Query]
  │   │
  │   └─→ SQL Query:
  │       SELECT * FROM resumes
  │       WHERE status = 'parsed'
  │         AND skills && ARRAY['Python', 'Django', 'AWS']
  │         AND years_of_experience BETWEEN 3 AND 7
  │       ORDER BY (
  │         -- Match score calculation
  │         array_length(skills & ARRAY['Python','Django','AWS'], 1)
  │       ) DESC;
  │
  ├─→ [Search Results] 📊
  │   │
  │   ├─→ Found 23 matching resumes
  │   │
  │   ├─→ ⭐ John Candidate (Match: 95%)
  │   │   Skills: Python, Django, AWS, React, SQL
  │   │   Experience: 5 years
  │   │   Education: BS Computer Science - MIT
  │   │   Last Updated: 2 days ago
  │   │   [View] [Download] [Contact]
  │   │
  │   ├─→ ⭐ Jane Developer (Match: 88%)
  │   │   Skills: Python, Django, PostgreSQL, Docker
  │   │   Experience: 6 years
  │   │   Education: MS Software Engineering
  │   │   Last Updated: 1 week ago
  │   │   [View] [Download] [Contact]
  │   │
  │   └─→ ... (21 more results)
  │
  └─→ [Click on Resume] → View Full Details
      │
      ├─→ 📄 Complete Resume View
      │   ├─→ Extracted Information
      │   ├─→ Skills Breakdown
      │   ├─→ Experience Timeline
      │   ├─→ Education History
      │   └─→ Contact Information
      │
      └─→ Actions:
          ├─→ Download Resume (PDF/DOCX)
          ├─→ Send to Job Match
          ├─→ Schedule Interview
          └─→ Add Notes
```

**CRITICAL: Search includes:**
1. ✅ 17 training resumes (parsed from /resumes folder)
2. ✅ All new candidate uploads (auto-parsed)
3. ✅ Real-time updates (new uploads appear immediately)

---

### 5. APPLICATION REVIEW FLOW

```
[Jobs Tab] → Click on Job → View Applications
  │
  ├─→ [Application List for Job]
  │   │
  │   ├─→ Filters:
  │   │   ☐ All (45)
  │   │   ☐ Under Review (30)
  │   │   ☐ Shortlisted (10)
  │   │   ☐ Rejected (5)
  │   │
  │   └─→ Sort by:
  │       • Match Score (Highest First) ⬇️
  │       • Date Applied
  │       • Name (A-Z)
  │
  ├─→ [Application Card]
  │   │
  │   ├─→ 🟢 John Candidate
  │   │   Match Score: 85% ⭐
  │   │   Suitability: Good
  │   │   Applied: 2 days ago
  │   │
  │   │   ✅ Matched Skills: Python, AWS, React
  │   │   ⚠️ Missing Skills: Django
  │   │
  │   │   5 years experience | BS Computer Science
  │   │
  │   │   Status: [Under Review ▼]
  │   │   └─→ Options:
  │   │       • Shortlist
  │   │       • Schedule Interview
  │   │       • Reject
  │   │
  │   └─→ [View Full Application]
  │
  ├─→ [Click on Application] → Detailed View
  │   │
  │   ├─→ Candidate Profile
  │   ├─→ Resume (View/Download)
  │   ├─→ AI Insights:
  │   │   • "Strong Python background"
  │   │   • "Experience with AWS cloud services"
  │   │   • "Needs Django training"
  │   │
  │   ├─→ Application Timeline
  │   └─→ Action Buttons
  │
  └─→ [Take Action]
      │
      ├─→ [Shortlist]
      │   ├─→ Change status to "shortlisted"
      │   ├─→ Add note: "Good candidate, moving forward"
      │   └─→ ✅ Candidate notified
      │
      ├─→ [Schedule Interview]
      │   ├─→ Select date: Jan 25, 2026
      │   ├─→ Select time: 2:00 PM
      │   ├─→ Duration: 60 minutes
      │   ├─→ Type: Technical Interview
      │   ├─→ Platform: Zoom
      │   ├─→ Add meeting link
      │   ├─→ Click "Schedule"
      │   └─→ ✅ Interview created, candidate notified
      │
      └─→ [Reject]
          ├─→ Add feedback (optional)
          ├─→ Click "Reject Application"
          └─→ ✅ Status updated, candidate notified
```

**Status Update Flow:**
```
Database Update:
UPDATE applications SET
  status = 'shortlisted',
  reviewed_at = NOW(),
  reviewed_by = 'recruiter_uuid',
  notes = 'Good candidate, moving forward'
WHERE id = 'application_uuid';
```

---

### 6. INTERVIEW MANAGEMENT

```
[Dashboard] → Interviews Section
  │
  ├─→ [Calendar View]
  │   │
  │   ├─→ Jan 25, 2026
  │   │   • 10:00 AM - Jane Doe (Technical)
  │   │   • 2:00 PM - John Candidate (Technical)
  │   │   • 4:00 PM - Bob Smith (HR)
  │   │
  │   └─→ Jan 26, 2026
  │       • 11:00 AM - Alice Johnson (Final)
  │
  ├─→ [Click on Interview] → Details
  │   │
  │   ├─→ Candidate: John Candidate
  │   ├─→ Position: Senior Python Developer
  │   ├─→ Date/Time: Jan 25, 2:00 PM
  │   ├─→ Duration: 60 minutes
  │   ├─→ Meeting Link: [Join Zoom]
  │   ├─→ Type: Technical Interview
  │   │
  │   └─→ Actions:
  │       • [Reschedule]
  │       • [Cancel]
  │       • [Add to Calendar]
  │
  ├─→ [After Interview] → Add Feedback
  │   │
  │   ├─→ Mark as Completed
  │   │
  │   ├─→ Rating: ⭐⭐⭐⭐☆ (4/5)
  │   │
  │   ├─→ Notes:
  │   │   "Strong technical skills, good communication.
  │   │    Solid understanding of Python and Django.
  │   │    Recommend for next round."
  │   │
  │   ├─→ Recommendation:
  │   │   ○ Reject
  │   │   ● Move to Next Round ✅
  │   │   ○ Offer Position
  │   │
  │   └─→ [Save Feedback]
  │
  └─→ [Update Application]
      ├─→ Status → "interview-completed"
      ├─→ Next steps triggered
      └─→ Candidate notified
```

---

## KEY FLOWS COMPARISON

### Candidate vs Recruiter Navigation

| Feature | Candidate Access | Recruiter Access |
|---------|------------------|------------------|
| Dashboard | ✅ View stats | ✅ View stats & analytics |
| Home/Index | ✅ Upload resumes | ✅ Manage jobs |
| Jobs | ✅ Browse & apply | ✅ Create & manage |
| Search Tab | ❌ NOT VISIBLE | ✅ Search resumes |
| Applications | ✅ View own | ✅ View for their jobs |
| Interviews | ✅ View own | ✅ Manage all |
| Profiles | ✅ Edit own | ✅ View candidates |

---

## COMPLETE DATA FLOW: Resume to Hire

```
1. CANDIDATE UPLOADS RESUME
   │
   ├─→ File stored in Supabase Storage
   ├─→ Database record created (status: parsing)
   └─→ Parse triggered automatically

2. AI PARSING (Backend) 🤖
   │
   ├─→ Extract text from PDF/DOCX
   ├─→ NLP processing
   ├─→ Entity extraction (skills, experience, etc.)
   └─→ Database updated (status: parsed)

3. RESUME NOW SEARCHABLE
   │
   └─→ Appears in recruiter searches instantly

4. RECRUITER SEARCHES
   │
   ├─→ Enters: "Python, Django, 5+ years"
   ├─→ Query matches against ALL resumes:
   │   • 17 training resumes ✅
   │   • All candidate uploads ✅
   └─→ Results sorted by match score

5. RECRUITER FINDS MATCH
   │
   ├─→ Views candidate resume
   ├─→ See high match score (85%)
   └─→ Sends to job matching

6. CANDIDATE APPLIES TO JOB
   │
   ├─→ Or recruiter invites candidate
   ├─→ Application created
   └─→ AI calculates match score

7. RECRUITER REVIEWS
   │
   ├─→ Views application with AI insights
   ├─→ Shortlists candidate
   └─→ Schedules interview

8. INTERVIEW PROCESS
   │
   ├─→ Interview scheduled
   ├─→ Both parties notified
   ├─→ Interview occurs
   └─→ Feedback recorded

9. HIRING DECISION
   │
   ├─→ Offer extended
   ├─→ Candidate accepts
   └─→ Status: "hired" 🎉
```

---

## BUTTON FLOWS

### Login Page Buttons
```
[Sign In] → Validates credentials → Redirects to dashboard
[Sign Up Link] → Navigates to /register
```

### Register Page Buttons
```
[Candidate] → Sets role='candidate' → Highlights button
[Recruiter] → Sets role='recruiter' → Highlights button
[Sign Up] → Creates account → Redirects to dashboard
[Sign In Link] → Navigates to /login
```

### Dashboard Buttons (Candidate)
```
[Upload Resume] → Opens file picker
[View Application] → Shows application details
[Join Interview] → Opens meeting link
```

### Dashboard Buttons (Recruiter)
```
[Create Job] → Opens job form
[Search Resumes] → Navigate to search tab
[View Applications] → Shows application list
[Schedule Interview] → Opens interview form
```

### Application Buttons (Recruiter)
```
[Shortlist] → Updates status to 'shortlisted'
[Reject] → Updates status to 'rejected'
[Schedule Interview] → Creates interview record
[Add Notes] → Opens notes editor
```

---

## ERROR STATES & EDGE CASES

### Login Errors
- Wrong password → "Invalid credentials"
- No account → "Email not found"
- Network error → "Connection failed, try again"

### Upload Errors
- Invalid file → "Only PDF/DOCX allowed"
- File too large → "Maximum file size: 10MB"
- Parse failure → Status remains 'parsing' with error

### Application Errors
- Duplicate application → "Already applied"
- Job closed → "This position is no longer accepting applications"

### Search Errors
- No results → "No resumes match your criteria"
- Invalid filters → "Please enter valid experience range"

---

## NOTIFICATION TRIGGERS

### Candidate Notifications
- Resume parsed successfully
- Application status changed
- Interview scheduled
- Interview reminder (1 hour before)
- Offer received

### Recruiter Notifications
- New application received
- Interview coming up
- Candidate withdrew application
- Resume matching saved search

---

This completes the comprehensive user flow documentation! 🎉
