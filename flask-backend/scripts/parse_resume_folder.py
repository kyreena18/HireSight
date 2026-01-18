"""
Script to parse all resumes from the /resumes folder and upload to database
Run this script to bulk process existing resumes
"""

import os
import sys

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from services.resume_parser import resume_parser
from services.supabase_client import supabase_service
from dotenv import load_dotenv

load_dotenv()


def parse_resume_folder(folder_path, recruiter_user_id=None):
    """
    Parse all resumes from a folder and upload to database

    Args:
        folder_path: Path to folder containing resumes
        recruiter_user_id: User ID who uploaded these resumes (optional)
    """

    if not os.path.exists(folder_path):
        print(f"Error: Folder {folder_path} does not exist")
        return

    files = [f for f in os.listdir(folder_path) if f.lower().endswith(('.pdf', '.docx', '.doc'))]

    print(f"Found {len(files)} resume files to process")
    print("-" * 50)

    successful = 0
    failed = 0

    for filename in files:
        try:
            print(f"\nProcessing: {filename}")

            file_path = os.path.join(folder_path, filename)
            file_type = filename.rsplit('.', 1)[1].lower()

            parsed_data = resume_parser.parse_resume(file_path, file_type)

            entities = parsed_data['entities']

            print(f"  ✓ Extracted {len(entities.get('skills', []))} skills")
            print(f"  ✓ Found {entities.get('years_of_experience', 0)} years of experience")

            resume_data = {
                'user_id': recruiter_user_id or '00000000-0000-0000-0000-000000000000',
                'file_name': filename,
                'file_url': f'/resumes/{filename}',
                'file_type': file_type,
                'file_size': os.path.getsize(file_path),
                'status': 'parsed',
                'skills': entities.get('skills', []),
                'experience': [str(exp) for exp in entities.get('experience', [])],
                'education': [str(edu) for edu in entities.get('education', [])],
                'years_of_experience': entities.get('years_of_experience', 0),
                'email': entities.get('email'),
                'phone': entities.get('phone'),
                'summary': parsed_data['cleaned_text'][:500],
                'parsed_data': {
                    'raw_text': parsed_data['raw_text'][:1000],
                    'entities': entities
                }
            }

            successful += 1
            print(f"  ✓ Successfully parsed {filename}")
            print(f"    Skills: {', '.join(entities.get('skills', [])[:5])}...")

        except Exception as e:
            failed += 1
            print(f"  ✗ Error parsing {filename}: {str(e)}")

    print("\n" + "=" * 50)
    print(f"SUMMARY:")
    print(f"  Successfully parsed: {successful}")
    print(f"  Failed: {failed}")
    print(f"  Total: {len(files)}")
    print("=" * 50)


if __name__ == "__main__":
    project_root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    resumes_folder = os.path.join(project_root, 'resumes')

    print("HireSight - Resume Parser")
    print("=" * 50)
    print(f"Resume folder: {resumes_folder}")
    print()

    parse_resume_folder(resumes_folder)
