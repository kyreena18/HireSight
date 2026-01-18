"""
Supabase Client Service
Handles all database operations
"""

import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()


class SupabaseService:
    """Supabase database service"""

    def __init__(self):
        self.url = os.environ.get("EXPO_PUBLIC_SUPABASE_URL")
        self.key = os.environ.get("EXPO_PUBLIC_SUPABASE_ANON_KEY")

        if not self.url or not self.key:
            raise ValueError("Supabase credentials not found in environment variables")

        self.client: Client = create_client(self.url, self.key)

    def insert_resume(self, resume_data):
        """Insert a new resume into the database"""
        try:
            response = self.client.table('resumes').insert(resume_data).execute()
            return response.data[0] if response.data else None
        except Exception as e:
            print(f"Error inserting resume: {str(e)}")
            raise

    def update_resume(self, resume_id, update_data):
        """Update an existing resume"""
        try:
            response = self.client.table('resumes').update(update_data).eq('id', resume_id).execute()
            return response.data[0] if response.data else None
        except Exception as e:
            print(f"Error updating resume: {str(e)}")
            raise

    def get_resume(self, resume_id):
        """Get a specific resume by ID"""
        try:
            response = self.client.table('resumes').select('*').eq('id', resume_id).single().execute()
            return response.data
        except Exception as e:
            print(f"Error fetching resume: {str(e)}")
            return None

    def search_resumes(self, skills=None, min_experience=None, max_experience=None):
        """
        Search resumes with filters

        Args:
            skills: List of skills to match
            min_experience: Minimum years of experience
            max_experience: Maximum years of experience

        Returns:
            List of matching resumes
        """
        try:
            query = self.client.table('resumes').select('*').eq('status', 'parsed')

            if min_experience is not None:
                query = query.gte('years_of_experience', min_experience)

            if max_experience is not None:
                query = query.lte('years_of_experience', max_experience)

            response = query.execute()
            resumes = response.data if response.data else []

            # Filter by skills if provided
            if skills and len(skills) > 0:
                filtered_resumes = []
                for resume in resumes:
                    resume_skills = resume.get('skills', [])
                    # Check if any of the requested skills are in the resume
                    if any(skill.lower() in [rs.lower() for rs in resume_skills] for skill in skills):
                        # Calculate match score
                        matched = sum(1 for skill in skills if skill.lower() in [rs.lower() for rs in resume_skills])
                        resume['match_score'] = (matched / len(skills)) * 100
                        filtered_resumes.append(resume)

                # Sort by match score
                filtered_resumes.sort(key=lambda x: x.get('match_score', 0), reverse=True)
                return filtered_resumes

            return resumes
        except Exception as e:
            print(f"Error searching resumes: {str(e)}")
            return []

    def get_user_resumes(self, user_id):
        """Get all resumes for a specific user"""
        try:
            response = self.client.table('resumes').select('*').eq('user_id', user_id).execute()
            return response.data if response.data else []
        except Exception as e:
            print(f"Error fetching user resumes: {str(e)}")
            return []

    def delete_resume(self, resume_id):
        """Delete a resume"""
        try:
            response = self.client.table('resumes').delete().eq('id', resume_id).execute()
            return True
        except Exception as e:
            print(f"Error deleting resume: {str(e)}")
            return False

    def get_job(self, job_id):
        """Get a specific job by ID"""
        try:
            response = self.client.table('job_descriptions').select('*').eq('id', job_id).single().execute()
            return response.data
        except Exception as e:
            print(f"Error fetching job: {str(e)}")
            return None

    def get_all_jobs(self, status='active'):
        """Get all jobs with optional status filter"""
        try:
            query = self.client.table('job_descriptions').select('*')
            if status:
                query = query.eq('status', status)
            response = query.execute()
            return response.data if response.data else []
        except Exception as e:
            print(f"Error fetching jobs: {str(e)}")
            return []

    def create_application(self, application_data):
        """Create a new job application"""
        try:
            response = self.client.table('applications').insert(application_data).execute()
            return response.data[0] if response.data else None
        except Exception as e:
            print(f"Error creating application: {str(e)}")
            raise

    def update_application(self, application_id, update_data):
        """Update an existing application"""
        try:
            response = self.client.table('applications').update(update_data).eq('id', application_id).execute()
            return response.data[0] if response.data else None
        except Exception as e:
            print(f"Error updating application: {str(e)}")
            raise

    def get_applications(self, candidate_id=None, job_id=None):
        """Get applications filtered by candidate or job"""
        try:
            query = self.client.table('applications').select('*')

            if candidate_id:
                query = query.eq('candidate_id', candidate_id)
            if job_id:
                query = query.eq('job_id', job_id)

            response = query.execute()
            return response.data if response.data else []
        except Exception as e:
            print(f"Error fetching applications: {str(e)}")
            return []


# Global service instance
supabase_service = SupabaseService()
