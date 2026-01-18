# HireSight Test Cases

## Comprehensive Test Suite

---

## 1. AUTHENTICATION TEST CASES

| Test ID | Test Case | Steps | Expected Result | Priority | Status |
|---------|-----------|-------|-----------------|----------|--------|
| AUTH-001 | User Registration - Candidate | 1. Navigate to /register<br>2. Enter name, email, password<br>3. Select "Candidate" role<br>4. Click Sign Up | Account created, redirected to candidate dashboard, profile created in DB | HIGH | ✅ |
| AUTH-002 | User Registration - Recruiter | 1. Navigate to /register<br>2. Enter name, email, password<br>3. Select "Recruiter" role<br>4. Click Sign Up | Account created, redirected to recruiter dashboard, profile created in DB | HIGH | ✅ |
| AUTH-003 | Duplicate Email Registration | 1. Register with existing email | Error: "Email already registered" displayed | HIGH | ✅ |
| AUTH-004 | Weak Password Validation | 1. Enter password < 6 characters<br>2. Click Sign Up | Error: "Password must be at least 6 characters" | MEDIUM | ✅ |
| AUTH-005 | Empty Fields Validation | 1. Leave fields empty<br>2. Click Sign Up | Error: "Please fill in all fields" | MEDIUM | ✅ |
| AUTH-006 | User Login - Valid Credentials | 1. Navigate to /login<br>2. Enter valid email/password<br>3. Click Sign In | Logged in, redirected to appropriate dashboard | HIGH | ✅ |
| AUTH-007 | User Login - Invalid Credentials | 1. Enter wrong password<br>2. Click Sign In | Error: "Invalid email or password" | HIGH | ✅ |
| AUTH-008 | User Logout | 1. Click logout button<br>2. Verify redirect | User logged out, redirected to /login, session cleared | HIGH | ✅ |
| AUTH-009 | Session Persistence | 1. Login<br>2. Close browser<br>3. Reopen | User still logged in (session persists) | MEDIUM | ✅ |
| AUTH-010 | Protected Route Access | 1. Logout<br>2. Try accessing /(tabs)/dashboard directly | Redirected to /login | HIGH | ✅ |

---

## 2. PROFILE MANAGEMENT TEST CASES

| Test ID | Test Case | Steps | Expected Result | Priority | Status |
|---------|-----------|-------|-----------------|----------|--------|
| PROF-001 | View Own Profile | 1. Login<br>2. Navigate to profile | Profile data displayed correctly | MEDIUM | ⏳ |
| PROF-002 | Update Profile Information | 1. Edit name, bio, location<br>2. Save changes | Profile updated in DB, changes reflected immediately | MEDIUM | ⏳ |
| PROF-003 | Upload Profile Picture | 1. Click avatar<br>2. Select image<br>3. Upload | Image uploaded to storage, avatar_url updated | LOW | ⏳ |
| PROF-004 | View Other User Profile (Recruiter) | 1. Login as recruiter<br>2. View candidate profile | Can view candidate details | MEDIUM | ⏳ |
| PROF-005 | Cannot Edit Other's Profile | 1. Try editing another user's profile via API | Error: Permission denied (RLS blocks) | HIGH | ✅ |

---

## 3. RESUME UPLOAD & PARSING TEST CASES

| Test ID | Test Case | Steps | Expected Result | Priority | Status |
|---------|-----------|-------|-----------------|----------|--------|
| RES-001 | Upload PDF Resume | 1. Login as candidate<br>2. Click Upload Resume<br>3. Select PDF file<br>4. Upload | File uploaded, status: "parsing" | HIGH | ✅ |
| RES-002 | Upload DOCX Resume | 1. Upload .docx file | File uploaded, status: "parsing" | HIGH | ✅ |
| RES-003 | Invalid File Type Rejection | 1. Try uploading .txt, .jpg, .exe | Error: "Only PDF and DOCX files allowed" | HIGH | ⏳ |
| RES-004 | Auto-Parse After Upload | 1. Upload resume<br>2. Wait 5-10 seconds | Status changes to "parsed", skills/experience extracted | HIGH | ⏳ |
| RES-005 | Skills Extraction Accuracy | 1. Upload resume with known skills (Python, Java, SQL)<br>2. Check parsed skills | Skills array contains: ["Python", "Java", "SQL"] | HIGH | ⏳ |
| RES-006 | Experience Extraction | 1. Upload resume with work history<br>2. Check experience field | Experience array populated with job titles/companies | HIGH | ⏳ |
| RES-007 | Education Extraction | 1. Upload resume with degrees<br>2. Check education field | Education array populated correctly | MEDIUM | ⏳ |
| RES-008 | Years of Experience Calculation | 1. Upload resume<br>2. Check years_of_experience | Correct calculation based on work history | MEDIUM | ⏳ |
| RES-009 | Email & Phone Extraction | 1. Upload resume with contact info | Email and phone fields populated | MEDIUM | ⏳ |
| RES-010 | View Uploaded Resumes | 1. Navigate to My Resumes<br>2. View list | All uploaded resumes displayed with metadata | HIGH | ⏳ |
| RES-011 | Delete Resume | 1. Click delete on resume<br>2. Confirm | Resume removed from DB and storage | MEDIUM | ⏳ |
| RES-012 | Cannot Delete Others' Resumes | 1. Try deleting another user's resume via API | Error: Permission denied (RLS blocks) | HIGH | ✅ |
| RES-013 | Bulk Upload (17 Existing Resumes) | 1. Run parse script<br>2. Check database | All 17 resumes parsed and stored in DB | HIGH | ⏳ |
| RES-014 | Parsed Resume Visible to Recruiters | 1. Candidate uploads resume<br>2. Recruiter searches | Resume appears in recruiter search results | HIGH | ⏳ |

---

## 4. JOB POSTING TEST CASES (Recruiter)

| Test ID | Test Case | Steps | Expected Result | Priority | Status |
|---------|-----------|-------|-----------------|----------|--------|
| JOB-001 | Create New Job Posting | 1. Login as recruiter<br>2. Click Create Job<br>3. Fill details<br>4. Publish | Job created with status "active" | HIGH | ⏳ |
| JOB-002 | Required Skills Input | 1. Add skills: Python, React, SQL | Skills stored as array in required_skills | HIGH | ⏳ |
| JOB-003 | View All Jobs | 1. Navigate to Jobs tab | All jobs displayed (active and closed) | MEDIUM | ⏳ |
| JOB-004 | Edit Existing Job | 1. Click edit on job<br>2. Modify fields<br>3. Save | Job updated in DB | MEDIUM | ⏳ |
| JOB-005 | Close Job Posting | 1. Change status to "closed" | Job no longer visible to candidates | MEDIUM | ⏳ |
| JOB-006 | Delete Job | 1. Delete job<br>2. Confirm | Job removed from DB | LOW | ⏳ |
| JOB-007 | Cannot Edit Others' Jobs | 1. Try editing another recruiter's job | Error: Permission denied (RLS blocks) | HIGH | ✅ |
| JOB-008 | Candidate View Active Jobs | 1. Login as candidate<br>2. View Jobs tab | Only active jobs visible | HIGH | ⏳ |

---

## 5. JOB APPLICATION TEST CASES

| Test ID | Test Case | Steps | Expected Result | Priority | Status |
|---------|-----------|-------|-----------------|----------|--------|
| APP-001 | Apply to Job | 1. Candidate views job<br>2. Selects resume<br>3. Click Apply | Application created in DB | HIGH | ⏳ |
| APP-002 | AI Match Score Generation | 1. Apply to job<br>2. Check application | match_score calculated (0-100) | HIGH | ⏳ |
| APP-003 | Matched Skills Identification | 1. Resume has Python, Java<br>2. Job requires Python, SQL<br>3. Apply | matched_skills: ["Python"], missing_skills: ["SQL"] | HIGH | ⏳ |
| APP-004 | Prevent Duplicate Applications | 1. Apply to same job twice | Error: "Already applied to this job" | MEDIUM | ⏳ |
| APP-005 | View My Applications (Candidate) | 1. Navigate to Applications tab | All applications displayed with status | HIGH | ⏳ |
| APP-006 | Application Status Tracking | 1. Check application | Status visible: under-review, shortlisted, etc. | MEDIUM | ⏳ |
| APP-007 | Recruiter View Applications | 1. Login as recruiter<br>2. View job<br>3. See applicants | All applications for job displayed | HIGH | ⏳ |
| APP-008 | Recruiter Update Application Status | 1. Change status to "shortlisted"<br>2. Add notes | Application updated with timestamp | HIGH | ⏳ |
| APP-009 | Cannot View Others' Applications | 1. Candidate tries viewing another's application | Error: Permission denied (RLS blocks) | HIGH | ✅ |
| APP-010 | Suitability Rating Display | 1. View application | Suitability shown: not-suitable, moderate, good, excellent | MEDIUM | ⏳ |

---

## 6. RESUME SEARCH TEST CASES (Recruiter)

| Test ID | Test Case | Steps | Expected Result | Priority | Status |
|---------|-----------|-------|-----------------|----------|--------|
| SRCH-001 | Search by Skills | 1. Enter skills: "Python, React"<br>2. Search | Resumes with matching skills displayed | HIGH | ⏳ |
| SRCH-002 | Search by Experience Range | 1. Set min: 3, max: 5 years<br>2. Search | Resumes with 3-5 years experience shown | HIGH | ⏳ |
| SRCH-003 | Combined Filters | 1. Skills: Python<br>2. Experience: 5+ years<br>3. Search | Resumes matching both criteria | HIGH | ⏳ |
| SRCH-004 | View Resume Details | 1. Click on resume in search results | Full resume details displayed | HIGH | ⏳ |
| SRCH-005 | Download Resume | 1. Click download button | PDF/DOCX file downloaded | MEDIUM | ⏳ |
| SRCH-006 | Search Includes New Uploads | 1. Candidate uploads new resume<br>2. Recruiter searches immediately | New resume appears in results | HIGH | ⏳ |
| SRCH-007 | Search Includes 17 Training Resumes | 1. Search with broad criteria | Training resumes visible in results | HIGH | ⏳ |
| SRCH-008 | Empty Search Results | 1. Search for rare skill (e.g., "COBOL")<br>2. No matches | Message: "No resumes found" | MEDIUM | ⏳ |
| SRCH-009 | Sort by Match Score | 1. Sort by relevance | Resumes sorted by best match first | MEDIUM | ⏳ |
| SRCH-010 | Save Search Filters | 1. Create complex filter<br>2. Save | Filter saved for future use | LOW | ⏳ |

---

## 7. INTERVIEW SCHEDULING TEST CASES

| Test ID | Test Case | Steps | Expected Result | Priority | Status |
|---------|-----------|-------|-----------------|----------|--------|
| INT-001 | Schedule Interview | 1. Recruiter selects application<br>2. Click Schedule Interview<br>3. Set date, time, platform<br>4. Save | Interview created, both parties notified | HIGH | ⏳ |
| INT-002 | Virtual Meeting Link | 1. Add Zoom/Teams link<br>2. Save | meeting_link stored | MEDIUM | ⏳ |
| INT-003 | View Upcoming Interviews (Candidate) | 1. Navigate to Interviews tab | All scheduled interviews displayed | HIGH | ⏳ |
| INT-004 | View Upcoming Interviews (Recruiter) | 1. View calendar | All interviews shown on calendar | HIGH | ⏳ |
| INT-005 | Reschedule Interview | 1. Edit interview<br>2. Change date/time<br>3. Save | Status: "rescheduled", updated timestamp | MEDIUM | ⏳ |
| INT-006 | Cancel Interview | 1. Cancel interview<br>2. Add reason | Status: "cancelled" | MEDIUM | ⏳ |
| INT-007 | Mark Interview Complete | 1. After interview<br>2. Update status to "completed" | Status updated | MEDIUM | ⏳ |
| INT-008 | Add Interview Notes | 1. Add notes after interview<br>2. Save | Notes stored in interviewer_notes | HIGH | ⏳ |
| INT-009 | Rate Candidate | 1. Set rating (1-5 stars)<br>2. Save | Rating stored | MEDIUM | ⏳ |
| INT-010 | Add Recommendation | 1. Select: hire/reject/reconsider<br>2. Save | Recommendation stored | HIGH | ⏳ |

---

## 8. DASHBOARD & ANALYTICS TEST CASES

| Test ID | Test Case | Steps | Expected Result | Priority | Status |
|---------|-----------|-------|-----------------|----------|--------|
| DASH-001 | Candidate Dashboard Overview | 1. Login as candidate<br>2. View dashboard | Shows: applications count, interviews scheduled, profile completion | MEDIUM | ⏳ |
| DASH-002 | Recruiter Dashboard Overview | 1. Login as recruiter<br>2. View dashboard | Shows: active jobs, applications received, interviews scheduled | MEDIUM | ⏳ |
| DASH-003 | Application Statistics | 1. View analytics | Charts showing application trends | LOW | ⏳ |
| DASH-004 | Top Skills Chart | 1. View skills analytics | Bar chart of most requested skills | LOW | ⏳ |
| DASH-005 | Interview Success Rate | 1. View metrics | Percentage of interviews leading to hires | LOW | ⏳ |

---

## 9. SECURITY & PERMISSIONS TEST CASES

| Test ID | Test Case | Steps | Expected Result | Priority | Status |
|---------|-----------|-------|-----------------|----------|--------|
| SEC-001 | RLS - Candidate Cannot View Others' Resumes | 1. API call to fetch another candidate's resume | Error 403: Forbidden | HIGH | ✅ |
| SEC-002 | RLS - Candidate Cannot Modify Jobs | 1. API call to update job | Error 403: Forbidden | HIGH | ✅ |
| SEC-003 | RLS - Recruiter Cannot Modify Resumes | 1. API call to update resume | Error 403: Forbidden | HIGH | ✅ |
| SEC-004 | SQL Injection Prevention | 1. Enter malicious SQL in search field | Input sanitized, no SQL executed | HIGH | ✅ |
| SEC-005 | XSS Prevention | 1. Enter `<script>` tag in inputs | Script tags escaped, not executed | HIGH | ✅ |
| SEC-006 | CORS Configuration | 1. API call from unauthorized origin | Request blocked | MEDIUM | ✅ |
| SEC-007 | JWT Token Validation | 1. Send request with invalid token | Error 401: Unauthorized | HIGH | ✅ |
| SEC-008 | Password Hashing | 1. Check database | Passwords stored as hashed values | HIGH | ✅ |

---

## 10. PERFORMANCE TEST CASES

| Test ID | Test Case | Steps | Expected Result | Priority | Status |
|---------|-----------|-------|-----------------|----------|--------|
| PERF-001 | Resume Upload Speed | 1. Upload 5MB resume | Upload completes < 5 seconds | MEDIUM | ⏳ |
| PERF-002 | Parse Speed | 1. Parse resume | Parsing completes < 10 seconds | MEDIUM | ⏳ |
| PERF-003 | Search Speed | 1. Search with filters | Results return < 2 seconds | MEDIUM | ⏳ |
| PERF-004 | Dashboard Load Time | 1. Open dashboard | Page loads < 3 seconds | LOW | ⏳ |
| PERF-005 | Concurrent Users | 1. Simulate 100 concurrent users | System remains responsive | LOW | ⏳ |

---

## 11. EDGE CASES & ERROR HANDLING

| Test ID | Test Case | Steps | Expected Result | Priority | Status |
|---------|-----------|-------|-----------------|----------|--------|
| EDGE-001 | Corrupted Resume File | 1. Upload corrupted PDF | Error: "Unable to parse resume" | MEDIUM | ⏳ |
| EDGE-002 | Resume with No Skills | 1. Upload simple text resume | Parsed with empty skills array | MEDIUM | ⏳ |
| EDGE-003 | Resume in Unusual Format | 1. Upload 2-column resume | Parsing attempts, extracts what's possible | MEDIUM | ⏳ |
| EDGE-004 | Very Large Resume (20+ pages) | 1. Upload large resume | Parses successfully or shows size warning | LOW | ⏳ |
| EDGE-005 | Network Failure During Upload | 1. Disconnect network mid-upload | Error message, retry option | MEDIUM | ⏳ |
| EDGE-006 | Database Connection Loss | 1. Simulate DB downtime | Graceful error message | LOW | ⏳ |

---

## TEST EXECUTION SUMMARY

### By Priority

| Priority | Total Tests | Passed | Failed | Pending | Pass Rate |
|----------|-------------|--------|--------|---------|-----------|
| HIGH | 52 | 15 | 0 | 37 | 28.8% |
| MEDIUM | 35 | 0 | 0 | 35 | 0% |
| LOW | 11 | 0 | 0 | 11 | 0% |
| **TOTAL** | **98** | **15** | **0** | **83** | **15.3%** |

### By Module

| Module | Total Tests | Status |
|--------|-------------|--------|
| Authentication | 10 | ✅ 100% Complete |
| Profile Management | 5 | ⏳ 0% Complete |
| Resume Upload & Parsing | 14 | ⏳ 14% Complete |
| Job Posting | 8 | ⏳ 12% Complete |
| Job Application | 10 | ⏳ 10% Complete |
| Resume Search | 10 | ⏳ 0% Complete |
| Interview Scheduling | 10 | ⏳ 0% Complete |
| Dashboard & Analytics | 5 | ⏳ 0% Complete |
| Security & Permissions | 8 | ✅ 100% Complete |
| Performance | 5 | ⏳ 0% Complete |
| Edge Cases | 6 | ⏳ 0% Complete |

---

## TESTING NOTES

### Automated vs Manual Testing
- **Automated**: AUTH, SEC tests (via Jest/Supertest)
- **Manual**: UI/UX tests, upload flows
- **End-to-End**: Complete user flows (Cypress/Playwright)

### Test Data
- Use dedicated test users: `test.candidate@hiresight.com`, `test.recruiter@hiresight.com`
- Sample resumes in `/resumes` folder (17 files)
- Test job postings with various skill requirements

### Regression Testing
Run full suite before each deployment to production.

