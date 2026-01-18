"""
Application Management and AI Analysis Routes
"""

from flask import Blueprint, request, jsonify
from services.supabase_client import supabase_service
from services.ai_engine import ai_engine

application_bp = Blueprint('applications', __name__, url_prefix='/api/applications')


@application_bp.route('/', methods=['GET'])
def get_applications():
    """Get applications for a candidate or job"""
    try:
        candidate_id = request.args.get('candidate_id')
        job_id = request.args.get('job_id')

        if candidate_id:
            applications = supabase_service.get_candidate_applications(candidate_id)
        elif job_id:
            applications = supabase_service.get_job_applications(job_id)
        else:
            return jsonify({'error': 'Either candidate_id or job_id required'}), 400

        return jsonify({'applications': applications}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@application_bp.route('/<application_id>', methods=['GET'])
def get_application(application_id):
    """Get a specific application"""
    try:
        application = supabase_service.get_application(application_id)

        if not application:
            return jsonify({'error': 'Application not found'}), 404

        return jsonify({'application': application}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@application_bp.route('/apply', methods=['POST'])
def apply_to_job():
    """
    Apply to a job with resume analysis
    Expects: resume_id, job_id, candidate_id
    """
    try:
        data = request.get_json()

        required_fields = ['resume_id', 'job_id', 'candidate_id']
        if not all(field in data for field in required_fields):
            return jsonify({'error': 'Missing required fields'}), 400

        resume_id = data['resume_id']
        job_id = data['job_id']
        candidate_id = data['candidate_id']

        resume = supabase_service.get_resume(resume_id)
        job = supabase_service.get_job(job_id)

        if not resume or not job:
            return jsonify({'error': 'Resume or job not found'}), 404

        resume_data = {
            'cleaned_text': resume.get('summary', ''),
            'entities': {
                'skills': resume.get('skills', []),
                'experience': resume.get('experience', []),
                'education': resume.get('education', []),
                'years_of_experience': resume.get('years_of_experience', 0)
            }
        }

        job_data = {
            'description': job.get('description', ''),
            'requirements': job.get('requirements', ''),
            'required_skills': job.get('required_skills', []),
            'min_experience': job.get('min_experience', 0)
        }

        analysis = ai_engine.analyze_resume(resume_data, job_data)

        application_data = {
            'resume_id': resume_id,
            'job_id': job_id,
            'candidate_id': candidate_id,
            'match_score': analysis['match_score'],
            'suitability': analysis['suitability'],
            'matched_skills': analysis['matched_skills'],
            'missing_skills': analysis['missing_skills'],
            'insights': {'insights': analysis['insights']}
        }

        application = supabase_service.create_application(application_data)

        return jsonify({
            'message': 'Application submitted successfully',
            'application': application,
            'analysis': analysis
        }), 201

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@application_bp.route('/<application_id>/status', methods=['PUT'])
def update_application_status(application_id):
    """Update application status"""
    try:
        data = request.get_json()

        if 'status' not in data:
            return jsonify({'error': 'Status is required'}), 400

        reviewed_by = data.get('reviewed_by')

        application = supabase_service.update_application_status(
            application_id,
            data['status'],
            reviewed_by
        )

        if not application:
            return jsonify({'error': 'Application not found'}), 404

        return jsonify({
            'message': 'Application status updated',
            'application': application
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@application_bp.route('/<application_id>/analyze', methods=['POST'])
def analyze_application(application_id):
    """Re-analyze an application"""
    try:
        application = supabase_service.get_application(application_id)

        if not application:
            return jsonify({'error': 'Application not found'}), 404

        resume = supabase_service.get_resume(application['resume_id'])
        job = supabase_service.get_job(application['job_id'])

        resume_data = {
            'cleaned_text': resume.get('summary', ''),
            'entities': {
                'skills': resume.get('skills', []),
                'experience': resume.get('experience', []),
                'education': resume.get('education', []),
                'years_of_experience': resume.get('years_of_experience', 0)
            }
        }

        job_data = {
            'description': job.get('description', ''),
            'requirements': job.get('requirements', ''),
            'required_skills': job.get('required_skills', []),
            'min_experience': job.get('min_experience', 0)
        }

        analysis = ai_engine.analyze_resume(resume_data, job_data)

        updated_application = supabase_service.update_application_analysis(
            application_id,
            analysis
        )

        return jsonify({
            'message': 'Application re-analyzed successfully',
            'application': updated_application,
            'analysis': analysis
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500
