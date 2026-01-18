"""
HireSight Setup Verification Script
Run this to verify that your backend is properly configured
"""

import os
import sys
from dotenv import load_dotenv

def print_header(text):
    print("\n" + "=" * 60)
    print(f"  {text}")
    print("=" * 60)

def print_check(passed, message):
    status = "✓" if passed else "✗"
    color = "\033[92m" if passed else "\033[91m"
    reset = "\033[0m"
    print(f"{color}{status}{reset} {message}")

def verify_environment():
    print_header("1. Checking Environment Variables")

    load_dotenv()

    supabase_url = os.getenv('EXPO_PUBLIC_SUPABASE_URL')
    supabase_key = os.getenv('EXPO_PUBLIC_SUPABASE_ANON_KEY')

    print_check(supabase_url is not None, "EXPO_PUBLIC_SUPABASE_URL is set")
    print_check(supabase_key is not None, "EXPO_PUBLIC_SUPABASE_ANON_KEY is set")

    if supabase_url:
        print_check('supabase.co' in supabase_url, "Supabase URL looks valid")

    return supabase_url and supabase_key

def verify_python_packages():
    print_header("2. Checking Python Packages")

    packages = {
        'flask': 'Flask',
        'flask_cors': 'Flask-CORS',
        'supabase': 'Supabase Client',
        'PyPDF2': 'PDF Parser',
        'docx': 'DOCX Parser',
        'nltk': 'NLTK',
        'spacy': 'spaCy',
        'sklearn': 'Scikit-learn',
        'sentence_transformers': 'Sentence Transformers'
    }

    all_installed = True
    for package, name in packages.items():
        try:
            __import__(package)
            print_check(True, f"{name} installed")
        except ImportError:
            print_check(False, f"{name} NOT installed")
            all_installed = False

    return all_installed

def verify_nltk_data():
    print_header("3. Checking NLTK Data")

    try:
        import nltk
        datasets = ['punkt', 'stopwords', 'wordnet']
        all_present = True

        for dataset in datasets:
            try:
                nltk.data.find(f'tokenizers/{dataset}' if dataset == 'punkt' else f'corpora/{dataset}')
                print_check(True, f"NLTK {dataset} downloaded")
            except LookupError:
                print_check(False, f"NLTK {dataset} NOT downloaded")
                all_present = False

        return all_present
    except:
        return False

def verify_spacy_model():
    print_header("4. Checking spaCy Model")

    try:
        import spacy
        nlp = spacy.load('en_core_web_sm')
        print_check(True, "spaCy model 'en_core_web_sm' loaded")
        return True
    except:
        print_check(False, "spaCy model 'en_core_web_sm' NOT found")
        return False

def verify_supabase_connection():
    print_header("5. Testing Supabase Connection")

    try:
        from services.supabase_client import supabase_service

        # Try to query profiles table
        result = supabase_service.client.table('profiles').select('*').limit(1).execute()

        print_check(True, "Connected to Supabase")
        print_check(True, "Can query 'profiles' table")
        return True
    except Exception as e:
        print_check(False, f"Supabase connection failed: {str(e)}")
        return False

def verify_directories():
    print_header("6. Checking Directories")

    directories = ['uploads', 'models']
    all_exist = True

    for directory in directories:
        exists = os.path.exists(directory)
        print_check(exists, f"'{directory}' directory exists")
        if not exists:
            all_exist = False
            try:
                os.makedirs(directory)
                print_check(True, f"Created '{directory}' directory")
            except:
                print_check(False, f"Failed to create '{directory}' directory")

    return all_exist

def verify_resumes_folder():
    print_header("7. Checking Resume Folder")

    project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    resumes_folder = os.path.join(project_root, 'resumes')

    exists = os.path.exists(resumes_folder)
    print_check(exists, f"Resume folder exists at: {resumes_folder}")

    if exists:
        files = [f for f in os.listdir(resumes_folder) if f.lower().endswith(('.pdf', '.docx', '.doc'))]
        print_check(len(files) > 0, f"Found {len(files)} resume files")
        return True

    return False

def main():
    print("\n")
    print("╔═══════════════════════════════════════════════════════════╗")
    print("║                                                           ║")
    print("║          HireSight Setup Verification                     ║")
    print("║          AI-Driven Resume Screening Platform              ║")
    print("║                                                           ║")
    print("╚═══════════════════════════════════════════════════════════╝")

    results = []

    results.append(("Environment Variables", verify_environment()))
    results.append(("Python Packages", verify_python_packages()))
    results.append(("NLTK Data", verify_nltk_data()))
    results.append(("spaCy Model", verify_spacy_model()))
    results.append(("Directories", verify_directories()))
    results.append(("Resume Folder", verify_resumes_folder()))
    results.append(("Supabase Connection", verify_supabase_connection()))

    print_header("Summary")

    passed = sum(1 for _, result in results if result)
    total = len(results)

    for name, result in results:
        print_check(result, name)

    print(f"\nPassed: {passed}/{total}")

    if passed == total:
        print("\n✨ All checks passed! Your setup is complete.")
        print("\nNext steps:")
        print("  1. Parse resumes: python scripts/parse_resume_folder.py")
        print("  2. Start backend: python app.py")
        print("  3. Start frontend: npm start (in project root)")
    else:
        print("\n⚠️  Some checks failed. Please review the errors above.")
        print("\nCommon fixes:")
        if not results[1][1]:
            print("  - Install packages: pip install -r requirements.txt")
        if not results[2][1]:
            print("  - Download NLTK data: python -c \"import nltk; nltk.download('punkt'); nltk.download('stopwords'); nltk.download('wordnet')\"")
        if not results[3][1]:
            print("  - Download spaCy model: python -m spacy download en_core_web_sm")
        if not results[0][1] or not results[6][1]:
            print("  - Check .env file with Supabase credentials")

    print("\n")

if __name__ == "__main__":
    main()
