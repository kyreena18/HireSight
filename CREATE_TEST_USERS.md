# Creating Test Users for HireSight

This guide helps you create test accounts to explore all features of HireSight.

## Quick Test Accounts

### Option 1: Use the Registration UI

1. **Start the application:**
   ```bash
   # Terminal 1 - Backend
   cd flask-backend
   python app.py

   # Terminal 2 - Frontend
   npm start
   # Press 'w' for web
   ```

2. **Create Recruiter Account:**
   - Go to `http://localhost:8081`
   - Click "Sign Up"
   - Enter:
     - **Name:** John Recruiter
     - **Email:** recruiter@hiresight.com
     - **Password:** recruiter123
     - **Role:** Select "Recruiter"
   - Click "Sign Up"

3. **Create Candidate Account:**
   - Logout (if logged in)
   - Click "Sign Up"
   - Enter:
     - **Name:** Jane Candidate
     - **Email:** candidate@hiresight.com
     - **Password:** candidate123
     - **Role:** Select "Candidate"
   - Click "Sign Up"

## Option 2: Using Supabase Dashboard

1. **Go to your Supabase project**
2. **Click on "Authentication" in sidebar**
3. **Click "Add user" button**
4. **Create users manually:**

### Recruiter Account
```
Email: recruiter@hiresight.com
Password: recruiter123
```

Then in SQL Editor, run:
```sql
UPDATE public.profiles
SET role = 'recruiter',
    name = 'John Recruiter'
WHERE email = 'recruiter@hiresight.com';
```

### Candidate Account
```
Email: candidate@hiresight.com
Password: candidate123
```

Then in SQL Editor, run:
```sql
UPDATE public.profiles
SET role = 'candidate',
    name = 'Jane Candidate'
WHERE email = 'candidate@hiresight.com';
```

## Test Scenarios

### As Recruiter (recruiter@hiresight.com)

1. **Search Resumes:**
   - Login as recruiter
   - Go to "Search" tab
   - Try filters:
     - Search: "python"
     - Skills: "python, machine learning"
     - Min Experience: "3"

2. **Create a Job:**
   - Go to "Dashboard"
   - Create new job:
     ```
     Title: Senior Data Scientist
     Company: TechCorp Inc
     Description: Looking for an experienced data scientist...
     Requirements: 5+ years in ML/AI, Python, TensorFlow
     Required Skills: python, machine learning, tensorflow, nlp
     Min Experience: 5
     ```

3. **View Applications:**
   - Once candidates apply, view match scores
   - See AI-generated insights
   - Shortlist candidates

4. **Schedule Interview:**
   - Select a shortlisted candidate
   - Schedule interview with meeting link

5. **View Analytics:**
   - Check dashboard statistics
   - View skill frequency
   - Export data

### As Candidate (candidate@hiresight.com)

1. **Upload Resume:**
   - Login as candidate
   - Upload a PDF or DOCX resume
   - View parsed skills and experience

2. **Browse Jobs:**
   - Go to "Explore" or "Jobs"
   - See active job postings

3. **Apply to Job:**
   - Select a job
   - Apply with your resume
   - View your match score
   - See insights on skill gaps

4. **Track Applications:**
   - Go to "My Applications"
   - Monitor application status

5. **View Interviews:**
   - Check scheduled interviews
   - Get meeting links

## Multiple Test Users

You can create additional test accounts for different scenarios:

### Recruiter 2
```
Name: Sarah HR Manager
Email: sarah@hiresight.com
Password: sarah123
Role: Recruiter
```

### Candidate 2
```
Name: Mike Developer
Email: mike@hiresight.com
Password: mike123
Role: Candidate
```

### Candidate 3
```
Name: Lisa Engineer
Email: lisa@hiresight.com
Password: lisa123
Role: Candidate
```

## Testing Workflow

### Complete Recruitment Flow

1. **Setup Phase:**
   - ✅ Parse sample resumes (17 resumes in /resumes folder)
   - ✅ Create recruiter account
   - ✅ Create candidate accounts

2. **Recruiter Actions:**
   - ✅ Login as recruiter
   - ✅ Search resumes with filters
   - ✅ Create job posting
   - ✅ View parsed candidate data

3. **Candidate Actions:**
   - ✅ Login as candidate
   - ✅ Upload resume
   - ✅ View parsed resume data
   - ✅ Browse jobs
   - ✅ Apply to job

4. **AI Analysis:**
   - ✅ System calculates match score
   - ✅ Generates insights
   - ✅ Identifies skill gaps

5. **Shortlisting:**
   - ✅ Recruiter views applications
   - ✅ Reviews match scores
   - ✅ Updates application status

6. **Interview:**
   - ✅ Recruiter schedules interview
   - ✅ Candidate views interview details

7. **Analytics:**
   - ✅ Recruiter views dashboard
   - ✅ Analyzes skill trends
   - ✅ Exports data

## Troubleshooting

### Can't login after registration
- **Check:** Email confirmation might be enabled in Supabase
- **Solution:** Disable email confirmation in Supabase Authentication settings
  - Go to Authentication > Settings
  - Disable "Enable email confirmations"

### Role not set correctly
- **Check:** Profile table in Supabase
- **Solution:** Update role manually:
  ```sql
  UPDATE public.profiles
  SET role = 'recruiter'
  WHERE email = 'your-email@example.com';
  ```

### Can't see resumes as recruiter
- **Check:** RLS policies are enabled
- **Solution:** Verify policies in Supabase
  - Go to Database > Policies
  - Check "Recruiters can view all resumes" policy exists

## Default Credentials (for demo)

```
Recruiter:
  Email: recruiter@hiresight.com
  Password: recruiter123

Candidate:
  Email: candidate@hiresight.com
  Password: candidate123
```

**Remember to change these in production!**

## Next Steps

After creating test users:

1. ✅ Parse sample resumes
2. ✅ Login as recruiter
3. ✅ Test resume search
4. ✅ Create job posting
5. ✅ Login as candidate
6. ✅ Apply to job
7. ✅ View AI match analysis
8. ✅ Schedule interview
9. ✅ Review analytics

---

**Happy Testing! 🚀**
