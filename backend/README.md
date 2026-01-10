# Resume Search Backend

This Flask backend provides AI-powered semantic search for resumes using ChromaDB and sentence transformers.

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Create the following directories:
- `cleaned_resumes/` - Contains cleaned/parsed resume text files
- `interview_notes/` - Contains interview notes (optional)
- `resumes/` - Contains original resume PDF/DOCX files
- `resume_db/` - ChromaDB will create this automatically

3. Place your cleaned resume text files in `cleaned_resumes/` directory. The filename should match the original resume filename (e.g., `John_Doe_resume_cleaned.txt` for `John_Doe_resume.pdf`)

4. Place original resume files (PDF/DOCX) in `resumes/` directory

5. Run the server:
```bash
python app.py
```

The server will run on `http://localhost:6060`

## API Endpoints

### POST /api/search/jd
Search resumes by job description.

**Form Data:**
- `jd`: Job description text

**Response:**
```json
{
  "results": [
    {
      "id": "resume_id",
      "name": "Candidate Name",
      "similarity": 0.85,
      "match_percent": 87.5,
      "preview": "Resume preview text...",
      "resume": "original_filename.pdf",
      "found_in_resume": true,
      "keywords_found": ["keyword1", "keyword2"],
      "match_type": "✅ Keywords found"
    }
  ],
  "message": "✅ Showing top matches..."
}
```

### POST /api/search/skills
Search resumes by skills and years of experience.

**Form Data:**
- `skills`: Comma-separated skills (e.g., "Python, React, SQL")
- `years`: Minimum years of experience (e.g., "3")

### POST /api/search/education
Search resumes by education level.

**Form Data:**
- `levels`: Comma-separated education levels (e.g., "bachelors, masters")

### POST /api/search/general
General search query.

**Form Data:**
- `q`: Search query text
- `include_notes`: "y" or "n" to include interview notes

### GET /resume/<filename>
Download/view original resume file.

## Environment Variables

Set `EXPO_PUBLIC_FLASK_API_URL` in your React Native app to point to this backend (default: `http://localhost:6060`)

## Notes

- The backend uses ChromaDB for vector storage and sentence-transformers for embeddings
- First run will index all documents in `cleaned_resumes/` and `interview_notes/` folders
- Make sure cleaned resume files are plain text and properly formatted


