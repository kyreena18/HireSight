"""
Analytics and Reporting Routes
"""

from flask import Blueprint, request, jsonify
from services.supabase_client import supabase_service

analytics_bp = Blueprint('analytics', __name__, url_prefix='/api/analytics')


@analytics_bp.route('/dashboard', methods=['GET'])
def get_dashboard_stats():
    """Get overall dashboard statistics for recruiter"""
    try:
        recruiter_id = request.args.get('recruiter_id')

        if not recruiter_id:
            return jsonify({'error': 'recruiter_id is required'}), 400

        stats = supabase_service.get_recruiter_statistics(recruiter_id)

        return jsonify({'stats': stats}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@analytics_bp.route('/job/<job_id>', methods=['GET'])
def get_job_analytics(job_id):
    """Get analytics for a specific job"""
    try:
        applications = supabase_service.get_job_applications(job_id)

        if not applications:
            return jsonify({
                'total_applications': 0,
                'avg_match_score': 0,
                'status_distribution': {},
                'skill_frequency': {}
            }), 200

        total = len(applications)
        avg_score = sum(app.get('match_score', 0) or 0 for app in applications) / total if total > 0 else 0

        status_distribution = {}
        for app in applications:
            status = app.get('status', 'unknown')
            status_distribution[status] = status_distribution.get(status, 0) + 1

        skill_frequency = {}
        for app in applications:
            skills = app.get('matched_skills', []) or []
            for skill in skills:
                skill_frequency[skill] = skill_frequency.get(skill, 0) + 1

        match_score_ranges = {
            '0-25': 0,
            '26-50': 0,
            '51-75': 0,
            '76-100': 0
        }
        for app in applications:
            score = app.get('match_score', 0) or 0
            if score <= 25:
                match_score_ranges['0-25'] += 1
            elif score <= 50:
                match_score_ranges['26-50'] += 1
            elif score <= 75:
                match_score_ranges['51-75'] += 1
            else:
                match_score_ranges['76-100'] += 1

        return jsonify({
            'total_applications': total,
            'avg_match_score': round(avg_score, 2),
            'status_distribution': status_distribution,
            'skill_frequency': dict(sorted(skill_frequency.items(), key=lambda x: x[1], reverse=True)[:20]),
            'match_score_ranges': match_score_ranges
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@analytics_bp.route('/skills', methods=['GET'])
def get_skill_trends():
    """Get skill frequency across all applications"""
    try:
        recruiter_id = request.args.get('recruiter_id')

        if not recruiter_id:
            return jsonify({'error': 'recruiter_id is required'}), 400

        jobs = supabase_service.get_recruiter_jobs(recruiter_id)
        job_ids = [job['id'] for job in jobs]

        all_applications = []
        for job_id in job_ids:
            apps = supabase_service.get_job_applications(job_id)
            all_applications.extend(apps)

        skill_frequency = {}
        missing_skill_frequency = {}

        for app in all_applications:
            matched_skills = app.get('matched_skills', []) or []
            for skill in matched_skills:
                skill_frequency[skill] = skill_frequency.get(skill, 0) + 1

            missing_skills = app.get('missing_skills', []) or []
            for skill in missing_skills:
                missing_skill_frequency[skill] = missing_skill_frequency.get(skill, 0) + 1

        return jsonify({
            'top_skills': dict(sorted(skill_frequency.items(), key=lambda x: x[1], reverse=True)[:20]),
            'common_missing_skills': dict(sorted(missing_skill_frequency.items(), key=lambda x: x[1], reverse=True)[:20])
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@analytics_bp.route('/export', methods=['GET'])
def export_data():
    """Export analytics data"""
    try:
        recruiter_id = request.args.get('recruiter_id')
        job_id = request.args.get('job_id')

        if not recruiter_id:
            return jsonify({'error': 'recruiter_id is required'}), 400

        if job_id:
            applications = supabase_service.get_job_applications(job_id)
            job = supabase_service.get_job(job_id)

            export_data = {
                'job': job,
                'applications': applications
            }
        else:
            jobs = supabase_service.get_recruiter_jobs(recruiter_id)
            stats = supabase_service.get_recruiter_statistics(recruiter_id)

            export_data = {
                'jobs': jobs,
                'stats': stats
            }

        return jsonify(export_data), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500
