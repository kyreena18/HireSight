# 🎯 HireSight - AI-Driven Resume Screening Platform

> **Production-Ready Web Application for Intelligent Recruitment**

A complete end-to-end recruitment platform powered by AI/ML that helps recruiters efficiently screen candidates and match them to job requirements.

## 🌟 Key Features

### For Recruiters
- **AI-Powered Resume Search** - Search through resumes with intelligent filtering
- **Smart Matching** - Get 0-100% compatibility scores for each candidate
- **Bulk Processing** - Upload and analyze multiple resumes at once
- **Analytics Dashboard** - Visualize hiring metrics and trends
- **Interview Management** - Schedule and track interviews
- **Skills Analysis** - Identify common skills and skill gaps

### For Candidates
- **Resume Parsing** - Automatic extraction of skills, experience, and education
- **Job Matching** - See how well you match with job requirements
- **Application Tracking** - Monitor your application status
- **Skill Gap Analysis** - Understand what skills you need to develop
- **Interview Schedule** - View upcoming interviews

## 🏗️ Technology Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React (Expo Web) + TypeScript |
| **Backend** | Flask (Python) REST API |
| **Database** | Supabase (PostgreSQL) |
| **Authentication** | Supabase Auth (JWT) |
| **Storage** | Supabase Storage |
| **AI/ML** | Sentence-BERT + TF-IDF + Scikit-learn |
| **NLP** | NLTK + spaCy |

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+)
- Python (v3.8+)
- Supabase account

### 1. Clone and Install

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd flask-backend
pip install -r requirements.txt

# Download NLP models
python -c "import nltk; nltk.download('punkt'); nltk.download('stopwords'); nltk.download('wordnet')"
python -m spacy download en_core_web_sm
```

### 2. Configure Environment

Update `.env` in project root:

```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Parse Sample Resumes

```bash
cd flask-backend
python scripts/parse_resume_folder.py
```

### 4. Run the Application

**Terminal 1 - Backend:**
```bash
cd flask-backend
python app.py
```

**Terminal 2 - Frontend:**
```bash
npm start
# Press 'w' for web
```

Access the app at: `http://localhost:8081`

## 📚 Complete Documentation

For detailed setup instructions, see [SETUP_GUIDE.md](./SETUP_GUIDE.md)

## 🤖 AI/ML Features

### Resume Analysis Engine
- **TF-IDF Vectorization** - Keyword frequency analysis
- **Sentence-BERT** - Semantic similarity (all-MiniLM-L6-v2)
- **Cosine Similarity** - Resume-job matching
- **Multi-factor Scoring** - Weighted algorithm considering:
  - Semantic similarity (30%)
  - TF-IDF similarity (20%)
  - Skill match (35%)
  - Experience match (15%)

### Intelligent Features
- Automatic skill extraction from resumes
- Years of experience calculation
- Education level detection
- Contact information extraction
- Missing skills identification
- Suitability classification

## 📊 Database Schema

```
profiles (users with roles)
  ├── resumes (parsed resume data)
  │   └── applications (AI match results)
  │       └── interviews
  └── job_descriptions
      └── applications
          └── interviews
```

## 🔐 Security

- Row Level Security (RLS) on all tables
- JWT-based authentication
- Role-based access control (Candidate/Recruiter)
- Secure file uploads
- Protected API endpoints

## 📱 User Roles

### Candidate
- Upload and manage resumes
- Browse active jobs
- Apply to positions with AI matching
- View match scores and insights
- Track application status
- Manage interview schedule

### Recruiter
- Search resumes with filters
- Create and manage job postings
- View AI-generated match scores
- Shortlist candidates
- Schedule interviews
- Access analytics dashboard
- Export reports

## 🎯 Modules

1. **User Management & Authentication**
   - Registration with role selection
   - JWT-based sessions
   - Profile management

2. **Resume Upload & Storage**
   - Single and bulk upload
   - PDF/DOCX support
   - Supabase Storage integration

3. **Resume Parsing & Preprocessing**
   - Text extraction
   - NLP processing
   - Entity extraction

4. **AI/ML Analysis Engine** ⭐
   - Semantic matching
   - Score generation
   - Suitability classification
   - Insight generation

5. **Job Management**
   - CRUD operations
   - Candidate ranking
   - Status tracking

6. **Analytics Dashboard**
   - Match score charts
   - Skill frequency
   - Conversion metrics
   - Data export

7. **Interview Scheduler**
   - Schedule management
   - Meeting links
   - Calendar view

## 📁 Project Structure

```
hiresight/
├── flask-backend/          # Flask API + AI Engine
│   ├── routes/            # API endpoints
│   ├── services/          # Business logic
│   │   ├── resume_parser.py
│   │   ├── ai_engine.py
│   │   └── supabase_client.py
│   └── scripts/           # Utility scripts
├── app/                   # React Native (Expo)
│   ├── (tabs)/           # Main screens
│   ├── login.tsx
│   └── register.tsx
├── context/               # React context
├── lib/                   # Utilities
├── resumes/              # Sample resumes
└── .env                  # Configuration
```

## 🧪 Testing

### Test Resume Search
1. Register as recruiter
2. Go to "Search" tab
3. Use filters to find candidates

### Test AI Matching
1. Register as candidate
2. Upload resume
3. Apply to a job
4. View match score and insights

### Test Analytics
1. Log in as recruiter
2. View dashboard statistics
3. Check skill trends

## 📊 Sample Data

The `/resumes` folder contains 17 sample resumes including:
- Data Engineers
- Data Scientists
- Software Developers
- Power BI Developers
- And more...

Run the parser script to process these into the database.

## 🐛 Troubleshooting

### Backend won't start
- Check Python dependencies: `pip install -r requirements.txt`
- Download NLP models (see Quick Start)
- Verify .env configuration

### Frontend won't connect
- Ensure backend is running on port 5000
- Check Supabase credentials in .env
- Verify CORS settings

### Resume parsing issues
- Only PDF and DOCX files supported
- Maximum file size: 10MB
- Ensure file is not corrupted

## 🎓 Academic Features

Perfect for final-year projects:
- ✅ Real-world problem solving
- ✅ Full-stack implementation
- ✅ AI/ML integration
- ✅ Database design
- ✅ Authentication & security
- ✅ RESTful API architecture
- ✅ Modern tech stack
- ✅ Industry-standard practices

## 🔄 API Endpoints

### Authentication
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login

### Resumes
- `GET /api/resumes/` - List resumes
- `POST /api/resumes/upload` - Upload resume
- `POST /api/resumes/bulk-upload` - Bulk upload

### Jobs
- `GET /api/jobs/` - List jobs
- `POST /api/jobs/` - Create job
- `PUT /api/jobs/:id` - Update job

### Applications (AI-Powered)
- `POST /api/applications/apply` - Apply with AI analysis
- `GET /api/applications/` - List applications
- `PUT /api/applications/:id/status` - Update status

### Analytics
- `GET /api/analytics/dashboard` - Get statistics
- `GET /api/analytics/job/:id` - Job analytics

### Interviews
- `GET /api/interviews/` - List interviews
- `POST /api/interviews/` - Schedule interview

## 💡 Future Enhancements

- Email notifications
- Advanced analytics (charts/graphs)
- Resume comparison
- Collaborative hiring
- Interview feedback system
- Mobile app (iOS/Android)
- Video interview integration

## 📝 License

This project is for educational and portfolio purposes.

## 👥 Contributors

Built as a comprehensive full-stack AI application demonstrating:
- Modern web development
- Machine learning integration
- Database design
- User authentication
- Real-time data processing

---

**Made with ❤️ using React, Flask, and AI**

For detailed setup and usage instructions, see [SETUP_GUIDE.md](./SETUP_GUIDE.md)
