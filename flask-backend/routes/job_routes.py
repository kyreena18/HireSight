"""
Job Description Management Routes
"""

from flask import Blueprint, request, jsonify
from services.supabase_client import supabase_service

job_bp = Blueprint('jobs', __name__, url_prefix='/api/jobs')


@job_bp.route('/', methods=['GET'])
def get_jobs():
    """Get all jobs or jobs for a specific recruiter"""
    try:
        recruiter_id = request.args.get('recruiter_id')
        show_all = request.args.get('show_all', 'false').lower() == 'true'

        if recruiter_id:
            jobs = supabase_service.get_recruiter_jobs(recruiter_id)
        elif show_all:
            jobs = supabase_service.get_active_jobs()
        else:
            jobs = supabase_service.get_active_jobs()

        return jsonify({'jobs': jobs}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@job_bp.route('/<job_id>', methods=['GET'])
def get_job(job_id):
    """Get a specific job by ID"""
    try:
        job = supabase_service.get_job(job_id)

        if not job:
            return jsonify({'error': 'Job not found'}), 404

        return jsonify({'job': job}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@job_bp.route('/', methods=['POST'])
def create_job():
    """Create a new job description"""
    try:
        data = request.get_json()

        required_fields = ['recruiter_id', 'title', 'description', 'requirements']
        if not all(field in data for field in required_fields):
            return jsonify({'error': 'Missing required fields'}), 400

        job = supabase_service.create_job(data)

        return jsonify({
            'message': 'Job created successfully',
            'job': job
        }), 201

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@job_bp.route('/<job_id>', methods=['PUT'])
def update_job(job_id):
    """Update a job description"""
    try:
        data = request.get_json()

        job = supabase_service.update_job(job_id, data)

        if not job:
            return jsonify({'error': 'Job not found'}), 404

        return jsonify({
            'message': 'Job updated successfully',
            'job': job
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@job_bp.route('/<job_id>', methods=['DELETE'])
def delete_job(job_id):
    """Delete a job description"""
    try:
        supabase_service.delete_job(job_id)

        return jsonify({
            'message': 'Job deleted successfully'
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@job_bp.route('/<job_id>/applications', methods=['GET'])
def get_job_applications(job_id):
    """Get all applications for a job"""
    try:
        applications = supabase_service.get_job_applications(job_id)

        return jsonify({'applications': applications}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500
