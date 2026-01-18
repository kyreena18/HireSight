# 📄 How to Parse the 17 Training Resumes

## Quick Answer: NO, You Don't Need to Change Any Paths! 🎉

The script **automatically finds** the `/resumes` folder at your project root.

---

## 📂 How the Path Works

The script uses this logic:
```
Your script location: /project/flask-backend/scripts/parse_resume_folder.py
Goes up 3 levels  : /project/
Looks for folder  : /project/resumes/
```

**It automatically finds your 17 resume files!**

---

## 🚀 How to Run

### Step 1: Make Sure You're in the Right Directory
```bash
cd flask-backend
```

### Step 2: Run the Script
```bash
python scripts/parse_resume_folder.py
```

That's it! ✅

---

## 📊 What You'll See

```
HireSight - Resume Parser
==================================================
Resume folder: /tmp/cc-agent/62401612/project/resumes

Found 17 resume files to process
--------------------------------------------------

Processing: Aman Kumar_Data Engineer_ZGN_Avesta.pdf
  ✓ Extracted 12 skills
  ✓ Found 5 years of experience
  ✓ Successfully parsed and inserted into database
    Resume ID: abc-123-def-456
    Skills: Python, Sql, Aws, Spark, Airflow...

Processing: Ankush Sharma_Data Scientist NLP CV_GHD_AVesta.pdf
  ✓ Extracted 15 skills
  ✓ Found 6 years of experience
  ✓ Successfully parsed and inserted into database
    Resume ID: xyz-789-ghi-012
    Skills: Python, Tensorflow, Pytorch, Nlp, Computer Vision...

... (15 more resumes)

==================================================
SUMMARY:
  Successfully parsed: 17
  Failed: 0
  Total: 17
==================================================
```

---

## ✅ What Just Happened

For each of the 17 resumes, the script:
1. ✅ Extracted text from PDF/DOCX
2. ✅ Identified skills (Python, SQL, AWS, etc.)
3. ✅ Found work experience
4. ✅ Calculated years of experience
5. ✅ Extracted education
6. ✅ Found contact info (email, phone)
7. ✅ **Inserted into Supabase database**
8. ✅ Status set to 'parsed'

---

## 🔍 Verify It Worked

### Option 1: Check Supabase Dashboard
1. Go to your Supabase project
2. Click "Table Editor"
3. Select `resumes` table
4. You should see 17 rows with:
   - file_name (the resume filenames)
   - status = 'parsed'
   - skills array filled
   - years_of_experience > 0

### Option 2: Test the Search
1. Start your frontend: `npm start` → press 'w'
2. Login as recruiter
3. Go to "Search" tab
4. Enter skills: "Python, SQL"
5. You should see matching resumes from the 17 parsed

---

## 🎯 When You'd Need to Change the Path

**Only if** you want to parse resumes from a different folder:

```python
# At the end of parse_resume_folder.py, change:
if __name__ == "__main__":
    # Custom path example:
    my_custom_path = "/Users/yourname/Desktop/more_resumes"
    parse_resume_folder(my_custom_path)
```

But for the 17 training resumes, **you don't need to change anything!**

---

## 🐛 Troubleshooting

### "Error: Folder does not exist"
**Problem:** The script can't find the `/resumes` folder.

**Solution:**
```bash
# Check if folder exists
ls -la /tmp/cc-agent/62401612/project/resumes/

# You should see 17 files:
# Aman Kumar_Data Engineer_ZGN_Avesta.pdf
# Ankush Sharma_Data Scientist...pdf
# etc.
```

If the folder is missing, the files should be at the project root.

---

### "ModuleNotFoundError: No module named 'PyPDF2'"
**Problem:** Python dependencies not installed.

**Solution:**
```bash
cd flask-backend
pip install -r requirements.txt
python -m spacy download en_core_web_sm
```

---

### "Error: Supabase credentials not found"
**Problem:** `.env` file missing or incorrect.

**Solution:**
```bash
# Check .env file exists in flask-backend/
ls flask-backend/.env

# Should contain:
# EXPO_PUBLIC_SUPABASE_URL=https://...
# EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

If missing, copy from project root `.env` file.

---

### "Successfully parsed but not appearing in search"
**Problem:** Backend not running or search not querying database.

**Solution:**
```bash
# Make sure backend is running
cd flask-backend
python app.py

# Should show:
# * Running on http://0.0.0.0:5000
```

---

## 🎉 After Parsing Successfully

Your 17 resumes are now:
- ✅ Stored in Supabase `resumes` table
- ✅ Fully parsed with skills and experience
- ✅ Searchable by ALL recruiters
- ✅ Ranked by match score
- ✅ Visible in search results

**Test it:**
1. Login as recruiter
2. Search for: "Python"
3. You should see all resumes with Python skill!

---

## 📝 Summary

**Question:** Do I need to add my file path anywhere?

**Answer:** **NO!** The script automatically finds:
```
/project/resumes/
```

Just run:
```bash
cd flask-backend
python scripts/parse_resume_folder.py
```

And all 17 resumes will be parsed and inserted into the database! 🚀
