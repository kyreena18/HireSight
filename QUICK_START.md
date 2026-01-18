# 🚀 HireSight - Quick Start Guide

## ⚡ 60-Second Setup

### Step 1: Install Backend Dependencies (30 seconds)
```bash
cd flask-backend
pip install -r requirements.txt
python -c "import nltk; nltk.download('punkt'); nltk.download('stopwords'); nltk.download('wordnet')"
python -m spacy download en_core_web_sm
```

### Step 2: Install Frontend Dependencies (20 seconds)
```bash
cd ..
npm install
```

### Step 3: Verify Setup (10 seconds)
```bash
cd flask-backend
python verify_setup.py
```

---

## ▶️ Run the Application

### Terminal 1: Backend
```bash
cd flask-backend
python app.py
```
✅ Backend running on http://localhost:5000

### Terminal 2: Frontend
```bash
npm start
# Press 'w' for web browser
```
✅ Frontend running on http://localhost:8081

---

## 👤 Create Test Accounts

### Register as Recruiter:
1. Open http://localhost:8081
2. Click "Sign Up"
3. Enter:
   - Name: **John Recruiter**
   - Email: **recruiter@hiresight.com**
   - Password: **recruiter123**
   - Role: **Recruiter**

### Register as Candidate:
1. Click "Sign Up"
2. Enter:
   - Name: **Jane Candidate**
   - Email: **candidate@hiresight.com**
   - Password: **candidate123**
   - Role: **Candidate**

---

## 📄 Parse Sample Resumes

```bash
cd flask-backend
python scripts/parse_resume_folder.py
```

This will process 17 resumes from the `/resumes` folder and extract:
- Skills (Python, React, AWS, etc.)
- Years of experience
- Education
- Contact info

---

## 🎯 Quick Test Workflow

### As Recruiter:
1. Login → Go to **"Search"** tab
2. Filter by:
   - **Skills:** `python, machine learning`
   - **Min Experience:** `3`
3. View parsed resumes with skills and experience

### As Candidate:
1. Login → **Upload Resume** (PDF/DOCX)
2. View parsed skills automatically
3. Browse **Jobs** → **Apply**
4. See your **AI match score** (0-100%)
5. View **insights** and skill gaps

---

## 📊 Key Features to Test

| Feature | How to Access | What You'll See |
|---------|---------------|-----------------|
| **AI Resume Search** | Recruiter → Search tab | Filter resumes by skills, experience |
| **Resume Parsing** | Candidate → Upload Resume | Auto-extracted skills & experience |
| **Job Matching** | Candidate → Apply to Job | AI match score (0-100%) |
| **Analytics** | Recruiter → Dashboard | Match scores, skill trends |
| **Interview Scheduling** | Recruiter → Schedule Interview | Calendar view, meeting links |

---

## 🔧 Troubleshooting

### Backend won't start
```bash
pip install -r requirements.txt
python -c "import nltk; nltk.download('punkt'); nltk.download('stopwords'); nltk.download('wordnet')"
python -m spacy download en_core_web_sm
```

### Frontend won't connect
- Check backend is running on port 5000
- Check `.env` has correct Supabase credentials

### Can't see resumes as recruiter
Run SQL in Supabase:
```sql
UPDATE public.profiles
SET role = 'recruiter'
WHERE email = 'your-email@example.com';
```

---

## 📚 Full Documentation

- **SETUP_GUIDE.md** - Comprehensive setup instructions
- **README_HIRESIGHT.md** - Project overview and features
- **CREATE_TEST_USERS.md** - Testing guide
- **PROJECT_SUMMARY.md** - Complete project breakdown

---

## 🎓 What You Built

✅ **Full-Stack Application**
- React (Expo Web) frontend
- Flask REST API backend
- Supabase PostgreSQL database

✅ **AI/ML Features**
- NLP resume parsing
- Sentence-BERT semantic analysis
- TF-IDF keyword matching
- 0-100% match scores

✅ **Core Modules**
1. User authentication (Candidate/Recruiter)
2. Resume upload & parsing
3. AI-powered job matching
4. Interview scheduling
5. Analytics dashboard
6. Advanced search

---

## 🔑 API Endpoints (Quick Reference)

```bash
# Health Check
GET http://localhost:5000/api/health

# Resume Upload
POST http://localhost:5000/api/resumes/upload

# Job Application with AI Analysis
POST http://localhost:5000/api/applications/apply

# Search Resumes
GET http://localhost:5000/api/resumes/?show_all=true

# Analytics
GET http://localhost:5000/api/analytics/dashboard?recruiter_id={id}
```

---

## 💡 Pro Tips

1. **Parse resumes first** to have data to search
2. **Use recruiter account** to see AI matching in action
3. **Create multiple jobs** to test different scenarios
4. **Apply as candidate** to see your match scores
5. **Check analytics** to see skill trends

---

## 🎉 You're Ready!

Your complete AI-driven recruitment platform is ready to use.

**Backend:** http://localhost:5000
**Frontend:** http://localhost:8081

**Next:** Create accounts and test the AI matching! 🚀

---

## 📞 Need Help?

Refer to these files:
- `SETUP_GUIDE.md` - Detailed setup
- `CREATE_TEST_USERS.md` - Testing guide
- `flask-backend/README_BACKEND.md` - API docs
- `PROJECT_SUMMARY.md` - Complete overview

---

**Happy Recruiting! 🎯**
