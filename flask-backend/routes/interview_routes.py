"""
Interview Scheduling and Management Routes
"""

from flask import Blueprint, request, jsonify
from services.supabase_client import supabase_service

interview_bp = Blueprint('interviews', __name__, url_prefix='/api/interviews')


@interview_bp.route('/', methods=['GET'])
def get_interviews():
    """Get interviews for a candidate or recruiter"""
    try:
        candidate_id = request.args.get('candidate_id')
        recruiter_id = request.args.get('recruiter_id')

        if candidate_id:
            interviews = supabase_service.get_candidate_interviews(candidate_id)
        elif recruiter_id:
            interviews = supabase_service.get_recruiter_interviews(recruiter_id)
        else:
            return jsonify({'error': 'Either candidate_id or recruiter_id required'}), 400

        return jsonify({'interviews': interviews}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@interview_bp.route('/<interview_id>', methods=['GET'])
def get_interview(interview_id):
    """Get a specific interview"""
    try:
        interview = supabase_service.get_interview(interview_id)

        if not interview:
            return jsonify({'error': 'Interview not found'}), 404

        return jsonify({'interview': interview}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@interview_bp.route('/', methods=['POST'])
def create_interview():
    """Schedule a new interview"""
    try:
        data = request.get_json()

        required_fields = [
            'application_id', 'candidate_id', 'recruiter_id', 'job_id',
            'title', 'scheduled_date', 'scheduled_time'
        ]

        if not all(field in data for field in required_fields):
            return jsonify({'error': 'Missing required fields'}), 400

        interview = supabase_service.create_interview(data)

        application_id = data['application_id']
        supabase_service.update_application_status(
            application_id,
            'interview-scheduled',
            data['recruiter_id']
        )

        return jsonify({
            'message': 'Interview scheduled successfully',
            'interview': interview
        }), 201

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@interview_bp.route('/<interview_id>', methods=['PUT'])
def update_interview(interview_id):
    """Update an interview"""
    try:
        data = request.get_json()

        interview = supabase_service.update_interview(interview_id, data)

        if not interview:
            return jsonify({'error': 'Interview not found'}), 404

        return jsonify({
            'message': 'Interview updated successfully',
            'interview': interview
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@interview_bp.route('/<interview_id>', methods=['DELETE'])
def delete_interview(interview_id):
    """Cancel/delete an interview"""
    try:
        supabase_service.delete_interview(interview_id)

        return jsonify({
            'message': 'Interview deleted successfully'
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500
