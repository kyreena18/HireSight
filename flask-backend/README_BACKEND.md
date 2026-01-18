# HireSight Flask Backend

AI-Driven Resume Screening and Recruitment Platform - Backend API

## Setup Instructions

### 1. Install Python Dependencies

```bash
cd flask-backend
pip install -r requirements.txt
```

### 2. Download Required NLP Models

```bash
# Download NLTK data
python -c "import nltk; nltk.download('punkt'); nltk.download('stopwords'); nltk.download('wordnet')"

# Download spaCy model
python -m spacy download en_core_web_sm
```

### 3. Environment Variables

Create a `.env` file in the flask-backend directory:

```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SECRET_KEY=your_secret_key
DEBUG=True
```

### 4. Parse Existing Resumes

To parse all resumes from the `/resumes` folder:

```bash
cd flask-backend
python scripts/parse_resume_folder.py
```

### 5. Run the Flask Server

```bash
python app.py
```

The server will start on `http://localhost:5000`

## API Endpoints

### Health Check
- `GET /api/health` - Check if API is running

### Resume Management
- `POST /api/resumes/upload` - Upload and parse a single resume
- `POST /api/resumes/bulk-upload` - Upload multiple resumes
- `GET /api/resumes/` - Get all resumes or user's resumes
- `GET /api/resumes/<id>` - Get specific resume

### Job Management
- `GET /api/jobs/` - Get all jobs
- `GET /api/jobs/<id>` - Get specific job
- `POST /api/jobs/` - Create new job
- `PUT /api/jobs/<id>` - Update job
- `DELETE /api/jobs/<id>` - Delete job

### Application Management
- `GET /api/applications/` - Get applications (by candidate or job)
- `POST /api/applications/apply` - Apply to job with AI analysis
- `PUT /api/applications/<id>/status` - Update application status
- `POST /api/applications/<id>/analyze` - Re-analyze application

### Interview Management
- `GET /api/interviews/` - Get interviews (by candidate or recruiter)
- `POST /api/interviews/` - Schedule interview
- `PUT /api/interviews/<id>` - Update interview
- `DELETE /api/interviews/<id>` - Delete interview

### Analytics
- `GET /api/analytics/dashboard` - Get dashboard statistics
- `GET /api/analytics/job/<id>` - Get job-specific analytics
- `GET /api/analytics/skills` - Get skill trends
- `GET /api/analytics/export` - Export data

## AI/ML Features

### Resume Parser
- Extracts text from PDF and DOCX files
- Identifies skills, experience, and education
- Calculates years of experience
- Extracts contact information

### AI Analysis Engine
- **TF-IDF Vectorization**: Analyzes keyword frequency
- **Sentence-BERT**: Semantic similarity analysis
- **Cosine Similarity**: Measures resume-job match
- **Match Score**: 0-100% compatibility score
- **Suitability Classification**:
  - Highly Suitable (75-100%)
  - Moderately Suitable (50-74%)
  - Not Suitable (0-49%)

### Weighting System
- Semantic Similarity: 30%
- TF-IDF Similarity: 20%
- Skill Match: 35%
- Experience Match: 15%

## Testing

### Test Resume Upload
```bash
curl -X POST http://localhost:5000/api/resumes/upload \
  -F "file=@path/to/resume.pdf" \
  -F "user_id=user_uuid" \
  -F "resume_id=resume_uuid"
```

### Test Job Application with AI Analysis
```bash
curl -X POST http://localhost:5000/api/applications/apply \
  -H "Content-Type: application/json" \
  -d '{
    "resume_id": "resume_uuid",
    "job_id": "job_uuid",
    "candidate_id": "candidate_uuid"
  }'
```

## Folder Structure

```
flask-backend/
├── app.py                  # Main Flask application
├── config.py               # Configuration
├── requirements.txt        # Python dependencies
├── routes/                 # API route handlers
│   ├── resume_routes.py
│   ├── job_routes.py
│   ├── application_routes.py
│   ├── interview_routes.py
│   └── analytics_routes.py
├── services/               # Business logic
│   ├── resume_parser.py    # PDF/DOCX parsing + NLP
│   ├── ai_engine.py        # AI/ML analysis engine
│   └── supabase_client.py  # Database operations
├── models/                 # ML models (auto-created)
└── uploads/                # Temporary file uploads
```

## Troubleshooting

### Issue: NLTK/spaCy models not found
**Solution**: Run the download commands in step 2

### Issue: "relation does not exist" error
**Solution**: Ensure database migrations are applied in Supabase

### Issue: CORS errors
**Solution**: Check CORS configuration in app.py

### Issue: File upload fails
**Solution**: Ensure uploads/ directory exists and has write permissions

## Production Deployment

1. Set `DEBUG=False` in environment variables
2. Use a production WSGI server (gunicorn, uWSGI)
3. Set up proper CORS origins
4. Enable rate limiting
5. Use environment-specific configurations
6. Set up logging and monitoring

## Support

For issues or questions, refer to the main project documentation.
