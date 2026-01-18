"""
Resume Management Routes
Handles resume upload, parsing, and retrieval
"""

from flask import Blueprint, request, jsonify
import os
import uuid
from werkzeug.utils import secure_filename
from services.resume_parser import resume_parser
from services.supabase_client import supabase_service

resume_bp = Blueprint('resume', __name__, url_prefix='/api/resumes')

UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'uploads')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

ALLOWED_EXTENSIONS = {'pdf', 'docx', 'doc'}


def allowed_file(filename):
    """Check if file extension is allowed"""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@resume_bp.route('/upload', methods=['POST'])
def upload_resume():
    """
    Upload and parse a resume
    Expects: file, user_id in form data
    """
    try:
        # Check if file is present
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400

        file = request.files['file']
        user_id = request.form.get('user_id')

        if not user_id:
            return jsonify({'error': 'user_id is required'}), 400

        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400

        if not allowed_file(file.filename):
            return jsonify({'error': 'Only PDF and DOCX files are allowed'}), 400

        # Save file temporarily
        filename = secure_filename(file.filename)
        file_path = os.path.join(UPLOAD_FOLDER, f"{uuid.uuid4()}_{filename}")
        file.save(file_path)

        try:
            # Get file info
            file_size = os.path.getsize(file_path)
            file_type = filename.rsplit('.', 1)[1].lower()

            # Create initial resume record
            resume_data = {
                'user_id': user_id,
                'file_name': filename,
                'file_url': file_path,  # In production, upload to Supabase Storage
                'file_size': file_size,
                'file_type': file_type,
                'status': 'parsing'
            }

            # Insert into database
            resume_record = supabase_service.insert_resume(resume_data)

            if not resume_record:
                raise Exception("Failed to create resume record")

            resume_id = resume_record['id']

            # Parse the resume
            try:
                parsed_data = resume_parser.parse_resume(file_path, file_type)
                entities = parsed_data['entities']

                # Update resume with parsed data
                update_data = {
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

                updated_resume = supabase_service.update_resume(resume_id, update_data)

                return jsonify({
                    'message': 'Resume uploaded and parsed successfully',
                    'resume': updated_resume
                }), 200

            except Exception as parse_error:
                # Update status to error
                supabase_service.update_resume(resume_id, {'status': 'error'})
                return jsonify({
                    'error': 'Failed to parse resume',
                    'details': str(parse_error),
                    'resume_id': resume_id
                }), 500

        finally:
            # Clean up temporary file
            if os.path.exists(file_path):
                os.remove(file_path)

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@resume_bp.route('/', methods=['GET'])
def get_resumes():
    """
    Get resumes
    Query params: user_id (optional), skills (optional), min_experience (optional)
    """
    try:
        user_id = request.args.get('user_id')
        skills = request.args.getlist('skills')
        min_experience = request.args.get('min_experience', type=int)
        max_experience = request.args.get('max_experience', type=int)

        if user_id:
            # Get specific user's resumes
            resumes = supabase_service.get_user_resumes(user_id)
        else:
            # Search resumes with filters
            resumes = supabase_service.search_resumes(
                skills=skills if skills else None,
                min_experience=min_experience,
                max_experience=max_experience
            )

        return jsonify({
            'resumes': resumes,
            'count': len(resumes)
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@resume_bp.route('/<resume_id>', methods=['GET'])
def get_resume(resume_id):
    """Get a specific resume by ID"""
    try:
        resume = supabase_service.get_resume(resume_id)

        if not resume:
            return jsonify({'error': 'Resume not found'}), 404

        return jsonify({'resume': resume}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@resume_bp.route('/<resume_id>', methods=['DELETE'])
def delete_resume(resume_id):
    """Delete a resume"""
    try:
        success = supabase_service.delete_resume(resume_id)

        if not success:
            return jsonify({'error': 'Failed to delete resume'}), 500

        return jsonify({'message': 'Resume deleted successfully'}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@resume_bp.route('/search', methods=['POST'])
def search_resumes():
    """
    Advanced resume search
    Body: { "skills": [...], "min_experience": 3, "max_experience": 7 }
    """
    try:
        data = request.get_json()
        skills = data.get('skills', [])
        min_experience = data.get('min_experience')
        max_experience = data.get('max_experience')

        resumes = supabase_service.search_resumes(
            skills=skills if skills else None,
            min_experience=min_experience,
            max_experience=max_experience
        )

        return jsonify({
            'resumes': resumes,
            'count': len(resumes),
            'query': {
                'skills': skills,
                'min_experience': min_experience,
                'max_experience': max_experience
            }
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500
