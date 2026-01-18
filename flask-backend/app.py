"""
HireSight Flask Backend Application
Main entry point for the Flask API server
"""

from flask import Flask, jsonify
from flask_cors import CORS
from config import Config

app = Flask(__name__)
app.config.from_object(Config)

CORS(app, resources={r"/api/*": {"origins": "*"}})

Config.init_app(app)

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'message': 'HireSight API is running'
    }), 200

@app.route('/', methods=['GET'])
def index():
    """Root endpoint"""
    return jsonify({
        'name': 'HireSight API',
        'version': '1.0.0',
        'description': 'AI-Driven Resume Screening and Recruitment Platform'
    }), 200

from routes.resume_routes import resume_bp
from routes.job_routes import job_bp
from routes.application_routes import application_bp
from routes.interview_routes import interview_bp
from routes.analytics_routes import analytics_bp

app.register_blueprint(resume_bp)
app.register_blueprint(job_bp)
app.register_blueprint(application_bp)
app.register_blueprint(interview_bp)
app.register_blueprint(analytics_bp)

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Endpoint not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
