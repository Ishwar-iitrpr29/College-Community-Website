# from flask import Flask, request, jsonify, send_from_directory, g
# from flask_sqlalchemy import SQLAlchemy
# from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
# from flask_migrate import Migrate
# from werkzeug.utils import secure_filename
# from werkzeug.security import check_password_hash, generate_password_hash
# import os
# from dotenv import load_dotenv
# import cloudinary
# import cloudinary.uploader
# import cloudinary.api
# from datetime import datetime, timedelta
# from flask_cors import CORS
# from flasgger import Swagger, swag_from
# import re
# import logging
# import requests
# from bs4 import BeautifulSoup
# import re
# import json
# import random
# import smtplib
# from email.mime.text import MIMEText
# from email.mime.multipart import MIMEMultipart
# import time
# from functools import wraps
# from flask_mail import Mail, Message
# import string
# # Update to the main Flask app to include the MDP ranking system

# # Add these imports to the existing imports
# from app_updates import register_updates_blueprint
# from models import UserStateTransition, UserPreference, UpdateInteraction

# # Load environment variables from .env file
# load_dotenv()

# # Configure logging
# logging.basicConfig(level=logging.DEBUG)
# logger = logging.getLogger(__name__)

# # Security headers function
# def add_security_headers(response):
#     """Add security headers to each response"""
#     response.headers['Content-Security-Policy'] = "default-src 'self'; img-src 'self' data: https:; style-src 'self' 'unsafe-inline' https:; script-src 'self' 'unsafe-inline' 'unsafe-eval' https:; connect-src 'self' http://localhost:5000;"
#     response.headers['X-Content-Type-Options'] = 'nosniff'
#     response.headers['X-Frame-Options'] = 'DENY'
#     response.headers['X-XSS-Protection'] = '1; mode=block'
#     response.headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains'
#     response.headers['Referrer-Policy'] = 'strict-origin-when-cross-origin'
#     return response

# # Initialize app
# app = Flask(__name__)
# CORS(app, resources={
#     r"/*": {
#         "origins": ["http://localhost:3000"],
#         "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
#         "allow_headers": ["Content-Type", "Authorization"],
#         "expose_headers": ["Content-Range", "X-Content-Range"],
#         "supports_credentials": True,
#         "max_age": 3600
#     }
# })

# # Get the current directory
# BASE_DIR = os.path.abspath(os.path.dirname(__file__))
# DB_PATH = os.path.join(BASE_DIR, 'dep.db')

# # Ensure the database directory exists
# os.makedirs(BASE_DIR, exist_ok=True)


# # Configurations
# app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///database.db')
# app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET', 'your-secret-key')
# app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size
# app.config['UPLOAD_FOLDER'] = 'uploads'
# app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
# app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=1)
# app.config['MAIL_SERVER'] = 'smtp.gmail.com'
# app.config['MAIL_PORT'] = 587
# app.config['MAIL_USE_TLS'] = True
# app.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME', 'depplatfrom@gmail.com')
# app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD', 'your_app_password_here')  # Replace with your actual app password
# app.config['MAIL_DEFAULT_SENDER'] = os.getenv('MAIL_DEFAULT_SENDER', 'depplatfrom@gmail.com')

# # Ensure upload folder exists
# if not os.path.exists(app.config['UPLOAD_FOLDER']):
#     os.makedirs(app.config['UPLOAD_FOLDER'])

# db = SQLAlchemy(app)
# migrate = Migrate(app, db)
# jwt = JWTManager(app)

# # Cloudinary Configuration
# cloudinary.config(
#     cloud_name=os.getenv('CLOUDINARY_CLOUD_NAME'),
#     api_key=os.getenv('CLOUDINARY_API_KEY'),
#     api_secret=os.getenv('CLOUDINARY_API_SECRET')
# )
# mail = Mail(app)
# # Models
# class User(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     username = db.Column(db.String(80), unique=True, nullable=False)
#     password_hash = db.Column(db.String(120), nullable=False)
#     email = db.Column(db.String(120), unique=True, nullable=True)
#     bio = db.Column(db.Text, nullable=True)
#     profile_picture = db.Column(db.String(200), nullable=True)
#     created_at = db.Column(db.DateTime, server_default=db.func.now())
#     last_login = db.Column(db.DateTime, nullable=True)
#     password_changed_at = db.Column(db.DateTime, nullable=True)
#     is_verified = db.Column(db.Boolean, default=False)
#     verification_token = db.Column(db.String(100), nullable=True)
#     verification_token_expires = db.Column(db.DateTime, nullable=True)

#     def set_password(self, password):
#         self.password_hash = generate_password_hash(password)

#     def check_password(self, password):
#         return check_password_hash(self.password_hash, password)

#     def generate_verification_token(self):
#         self.verification_token = ''.join(random.choices(string.ascii_letters + string.digits, k=32))
#         self.verification_token_expires = datetime.utcnow() + timedelta(hours=24)
#         return self.verification_token
#     def verify_email(self, token):
#         if (self.verification_token == token and 
#             self.verification_token_expires and 
#             datetime.utcnow() < self.verification_token_expires):
#             self.is_verified = True
#             self.verification_token = None
#             self.verification_token_expires = None
#             return True
#         return False
# class OTP(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     email = db.Column(db.String(120), nullable=False)
#     otp_code = db.Column(db.String(6), nullable=False)
#     created_at = db.Column(db.DateTime, default=datetime.utcnow)
#     expires_at = db.Column(db.DateTime, nullable=False)
#     is_used = db.Column(db.Boolean, default=False)
#     attempts = db.Column(db.Integer, default=0)  # Add attempts counter
#     max_attempts = db.Column(db.Integer, default=5)  # Add max attempts
#     reset_token = db.Column(db.String(100), nullable=True)  # Add reset token column

#     __table_args__ = (
#         db.Index('idx_email_otp', 'email', 'otp_code'),
#         db.Index('idx_expires_at', 'expires_at')
#     )
# class Upload(db.Model):
#     id = db.Column(db.Integer, primary_key=True, autoincrement=True)
#     author = db.Column(db.String(80), nullable=False)
#     course_code = db.Column(db.String(20), nullable=False)
#     description = db.Column(db.String(200), nullable=False)
#     tags = db.Column(db.String(200), nullable=False)  # Comma-separated tags
#     file_url = db.Column(db.String(500), nullable=True)  # File path or link
#     public_id = db.Column(db.String(200), nullable=True)  # Cloudinary public ID
#     upvotes = db.Column(db.Integer, default=0)
#     downvotes = db.Column(db.Integer, default=0)
#     year = db.Column(db.String(10), nullable=True)
#     semester = db.Column(db.String(20), nullable=True)
#     created_at = db.Column(db.DateTime, default=datetime.utcnow)
#     file_type = db.Column(db.String(10), nullable=True)  # Store file extension
#     __table_args__ = (
#         db.Index('idx_course_code', 'course_code'),
#         db.Index('idx_created_at', 'created_at'),
#         db.Index('idx_author', 'author')
#     )

# class Comment(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     upload_id = db.Column(db.Integer, db.ForeignKey('upload.id'), nullable=False)
#     author = db.Column(db.String(80), nullable=False)
#     text = db.Column(db.String(500), nullable=False)
#     created_at = db.Column(db.DateTime, default=datetime.utcnow)

# class Vote(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     upload_id = db.Column(db.Integer, db.ForeignKey('upload.id'), nullable=False)
#     user = db.Column(db.String(80), nullable=False)
#     vote_type = db.Column(db.String(10), nullable=False)  # 'upvote' or 'downvote'
#     created_at = db.Column(db.DateTime, default=datetime.utcnow)
#     __table_args__ = (
#         db.UniqueConstraint('upload_id', 'user', name='unique_user_vote'),
#     )

# # Model for placement data
# class Placement(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     company = db.Column(db.String(100), nullable=False)
#     type = db.Column(db.String(20), nullable=False)  # 'Internship' or 'Placement'
#     mode = db.Column(db.String(20), nullable=False)  # 'On Campus' or 'Off Campus'
#     year = db.Column(db.String(4), nullable=False)
#     role = db.Column(db.String(100), nullable=False)
#     referral = db.Column(db.String(3), nullable=False)  # 'Yes' or 'No'
#     created_at = db.Column(db.DateTime, default=datetime.utcnow)
#     created_by = db.Column(db.String(80), nullable=False)

# class PlacementPerson(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     placement_id = db.Column(db.Integer, db.ForeignKey('placement.id'), nullable=False)
#     name = db.Column(db.String(100), nullable=False)
#     resume_url = db.Column(db.String(500), nullable=True)
#     resume_public_id = db.Column(db.String(200), nullable=True)


# # Model for interview experiences
# class InterviewExperience(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     company = db.Column(db.String(100), nullable=False)
#     candidate_name = db.Column(db.String(100), nullable=False)
#     interviewer_name = db.Column(db.String(100), nullable=True)
#     year = db.Column(db.String(4), nullable=False)
#     type = db.Column(db.String(20), nullable=False)  # 'Internship' or 'Placement'
#     tips = db.Column(db.Text, nullable=True)
#     created_at = db.Column(db.DateTime, default=datetime.utcnow)
#     created_by = db.Column(db.String(80), nullable=False)
#     tags = db.Column(db.String(200), nullable=True)  # Comma-separated tags

# class InterviewQuestion(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     interview_id = db.Column(db.Integer, db.ForeignKey('interview_experience.id'), nullable=False)
#     question = db.Column(db.Text, nullable=False)
#     answer = db.Column(db.Text, nullable=False)

# # Classroom type discussion backend
# class Classroom(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     name = db.Column(db.String(100), nullable=False)
#     description = db.Column(db.Text, nullable=True)
#     created_by = db.Column(db.String(80), nullable=False)
#     created_at = db.Column(db.DateTime, default=datetime.utcnow)

# class ClassroomMembership(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     user_id = db.Column(db.String(80), nullable=False)
#     classroom_id = db.Column(db.Integer, db.ForeignKey('classroom.id'), nullable=False)
#     joined_at = db.Column(db.DateTime, default=datetime.utcnow)
#     __table_args__ = (
#         db.UniqueConstraint('user_id', 'classroom_id', name='unique_user_classroom'),
#     )

# class ClassroomMessage(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     user_id = db.Column(db.String(80), nullable=False)
#     classroom_id = db.Column(db.Integer, db.ForeignKey('classroom.id'), nullable=False)
#     content = db.Column(db.Text, nullable=False)
#     timestamp = db.Column(db.DateTime, default=datetime.utcnow)

# class UserStateTransition(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     user_id = db.Column(db.String(80), nullable=False)
#     old_state = db.Column(db.String(50), nullable=False)
#     new_state = db.Column(db.String(50), nullable=False)
#     timestamp = db.Column(db.DateTime, default=datetime.utcnow)

# class UserPreference(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     user_id = db.Column(db.String(80), nullable=False)
#     preference_type = db.Column(db.String(50), nullable=False)
#     preference_value = db.Column(db.String(200), nullable=False)
#     timestamp = db.Column(db.DateTime, default=datetime.utcnow)

# class UpdateInteraction(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     user_id = db.Column(db.String(80), nullable=False)
#     update_id = db.Column(db.Integer, nullable=False)
#     interaction_type = db.Column(db.String(50), nullable=False)
#     timestamp = db.Column(db.DateTime, default=datetime.utcnow)

# # Helper function for allowed file extensions
# ALLOWED_EXTENSIONS = {'pdf', 'png', 'jpg', 'jpeg', 'docx', 'txt'}
# def allowed_file(filename):
#     return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# # Routes
# def validate_username(username):
#     if not username or len(username) < 3:
#         return False, "Username must be at least 3 characters long"
#     if not re.match(r'^[a-zA-Z0-9_]+$', username):
#         return False, "Username can only contain letters, numbers, and underscores"
#     return True, None

# def validate_password(password):
#     if not password or len(password) < 6:
#         return False, "Password must be at least 6 characters long"
#     if not re.match(r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)', password):
#         return False, "Password must contain at least one uppercase letter, one lowercase letter, and one number"
#     return True, None

# # @app.route('/signup', methods=['POST'])
# # def signup():
# #     try:
# #         logger.debug("Received signup request")
# #         data = request.get_json()
        
# #         if not data:
# #             logger.warning("No data provided in signup request")
# #             return jsonify({'message': 'No data provided'}), 400

# #         username = data.get('username')
# #         password = data.get('password')

# #         logger.debug(f"Attempting to create user: {username}")

# #         # Validate username
# #         is_valid_username, username_error = validate_username(username)
# #         if not is_valid_username:
# #             logger.warning(f"Invalid username: {username_error}")
# #             return jsonify({'message': username_error}), 400

# #         # Validate password
# #         is_valid_password, password_error = validate_password(password)
# #         if not is_valid_password:
# #             logger.warning(f"Invalid password: {password_error}")
# #             return jsonify({'message': password_error}), 400

# #         # Check if username already exists
# #         if User.query.filter_by(username=username).first():
# #             logger.warning(f"Username already exists: {username}")
# #             return jsonify({'message': 'Username already exists'}), 409

# #         # Create new user
# #         new_user = User(username=username)
# #         new_user.set_password(password)
        
# #         try:
# #             db.session.add(new_user)
# #             db.session.commit()
# #             logger.info(f"User created successfully: {username}")
# #             return jsonify({'message': 'User created successfully'}), 201
# #         except Exception as db_error:
# #             db.session.rollback()
# #             logger.error(f"Database error during signup: {str(db_error)}")
# #             return jsonify({'message': 'Error creating user. Please try again.'}), 500

# #     except Exception as e:
# #         logger.error(f"Unexpected error during signup: {str(e)}")
# #         return jsonify({'message': 'An unexpected error occurred'}), 500

# @app.route('/signup', methods=['POST'])
# def signup():
#     data = request.get_json()
#     logger.debug(f"Received signup data: {data}")
    
#     # Validate required fields
#     if not all(k in data for k in ['email', 'username', 'password']):
#         missing_fields = [k for k in ['email', 'username', 'password'] if k not in data]
#         logger.warning(f"Missing required fields: {missing_fields}")
#         return jsonify({'error': f'Missing required fields: {missing_fields}'}), 400
    
#     email = data['email']
#     username = data['username']
#     password = data['password']
    
#     logger.debug(f"Processing signup for email: {email}, username: {username}")
    
#     # Validate IITRPR email domain
#     if not email.endswith('@iitrpr.ac.in'):
#         logger.warning(f"Invalid email domain for: {email}")
#         return jsonify({'error': 'Only IITRPR email addresses (@iitrpr.ac.in) are allowed'}), 400
    
#     # Validate email format
#     if not re.match(r"[^@]+@iitrpr\.ac\.in$", email):
#         logger.warning(f"Invalid email format for: {email}")
#         return jsonify({'error': 'Invalid IITRPR email format'}), 400
    
#     # Check if username already exists
#     if User.query.filter_by(username=username).first():
#         logger.warning(f"Username already exists: {username}")
#         return jsonify({'error': 'Username already exists'}), 409
    
#     # Check if email already exists
#     if User.query.filter_by(email=email).first():
#         logger.warning(f"Email already exists: {email}")
#         return jsonify({'error': 'Email already exists'}), 409
    
#     try:
#         # Create new user
#         new_user = User(
#             username=username,
#             email=email
#         )
#         new_user.set_password(password)
        
#         db.session.add(new_user)
#         db.session.commit()
#         logger.info(f"User created successfully: {email}")
        
#         # Send welcome email
#         if send_welcome_email(email, username):
#             logger.info(f"Welcome email sent to {email}")
#         else:
#             logger.warning(f"Failed to send welcome email to {email}")
        
#         return jsonify({'message': 'User registered successfully'}), 201
#     except Exception as e:
#         db.session.rollback()
#         logger.error(f"Error during signup: {str(e)}")
#         return jsonify({'error': 'An error occurred during registration'}), 500

# @app.route('/request-password-reset', methods=['POST'])
# def request_password_reset():
#     try:
#         data = request.get_json()
#         email = data.get('email')
        
#         if not email:
#             return jsonify({'error': 'Email is required'}), 400
            
#         # Get client IP for rate limiting
#         client_ip = request.remote_addr
#         rate_limit_key = f"pwd_reset:{client_ip}:{email}"
        
#         # Check rate limiting
#         now = time.time()
#         if hasattr(g, 'rate_limits') and rate_limit_key in g.rate_limits:
#             attempts = [t for t in g.rate_limits[rate_limit_key] if now - t < 3600]  # 1 hour window
#             if len(attempts) >= 5:  # 5 attempts per hour
#                 retry_after = 3600 - (now - attempts[0])
#                 return jsonify({
#                     'error': 'Too many reset attempts',
#                     'retry_after': retry_after,
#                     'attempts_remaining': 0,
#                     'window_reset': attempts[0] + 3600
#                 }), 429
            
#             attempts_remaining = 5 - len(attempts)
#         else:
#             if not hasattr(g, 'rate_limits'):
#                 g.rate_limits = {}
#             g.rate_limits[rate_limit_key] = []
#             attempts_remaining = 5

#         # Add current attempt
#         if rate_limit_key in g.rate_limits:
#             g.rate_limits[rate_limit_key].append(now)
            
#         # Validate IITRPR email domain
#         if not email.endswith('@iitrpr.ac.in'):
#             return jsonify({'error': 'Only IITRPR email addresses (@iitrpr.ac.in) are allowed'}), 400
        
#         # Check if user exists
#         user = User.query.filter_by(email=email).first()
#         if not user:
#             return jsonify({'error': 'No account found with this email'}), 404
        
#         # Generate OTP for password reset
#         otp = ''.join(random.choices('0123456789', k=6))
#         expires_at = datetime.utcnow() + timedelta(minutes=10)  # 10 minutes expiry
        
#         # Create OTP record
#         otp_record = OTP(
#             email=email,
#             otp_code=otp,
#             expires_at=expires_at,
#             is_used=False
#         )
        
#         try:
#             db.session.add(otp_record)
#             db.session.commit()
            
#             # Send OTP via email with password reset specific message
#             if send_password_reset_email(email, otp):
#                 return jsonify({
#                     'message': 'Password reset OTP sent successfully to your email',
#                     'expires_in': 600,  # 10 minutes in seconds
#                     'attempts_remaining': attempts_remaining - 1,
#                     'window_reset': now + 3600
#                 }), 200
#             else:
#                 return jsonify({'error': 'Failed to send password reset email'}), 500
                
#         except Exception as e:
#             db.session.rollback()
#             logger.error(f"Error saving password reset OTP: {str(e)}")
#             return jsonify({'error': 'Failed to generate password reset OTP'}), 500
            
#     except Exception as e:
#         logger.error(f"Error in request_password_reset: {str(e)}")
#         return jsonify({'error': 'An unexpected error occurred'}), 500

# @app.route('/verify-reset-otp', methods=['POST'])
# def verify_reset_otp():
#     try:
#         data = request.get_json()
#         email = data.get('email')
#         otp = data.get('otp')
#         new_password = data.get('new_password')
        
#         if not all([email, otp, new_password]):
#             return jsonify({'error': 'Email, OTP, and new password are required'}), 400
        
#         # Validate password
#         if len(new_password) < 6:
#             return jsonify({'error': 'Password must be at least 6 characters long'}), 400
#         if not re.match(r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)', new_password):
#             return jsonify({'error': 'Password must contain at least one uppercase letter, one lowercase letter, and one number'}), 400
        
#         # Find the most recent unused OTP for this email
#         otp_record = OTP.query.filter_by(
#             email=email,
#             otp_code=otp,
#             is_used=False
#         ).order_by(OTP.created_at.desc()).first()
        
#         if not otp_record:
#             return jsonify({'error': 'Invalid OTP'}), 400
        
#         # Check if OTP has expired
#         if datetime.utcnow() > otp_record.expires_at:
#             return jsonify({'error': 'OTP has expired'}), 400
        
#         try:
#             # Mark OTP as used
#             otp_record.is_used = True
            
#             # Update user's password
#             user = User.query.filter_by(email=email).first()
#             if not user:
#                 return jsonify({'error': 'User not found'}), 404
                
#             user.set_password(new_password)
#             user.password_changed_at = datetime.utcnow()  # Track password change time
#             db.session.commit()
            
#             return jsonify({'message': 'Password reset successful'}), 200
            
#         except Exception as e:
#             db.session.rollback()
#             logger.error(f"Error during password reset: {str(e)}")
#             return jsonify({'error': 'An error occurred during password reset'}), 500
            
#     except Exception as e:
#         logger.error(f"Error in verify_reset_otp: {str(e)}")
#         return jsonify({'error': 'An unexpected error occurred'}), 500

# def send_password_reset_email(email, otp):
#     try:
#         # Create message
#         msg = MIMEMultipart('alternative')
#         msg['From'] = f"DEP Platform <{os.getenv('EMAIL_USERNAME')}>"
#         msg['To'] = email
#         msg['Subject'] = 'Password Reset Request - DEP Platform'

#         # Create HTML version of the email
#         html = f"""
#         <html>
#             <head>
#                 <style>
#                     body {{
#                         font-family: Arial, sans-serif;
#                         line-height: 1.6;
#                         color: #333333;
#                         max-width: 600px;
#                         margin: 0 auto;
#                         padding: 20px;
#                     }}
#                     .header {{
#                         background-color: #1a237e;
#                         color: white;
#                         padding: 20px;
#                         text-align: center;
#                         border-radius: 5px;
#                     }}
#                     .content {{
#                         background-color: #ffffff;
#                         padding: 20px;
#                         border-radius: 5px;
#                         margin-top: 20px;
#                     }}
#                     .otp {{
#                         font-size: 32px;
#                         font-weight: bold;
#                         color: #1a237e;
#                         text-align: center;
#                         padding: 20px;
#                         margin: 20px 0;
#                         background-color: #f5f5f5;
#                         border-radius: 5px;
#                         letter-spacing: 5px;
#                     }}
#                     .warning {{
#                         color: #d32f2f;
#                         font-weight: bold;
#                         margin-top: 20px;
#                         padding: 10px;
#                         background-color: #ffebee;
#                         border-radius: 5px;
#                     }}
#                 </style>
#             </head>
#             <body>
#                 <div class="header">
#                     <h1>Password Reset Request</h1>
#                 </div>
#                 <div class="content">
#                     <p>Dear User,</p>
#                     <p>We received a request to reset your password for your DEP Platform account. To proceed with the password reset, please use the following OTP (One-Time Password):</p>
#                     <div class="otp">{otp}</div>
#                     <p><strong>Important Notes:</strong></p>
#                     <ul>
#                         <li>This OTP will expire in 10 minutes</li>
#                         <li>If you didn't request this password reset, please ignore this email</li>
#                         <li>Your account security is important to us</li>
#                     </ul>
#                     <div class="warning">
#                         <p>⚠️ Security Notice:</p>
#                         <ul>
#                             <li>Never share your OTP with anyone</li>
#                             <li>Our team will never ask for your OTP</li>
#                             <li>This is an automated message, please do not reply</li>
#                         </ul>
#                     </div>
#                     <p>Best regards,<br>DEP Platform Team</p>
#                 </div>
#             </body>
#         </html>
#         """

#         # Create plain text version
#         text = f"""
#         Password Reset Request - DEP Platform

#         Dear User,

#         We received a request to reset your password for your DEP Platform account. To proceed with the password reset, please use the following OTP (One-Time Password):

#         {otp}

#         Important Notes:
#         - This OTP will expire in 10 minutes
#         - If you didn't request this password reset, please ignore this email
#         - Your account security is important to us

#         Security Notice:
#         ⚠️ Never share your OTP with anyone
#         ⚠️ Our team will never ask for your OTP
#         ⚠️ This is an automated message, please do not reply

#         Best regards,
#         DEP Platform Team
#         """

#         # Attach both versions
#         msg.attach(MIMEText(text, 'plain'))
#         msg.attach(MIMEText(html, 'html'))

#         # Create SMTP session and send email
#         server = smtplib.SMTP(os.getenv('EMAIL_SERVER'), int(os.getenv('EMAIL_PORT')))
#         server.starttls()
#         server.login(os.getenv('EMAIL_USERNAME'), os.getenv('EMAIL_PASSWORD'))
#         server.send_message(msg)
#         server.quit()
        
#         return True
#     except Exception as e:
#         logger.error(f"Error sending password reset email: {str(e)}")
#         return False


# # @app.route('/login', methods=['POST'])
# # def login():
# #     try:
# #         data = request.get_json()
        
# #         if not data:
# #             return jsonify({'message': 'No data provided'}), 400

# #         username = data.get('username')
# #         password = data.get('password')

# #         if not username or not password:
# #             return jsonify({'message': 'Username and password are required'}), 400

# #         user = User.query.filter_by(username=username).first()
        
# #         if not user or not user.check_password(password):
# #             return jsonify({'message': 'Invalid username or password'}), 401

# #         # Update last login
# #         user.last_login = db.func.now()
# #         db.session.commit()

# #         # Create access token
# #         access_token = create_access_token(identity=username)
        
# #         return jsonify({
# #             'access_token': access_token,
# #             'username': username
# #         }), 200

# #     except Exception as e:
# #         return jsonify({'message': 'An unexpected error occurred'}), 500

# @app.route('/login', methods=['POST'])
# def login():
#     try:
#         data = request.get_json()
        
#         if not data:
#             return jsonify({'message': 'No data provided'}), 400

#         email = data.get('email')
#         password = data.get('password')

#         if not email or not password:
#             return jsonify({'message': 'Email and password are required'}), 400

#         user = User.query.filter_by(email=email).first()
        
#         if not user or not user.check_password(password):
#             return jsonify({'message': 'Invalid email or password'}), 401

#         # Update last login
#         user.last_login = db.func.now()
#         db.session.commit()

#         # Create access token
#         access_token = create_access_token(identity=user.username)
        
#         return jsonify({
#             'access_token': access_token,
#             'username': user.username
#         }), 200

#     except Exception as e:
#         logger.error(f"Login error: {str(e)}")
#         return jsonify({'message': 'An unexpected error occurred'}), 500

# # Rate limiting decorator
# def rate_limit(limit=5, period=600):  # 5 requests per 10 minutes
#     def decorator(f):
#         @wraps(f)
#         def wrapped(*args, **kwargs):
#             # Get client IP
#             client_ip = request.remote_addr
#             key = f"rate_limit:{client_ip}:{f.__name__}"
            
#             # Get current timestamp
#             now = time.time()
            
#             # Initialize g object if it doesn't exist
#             if not hasattr(g, 'rate_limits'):
#                 g.rate_limits = {}
            
#             # Get existing requests or initialize
#             if key not in g.rate_limits:
#                 g.rate_limits[key] = []
            
#             requests = g.rate_limits[key]
#             # Remove old requests
#             requests = [req for req in requests if now - req < period]
            
#             # Check if limit exceeded
#             if len(requests) >= limit:
#                 return jsonify({
#                     'error': 'Too many requests. Please try again later.',
#                     'retry_after': int(period - (now - requests[0]))
#                 }), 429
            
#             # Add current request
#             requests.append(now)
#             g.rate_limits[key] = requests
            
#             # Call the original function
#             return f(*args, **kwargs)
#         return wrapped
#     return decorator

# # Session management for OTP attempts
# otp_attempts = {}

# def track_otp_attempts(email, max_attempts=5, window_minutes=10):
#     current_time = time.time()
#     if email not in otp_attempts:
#         otp_attempts[email] = []
    
#     # Remove old attempts
#     otp_attempts[email] = [t for t in otp_attempts[email] if current_time - t < window_minutes * 60]
    
#     # Check if max attempts exceeded
#     if len(otp_attempts[email]) >= max_attempts:
#         return False, window_minutes * 60 - (current_time - otp_attempts[email][0]), 0
    
#     # Add new attempt
#     otp_attempts[email].append(current_time)
#     attempts_left = max_attempts - len(otp_attempts[email])
#     return True, 0, attempts_left

# def validate_otp_format(otp):
#     if not otp or not isinstance(otp, str):
#         return False
#     if not otp.isdigit():
#         return False
#     if len(otp) != 6:
#         return False
#     return True

# @app.route('/verify-otp', methods=['POST'])
# def verify_otp():
#     data = request.get_json()
#     email = data.get('email')
#     otp = data.get('otp')
    
#     if not email or not otp:
#         logger.warning(f"Missing email or OTP in verification request")
#         return jsonify({'error': 'Email and OTP are required'}), 400
    
#     # Validate OTP format
#     if not validate_otp_format(otp):
#         logger.warning(f"Invalid OTP format for email: {email}")
#         return jsonify({'error': 'Invalid OTP format'}), 400
    
#     # Check for too many attempts
#     allowed, retry_after, attempts_left = track_otp_attempts(email)
#     if not allowed:
#         logger.warning(f"Too many OTP verification attempts for email: {email}")
#         return jsonify({
#             'error': 'Too many verification attempts. Please try again later.',
#             'retry_after': int(retry_after),
#             'attempts_left': attempts_left
#         }), 429
    
#     # Find the most recent unused OTP for this email
#     otp_record = OTP.query.filter_by(
#         email=email,
#         otp_code=otp,  # This matches the field name in the database
#         is_used=False
#     ).order_by(OTP.created_at.desc()).first()
    
#     if not otp_record:
#         logger.warning(f"Invalid OTP attempt for email: {email}")
#         return jsonify({
#             'error': 'Invalid OTP',
#             'attempts_left': attempts_left
#         }), 400
    
#     # Check if OTP has expired
#     if datetime.utcnow() > otp_record.expires_at:
#         logger.warning(f"Expired OTP attempt for email: {email}")
#         return jsonify({
#             'error': 'OTP has expired',
#             'attempts_left': attempts_left
#         }), 400
    
#     try:
#         # Mark OTP as used
#         otp_record.is_used = True
        
#         # Get user and update last login
#         user = User.query.filter_by(email=email).first()
#         if not user:
#             logger.error(f"User not found for email: {email}")
#             return jsonify({'error': 'User not found'}), 404
            
#         user.last_login = datetime.utcnow()
        
#         # Generate access token
#         access_token = create_access_token(identity=user.username)
        
#         db.session.commit()
        
#         logger.info(f"Successful OTP verification for email: {email}")
#         return jsonify({
#             'message': 'OTP verified successfully',
#             'access_token': access_token,
#             'username': user.username
#         }), 200
        
#     except Exception as e:
#         db.session.rollback()
#         logger.error(f"Error during OTP verification for email {email}: {str(e)}")
#         return jsonify({'error': 'An error occurred during verification'}), 500

# def send_otp_email(email, otp):
#     try:
#         # Create message
#         msg = MIMEMultipart('alternative')
#         msg['From'] = f"DEP Platform <{os.getenv('EMAIL_USERNAME')}>"
#         msg['To'] = email
#         msg['Subject'] = 'Your DEP Platform Login OTP'

#         # Create HTML version of the email
#         html = f"""
#         <html>
#             <head>
#                 <style>
#                     body {{
#                         font-family: Arial, sans-serif;
#                         line-height: 1.6;
#                         color: #333333;
#                         max-width: 600px;
#                         margin: 0 auto;
#                         padding: 20px;
#                     }}
#                     .header {{
#                         background-color: #1a237e;
#                         color: white;
#                         padding: 20px;
#                         text-align: center;
#                         border-radius: 5px;
#                     }}
#                     .content {{
#                         background-color: #ffffff;
#                         padding: 20px;
#                         border-radius: 5px;
#                         margin-top: 20px;
#                     }}
#                     .otp {{
#                         font-size: 32px;
#                         font-weight: bold;
#                         color: #1a237e;
#                         text-align: center;
#                         padding: 20px;
#                         margin: 20px 0;
#                         background-color: #f5f5f5;
#                         border-radius: 5px;
#                         letter-spacing: 5px;
#                     }}
#                     .footer {{
#                         text-align: center;
#                         margin-top: 20px;
#                         font-size: 12px;
#                         color: #666666;
#                     }}
#                     .warning {{
#                         color: #d32f2f;
#                         font-weight: bold;
#                         margin-top: 20px;
#                         padding: 10px;
#                         background-color: #ffebee;
#                         border-radius: 5px;
#                     }}
#                 </style>
#             </head>
#             <body>
#                 <div class="header">
#                     <h1>DEP Platform Login Verification</h1>
#                 </div>
#                 <div class="content">
#                     <p>Dear User,</p>
#                     <p>Thank you for using the DEP Platform. To complete your login process, please use the following OTP (One-Time Password):</p>
#                     <div class="otp">{otp}</div>
#                     <p><strong>Important Notes:</strong></p>
#                     <ul>
#                         <li>This OTP will expire in 10 minutes</li>
#                         <li>Do not share this OTP with anyone</li>
#                         <li>If you didn't request this OTP, please ignore this email</li>
#                     </ul>
#                     <div class="warning">
#                         <p>⚠️ Security Notice:</p>
#                         <ul>
#                             <li>Never share your OTP with anyone</li>
#                             <li>Our team will never ask for your OTP</li>
#                             <li>This is an automated message, please do not reply</li>
#                         </ul>
#                     </div>
#                     <p>Best regards,<br>DEP Platform Team</p>
#                 </div>
#                 <div class="footer">
#                     <p>This is an automated message, please do not reply to this email.</p>
#                     <p>© 2024 DEP Platform. All rights reserved.</p>
#                 </div>
#             </body>
#         </html>
#         """

#         # Create plain text version
#         text = f"""
#         DEP Platform Login Verification

#         Dear User,

#         Thank you for using the DEP Platform. To complete your login process, please use the following OTP (One-Time Password):

#         {otp}

#         Important Notes:
#         - This OTP will expire in 10 minutes
#         - Do not share this OTP with anyone
#         - If you didn't request this OTP, please ignore this email

#         Security Notice:
#         ⚠️ Never share your OTP with anyone
#         ⚠️ Our team will never ask for your OTP
#         ⚠️ This is an automated message, please do not reply

#         Best regards,
#         DEP Platform Team

#         This is an automated message, please do not reply to this email.
#         © 2024 DEP Platform. All rights reserved.
#         """

#         # Attach both HTML and plain text versions
#         msg.attach(MIMEText(text, 'plain'))
#         msg.attach(MIMEText(html, 'html'))

#         # Create SMTP session
#         server = smtplib.SMTP(os.getenv('EMAIL_SERVER'), int(os.getenv('EMAIL_PORT')))
#         server.starttls()
#         server.login(os.getenv('EMAIL_USERNAME'), os.getenv('EMAIL_PASSWORD'))
        
#         # Send email
#         server.send_message(msg)
#         server.quit()
        
#         logger.info(f"OTP email sent successfully to {email}")
#         return True
#     except Exception as e:
#         logger.error(f"Error sending OTP email to {email}: {str(e)}")
#         return False

# @app.route('/generate-otp', methods=['POST'])
# def generate_otp():
#     try:
#         data = request.get_json()
#         logger.debug(f"Received OTP generation request: {data}")
        
#         if not data or 'email' not in data:
#             logger.warning("Missing email in OTP request")
#             return jsonify({'error': 'Email is required'}), 400
            
#         email = data['email']
        
#         # Validate IITRPR email domain
#         if not email.endswith('@iitrpr.ac.in'):
#             logger.warning(f"Invalid email domain for OTP request: {email}")
#             return jsonify({'error': 'Only IITRPR email addresses (@iitrpr.ac.in) are allowed'}), 400
        
#         # Check if user exists
#         user = User.query.filter_by(email=email).first()
#         if not user:
#             logger.warning(f"No account found for email: {email}")
#             return jsonify({'error': 'No account found with this email'}), 404
        
#         # Generate OTP
#         otp = ''.join(random.choices('0123456789', k=6))
#         expires_at = datetime.utcnow() + timedelta(minutes=5)
        
#         # Create OTP record
#         otp_record = OTP(
#             email=email,
#             otp_code=otp,
#             expires_at=expires_at,
#             is_used=False
#         )
        
#         try:
#             db.session.add(otp_record)
#             db.session.commit()
#             logger.info(f"OTP generated for email: {email}")
            
#             # Send OTP via email
#             if send_otp_email(email, otp):
#                 return jsonify({
#                     'message': 'OTP sent successfully to your email',
#                     'expires_in': 300  # 5 minutes in seconds
#                 }), 200
#             else:
#                 return jsonify({'error': 'Failed to send OTP email'}), 500
                
#         except Exception as e:
#             db.session.rollback()
#             logger.error(f"Error saving OTP: {str(e)}")
#             return jsonify({'error': 'Failed to generate OTP'}), 500
            
#     except Exception as e:
#         logger.error(f"Error in generate_otp: {str(e)}")
#         return jsonify({'error': 'An unexpected error occurred'}), 500

# @app.route('/resend-otp', methods=['POST'])
# @rate_limit(limit=2, period=300)  # 2 requests per 5 minutes
# def resend_otp():
#     data = request.get_json()
#     email = data.get('email')
    
#     if not email:
#         return jsonify({'error': 'Email is required'}), 400
    
#     # Check if user exists
#     user = User.query.filter_by(email=email).first()
#     if not user:
#         return jsonify({'error': 'No account found with this email'}), 404
    
#     # Check for recent OTP
#     recent_otp = OTP.query.filter_by(
#         email=email,
#         is_used=False
#     ).order_by(OTP.created_at.desc()).first()
    
#     if not recent_otp:
#         return jsonify({'error': 'No active OTP found. Please generate a new one.'}), 400
    
#     if datetime.utcnow() - recent_otp.created_at < timedelta(minutes=1):
#         return jsonify({
#             'error': 'Please wait 1 minute before requesting another OTP',
#             'retry_after': 60 - (datetime.utcnow() - recent_otp.created_at).seconds
#         }), 429
    
#     # Resend the existing OTP
#     if os.getenv('FLASK_ENV') == 'development':
#         return jsonify({
#             'message': 'OTP resent successfully (Development Mode)',
#             'otp': recent_otp.otp_code,  # Remove this in production
#             'expires_at': recent_otp.expires_at.isoformat()
#         }), 200
#     else:
#         if send_otp_email(email, recent_otp.otp_code):
#             return jsonify({
#                 'message': 'OTP has been resent to your email',
#                 'expires_at': recent_otp.expires_at.isoformat()
#             }), 200
#         else:
#             return jsonify({
#                 'error': 'Failed to resend OTP email. Please try again.'
#             }), 500

# @app.route('/uploads', methods=['POST'])
# @jwt_required()
# @swag_from({
#     'parameters': [
#         {
#             'name': 'file',
#             'in': 'formData',
#             'type': 'file',
#             'required': True
#         }
#     ],
#     'responses': {
#         201: 'Upload successful',
#         400: 'Invalid input',
#         401: 'Unauthorized'
#     }
# })
# def upload_file():
#     try:
#         current_user = get_jwt_identity()
        
#         # Get form data
#         course_code = request.form.get('course_code')
#         description = request.form.get('description')
#         tags = request.form.get('tags')
#         year = request.form.get('year')
#         semester = request.form.get('semester')

#         # Validate required fields
#         if not course_code:
#             return jsonify({'message': 'Course code is required'}), 400
#         if not description:
#             return jsonify({'message': 'Description is required'}), 400
#         if not tags:
#             return jsonify({'message': 'At least one tag is required'}), 400

#         # Handle file upload
#         if 'file' in request.files:
#             file = request.files['file']
            
#             if file.filename == '':
#                 return jsonify({'message': 'No selected file'}), 400

#             if not allowed_file(file.filename):
#                 return jsonify({'message': f'File type not allowed. Allowed types: {", ".join(ALLOWED_EXTENSIONS)}'}), 400

#             try:
#                 # Upload to Cloudinary
#                 upload_result = cloudinary.uploader.upload(
#                     file.stream,
#                     folder="material_sharing",
#                     resource_type="auto"
#                 )
#                 print("Upload Result:", upload_result)
#                 file_url = upload_result.get('secure_url')
#                 public_id = upload_result.get('public_id')
#                 file_type = os.path.splitext(file.filename)[1][1:].lower()

#                 new_upload = Upload(
#                     author=current_user,
#                     course_code=course_code,
#                     description=description,
#                     tags=tags,
#                     file_url=file_url,
#                     public_id=public_id,
#                     year=year,
#                     semester=semester,
#                     file_type=file_type
#                 )

#             except Exception as cloudinary_error:
#                 print(f"Cloudinary error: {str(cloudinary_error)}")
#                 return jsonify({'message': 'Error uploading to cloud storage'}), 500

#         # Handle link upload
#         elif 'link' in request.form:
#             link = request.form.get('link')
#             if not link:
#                 return jsonify({'message': 'Link is required when no file is provided'}), 400

#             new_upload = Upload(
#                 author=current_user,
#                 course_code=course_code,
#                 description=description,
#                 tags=tags,
#                 file_url=link,
#                 year=year,
#                 semester=semester
#             )
#         else:
#             return jsonify({'message': 'Either a file or link must be provided'}), 400
#         # print("Received Files:", request.files)
#         # print("Received Form Data:", request.form)

#         # Save to database
#         try:
#             db.session.add(new_upload)
#             db.session.commit()
#             return jsonify({
#                 'message': 'Upload successful',
#                 'file_url': new_upload.file_url
#             }), 201
#         except Exception as db_error:
#             db.session.rollback()
#             print(f"Database error: {str(db_error)}")
#             return jsonify({'message': 'Error saving to database'}), 500

#     except Exception as e:
#         print(f"General error: {str(e)}")
#         return jsonify({'message': f'Error processing upload: {str(e)}'}), 500

# @app.route('/uploads/<int:upload_id>', methods=['DELETE'])
# @jwt_required()
# def delete_upload(upload_id):
#     try:
#         # Get the upload
#         upload = Upload.query.get(upload_id)
        
#         if not upload:
#             return jsonify({'message': 'Upload not found'}), 404
            
#         # If there's a file in Cloudinary, delete it
#         if upload.public_id:
#             try:
#                 cloudinary.uploader.destroy(upload.public_id)
#             except Exception as cloud_error:
#                 print(f"Error deleting from Cloudinary: {str(cloud_error)}")
#                 # Continue with database deletion even if Cloudinary deletion fails
        
#         # Delete associated comments first (due to foreign key constraint)
#         Comment.query.filter_by(upload_id=upload_id).delete()
        
#         # Delete any votes or ratings associated with this upload
#         # (assuming you have a Votes table)
#         # Vote.query.filter_by(upload_id=upload_id).delete()
        
#         # Delete the upload record
#         db.session.delete(upload)
#         db.session.commit()
        
#         return jsonify({
#             'message': 'Upload and associated data deleted successfully',
#             'deleted_id': upload_id
#         }), 200
        
#     except Exception as e:
#         db.session.rollback()
#         print(f"Error deleting upload: {str(e)}")
#         return jsonify({'message': f'Error deleting upload: {str(e)}'}), 500

# @app.route('/uploads/<int:upload_id>/vote', methods=['POST'])
# @jwt_required()
# def vote(upload_id):
#     try:
#         current_user = get_jwt_identity()
#         data = request.get_json()
#         if not data or 'type' not in data:
#             return jsonify({'message': 'Missing vote type'}), 400
            
#         upload_item = Upload.query.get(upload_id)
#         if not upload_item:
#             return jsonify({'message': 'Upload not found'}), 404

#         vote_type = data['type']
#         existing_vote = Vote.query.filter_by(
#             upload_id=upload_id,
#             user=current_user
#         ).first()

#         # Handle vote removal
#         if vote_type == 'remove' and existing_vote:
#             if existing_vote.vote_type == 'upvote':
#                 upload_item.upvotes = max(0, upload_item.upvotes - 1)
#             else:
#                 upload_item.downvotes = max(0, upload_item.downvotes - 1)
#             db.session.delete(existing_vote)

#         # Handle vote switching or new vote
#         elif vote_type in ['upvote', 'downvote']:
#             if existing_vote:
#                 # Switch vote
#                 if existing_vote.vote_type != vote_type:
#                     if vote_type == 'upvote':
#                         upload_item.downvotes = max(0, upload_item.downvotes - 1)
#                         upload_item.upvotes += 1
#                     else:
#                         upload_item.upvotes = max(0, upload_item.upvotes - 1)
#                         upload_item.downvotes += 1
#                     existing_vote.vote_type = vote_type
#             else:
#                 # New vote
#                 new_vote = Vote(
#                     upload_id=upload_id,
#                     user=current_user,
#                     vote_type=vote_type
#                 )
#                 db.session.add(new_vote)
#                 if vote_type == 'upvote':
#                     upload_item.upvotes += 1
#                 else:
#                     upload_item.downvotes += 1
#         else:
#             return jsonify({'message': 'Invalid vote type'}), 400

#         db.session.commit()

#         # Return the user's current vote status along with counts
#         return jsonify({
#             'message': f"Vote {vote_type} recorded successfully",
#             'upvotes': upload_item.upvotes,
#             'downvotes': upload_item.downvotes,
#             'userVote': vote_type if vote_type != 'remove' else None
#         })

#     except Exception as e:
#         db.session.rollback()
#         return jsonify({'message': f'Error recording vote: {str(e)}'}), 500

# @app.route('/uploads/<int:upload_id>/comments', methods=['GET'])
# @jwt_required()
# def get_comments(upload_id):
#     try:
#         comments = Comment.query.filter_by(upload_id=upload_id).order_by(Comment.created_at.desc()).all()
        
#         comments_list = []
#         for comment in comments:
#             comments_list.append({
#                 'id': comment.id,
#                 'author': comment.author,
#                 'text': comment.text,
#                 'created_at': comment.created_at.isoformat()
#             })
        
#         return jsonify({'comments': comments_list}), 200
#     except Exception as e:
#         return jsonify({'message': f'Error fetching comments: {str(e)}'}), 500

# @app.route('/uploads/<int:upload_id>/comments', methods=['POST'])
# @jwt_required()
# def add_comment(upload_id):
#     try:
#         data = request.get_json()
#         current_user = get_jwt_identity()
        
#         if not data or 'text' not in data:
#             return jsonify({'message': 'Missing comment text'}), 400
        
#         if not Upload.query.get(upload_id):
#             return jsonify({'message': 'Upload not found'}), 404
        
#         new_comment = Comment(
#             upload_id=upload_id,
#             author=current_user,
#             text=data['text']
#         )
        
#         db.session.add(new_comment)
#         db.session.commit()
        
#         return jsonify({
#             'message': 'Comment added successfully',
#             'comment': {
#                 'id': new_comment.id,
#                 'author': new_comment.author,
#                 'text': new_comment.text,
#                 'created_at': new_comment.created_at.isoformat()
#             }
#         }), 201
#     except Exception as e:
#         db.session.rollback()
#         return jsonify({'message': f'Error adding comment: {str(e)}'}), 500

# @app.route('/recent-uploads', methods=['GET'])
# @jwt_required()
# def recent_uploads():
#     try:
#         current_user = get_jwt_identity()
#         uploads = Upload.query.order_by(Upload.created_at.desc()).limit(10).all()
        
#         materials = []
#         for upload in uploads:
#             # Get user's vote for this upload
#             user_vote = Vote.query.filter_by(
#                 upload_id=upload.id,
#                 user=current_user
#             ).first()

#             materials.append({
#                 'id': upload.id,
#                 'author': upload.author,
#                 'course_code': upload.course_code,
#                 'description': upload.description,
#                 'tags': upload.tags.split(','),
#                 'file_url': upload.file_url,
#                 'upvotes': upload.upvotes,
#                 'downvotes': upload.downvotes,
#                 'userVote': user_vote.vote_type if user_vote else None,
#                 'year': upload.year,
#                 'semester': upload.semester,
#                 'created_at': upload.created_at.isoformat(),
#                 'file_type': upload.file_type
#             })
        
#         return jsonify({'materials': materials}), 200
#     except Exception as e:
#         return jsonify({'message': f'Error fetching recent uploads: {str(e)}'}), 500

# @app.route('/search', methods=['GET'])
# @jwt_required()
# def search_materials():
#     try:
#         # Get search parameters
#         course_code = request.args.get('course_code', '')
#         year = request.args.get('year', '')
#         semester = request.args.get('semester', '')
#         tags = request.args.getlist('tags')
        
#         # Build the query
#         query = Upload.query
        
#         if course_code:
#             query = query.filter(Upload.course_code.like(f'%{course_code}%'))
        
#         if year:
#             query = query.filter(Upload.year == year)
        
#         if semester:
#             query = query.filter(Upload.semester == semester)
        
#         # Get all results that match the basic criteria
#         results = query.order_by(Upload.created_at.desc()).all()
        
#         # Filter by tags if provided
#         if tags:
#             filtered_results = []
#             for upload in results:
#                 upload_tags = upload.tags.split(',')
#                 matching_tags = sum(1 for tag in tags if tag in upload_tags)
#                 if matching_tags > 0:
#                     filtered_results.append((upload, matching_tags))
            
#             filtered_results.sort(key=lambda x: x[1], reverse=True)
#             results = [item[0] for item in filtered_results]
        
#         # Format the results
#         materials = []
#         for upload in results:
#             materials.append({
#                 'id': upload.id,
#                 'author': upload.author,
#                 'course_code': upload.course_code,
#                 'description': upload.description,
#                 'tags': upload.tags.split(','),
#                 'file_url': upload.file_url,
#                 'upvotes': upload.upvotes,
#                 'downvotes': upload.downvotes,
#                 'year': upload.year,
#                 'semester': upload.semester,
#                 'created_at': upload.created_at.isoformat(),
#                 'file_type': upload.file_type
#             })
        
#         return jsonify({'materials': materials}), 200
#     except Exception as e:
#         return jsonify({'message': f'Error searching materials: {str(e)}'}), 500

# @app.route('/verify-token', methods=['GET'])
# @jwt_required()
# def verify_token():
#     try:
#         current_user = get_jwt_identity()
#         return jsonify({'user': current_user}), 200
#     except Exception as e:
#         return jsonify({'message': 'Invalid token'}), 401

# # Add file validation
# def validate_file(file):
#     if not file:
#         return False, "No file provided"
#     if file.content_length > app.config['MAX_CONTENT_LENGTH']:
#         return False, "File too large"
#     if not allowed_file(file.filename):
#         return False, "Invalid file type"
#     return True, None

# # Add comprehensive tests
# def test_upload_resource():
#     # Test resource upload
#     pass

# def test_user_authentication():
#     # Test user auth
#     pass

# # Add new routes for profile management
# @app.route('/profile', methods=['GET'])
# @jwt_required()
# def get_profile():
#     try:
#         current_user = get_jwt_identity()
#         user = User.query.filter_by(username=current_user).first()
        
#         if not user:
#             return jsonify({'message': 'User not found'}), 404
            
#         return jsonify({
#             'username': user.username,
#             'email': user.email,
#             'bio': user.bio,
#             'profile_picture': user.profile_picture
#         }), 200
#     except Exception as e:
#         return jsonify({'message': f'Error fetching profile: {str(e)}'}), 500

# @app.route('/update-profile', methods=['PUT'])
# @jwt_required()
# def update_profile():
#     try:
#         current_user = get_jwt_identity()  # This returns the username
#         data = request.get_json()
        
#         # Get user from database using username
#         user = User.query.filter_by(username=current_user).first()
#         if not user:
#             return jsonify({'message': 'User not found'}), 404

#         # Update user fields
#         if 'username' in data:
#             # Check if username is already taken
#             existing_user = User.query.filter_by(username=data['username']).first()
#             if existing_user and existing_user.id != user.id:
#                 return jsonify({'message': 'Username already taken'}), 400
#             user.username = data['username']

#         if 'email' in data:
#             # Check if email is already taken
#             existing_user = User.query.filter_by(email=data['email']).first()
#             if existing_user and existing_user.id != user.id:
#                 return jsonify({'message': 'Email already taken'}), 400
#             user.email = data['email']

#         if 'bio' in data:
#             user.bio = data['bio']

#         # Commit changes
#         db.session.commit()

#         # Return updated user data
#         return jsonify({
#             'message': 'Profile updated successfully',
#             'user': {
#                 'id': user.id,
#                 'username': user.username,
#                 'email': user.email,
#                 'bio': user.bio,
#                 'profile_picture': user.profile_picture
#             }
#         }), 200

#     except Exception as e:
#         db.session.rollback()
#         print(f"Error updating profile: {str(e)}")
#         return jsonify({'message': 'Failed to update profile'}), 500

# # profile picture upload handling
# @app.route('/upload-profile-picture', methods=['POST'])
# @jwt_required()
# def upload_profile_picture():
#     try:
#         current_user = get_jwt_identity()
        
#         # Check if user exists
#         user = User.query.filter_by(username=current_user).first()
#         if not user:
#             return jsonify({'message': 'User not found'}), 404
        
#         # Handle file upload
#         if 'file' not in request.files:
#             return jsonify({'message': 'No file part'}), 400
            
#         file = request.files['file']
        
#         if file.filename == '':
#             return jsonify({'message': 'No selected file'}), 400

#         if not allowed_file(file.filename):
#             return jsonify({'message': f'File type not allowed. Allowed types: {", ".join(ALLOWED_EXTENSIONS)}'}), 400

#         try:
#             # Upload to Cloudinary in the profile-pic folder
#             upload_result = cloudinary.uploader.upload(
#                 file.stream,
#                 folder="profile-pic",
#                 resource_type="raw"
#             )
            
#             file_url = upload_result.get('secure_url')
            
#             # Update user's profile picture
#             user.profile_picture = file_url
#             db.session.commit()
            
#             return jsonify({
#                 'message': 'Profile picture updated successfully',
#                 'profile_picture': file_url
#             }), 200
            
#         except Exception as cloudinary_error:
#             print(f"Cloudinary error: {str(cloudinary_error)}")
#             return jsonify({'message': 'Error uploading to cloud storage'}), 500
            
#     except Exception as e:
#         db.session.rollback()
#         print(f"Error uploading profile picture: {str(e)}")
#         return jsonify({'message': f'Error uploading profile picture: {str(e)}'}), 500

# @app.route('/user-stats', methods=['GET'])
# @jwt_required()
# def get_user_stats():
#     try:
#         current_user = get_jwt_identity()
        
#         # Get user's uploads count
#         uploads_count = Upload.query.filter_by(author=current_user).count()
        
#         # Get user's comments count
#         comments_count = Comment.query.filter_by(author=current_user).count()
        
#         # Get placements added count
#         placements_added = Placement.query.filter_by(created_by=current_user).count()
        
#         # Get interview experiences added count
#         interview_experiences_added = InterviewExperience.query.filter_by(created_by=current_user).count()
        
#         # Get classrooms created by user
#         classrooms_created = Classroom.query.filter_by(created_by=current_user).all()
#         classrooms_created_data = [{
#             'id': classroom.id,
#             'name': classroom.name
#         } for classroom in classrooms_created]
        
#         # Get classrooms user is part of
#         memberships = ClassroomMembership.query.filter_by(user_id=current_user).all()
#         classroom_ids = [membership.classroom_id for membership in memberships]
#         classrooms_joined = Classroom.query.filter(Classroom.id.in_(classroom_ids)).all()
#         classrooms_joined_data = [{
#             'id': classroom.id,
#             'name': classroom.name
#         } for classroom in classrooms_joined]
        
#         # Get recent activity (last 5 uploads)
#         recent_uploads = Upload.query.filter_by(author=current_user)\
#             .order_by(Upload.created_at.desc())\
#             .limit(5)\
#             .all()
        
#         recent_activity = [{
#             'id': upload.id,
#             'course_code': upload.course_code,
#             'description': upload.description,
#             'created_at': upload.created_at.isoformat(),
#             'upvotes': upload.upvotes,
#             'downvotes': upload.downvotes
#         } for upload in recent_uploads]
        
#         # Create a log of searches (we need to track these in the respective search endpoints)
#         # For now, we'll return placeholder counts that you can implement fully later
        
#         return jsonify({
#             'uploads': uploads_count,
#             'comments': comments_count,
#             'placements_added': placements_added,
#             'placements_searches': 0,  # Placeholder - implement tracking in search endpoint
#             'interview_experiences_added': interview_experiences_added,
#             'interview_experience_searches': 0,  # Placeholder - implement tracking in search endpoint
#             'dsa_searches': 0,  # Placeholder - implement tracking in search endpoint
#             'classrooms_created': classrooms_created_data,
#             'classrooms_joined': classrooms_joined_data,
#             'recent_activity': recent_activity
#         }), 200
#     except Exception as e:
#         print(f"Error fetching user stats: {str(e)}")
#         return jsonify({'message': f'Error fetching user stats: {str(e)}'}), 500

# # Create tables
# with app.app_context():
#     try:
#         # Create tables if they don't exist
#         db.create_all()
#         logger.info("Database tables created successfully")
#     except Exception as e:
#         logger.error(f"Error creating database tables: {str(e)}")
#         raise

# @app.route('/api/jobs', methods=['GET'])
# #@jwt_required()
# # there is some problem with this authentication here---> LOOK INTO IT
# def get_jobs():
#     print("\nReceived request to get jobs")
#     # Get parameters from the request
#     field = request.args.get('field', '')
#     geoid = request.args.get('geoid', '')
#     page = request.args.get('page', 0)
#     sort_by = request.args.get('sortBy', '')
#     job_type = request.args.get('jobType', '')
#     exp_level = request.args.get('expLevel', '')
#     work_type = request.args.get('workType', '')
#     filter_by_company = request.args.get('filterByCompany', '')
    
#     # Print all parameters received from frontend
#     print("\nReceived parameters from frontend:")
#     print(f"Field: {field}")
#     print(f"Geoid: {geoid}")
#     print(f"Page: {page}")
#     print(f"Sort By: {sort_by}")
#     print(f"Job Type: {job_type}")
#     print(f"Experience Level: {exp_level}")
#     print(f"Work Type: {work_type}")
#     print(f"Filter By Company: {filter_by_company}")
#     print("----------------------------------------\n")
    
#     # API endpoint and key
#     api_key = "67e19812b136d19387075104"
#     url = "https://api.scrapingdog.com/linkedinjobs"
    
#     # Set up parameters for the API call
#     params = {
#         "api_key": api_key,
#         "field": field,
#         "geoid": geoid,
#         "page": 1,
#         "sortBy": sort_by,
#         "jobType": job_type,
#         "expLevel": exp_level,
#         "workType": work_type,
#         "filterByCompany": filter_by_company
#     }
    
#     # Remove empty parameters
#     params = {k: v for k, v in params.items() if v}
    
#     try:
#         # Make the API call
#         response = requests.get(url, params=params)
        
#         if response.status_code == 200:
#             return jsonify(response.json())
#         else:
#             return jsonify({
#                 "error": f"Request failed with status code: {response.status_code}",
#                 "message": response.text
#             }), response.status_code
#     except Exception as e:
#         return jsonify({"error": str(e)}), 500


# # Routes for placement data
# @app.route('/placements', methods=['GET'])
# @jwt_required()
# def get_placements():
#     try:
#         placements = Placement.query.order_by(Placement.created_at.desc()).all()
        
#         result = []
#         for placement in placements:
#             # Get people associated with this placement
#             people = PlacementPerson.query.filter_by(placement_id=placement.id).all()
            
#             people_data = []
#             for person in people:
#                 people_data.append({
#                     'id': person.id,
#                     'name': person.name,
#                     'resume_url': person.resume_url
#                 })
            
#             result.append({
#                 'id': placement.id,
#                 'company': placement.company,
#                 'type': placement.type,
#                 'mode': placement.mode,
#                 'year': placement.year,
#                 'role': placement.role,
#                 'referral': placement.referral,
#                 'created_at': placement.created_at.isoformat(),
#                 'created_by': placement.created_by,
#                 'people': people_data
#             })
        
#         return jsonify({'placements': result}), 200
#     except Exception as e:
#         return jsonify({'message': f'Error fetching placements: {str(e)}'}), 500

# @app.route('/placements', methods=['POST'])
# @jwt_required()
# def add_placement():
#     try:
#         current_user = get_jwt_identity()
        
#         # Get form data
#         company = request.form.get('company')
#         placement_type = request.form.get('type')
#         mode = request.form.get('mode')
#         year = request.form.get('year')
#         role = request.form.get('role')
#         referral = request.form.get('referral')
        
#         # Validate required fields
#         if not company or not placement_type or not mode or not year or not role:
#             return jsonify({'message': 'Missing required fields'}), 400
        
#         # Create new placement
#         new_placement = Placement(
#             company=company,
#             type=placement_type,
#             mode=mode,
#             year=year,
#             role=role,
#             referral=referral,
#             created_by=current_user
#         )
        
#         db.session.add(new_placement)
#         db.session.flush()  # Get the ID without committing
        
#         # Process people data
#         people_data = []
        
#         # Determine how many people were submitted
#         person_count = 0
#         for key in request.form.keys():
#             if key.startswith('people[') and key.endswith('][name]'):
#                 person_count = max(person_count, int(key.split('[')[1].split(']')[0]) + 1)
        
#         for i in range(person_count):
#             name_key = f'people[{i}][name]'
#             name = request.form.get(name_key)
            
#             if name:
#                 resume_url = None
#                 resume_public_id = None
                
#                 # Check if a resume was uploaded for this person
#                 resume_key = f'people[{i}][resume]'
#                 if resume_key in request.files and request.files[resume_key].filename:
#                     file = request.files[resume_key]
                    
#                     # if not allowe 
#                     # file = request.files[resume_key]
                    
#                     if not allowed_file(file.filename):
#                         return jsonify({'message': f'Invalid file type for resume. Allowed types: {", ".join(ALLOWED_EXTENSIONS)}'}), 400
                    
#                     # Upload to Cloudinary
#                     upload_result = cloudinary.uploader.upload(
#                         file,
#                         folder="placements",
#                         resource_type="raw"
#                     )
                    
#                     resume_url = upload_result.get('secure_url')
#                     resume_public_id = upload_result.get('public_id')
                
#                 # Create person record
#                 new_person = PlacementPerson(
#                     placement_id=new_placement.id,
#                     name=name,
#                     resume_url=resume_url,
#                     resume_public_id=resume_public_id
#                 )
                
#                 db.session.add(new_person)
                
#                 people_data.append({
#                     'name': name,
#                     'resume_url': resume_url
#                 })
        
#         db.session.commit()
        
#         return jsonify({
#             'message': 'Placement added successfully',
#             'placement': {
#                 'id': new_placement.id,
#                 'company': new_placement.company,
#                 'type': new_placement.type,
#                 'mode': new_placement.mode,
#                 'year': new_placement.year,
#                 'role': new_placement.role,
#                 'referral': new_placement.referral,
#                 'people': people_data
#             }
#         }), 201
#     except Exception as e:
#         db.session.rollback()
#         return jsonify({'message': f'Error adding placement: {str(e)}'}), 500

# @app.route('/placements/search', methods=['GET'])
# @jwt_required()
# def search_placements():
#     try:
#         # Get search parameters
#         company = request.args.get('company', '')
#         year = request.args.get('year', '')
#         placement_type = request.args.get('type', '')
        
#         # Build the query
#         query = Placement.query
        
#         if company:
#             query = query.filter(Placement.company.like(f'%{company}%'))
        
#         if year:
#             query = query.filter(Placement.year == year)
        
#         if placement_type:
#             query = query.filter(Placement.type == placement_type)
        
#         # Get results
#         placements = query.order_by(Placement.created_at.desc()).all()
        
#         result = []
#         for placement in placements:
#             # Get people associated with this placement
#             people = PlacementPerson.query.filter_by(placement_id=placement.id).all()
            
#             people_data = []
#             for person in people:
#                 people_data.append({
#                     'id': person.id,
#                     'name': person.name,
#                     'resume_url': person.resume_url
#                 })
            
#             result.append({
#                 'id': placement.id,
#                 'company': placement.company,
#                 'type': placement.type,
#                 'mode': placement.mode,
#                 'year': placement.year,
#                 'role': placement.role,
#                 'referral': placement.referral,
#                 'created_at': placement.created_at.isoformat(),
#                 'created_by': placement.created_by,
#                 'people': people_data
#             })
        
#         return jsonify({'placements': result}), 200
#     except Exception as e:
#         return jsonify({'message': f'Error searching placements: {str(e)}'}), 500


# # Routes for interview experiences
# @app.route('/interview-experiences', methods=['GET'])
# @jwt_required()
# def get_interview_experiences():
#     try:
#         # Get search parameters
#         company = request.args.get('company', '')
#         year = request.args.get('year', '')
#         interview_type = request.args.get('type', '')
        
#         # Build the query
#         query = InterviewExperience.query
        
#         if company:
#             query = query.filter(InterviewExperience.company.like(f'%{company}%'))
        
#         if year:
#             query = query.filter(InterviewExperience.year == year)
        
#         if interview_type:
#             query = query.filter(InterviewExperience.type == interview_type)
        
#         # Get results
#         interviews = query.order_by(InterviewExperience.created_at.desc()).all()
        
#         result = []
#         for interview in interviews:
#             # Get questions associated with this interview
#             questions = InterviewQuestion.query.filter_by(interview_id=interview.id).all()
            
#             questions_data = []
#             for question in questions:
#                 questions_data.append({
#                     'id': question.id,
#                     'question': question.question,
#                     'answer': question.answer
#                 })
            
#             # Parse tags
#             tags = interview.tags.split(',') if interview.tags else []
            
#             result.append({
#                 'id': interview.id,
#                 'company': interview.company,
#                 'candidateName': interview.candidate_name,
#                 'interviewerName': interview.interviewer_name,
#                 'year': interview.year,
#                 'type': interview.type,
#                 'tips': interview.tips,
#                 'created_at': interview.created_at.isoformat(),
#                 'created_by': interview.created_by,
#                 'tags': tags,
#                 'questions': questions_data
#             })
        
#         return jsonify({'interviews': result}), 200
#     except Exception as e:
#         return jsonify({'message': f'Error fetching interview experiences: {str(e)}'}), 500

# @app.route('/interview-experiences', methods=['POST'])
# @jwt_required()
# def add_interview_experience():
#     try:
#         current_user = get_jwt_identity()
#         data = request.get_json()
        
#         # Validate required fields
#         if not data.get('company') or not data.get('candidateName') or not data.get('year') or not data.get('type'):
#             return jsonify({'message': 'Missing required fields'}), 400
        
#         if not data.get('questions') or len(data.get('questions')) == 0:
#             return jsonify({'message': 'At least one question is required'}), 400
        
#         # Process tags
#         tags = ','.join(data.get('tags', [])) if data.get('tags') else ''
        
#         # Create new interview experience
#         new_interview = InterviewExperience(
#             company=data.get('company'),
#             candidate_name=data.get('candidateName'),
#             interviewer_name=data.get('interviewerName', ''),
#             year=data.get('year'),
#             type=data.get('type'),
#             tips=data.get('tips', ''),
#             created_by=current_user,
#             tags=tags
#         )
        
#         db.session.add(new_interview)
#         db.session.flush()  # Get the ID without committing
        
#         # Process questions
#         questions_data = []
#         for q in data.get('questions', []):
#             if q.get('question') and q.get('answer'):
#                 new_question = InterviewQuestion(
#                     interview_id=new_interview.id,
#                     question=q.get('question'),
#                     answer=q.get('answer')
#                 )
                
#                 db.session.add(new_question)
                
#                 questions_data.append({
#                     'question': q.get('question'),
#                     'answer': q.get('answer')
#                 })
        
#         db.session.commit()
        
#         return jsonify({
#             'message': 'Interview experience added successfully',
#             'interview': {
#                 'id': new_interview.id,
#                 'company': new_interview.company,
#                 'candidateName': new_interview.candidate_name,
#                 'interviewerName': new_interview.interviewer_name,
#                 'year': new_interview.year,
#                 'type': new_interview.type,
#                 'tips': new_interview.tips,
#                 'tags': data.get('tags', []),
#                 'questions': questions_data
#             }
#         }), 201
#     except Exception as e:
#         db.session.rollback()
#         return jsonify({'message': f'Error adding interview experience: {str(e)}'}), 500

# @app.route('/interview-experiences/<int:interview_id>', methods=['GET'])
# @jwt_required()
# def get_interview_experience(interview_id):
#     try:
#         interview = InterviewExperience.query.get(interview_id)
        
#         if not interview:
#             return jsonify({'message': 'Interview experience not found'}), 404
        
#         # Get questions associated with this interview
#         questions = InterviewQuestion.query.filter_by(interview_id=interview.id).all()
        
#         questions_data = []
#         for question in questions:
#             questions_data.append({
#                 'id': question.id,
#                 'question': question.question,
#                 'answer': question.answer
#             })
        
#         # Parse tags
#         tags = interview.tags.split(',') if interview.tags else []
        
#         return jsonify({
#             'interview': {
#                 'id': interview.id,
#                 'company': interview.company,
#                 'candidateName': interview.candidate_name,
#                 'interviewerName': interview.interviewer_name,
#                 'year': interview.year,
#                 'type': interview.type,
#                 'tips': interview.tips,
#                 'created_at': interview.created_at.isoformat(),
#                 'created_by': interview.created_by,
#                 'tags': tags,
#                 'questions': questions_data
#             }
#         }), 200
#     except Exception as e:
#         return jsonify({'message': f'Error fetching interview experience: {str(e)}'}), 500


# # @app.route('/api/duckduckgo-search', methods=['GET'])
# # def duckduckgo_search():
# #     query = request.args.get('q')
    
# #     if not query:
# #         return jsonify({'error': 'Missing search query'}), 400
    
# #     try:
# #         # DuckDuckGo search
# #         headers = {
# #             'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
# #         }
# #         response = requests.get(
# #             f'https://html.duckduckgo.com/html/?q={query}',
# #             headers=headers
# #         )
        
# #         if response.status_code != 200:
# #             return jsonify({'error': 'Failed to fetch search results'}), 500
        
# #         # Parse the HTML response
# #         soup = BeautifulSoup(response.text, 'html.parser')
# #         results = []
        
# #         # Extract search results
# #         for result in soup.select('.result'):
# #             title_elem = result.select_one('.result__a')
# #             snippet_elem = result.select_one('.result__snippet')
            
# #             if title_elem and title_elem.get('href'):
# #                 title = title_elem.get_text(strip=True)
# #                 url = title_elem.get('href')
# #                 description = snippet_elem.get_text(strip=True) if snippet_elem else ''
                
# #                 results.append({
# #                     'title': title,
# #                     'url': url,
# #                     'description': description
# #                 })
        
# #         return jsonify({'results': results})
    
# #     except Exception as e:
# #         return jsonify({'error': str(e)}), 500
# # app.py (Flask backend)


# @app.route('/api/search-dsa', methods=['POST'])
# def search_dsa():
#     data = request.json
#     query = data.get('query', '')
#     sites = data.get('sites', [])
    
#     if not query:
#         return jsonify({"error": "Query is required"}), 400
    
#     # Format site-specific search query for DuckDuckGo
#     site_restrictions = " OR ".join([f"site:{site}" for site in sites])
#     search_query = f"{query} ({site_restrictions})"
    
#     try:
#         # Using DuckDuckGo HTML API (they don't have an official API)
#         headers = {
#             'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
#         }
#         response = requests.get(
#             f"https://html.duckduckgo.com/html/?q={search_query}",
#             headers=headers
#         )
        
#         if response.status_code != 200:
#             return jsonify({"error": "Failed to fetch search results"}), 500
        
#         # Parse the HTML response
#         soup = BeautifulSoup(response.text, 'html.parser')
#         results = []
        
#         # Extract search results
#         for result in soup.select('.result'):
#             title_elem = result.select_one('.result__title')
#             url_elem = result.select_one('.result__url')
#             snippet_elem = result.select_one('.result__snippet')
            
#             if title_elem and url_elem:
#                 title = title_elem.get_text(strip=True)
#                 url = url_elem.get('href') if url_elem.get('href') else url_elem.get_text(strip=True)
                
#                 # Clean URL if it's from DuckDuckGo's redirect
#                 if '/duckduckgo.com/' in url:
#                     url_match = re.search(r'uddg=([^&]+)', url)
#                     if url_match:
#                         url = requests.utils.unquote(url_match.group(1))
                
#                 # Identify source website
#                 source = None
#                 for site in sites:
#                     if site in url:
#                         source = site
#                         break
                
#                 snippet = snippet_elem.get_text(strip=True) if snippet_elem else ""
                
#                 results.append({
#                     "title": title,
#                     "url": url,
#                     "snippet": snippet,
#                     "source": source
#                 })
                
#                 # Limit to 10 results
#                 if len(results) >= 20:
#                     break
        
#         return jsonify({"results": results})
    
#     except Exception as e:
#         return jsonify({"error": str(e)}), 500

# # classroom type discussion backend
# @app.route('/api/classroom/create', methods=['POST'])
# @jwt_required()
# def create_classroom():
#     try:
#         current_user = get_jwt_identity()
#         data = request.get_json()
        
#         if not data or not data.get('name'):
#             return jsonify({'message': 'Classroom name is required'}), 400
        
#         new_classroom = Classroom(
#             name=data.get('name'),
#             description=data.get('description', ''),
#             created_by=current_user
#         )
        
#         db.session.add(new_classroom)
#         db.session.flush()  # Get the ID without committing
        
#         # Add creator as a member
#         membership = ClassroomMembership(
#             user_id=current_user,
#             classroom_id=new_classroom.id
#         )
        
#         db.session.add(membership)
#         db.session.commit()
        
#         return jsonify({
#             'message': 'Classroom created successfully',
#             'classroom': {
#                 'id': new_classroom.id,
#                 'name': new_classroom.name,
#                 'description': new_classroom.description,
#                 'created_by': new_classroom.created_by,
#                 'created_at': new_classroom.created_at.isoformat()
#             }
#         }), 201
#     except Exception as e:
#         db.session.rollback()
#         return jsonify({'message': f'Error creating classroom: {str(e)}'}), 500

# @app.route('/api/classroom/join', methods=['POST'])
# @jwt_required()
# def join_classroom():
#     try:
#         current_user = get_jwt_identity()
#         data = request.get_json()
        
#         if not data or not data.get('classroom_id'):
#             return jsonify({'message': 'Classroom ID is required'}), 400
        
#         classroom_id = data.get('classroom_id')
        
#         # Check if classroom exists
#         classroom = Classroom.query.get(classroom_id)
#         if not classroom:
#             return jsonify({'message': 'Classroom not found'}), 404
        
#         # Check if user is already a member
#         existing_membership = ClassroomMembership.query.filter_by(
#             user_id=current_user,
#             classroom_id=classroom_id
#         ).first()
        
#         if existing_membership:
#             return jsonify({'message': 'You are already a member of this classroom'}), 400
        
#         # Add user as a member
#         membership = ClassroomMembership(
#             user_id=current_user,
#             classroom_id=classroom_id
#         )
        
#         db.session.add(membership)
#         db.session.commit()
        
#         return jsonify({
#             'message': 'Joined classroom successfully',
#             'classroom': {
#                 'id': classroom.id,
#                 'name': classroom.name,
#                 'description': classroom.description,
#                 'created_by': classroom.created_by,
#                 'created_at': classroom.created_at.isoformat()
#             }
#         }), 200
#     except Exception as e:
#         db.session.rollback()
#         return jsonify({'message': f'Error joining classroom: {str(e)}'}), 500

# @app.route('/api/classrooms', methods=['GET'])
# @jwt_required()
# def get_classrooms():
#     try:
#         current_user = get_jwt_identity()
        
#         # Get all classrooms the user is a member of
#         memberships = ClassroomMembership.query.filter_by(user_id=current_user).all()
#         classroom_ids = [membership.classroom_id for membership in memberships]
        
#         classrooms = Classroom.query.filter(Classroom.id.in_(classroom_ids)).all()
        
#         result = []
#         for classroom in classrooms:
#             result.append({
#                 'id': classroom.id,
#                 'name': classroom.name,
#                 'description': classroom.description,
#                 'created_by': classroom.created_by,
#                 'created_at': classroom.created_at.isoformat()
#             })
        
#         return jsonify({'classrooms': result}), 200
#     except Exception as e:
#         return jsonify({'message': f'Error fetching classrooms: {str(e)}'}), 500

# @app.route('/api/classroom/<int:classroom_id>/message', methods=['POST'])
# @jwt_required()
# def send_message(classroom_id):
#     try:
#         current_user = get_jwt_identity()
#         data = request.get_json()
        
#         if not data or not data.get('content'):
#             return jsonify({'message': 'Message content is required'}), 400
        
#         # Check if classroom exists
#         classroom = Classroom.query.get(classroom_id)
#         if not classroom:
#             return jsonify({'message': 'Classroom not found'}), 404
        
#         # Check if user is a member
#         membership = ClassroomMembership.query.filter_by(
#             user_id=current_user,
#             classroom_id=classroom_id
#         ).first()
        
#         if not membership:
#             return jsonify({'message': 'You are not a member of this classroom'}), 403
        
#         # Create new message
#         new_message = ClassroomMessage(
#             user_id=current_user,
#             classroom_id=classroom_id,
#             content=data.get('content')
#         )
        
#         db.session.add(new_message)
#         db.session.commit()
        
#         return jsonify({
#             'message': 'Message sent successfully',
#             'message': {
#                 'id': new_message.id,
#                 'user_id': new_message.user_id,
#                 'content': new_message.content,
#                 'timestamp': new_message.timestamp.isoformat()
#             }
#         }), 201
#     except Exception as e:
#         db.session.rollback()
#         return jsonify({'message': f'Error sending message: {str(e)}'}), 500

# @app.route('/api/classroom/<int:classroom_id>/messages', methods=['GET'])
# @jwt_required()
# def get_messages(classroom_id):
#     try:
#         current_user = get_jwt_identity()
        
#         # Check if classroom exists
#         classroom = Classroom.query.get(classroom_id)
#         if not classroom:
#             return jsonify({'message': 'Classroom not found'}), 404
        
#         # Check if user is a member
#         membership = ClassroomMembership.query.filter_by(
#             user_id=current_user,
#             classroom_id=classroom_id
#         ).first()
        
#         if not membership:
#             return jsonify({'message': 'You are not a member of this classroom'}), 403
        
#         # Get all messages for this classroom
#         messages = ClassroomMessage.query.filter_by(classroom_id=classroom_id).order_by(ClassroomMessage.timestamp.asc()).all()
        
#         result = []
#         for message in messages:
#             result.append({
#                 'id': message.id,
#                 'user_id': message.user_id,
#                 'content': message.content,
#                 'timestamp': message.timestamp.isoformat()
#             })
        
#         return jsonify({'messages': result}), 200
#     except Exception as e:
#         return jsonify({'message': f'Error fetching messages: {str(e)}'}), 500

# # Add these lines after initializing the app and before creating tables
# register_updates_blueprint(app)

# # Make sure these models are created when creating tables
# with app.app_context():
#     try:
#         # Create tables if they don't exist
#         db.create_all()
#         logger.info("Database tables created successfully")
#     except Exception as e:
#         logger.error(f"Error creating database tables: {str(e)}")
#         raise

# def send_welcome_email(email, username):
#     try:
#         # Create message
#         msg = MIMEMultipart('alternative')
#         msg['From'] = f"DEP Platform <{os.getenv('EMAIL_USERNAME')}>"
#         msg['To'] = email
#         msg['Subject'] = 'Welcome to DEP Platform'

#         # Create HTML version of the email
#         html = f"""
#         <html>
#             <head>
#                 <style>
#                     body {{
#                         font-family: Arial, sans-serif;
#                         line-height: 1.6;
#                         color: #333333;
#                         max-width: 600px;
#                         margin: 0 auto;
#                         padding: 20px;
#                     }}
#                     .header {{
#                         background-color: #1a237e;
#                         color: white;
#                         padding: 20px;
#                         text-align: center;
#                         border-radius: 5px;
#                     }}
#                     .content {{
#                         background-color: #ffffff;
#                         padding: 20px;
#                         border-radius: 5px;
#                         margin-top: 20px;
#                     }}
#                     .footer {{
#                         text-align: center;
#                         margin-top: 20px;
#                         font-size: 12px;
#                         color: #666666;
#                     }}
#                 </style>
#             </head>
#             <body>
#                 <div class="header">
#                     <h1>Welcome to DEP Platform</h1>
#                 </div>
#                 <div class="content">
#                     <p>Dear {username},</p>
#                     <p>Thank you for registering with the DEP Platform! Your account has been successfully created.</p>
#                     <p>You can now access all the features of our platform using your registered email address and password.</p>
#                     <p>If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
#                     <p>Best regards,<br>DEP Platform Team</p>
#                 </div>
#                 <div class="footer">
#                     <p>This is an automated message, please do not reply to this email.</p>
#                     <p>© 2024 DEP Platform. All rights reserved.</p>
#                 </div>
#             </body>
#         </html>
#         """

#         # Create plain text version
#         text = f"""
#         Welcome to DEP Platform

#         Dear {username},

#         Thank you for registering with the DEP Platform! Your account has been successfully created.

#         You can now access all the features of our platform using your registered email address and password.

#         If you have any questions or need assistance, please don't hesitate to contact our support team.

#         Best regards,
#         DEP Platform Team

#         This is an automated message, please do not reply to this email.
#         © 2024 DEP Platform. All rights reserved.
#         """

#         # Attach both versions
#         msg.attach(MIMEText(text, 'plain'))
#         msg.attach(MIMEText(html, 'html'))

#         # Create SMTP session
#         server = smtplib.SMTP(os.getenv('EMAIL_SERVER'), int(os.getenv('EMAIL_PORT')))
#         server.starttls()
#         server.login(os.getenv('EMAIL_USERNAME'), os.getenv('EMAIL_PASSWORD'))
        
#         # Send email
#         server.send_message(msg)
#         server.quit()
        
#         logger.info(f"Welcome email sent successfully to {email}")
#         return True
#     except Exception as e:
#         logger.error(f"Error sending welcome email to {email}: {str(e)}")
#         return False

# if __name__ == '__main__':
#     app.run(debug=True)

from flask import Flask, request, jsonify, send_from_directory, g, session
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity, decode_token
from flask_migrate import Migrate
from werkzeug.utils import secure_filename
from werkzeug.security import check_password_hash, generate_password_hash
import os
from dotenv import load_dotenv
import cloudinary
import cloudinary.uploader
import cloudinary.api
from datetime import datetime, timedelta, timezone
from flask_cors import CORS
from flasgger import Swagger, swag_from
import re
import logging
import requests
from bs4 import BeautifulSoup
import re
import json
import random
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import time
from functools import wraps
from flask_mail import Mail, Message
import string
# Update to the main Flask app to include the MDP ranking system

# Add these imports to the existing imports
from app_updates import register_updates_blueprint
from models import UserStateTransition, UserPreference, UpdateInteraction

# Load environment variables from .env file
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# Security headers function
def add_security_headers(response):
    """Add security headers to each response"""
    response.headers['Content-Security-Policy'] = "default-src 'self'; img-src 'self' data: https:; style-src 'self' 'unsafe-inline' https:; script-src 'self' 'unsafe-inline' 'unsafe-eval' https:; connect-src 'self' http://localhost:5000;"
    response.headers['X-Content-Type-Options'] = 'nosniff'
    response.headers['X-Frame-Options'] = 'DENY'
    response.headers['X-XSS-Protection'] = '1; mode=block'
    response.headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains'
    response.headers['Referrer-Policy'] = 'strict-origin-when-cross-origin'
    return response

# Initialize app
app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('FLASK_SECRET_KEY', os.getenv('JWT_SECRET_KEY', 'your-secret-key-here'))  # Use JWT_SECRET_KEY as fallback

# Configure session cookie settings
app.config['SESSION_COOKIE_SECURE'] = False  # Set to True in production with HTTPS
app.config['SESSION_COOKIE_HTTPONLY'] = True
app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(minutes=30)
app.config['SESSION_TYPE'] = 'filesystem'

# Configure CORS with proper settings
CORS(app, resources={
    r"/*": {
        "origins": ["http://localhost:3000"],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"],
        "expose_headers": ["Content-Range", "X-Content-Range"],
        "supports_credentials": True,
        "max_age": 3600
    }
}, supports_credentials=True)

# Add security headers
@app.after_request
def add_security_headers(response):
    response.headers['Access-Control-Allow-Origin'] = 'http://localhost:3000'
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
    response.headers['Access-Control-Allow-Credentials'] = 'true'
    return response

# Get the current directory
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
DB_PATH = os.path.join(BASE_DIR, 'dep.db')

# Ensure the database directory exists
os.makedirs(BASE_DIR, exist_ok=True)


# Configurations
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///database.db')
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET', 'your-secret-key')
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=1)
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = os.getenv('EMAIL_USERNAME', 'depplatfrom@gmail.com')
app.config['MAIL_PASSWORD'] = os.getenv('EMAIL_PASSWORD', 'your_app_password_here')  # Replace with your actual app password
app.config['MAIL_DEFAULT_SENDER'] = os.getenv('MAIL_DEFAULT_SENDER', 'depplatfrom@gmail.com')

# Ensure upload folder exists
if not os.path.exists(app.config['UPLOAD_FOLDER']):
    os.makedirs(app.config['UPLOAD_FOLDER'])

db = SQLAlchemy(app)
migrate = Migrate(app, db)
jwt = JWTManager(app)

# Cloudinary Configuration
cloudinary.config(
    cloud_name=os.getenv('CLOUDINARY_CLOUD_NAME'),
    api_key=os.getenv('CLOUDINARY_API_KEY'),
    api_secret=os.getenv('CLOUDINARY_API_SECRET')
)

mail = Mail(app)

# Models
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    bio = db.Column(db.Text, nullable=True)
    profile_picture = db.Column(db.String(200), nullable=True)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    last_login = db.Column(db.DateTime, nullable=True)
    password_changed_at = db.Column(db.DateTime, nullable=True)
    is_verified = db.Column(db.Boolean, default=False)
    verification_token = db.Column(db.String(100), nullable=True)
    verification_token_expires = db.Column(db.DateTime, nullable=True)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def generate_verification_token(self):
        self.verification_token = ''.join(random.choices(string.ascii_letters + string.digits, k=32))
        self.verification_token_expires = datetime.utcnow() + timedelta(hours=24)
        return self.verification_token

    def verify_email(self, token):
        if (self.verification_token == token and 
            self.verification_token_expires and 
            datetime.utcnow() < self.verification_token_expires):
            self.is_verified = True
            self.verification_token = None
            self.verification_token_expires = None
            return True
        return False

class OTP(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), nullable=False)
    otp_code = db.Column(db.String(6), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.now(timezone.utc))
    is_used = db.Column(db.Boolean, default=False)
    attempts = db.Column(db.Integer, default=0)  # Add attempts counter
    max_attempts = db.Column(db.Integer, default=5)  # Add max attempts
    reset_token = db.Column(db.String(100), nullable=True)  # Add reset token column
    
    __table_args__ = (
        db.Index('idx_email_otp', 'email', 'otp_code'),
    )
class Upload(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    author = db.Column(db.String(80), nullable=False)
    course_code = db.Column(db.String(20), nullable=False)
    description = db.Column(db.String(200), nullable=False)
    tags = db.Column(db.String(200), nullable=False)  # Comma-separated tags
    file_url = db.Column(db.String(500), nullable=True)  # File path or link
    public_id = db.Column(db.String(200), nullable=True)  # Cloudinary public ID
    upvotes = db.Column(db.Integer, default=0)
    downvotes = db.Column(db.Integer, default=0)
    year = db.Column(db.String(10), nullable=True)
    semester = db.Column(db.String(20), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    file_type = db.Column(db.String(10), nullable=True)  # Store file extension
    __table_args__ = (
        db.Index('idx_course_code', 'course_code'),
        db.Index('idx_created_at', 'created_at'),
        db.Index('idx_author', 'author')
    )

class Comment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    upload_id = db.Column(db.Integer, db.ForeignKey('upload.id'), nullable=False)
    author = db.Column(db.String(80), nullable=False)
    text = db.Column(db.String(500), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Vote(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    upload_id = db.Column(db.Integer, db.ForeignKey('upload.id'), nullable=False)
    user = db.Column(db.String(80), nullable=False)
    vote_type = db.Column(db.String(10), nullable=False)  # 'upvote' or 'downvote'
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    __table_args__ = (
        db.UniqueConstraint('upload_id', 'user', name='unique_user_vote'),
    )

# Model for placement data
class Placement(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    company = db.Column(db.String(100), nullable=False)
    type = db.Column(db.String(20), nullable=False)  # 'Internship' or 'Placement'
    mode = db.Column(db.String(20), nullable=False)  # 'On Campus' or 'Off Campus'
    year = db.Column(db.String(4), nullable=False)
    role = db.Column(db.String(100), nullable=False)
    referral = db.Column(db.String(3), nullable=False)  # 'Yes' or 'No'
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    created_by = db.Column(db.String(80), nullable=False)

class PlacementPerson(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    placement_id = db.Column(db.Integer, db.ForeignKey('placement.id'), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    resume_url = db.Column(db.String(500), nullable=True)
    resume_public_id = db.Column(db.String(200), nullable=True)


# Model for interview experiences
class InterviewExperience(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    company = db.Column(db.String(100), nullable=False)
    candidate_name = db.Column(db.String(100), nullable=False)
    interviewer_name = db.Column(db.String(100), nullable=True)
    year = db.Column(db.String(4), nullable=False)
    type = db.Column(db.String(20), nullable=False)  # 'Internship' or 'Placement'
    tips = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    created_by = db.Column(db.String(80), nullable=False)
    tags = db.Column(db.String(200), nullable=True)  # Comma-separated tags

class InterviewQuestion(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    interview_id = db.Column(db.Integer, db.ForeignKey('interview_experience.id'), nullable=False)
    question = db.Column(db.Text, nullable=False)
    answer = db.Column(db.Text, nullable=False)

# Classroom type discussion backend
class Classroom(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=True)
    created_by = db.Column(db.String(80), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class ClassroomMembership(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String(80), nullable=False)
    classroom_id = db.Column(db.Integer, db.ForeignKey('classroom.id'), nullable=False)
    joined_at = db.Column(db.DateTime, default=datetime.utcnow)
    __table_args__ = (
        db.UniqueConstraint('user_id', 'classroom_id', name='unique_user_classroom'),
    )

class ClassroomMessage(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String(80), nullable=False)
    classroom_id = db.Column(db.Integer, db.ForeignKey('classroom.id'), nullable=False)
    content = db.Column(db.Text, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

class UserStateTransition(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String(80), nullable=False)
    old_state = db.Column(db.String(50), nullable=False)
    new_state = db.Column(db.String(50), nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

class UserPreference(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String(80), nullable=False)
    preference_type = db.Column(db.String(50), nullable=False)
    preference_value = db.Column(db.String(200), nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

class UpdateInteraction(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String(80), nullable=False)
    update_id = db.Column(db.Integer, nullable=False)
    interaction_type = db.Column(db.String(50), nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

# Helper function for allowed file extensions
ALLOWED_EXTENSIONS = {'pdf', 'png', 'jpg', 'jpeg', 'docx', 'txt'}
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Routes
def validate_username(username):
    if not username or len(username) < 3:
        return False, "Username must be at least 3 characters long"
    if not re.match(r'^[a-zA-Z0-9_]+$', username):
        return False, "Username can only contain letters, numbers, and underscores"
    return True, None

def validate_password(password):
    if not password or len(password) < 6:
        return False, "Password must be at least 6 characters long"
    if not re.match(r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)', password):
        return False, "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    return True, None

@app.route('/signup', methods=['POST'])
def signup():
    try:
        data = request.get_json()
        
        if not data or not all(key in data for key in ['username', 'password', 'email']):
            return jsonify({'error': 'Missing required fields'}), 400

        username = data['username']
        password = data['password']
        email = data['email']
        verified = data.get('verified', False)

        # Validate email format
        if not re.match(r'^[a-zA-Z0-9._%+-]+@iitrpr\.ac\.in$', email):
            return jsonify({
                'error': 'Invalid email format',
                'message': 'Please use your IITRPR email address (username@iitrpr.ac.in)'
            }), 400

        # Check if username already exists
        if User.query.filter_by(username=username).first():
            return jsonify({
                'error': 'Username taken',
                'message': 'This username is already taken. Please choose another one.'
            }), 409

        # Check if email already exists
        existing_user = User.query.filter_by(email=email).first()
        if existing_user:
            if existing_user.is_verified:
                return jsonify({
                    'error': 'Email exists',
                    'message': 'An account already exists with this email. Please login instead.'
                }), 409
            else:
                return jsonify({
                    'error': 'Verification pending',
                    'message': 'An account exists but is not verified. Please check your email for verification code or request a new one.'
                }), 409

        # Only allow account creation if verified flag is True
        if not verified:
            return jsonify({
                'error': 'Verification required',
                'message': 'Email verification required to create account'
            }), 403

        # Validate password
        if not validate_password(password):
            return jsonify({
                'error': 'Invalid password',
                'message': 'Password must be at least 6 characters long and contain uppercase, lowercase, and numbers'
            }), 400

        # Create new user
        new_user = User(username=username, email=email, is_verified=True)
        new_user.set_password(password)

        db.session.add(new_user)
        db.session.commit()

        return jsonify({
            'success': True,
            'message': 'Account created successfully'
        }), 201

    except Exception as e:
        db.session.rollback()
        print(f"Error in signup: {str(e)}")
        return jsonify({
            'error': 'Server error',
            'message': 'An unexpected error occurred. Please try again later.'
        }), 500

@app.route('/request-password-reset', methods=['POST'])
def request_password_reset():
    try:
        data = request.get_json()
        email = data.get('email')
        
        if not email:
            return jsonify({'error': 'Email is required'}), 400
            
        # Validate email format
        if not email.endswith('@iitrpr.ac.in'):
            return jsonify({'error': 'Only IITRPR email addresses are allowed'}), 400
        
        user = User.query.filter_by(email=email).first()
        if not user:
            return jsonify({'error': 'No account found with this email'}), 404
        
        # Check for rate limiting
        if track_otp_attempts(email):
            return jsonify({
                'error': 'Too many attempts',
                'retry_after': 600  # 10 minutes
            }), 429

        # Generate and store OTP
        otp = ''.join(random.choices('0123456789', k=6))
        otp_record = OTP(
            email=email,
            otp_code=otp,
            created_at=datetime.now(timezone.utc)  # Set creation time
        )
        
        try:
            db.session.add(otp_record)
            db.session.commit()
            
            # Send email with OTP
            if send_password_reset_email(email, otp):
                return jsonify({'message': 'Password reset instructions sent to your email'}), 200
            else:
                db.session.delete(otp_record)
                db.session.commit()
                return jsonify({'error': 'Failed to send reset instructions'}), 500
                
        except Exception as e:
            db.session.rollback()
            app.logger.error(f"Error in password reset request: {str(e)}")
            return jsonify({'error': 'An unexpected error occurred'}), 500
    except Exception as e:
        app.logger.error(f"Error in request_password_reset: {str(e)}")
        return jsonify({'error': 'An unexpected error occurred'}), 500

@app.route('/verify-reset-otp', methods=['POST'])
def verify_reset_otp():
    try:
        data = request.get_json()
        if not data or 'email' not in data or 'otp' not in data:
            return jsonify({
                'error': 'Missing fields',
                'message': 'Both email and verification code are required'
            }), 400

        email = data['email'].strip()
        otp = data['otp'].strip()

        # Get the most recent unused OTP for this email
        otp_record = OTP.query.filter_by(
            email=email,
            is_used=False
        ).order_by(OTP.created_at.desc()).first()

        if not otp_record:
            return jsonify({
                'error': 'No code found',
                'message': 'No valid verification code found. Please request a new one.'
            }), 404

        # Check if OTP has expired (10 minutes)
        if datetime.utcnow() > otp_record.created_at + timedelta(minutes=10):
            otp_record.is_used = True
            db.session.commit()
            return jsonify({
                'error': 'Code expired',
                'message': 'Verification code has expired. Please request a new one.'
            }), 400

        # Verify OTP
        if otp_record.otp_code != otp:
            otp_record.attempts += 1
            db.session.commit()
            attempts_left = otp_record.max_attempts - otp_record.attempts
            if attempts_left <= 0:
                otp_record.is_used = True
                db.session.commit()
                return jsonify({
                    'error': 'Max attempts reached',
                    'message': 'Maximum number of attempts reached. Please request a new code.'
                }), 400
            return jsonify({
                'error': 'Invalid code',
                'message': f'Invalid verification code. {attempts_left} attempts remaining.'
            }), 400

        # Mark OTP as used
        otp_record.is_used = True
        db.session.commit()

        # Set session variables
        session['reset_verified'] = True
        session['reset_email'] = email
        session['reset_otp_id'] = otp_record.id
        session.permanent = True  # Make the session persist
        
        print(f"Session after OTP verification: {dict(session)}")  # Debug log
        
        return jsonify({
            'success': True,
            'message': 'OTP verified successfully'
        }), 200

    except Exception as e:
        db.session.rollback()
        print(f"Error in verify_reset_otp: {str(e)}")
        return jsonify({
            'error': 'Server error',
            'message': 'An unexpected error occurred. Please try again later.'
        }), 500

@app.route('/reset-password', methods=['POST'])
def reset_password():
    try:
        data = request.get_json()
        if not data or 'email' not in data or 'new_password' not in data:
            return jsonify({
                'error': 'Missing fields',
                'message': 'Email and new password are required'
            }), 400

        email = data['email'].strip()
        new_password = data['new_password'].strip()

        print(f"Session before password reset: {dict(session)}")  # Debug log

        # Check if user has verified OTP
        if not session.get('reset_verified') or session.get('reset_email') != email:
            print(f"Session verification failed. reset_verified: {session.get('reset_verified')}, reset_email: {session.get('reset_email')}, email: {email}")
            return jsonify({
                'error': 'Verification required',
                'message': 'Please verify your OTP first'
            }), 400

        # Validate password
        if not validate_password(new_password):
            return jsonify({
                'error': 'Invalid password',
                'message': 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character'
            }), 400

        # Get user
        user = User.query.filter_by(email=email).first()
        if not user:
            print(f"User not found for email: {email}")
            return jsonify({
                'error': 'User not found',
                'message': 'No account found with this email'
            }), 404

        print(f"Updating password for user: {email}")  # Debug log
        
        # Update password using the correct column name
        user.password_hash = generate_password_hash(new_password)
        db.session.commit()
        
        print(f"Password updated successfully for user: {email}")  # Debug log

        # Clear session variables
        session.pop('reset_verified', None)
        session.pop('reset_email', None)
        session.pop('reset_otp_id', None)

        return jsonify({
            'success': True,
            'message': 'Password reset successfully'
        }), 200

    except Exception as e:
        db.session.rollback()
        print(f"Error in reset_password: {str(e)}")
        return jsonify({
            'error': 'Server error',
            'message': 'An unexpected error occurred. Please try again later.'
        }), 500

def send_password_reset_email(email, otp):
    try:
        subject = "Password Reset Request - DEP Platform"
        html_content = f"""
        <html>
            <head>
                <style>
                    body {{
                        font-family: Arial, sans-serif;
                        line-height: 1.6;
                        color: #333333;
                        max-width: 600px;
                        margin: 0 auto;
                        padding: 20px;
                    }}
                    .header {{
                        background-color: #1a237e;
                        color: white;
                        padding: 20px;
                        text-align: center;
                        border-radius: 5px;
                    }}
                    .content {{
                        background-color: #ffffff;
                        padding: 20px;
                        border-radius: 5px;
                        margin-top: 20px;
                    }}
                    .otp {{
                        font-size: 32px;
                        font-weight: bold;
                        color: #1a237e;
                        text-align: center;
                        padding: 20px;
                        margin: 20px 0;
                        background-color: #f5f5f5;
                        border-radius: 5px;
                        letter-spacing: 5px;
                    }}
                    .warning {{
                        color: #d32f2f;
                        font-weight: bold;
                        margin-top: 20px;
                        padding: 10px;
                        background-color: #ffebee;
                        border-radius: 5px;
                    }}
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>Password Reset Request</h1>
                </div>
                <div class="content">
                    <p>Dear User,</p>
                    <p>We received a request to reset your password for your DEP Platform account. To proceed with the password reset, please use the following OTP (One-Time Password):</p>
                    <div class="otp">{otp}</div>
                    <p><strong>Important Notes:</strong></p>
                    <ul>
                        <li>This OTP will expire in 10 minutes</li>
                        <li>If you didn't request this password reset, please ignore this email</li>
                        <li>Your account security is important to us</li>
                    </ul>
                    <div class="warning">
                        <p>⚠️ Security Notice:</p>
                        <ul>
                            <li>Never share your OTP with anyone</li>
                            <li>Our team will never ask for your OTP</li>
                            <li>This is an automated message, please do not reply</li>
                        </ul>
                    </div>
                    <p>Best regards,<br>DEP Platform Team</p>
                </div>
            </body>
        </html>
        """

        msg = Message(
            subject=subject,
            recipients=[email],
            html=html_content,
            sender=app.config['MAIL_DEFAULT_SENDER']
        )
        mail.send(msg)
        print(f"Successfully sent password reset email to {email}")
        return True
    except Exception as e:
        print(f"Error sending password reset email: {str(e)}")
        return False


@app.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        
        # Check if this is an account existence check
        if data.get('check_account'):
            if not data.get('email'):
                return jsonify({
                    'error': 'Missing email',
                    'message': 'Email is required'
                }), 400

            user = User.query.filter_by(email=data['email']).first()
            
            if not user:
                return jsonify({
                    'error': 'Account not found',
                    'message': 'No account found with this email'
                }), 404

            return jsonify({
                'exists': True,
                'is_verified': user.is_verified
            }), 200

        # Regular login process
        if not data or not all(key in data for key in ['email', 'password']):
            return jsonify({
                'error': 'Missing credentials',
                'message': 'Please provide both email and password'
            }), 400

        # Validate email format
        if not re.match(r'^[a-zA-Z0-9._%+-]+@iitrpr\.ac\.in$', data['email']):
            return jsonify({
                'error': 'Invalid email',
                'message': 'Please use your IITRPR email address (username@iitrpr.ac.in)'
            }), 400

        user = User.query.filter_by(email=data['email']).first()
        
        if not user:
            return jsonify({
                'error': 'Invalid credentials',
                'message': 'No account found with this email'
            }), 401
            
        if not user.check_password(data['password']):
            return jsonify({
                'error': 'Invalid credentials',
                'message': 'Incorrect password'
            }), 401

        # Check if user's email is verified
        if not user.is_verified:
            return jsonify({
                'error': 'Verification pending',
                'message': 'Please verify your email before logging in'
            }), 403

        # Update last login time
        user.last_login = datetime.utcnow()
        db.session.commit()

        # Generate access token
        access_token = create_access_token(identity=user.username)
        return jsonify({
            'success': True,
            'access_token': access_token,
            'username': user.username,
            'message': 'Login successful'
        }), 200

    except Exception as e:
        print(f"Error in login: {str(e)}")
        return jsonify({
            'error': 'Server error',
            'message': 'An unexpected error occurred. Please try again later.'
        }), 500

# Rate limiting decorator
def rate_limit(limit=5, period=600):  # 5 requests per 10 minutes
    def decorator(f):
        @wraps(f)
        def wrapped(*args, **kwargs):
            # Get client IP
            client_ip = request.remote_addr
            key = f"rate_limit:{client_ip}:{f.__name__}"
            
            # Get current timestamp
            now = time.time()
            
            # Initialize g object if it doesn't exist
            if not hasattr(g, 'rate_limits'):
                g.rate_limits = {}
            
            # Get existing requests or initialize
            if key not in g.rate_limits:
                g.rate_limits[key] = []
            
            requests = g.rate_limits[key]
            
            # Remove old requests
            requests = [req for req in requests if now - req < period]
            
            # Check if limit exceeded
            if len(requests) >= limit:
                return jsonify({
                    'error': 'Too many requests. Please try again later.',
                    'retry_after': int(period - (now - requests[0]))
                }), 429
            
            # Add current request
            requests.append(now)
            g.rate_limits[key] = requests
            
            # Call the original function
            return f(*args, **kwargs)
        return wrapped
    return decorator

# Session management for OTP attempts
otp_attempts = {}

def track_otp_attempts(email, max_attempts=5, window_minutes=10):
    """
    Track OTP attempts for rate limiting.
    Returns True if too many attempts, False if allowed to proceed.
    """
    try:
        # Get all OTP attempts for this email in the time window
        cutoff_time = datetime.now(timezone.utc) - timedelta(minutes=window_minutes)
        recent_attempts = OTP.query.filter(
            OTP.email == email,
            OTP.created_at >= cutoff_time
        ).count()

        # If under the limit, allow the attempt
        if recent_attempts < max_attempts:
            return False
            
        return True
    except Exception as e:
        print(f"Error tracking OTP attempts: {str(e)}")
        return False  # On error, allow the attempt

def validate_otp_format(otp):
    if not otp or not isinstance(otp, str):
        return False
    if not otp.isdigit():
        return False
    if len(otp) != 6:
        return False
    return True

@app.route('/verify-otp', methods=['POST'])
def verify_otp():
    try:
        data = request.get_json()
        
        if not data or not all(key in data for key in ['email', 'otp']):
            return jsonify({
                'error': 'Missing fields',
                'message': 'Both email and verification code are required'
            }), 400

        email = data['email']
        otp = data['otp']
        is_login = data.get('is_login', False)  # Check if this is for login

        # Validate OTP format
        if not validate_otp_format(otp):
            return jsonify({
                'error': 'Invalid code',
                'message': 'Invalid verification code format'
            }), 400

        # Find the latest unused OTP for this email
        stored_otp = OTP.query.filter_by(
            email=email,
            is_used=False
        ).order_by(OTP.created_at.desc()).first()

        if not stored_otp:
            return jsonify({
                'error': 'No code found',
                'message': 'No valid verification code found. Please request a new one.'
            }), 404

        # Check if OTP has expired (10 minutes)
        if datetime.utcnow() > stored_otp.created_at + timedelta(minutes=10):
            stored_otp.is_used = True  # Mark as used if expired
            db.session.commit()
            return jsonify({
                'error': 'Code expired',
                'message': 'Verification code has expired. Please request a new one.'
            }), 400

        # Increment attempts counter
        stored_otp.attempts += 1
        db.session.commit()

        # Check if max attempts reached
        if stored_otp.attempts >= stored_otp.max_attempts:
            stored_otp.is_used = True  # Mark as used after max attempts
            db.session.commit()
            return jsonify({
                'error': 'Max attempts reached',
                'message': 'Maximum number of attempts reached. Please request a new verification code.',
                'attempts_left': 0
            }), 400

        # Verify OTP
        if stored_otp.otp_code != otp:
            attempts_left = stored_otp.max_attempts - stored_otp.attempts
            return jsonify({
                'error': 'Invalid code',
                'message': f'Invalid verification code. {attempts_left} attempts remaining.',
                'attempts_left': attempts_left
            }), 400

        # Mark OTP as used
        stored_otp.is_used = True
        
        # If this is a login attempt, generate access token
        if is_login:
            user = User.query.filter_by(email=email).first()
            if not user:
                return jsonify({
                    'error': 'Account not found',
                    'message': 'No account found with this email'
                }), 404
                
            # Update last login time
            user.last_login = datetime.utcnow()
            
            # Generate access token
            access_token = create_access_token(identity=user.username)
            
            db.session.commit()
            
            return jsonify({
                'success': True,
                'message': 'Login successful',
                'access_token': access_token,
                'username': user.username
            }), 200
        
        # For signup/other cases
        db.session.commit()
        return jsonify({
            'success': True,
            'message': 'Email verified successfully'
        }), 200

    except Exception as e:
        print(f"Error in verify_otp: {str(e)}")
        return jsonify({
            'error': 'Server error',
            'message': 'An unexpected error occurred. Please try again later.'
        }), 500

def send_otp_email(email, otp):
    try:
        subject = "Email Verification - Your OTP Code"
        html_content = f"""
        <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h2 style="color: #2c3e50; text-align: center;">Email Verification</h2>
                    <p>Hello,</p>
                    <p>Thank you for registering! Please use the following verification code to complete your registration:</p>
                    <div style="background-color: #f8f9fa; padding: 15px; text-align: center; border-radius: 5px; margin: 20px 0;">
                        <h1 style="color: #2c3e50; margin: 0; letter-spacing: 5px;">{otp}</h1>
                    </div>
                    <p>This code will expire in 10 minutes.</p>
                    <p>If you didn't request this verification, please ignore this email.</p>
                    <p style="color: #666; font-size: 0.9em; margin-top: 30px;">
                        This is an automated message, please do not reply.
                    </p>
                </div>
            </body>
        </html>
        """

        msg = Message(
            subject,
            recipients=[email],
            html=html_content,
            sender=app.config['MAIL_DEFAULT_SENDER']
        )
        mail.send(msg)
        print(f"Successfully sent OTP email to {email}")  # Add logging
        return True
    except Exception as e:
        print(f"Error sending email: {str(e)}")  # Add error logging
        return False

@app.route('/generate-otp', methods=['POST'])
def generate_otp():
    try:
        data = request.get_json()
        
        if not data or 'email' not in data:
            return jsonify({
                'error': 'Missing email',
                'message': 'Email is required'
            }), 400

        email = data['email']
        is_login = data.get('is_login', False)
        is_signup = data.get('is_signup', False)

        print(f"Generating OTP for email: {email}, is_login: {is_login}, is_signup: {is_signup}")

        # Check if user exists for login attempts
        if is_login:
            user = User.query.filter_by(email=email).first()
            if not user:
                return jsonify({
                    'error': 'Account not found',
                    'message': 'No account found with this email'
                }), 404

        # Check rate limiting
        recent_otps = OTP.query.filter(
            OTP.email == email,
            OTP.created_at > datetime.utcnow() - timedelta(minutes=1)
        ).count()

        if recent_otps >= 3:  # Allow max 3 OTP requests per minute
            return jsonify({
                'error': 'Too many requests',
                'message': 'Please wait a moment before requesting another verification code'
            }), 429

        # Generate 6-digit OTP
        otp = ''.join(random.choices(string.digits, k=6))
        
        # Mark any existing unused OTPs as used
        existing_otps = OTP.query.filter_by(
            email=email,
            is_used=False
        ).all()
        
        for existing_otp in existing_otps:
            existing_otp.is_used = True
        
        # Create new OTP record with current UTC time
        current_time = datetime.now(timezone.utc)
        new_otp = OTP(
            email=email,
            otp_code=otp,
            is_used=False,
            attempts=0,
            max_attempts=5,
            created_at=current_time
        )
        
        db.session.add(new_otp)
        db.session.commit()
        
        # Calculate expiry time for response
        expiry_time = current_time + timedelta(minutes=10)
        print(f"New OTP generated: {otp}, created at: {current_time}, expires at: {expiry_time}")

        # Send OTP via email
        try:
            msg = Message(
                'Your Verification Code',
                sender=app.config['MAIL_DEFAULT_SENDER'],
                recipients=[email]
            )
            msg.body = f'Your verification code is: {otp}\n\nThis code will expire in 10 minutes.'
            mail.send(msg)
            print(f"OTP email sent to {email}")
        except Exception as e:
            print(f"Error sending email: {str(e)}")
            return jsonify({
                'error': 'Email error',
                'message': 'Failed to send verification code. Please try again.'
            }), 500

        return jsonify({
            'success': True,
            'message': 'Verification code sent successfully',
            'attempts_allowed': 5,
            'expires_in': 600  # 10 minutes in seconds
        }), 200

    except Exception as e:
        db.session.rollback()
        print(f"Error in generate_otp: {str(e)}")
        return jsonify({
            'error': 'Server error',
            'message': 'An unexpected error occurred. Please try again later.'
        }), 500

@app.route('/resend-otp', methods=['POST'])
@rate_limit(limit=2, period=300)  # 2 requests per 5 minutes
def resend_otp():
    data = request.get_json()
    email = data.get('email')
    
    if not email:
        return jsonify({'error': 'Email is required'}), 400
    
    # Check if user exists
    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({'error': 'No account found with this email'}), 404
    
    # Check for recent OTP
    recent_otp = OTP.query.filter_by(
        email=email,
        is_used=False
    ).order_by(OTP.created_at.desc()).first()
    
    if not recent_otp:
        return jsonify({'error': 'No active OTP found. Please generate a new one.'}), 400
    
    if datetime.utcnow() - recent_otp.created_at < timedelta(minutes=1):
        return jsonify({
            'error': 'Please wait 1 minute before requesting another OTP',
            'retry_after': 60 - (datetime.utcnow() - recent_otp.created_at).seconds
        }), 429
    
    # Resend the existing OTP
    if os.getenv('FLASK_ENV') == 'development':
        return jsonify({
            'message': 'OTP resent successfully (Development Mode)',
            'otp': recent_otp.otp_code,  # Remove this in production
            'expires_at': recent_otp.created_at.isoformat()
        }), 200
    else:
        if send_otp_email(email, recent_otp.otp_code):
            return jsonify({
                'message': 'OTP has been resent to your email',
                'expires_at': recent_otp.created_at.isoformat()
            }), 200
        else:
            return jsonify({
                'error': 'Failed to resend OTP email. Please try again.'
            }), 500

@app.route('/uploads', methods=['POST'])
@jwt_required()
@swag_from({
    'parameters': [
        {
            'name': 'file',
            'in': 'formData',
            'type': 'file',
            'required': True
        }
    ],
    'responses': {
        201: 'Upload successful',
        400: 'Invalid input',
        401: 'Unauthorized'
    }
})
def upload_file():
    try:
        current_user = get_jwt_identity()
        
        # Get form data
        course_code = request.form.get('course_code')
        description = request.form.get('description')
        tags = request.form.get('tags')
        year = request.form.get('year')
        semester = request.form.get('semester')

        # Validate required fields
        if not course_code:
            return jsonify({'message': 'Course code is required'}), 400
        if not description:
            return jsonify({'message': 'Description is required'}), 400
        if not tags:
            return jsonify({'message': 'At least one tag is required'}), 400

        # Handle file upload
        if 'file' in request.files:
            file = request.files['file']
            
            if file.filename == '':
                return jsonify({'message': 'No selected file'}), 400

            if not allowed_file(file.filename):
                return jsonify({'message': f'File type not allowed. Allowed types: {", ".join(ALLOWED_EXTENSIONS)}'}), 400

            try:
                # Upload to Cloudinary
                upload_result = cloudinary.uploader.upload(
                    file.stream,
                    folder="material_sharing",
                    resource_type="auto"
                )
                print("Upload Result:", upload_result)
                file_url = upload_result.get('secure_url')
                public_id = upload_result.get('public_id')
                file_type = os.path.splitext(file.filename)[1][1:].lower()

                new_upload = Upload(
                    author=current_user,
                    course_code=course_code,
                    description=description,
                    tags=tags,
                    file_url=file_url,
                    public_id=public_id,
                    year=year,
                    semester=semester,
                    file_type=file_type
                )

            except Exception as cloudinary_error:
                print(f"Cloudinary error: {str(cloudinary_error)}")
                return jsonify({'message': 'Error uploading to cloud storage'}), 500

        # Handle link upload
        elif 'link' in request.form:
            link = request.form.get('link')
            if not link:
                return jsonify({'message': 'Link is required when no file is provided'}), 400

            new_upload = Upload(
                author=current_user,
                course_code=course_code,
                description=description,
                tags=tags,
                file_url=link,
                year=year,
                semester=semester
            )
        else:
            return jsonify({'message': 'Either a file or link must be provided'}), 400
        # print("Received Files:", request.files)
        # print("Received Form Data:", request.form)

        # Save to database
        try:
            db.session.add(new_upload)
            db.session.commit()
            return jsonify({
                'message': 'Upload successful',
                'file_url': new_upload.file_url
            }), 201
        except Exception as db_error:
            db.session.rollback()
            print(f"Database error: {str(db_error)}")
            return jsonify({'message': 'Error saving to database'}), 500

    except Exception as e:
        print(f"General error: {str(e)}")
        return jsonify({'message': f'Error processing upload: {str(e)}'}), 500

@app.route('/uploads/<int:upload_id>', methods=['DELETE'])
@jwt_required()
def delete_upload(upload_id):
    try:
        # Get the upload
        upload = Upload.query.get(upload_id)
        
        if not upload:
            return jsonify({'message': 'Upload not found'}), 404
            
        # If there's a file in Cloudinary, delete it
        if upload.public_id:
            try:
                cloudinary.uploader.destroy(upload.public_id)
            except Exception as cloud_error:
                print(f"Error deleting from Cloudinary: {str(cloud_error)}")
                # Continue with database deletion even if Cloudinary deletion fails
        
        # Delete associated comments first (due to foreign key constraint)
        Comment.query.filter_by(upload_id=upload_id).delete()
        
        # Delete any votes or ratings associated with this upload
        # (assuming you have a Votes table)
        # Vote.query.filter_by(upload_id=upload_id).delete()
        
        # Delete the upload record
        db.session.delete(upload)
        db.session.commit()
        
        return jsonify({
            'message': 'Upload and associated data deleted successfully',
            'deleted_id': upload_id
        }), 200
        
    except Exception as e:
        db.session.rollback()
        print(f"Error deleting upload: {str(e)}")
        return jsonify({'message': f'Error deleting upload: {str(e)}'}), 500

@app.route('/uploads/<int:upload_id>/vote', methods=['POST'])
@jwt_required()
def vote(upload_id):
    try:
        current_user = get_jwt_identity()
        data = request.get_json()
        if not data or 'type' not in data:
            return jsonify({'message': 'Missing vote type'}), 400
            
        upload_item = Upload.query.get(upload_id)
        if not upload_item:
            return jsonify({'message': 'Upload not found'}), 404

        vote_type = data['type']
        existing_vote = Vote.query.filter_by(
            upload_id=upload_id,
            user=current_user
        ).first()

        # Handle vote removal
        if vote_type == 'remove' and existing_vote:
            if existing_vote.vote_type == 'upvote':
                upload_item.upvotes = max(0, upload_item.upvotes - 1)
            else:
                upload_item.downvotes = max(0, upload_item.downvotes - 1)
            db.session.delete(existing_vote)

        # Handle vote switching or new vote
        elif vote_type in ['upvote', 'downvote']:
            if existing_vote:
                # Switch vote
                if existing_vote.vote_type != vote_type:
                    if vote_type == 'upvote':
                        upload_item.downvotes = max(0, upload_item.downvotes - 1)
                        upload_item.upvotes += 1
                    else:
                        upload_item.upvotes = max(0, upload_item.upvotes - 1)
                        upload_item.downvotes += 1
                    existing_vote.vote_type = vote_type
            else:
                # New vote
                new_vote = Vote(
                    upload_id=upload_id,
                    user=current_user,
                    vote_type=vote_type
                )
                db.session.add(new_vote)
                if vote_type == 'upvote':
                    upload_item.upvotes += 1
                else:
                    upload_item.downvotes += 1
        else:
            return jsonify({'message': 'Invalid vote type'}), 400

        db.session.commit()

        # Return the user's current vote status along with counts
        return jsonify({
            'message': f"Vote {vote_type} recorded successfully",
            'upvotes': upload_item.upvotes,
            'downvotes': upload_item.downvotes,
            'userVote': vote_type if vote_type != 'remove' else None
        })

    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Error recording vote: {str(e)}'}), 500

@app.route('/uploads/<int:upload_id>/comments', methods=['GET'])
@jwt_required()
def get_comments(upload_id):
    try:
        comments = Comment.query.filter_by(upload_id=upload_id).order_by(Comment.created_at.desc()).all()
        
        comments_list = []
        for comment in comments:
            comments_list.append({
                'id': comment.id,
                'author': comment.author,
                'text': comment.text,
                'created_at': comment.created_at.isoformat()
            })
        
        return jsonify({'comments': comments_list}), 200
    except Exception as e:
        return jsonify({'message': f'Error fetching comments: {str(e)}'}), 500

@app.route('/uploads/<int:upload_id>/comments', methods=['POST'])
@jwt_required()
def add_comment(upload_id):
    try:
        data = request.get_json()
        current_user = get_jwt_identity()
        
        if not data or 'text' not in data:
            return jsonify({'message': 'Missing comment text'}), 400
        
        if not Upload.query.get(upload_id):
            return jsonify({'message': 'Upload not found'}), 404
        
        new_comment = Comment(
            upload_id=upload_id,
            author=current_user,
            text=data['text']
        )
        
        db.session.add(new_comment)
        db.session.commit()
        
        return jsonify({
            'message': 'Comment added successfully',
            'comment': {
                'id': new_comment.id,
                'author': new_comment.author,
                'text': new_comment.text,
                'created_at': new_comment.created_at.isoformat()
            }
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Error adding comment: {str(e)}'}), 500

@app.route('/recent-uploads', methods=['GET'])
@jwt_required()
def recent_uploads():
    try:
        current_user = get_jwt_identity()
        uploads = Upload.query.order_by(Upload.created_at.desc()).limit(10).all()
        
        materials = []
        for upload in uploads:
            # Get user's vote for this upload
            user_vote = Vote.query.filter_by(
                upload_id=upload.id,
                user=current_user
            ).first()

            materials.append({
                'id': upload.id,
                'author': upload.author,
                'course_code': upload.course_code,
                'description': upload.description,
                'tags': upload.tags.split(','),
                'file_url': upload.file_url,
                'upvotes': upload.upvotes,
                'downvotes': upload.downvotes,
                'userVote': user_vote.vote_type if user_vote else None,
                'year': upload.year,
                'semester': upload.semester,
                'created_at': upload.created_at.isoformat(),
                'file_type': upload.file_type
            })
        
        return jsonify({'materials': materials}), 200
    except Exception as e:
        return jsonify({'message': f'Error fetching recent uploads: {str(e)}'}), 500

@app.route('/search', methods=['GET'])
@jwt_required()
def search_materials():
    try:
        # Get search parameters
        course_code = request.args.get('course_code', '')
        year = request.args.get('year', '')
        semester = request.args.get('semester', '')
        tags = request.args.getlist('tags')
        
        # Build the query
        query = Upload.query
        
        if course_code:
            query = query.filter(Upload.course_code.like(f'%{course_code}%'))
        
        if year:
            query = query.filter(Upload.year == year)
        
        if semester:
            query = query.filter(Upload.semester == semester)
        
        # Get all results that match the basic criteria
        results = query.order_by(Upload.created_at.desc()).all()
        
        # Filter by tags if provided
        if tags:
            filtered_results = []
            for upload in results:
                upload_tags = upload.tags.split(',')
                matching_tags = sum(1 for tag in tags if tag in upload_tags)
                if matching_tags > 0:
                    filtered_results.append((upload, matching_tags))
            
            filtered_results.sort(key=lambda x: x[1], reverse=True)
            results = [item[0] for item in filtered_results]
        
        # Format the results
        materials = []
        for upload in results:
            materials.append({
                'id': upload.id,
                'author': upload.author,
                'course_code': upload.course_code,
                'description': upload.description,
                'tags': upload.tags.split(','),
                'file_url': upload.file_url,
                'upvotes': upload.upvotes,
                'downvotes': upload.downvotes,
                'year': upload.year,
                'semester': upload.semester,
                'created_at': upload.created_at.isoformat(),
                'file_type': upload.file_type
            })
        
        return jsonify({'materials': materials}), 200
    except Exception as e:
        return jsonify({'message': f'Error searching materials: {str(e)}'}), 500

@app.route('/verify-token', methods=['GET'])
@jwt_required()
def verify_token():
    try:
        current_user = get_jwt_identity()
        return jsonify({'user': current_user}), 200
    except Exception as e:
        return jsonify({'message': 'Invalid token'}), 401

# Add file validation
def validate_file(file):
    if not file:
        return False, "No file provided"
    if file.content_length > app.config['MAX_CONTENT_LENGTH']:
        return False, "File too large"
    if not allowed_file(file.filename):
        return False, "Invalid file type"
    return True, None

# Add comprehensive tests
def test_upload_resource():
    # Test resource upload
    pass

def test_user_authentication():
    # Test user auth
    pass

# Add new routes for profile management
@app.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    try:
        current_user = get_jwt_identity()
        user = User.query.filter_by(username=current_user).first()
        
        if not user:
            return jsonify({'message': 'User not found'}), 404
            
        return jsonify({
            'username': user.username,
            'email': user.email,
            'bio': user.bio,
            'profile_picture': user.profile_picture
        }), 200
    except Exception as e:
        return jsonify({'message': f'Error fetching profile: {str(e)}'}), 500

@app.route('/update-profile', methods=['PUT'])
@jwt_required()
def update_profile():
    try:
        current_user = get_jwt_identity()  # This returns the username
        data = request.get_json()
        
        # Get user from database using username
        user = User.query.filter_by(username=current_user).first()
        if not user:
            return jsonify({'message': 'User not found'}), 404

        # Update user fields
        if 'username' in data:
            # Check if username is already taken
            existing_user = User.query.filter_by(username=data['username']).first()
            if existing_user and existing_user.id != user.id:
                return jsonify({'message': 'Username already taken'}), 400
            user.username = data['username']

        if 'email' in data:
            # Check if email is already taken
            existing_user = User.query.filter_by(email=data['email']).first()
            if existing_user and existing_user.id != user.id:
                return jsonify({'message': 'Email already taken'}), 400
            user.email = data['email']

        if 'bio' in data:
            user.bio = data['bio']

        # Commit changes
        db.session.commit()

        # Return updated user data
        return jsonify({
            'message': 'Profile updated successfully',
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'bio': user.bio,
                'profile_picture': user.profile_picture
            }
        }), 200

    except Exception as e:
        db.session.rollback()
        print(f"Error updating profile: {str(e)}")
        return jsonify({'message': 'Failed to update profile'}), 500

# profile picture upload handling
@app.route('/upload-profile-picture', methods=['POST'])
@jwt_required()
def upload_profile_picture():
    try:
        current_user = get_jwt_identity()
        
        # Check if user exists
        user = User.query.filter_by(username=current_user).first()
        if not user:
            return jsonify({'message': 'User not found'}), 404
        
        # Handle file upload
        if 'file' not in request.files:
            return jsonify({'message': 'No file part'}), 400
            
        file = request.files['file']
        
        if file.filename == '':
            return jsonify({'message': 'No selected file'}), 400

        if not allowed_file(file.filename):
            return jsonify({'message': f'File type not allowed. Allowed types: {", ".join(ALLOWED_EXTENSIONS)}'}), 400

        try:
            # Upload to Cloudinary in the profile-pic folder
            upload_result = cloudinary.uploader.upload(
                file.stream,
                folder="profile-pic",
                resource_type="raw"
            )
            
            file_url = upload_result.get('secure_url')
            
            # Update user's profile picture
            user.profile_picture = file_url
            db.session.commit()
            
            return jsonify({
                'message': 'Profile picture updated successfully',
                'profile_picture': file_url
            }), 200
            
        except Exception as cloudinary_error:
            print(f"Cloudinary error: {str(cloudinary_error)}")
            return jsonify({'message': 'Error uploading to cloud storage'}), 500
            
    except Exception as e:
        db.session.rollback()
        print(f"Error uploading profile picture: {str(e)}")
        return jsonify({'message': f'Error uploading profile picture: {str(e)}'}), 500

@app.route('/user-stats', methods=['GET'])
@jwt_required()
def get_user_stats():
    try:
        current_user = get_jwt_identity()
        
        # Get user's uploads count
        uploads_count = Upload.query.filter_by(author=current_user).count()
        
        # Get user's comments count
        comments_count = Comment.query.filter_by(author=current_user).count()
        
        # Get placements added count
        placements_added = Placement.query.filter_by(created_by=current_user).count()
        
        # Get interview experiences added count
        interview_experiences_added = InterviewExperience.query.filter_by(created_by=current_user).count()
        
        # Get classrooms created by user
        classrooms_created = Classroom.query.filter_by(created_by=current_user).all()
        classrooms_created_data = [{
            'id': classroom.id,
            'name': classroom.name
        } for classroom in classrooms_created]
        
        # Get classrooms user is part of
        memberships = ClassroomMembership.query.filter_by(user_id=current_user).all()
        classroom_ids = [membership.classroom_id for membership in memberships]
        classrooms_joined = Classroom.query.filter(Classroom.id.in_(classroom_ids)).all()
        classrooms_joined_data = [{
            'id': classroom.id,
            'name': classroom.name
        } for classroom in classrooms_joined]
        
        # Get recent activity (last 5 uploads)
        recent_uploads = Upload.query.filter_by(author=current_user)\
            .order_by(Upload.created_at.desc())\
            .limit(5)\
            .all()
        
        recent_activity = [{
            'id': upload.id,
            'course_code': upload.course_code,
            'description': upload.description,
            'created_at': upload.created_at.isoformat(),
            'upvotes': upload.upvotes,
            'downvotes': upload.downvotes
        } for upload in recent_uploads]
        
        # Create a log of searches (we need to track these in the respective search endpoints)
        # For now, we'll return placeholder counts that you can implement fully later
        
        return jsonify({
            'uploads': uploads_count,
            'comments': comments_count,
            'placements_added': placements_added,
            'placements_searches': 0,  # Placeholder - implement tracking in search endpoint
            'interview_experiences_added': interview_experiences_added,
            'interview_experience_searches': 0,  # Placeholder - implement tracking in search endpoint
            'dsa_searches': 0,  # Placeholder - implement tracking in search endpoint
            'classrooms_created': classrooms_created_data,
            'classrooms_joined': classrooms_joined_data,
            'recent_activity': recent_activity
        }), 200
    except Exception as e:
        print(f"Error fetching user stats: {str(e)}")
        return jsonify({'message': f'Error fetching user stats: {str(e)}'}), 500

# Create tables
with app.app_context():
    try:
        # Create tables if they don't exist
        db.create_all()
        logger.info("Database tables created successfully")
    except Exception as e:
        logger.error(f"Error creating database tables: {str(e)}")
        raise

@app.route('/api/jobs', methods=['GET'])
#@jwt_required()
# there is some problem with this authentication here---> LOOK INTO IT
def get_jobs():
    print("\nReceived request to get jobs")
    # Get parameters from the request
    field = request.args.get('field', '')
    geoid = request.args.get('geoid', '')
    page = request.args.get('page', 0)
    sort_by = request.args.get('sortBy', '')
    job_type = request.args.get('jobType', '')
    exp_level = request.args.get('expLevel', '')
    work_type = request.args.get('workType', '')
    filter_by_company = request.args.get('filterByCompany', '')
    
    # Print all parameters received from frontend
    print("\nReceived parameters from frontend:")
    print(f"Field: {field}")
    print(f"Geoid: {geoid}")
    print(f"Page: {page}")
    print(f"Sort By: {sort_by}")
    print(f"Job Type: {job_type}")
    print(f"Experience Level: {exp_level}")
    print(f"Work Type: {work_type}")
    print(f"Filter By Company: {filter_by_company}")
    print("----------------------------------------\n")
    
    # API endpoint and key
    api_key = "67e19812b136d19387075104"
    url = "https://api.scrapingdog.com/linkedinjobs"
    
    # Set up parameters for the API call
    params = {
        "api_key": api_key,
        "field": field,
        "geoid": geoid,
        "page": 1,
        "sortBy": sort_by,
        "jobType": job_type,
        "expLevel": exp_level,
        "workType": work_type,
        "filterByCompany": filter_by_company
    }
    
    # Remove empty parameters
    params = {k: v for k, v in params.items() if v}
    
    try:
        # Make the API call
        response = requests.get(url, params=params)
        
        if response.status_code == 200:
            return jsonify(response.json())
        else:
            return jsonify({
                "error": f"Request failed with status code: {response.status_code}",
                "message": response.text
            }), response.status_code
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Routes for placement data
@app.route('/placements', methods=['GET'])
@jwt_required()
def get_placements():
    try:
        placements = Placement.query.order_by(Placement.created_at.desc()).all()
        
        result = []
        for placement in placements:
            # Get people associated with this placement
            people = PlacementPerson.query.filter_by(placement_id=placement.id).all()
            
            people_data = []
            for person in people:
                people_data.append({
                    'id': person.id,
                    'name': person.name,
                    'resume_url': person.resume_url
                })
            
            result.append({
                'id': placement.id,
                'company': placement.company,
                'type': placement.type,
                'mode': placement.mode,
                'year': placement.year,
                'role': placement.role,
                'referral': placement.referral,
                'created_at': placement.created_at.isoformat(),
                'created_by': placement.created_by,
                'people': people_data
            })
        
        return jsonify({'placements': result}), 200
    except Exception as e:
        return jsonify({'message': f'Error fetching placements: {str(e)}'}), 500

@app.route('/placements', methods=['POST'])
@jwt_required()
def add_placement():
    try:
        current_user = get_jwt_identity()
        
        # Get form data
        company = request.form.get('company')
        placement_type = request.form.get('type')
        mode = request.form.get('mode')
        year = request.form.get('year')
        role = request.form.get('role')
        referral = request.form.get('referral')
        
        # Validate required fields
        if not company or not placement_type or not mode or not year or not role:
            return jsonify({'message': 'Missing required fields'}), 400
        
        # Create new placement
        new_placement = Placement(
            company=company,
            type=placement_type,
            mode=mode,
            year=year,
            role=role,
            referral=referral,
            created_by=current_user
        )
        
        db.session.add(new_placement)
        db.session.flush()  # Get the ID without committing
        
        # Process people data
        people_data = []
        
        # Determine how many people were submitted
        person_count = 0
        for key in request.form.keys():
            if key.startswith('people[') and key.endswith('][name]'):
                person_count = max(person_count, int(key.split('[')[1].split(']')[0]) + 1)
        
        for i in range(person_count):
            name_key = f'people[{i}][name]'
            name = request.form.get(name_key)
            
            if name:
                resume_url = None
                resume_public_id = None
                
                # Check if a resume was uploaded for this person
                resume_key = f'people[{i}][resume]'
                if resume_key in request.files and request.files[resume_key].filename:
                    file = request.files[resume_key]
                    
                    # if not allowe 
                    # file = request.files[resume_key]
                    
                    if not allowed_file(file.filename):
                        return jsonify({'message': f'Invalid file type for resume. Allowed types: {", ".join(ALLOWED_EXTENSIONS)}'}), 400
                    
                    # Upload to Cloudinary
                    upload_result = cloudinary.uploader.upload(
                        file,
                        folder="placements",
                        resource_type="raw"
                    )
                    
                    resume_url = upload_result.get('secure_url')
                    resume_public_id = upload_result.get('public_id')
                
                # Create person record
                new_person = PlacementPerson(
                    placement_id=new_placement.id,
                    name=name,
                    resume_url=resume_url,
                    resume_public_id=resume_public_id
                )
                
                db.session.add(new_person)
                
                people_data.append({
                    'name': name,
                    'resume_url': resume_url
                })
        
        db.session.commit()
        
        return jsonify({
            'message': 'Placement added successfully',
            'placement': {
                'id': new_placement.id,
                'company': new_placement.company,
                'type': new_placement.type,
                'mode': new_placement.mode,
                'year': new_placement.year,
                'role': new_placement.role,
                'referral': new_placement.referral,
                'people': people_data
            }
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Error adding placement: {str(e)}'}), 500

@app.route('/placements/search', methods=['GET'])
@jwt_required()
def search_placements():
    try:
        # Get search parameters
        company = request.args.get('company', '')
        year = request.args.get('year', '')
        placement_type = request.args.get('type', '')
        
        # Build the query
        query = Placement.query
        
        if company:
            query = query.filter(Placement.company.like(f'%{company}%'))
        
        if year:
            query = query.filter(Placement.year == year)
        
        if placement_type:
            query = query.filter(Placement.type == placement_type)
        
        # Get results
        placements = query.order_by(Placement.created_at.desc()).all()
        
        result = []
        for placement in placements:
            # Get people associated with this placement
            people = PlacementPerson.query.filter_by(placement_id=placement.id).all()
            
            people_data = []
            for person in people:
                people_data.append({
                    'id': person.id,
                    'name': person.name,
                    'resume_url': person.resume_url
                })
            
            result.append({
                'id': placement.id,
                'company': placement.company,
                'type': placement.type,
                'mode': placement.mode,
                'year': placement.year,
                'role': placement.role,
                'referral': placement.referral,
                'created_at': placement.created_at.isoformat(),
                'created_by': placement.created_by,
                'people': people_data
            })
        
        return jsonify({'placements': result}), 200
    except Exception as e:
        return jsonify({'message': f'Error searching placements: {str(e)}'}), 500


# Routes for interview experiences
@app.route('/interview-experiences', methods=['GET'])
@jwt_required()
def get_interview_experiences():
    try:
        # Get search parameters
        company = request.args.get('company', '')
        year = request.args.get('year', '')
        interview_type = request.args.get('type', '')
        
        # Build the query
        query = InterviewExperience.query
        
        if company:
            query = query.filter(InterviewExperience.company.like(f'%{company}%'))
        
        if year:
            query = query.filter(InterviewExperience.year == year)
        
        if interview_type:
            query = query.filter(InterviewExperience.type == interview_type)
        
        # Get results
        interviews = query.order_by(InterviewExperience.created_at.desc()).all()
        
        result = []
        for interview in interviews:
            # Get questions associated with this interview
            questions = InterviewQuestion.query.filter_by(interview_id=interview.id).all()
            
            questions_data = []
            for question in questions:
                questions_data.append({
                    'id': question.id,
                    'question': question.question,
                    'answer': question.answer
                })
            
            # Parse tags
            tags = interview.tags.split(',') if interview.tags else []
            
            result.append({
                'id': interview.id,
                'company': interview.company,
                'candidateName': interview.candidate_name,
                'interviewerName': interview.interviewer_name,
                'year': interview.year,
                'type': interview.type,
                'tips': interview.tips,
                'created_at': interview.created_at.isoformat(),
                'created_by': interview.created_by,
                'tags': tags,
                'questions': questions_data
            })
        
        return jsonify({'interviews': result}), 200
    except Exception as e:
        return jsonify({'message': f'Error fetching interview experiences: {str(e)}'}), 500

@app.route('/interview-experiences', methods=['POST'])
@jwt_required()
def add_interview_experience():
    try:
        current_user = get_jwt_identity()
        data = request.get_json()
        
        # Validate required fields
        if not data.get('company') or not data.get('candidateName') or not data.get('year') or not data.get('type'):
            return jsonify({'message': 'Missing required fields'}), 400
        
        if not data.get('questions') or len(data.get('questions')) == 0:
            return jsonify({'message': 'At least one question is required'}), 400
        
        # Process tags
        tags = ','.join(data.get('tags', [])) if data.get('tags') else ''
        
        # Create new interview experience
        new_interview = InterviewExperience(
            company=data.get('company'),
            candidate_name=data.get('candidateName'),
            interviewer_name=data.get('interviewerName', ''),
            year=data.get('year'),
            type=data.get('type'),
            tips=data.get('tips', ''),
            created_by=current_user,
            tags=tags
        )
        
        db.session.add(new_interview)
        db.session.flush()  # Get the ID without committing
        
        # Process questions
        questions_data = []
        for q in data.get('questions', []):
            if q.get('question') and q.get('answer'):
                new_question = InterviewQuestion(
                    interview_id=new_interview.id,
                    question=q.get('question'),
                    answer=q.get('answer')
                )
                
                db.session.add(new_question)
                
                questions_data.append({
                    'question': q.get('question'),
                    'answer': q.get('answer')
                })
        
        db.session.commit()
        
        return jsonify({
            'message': 'Interview experience added successfully',
            'interview': {
                'id': new_interview.id,
                'company': new_interview.company,
                'candidateName': new_interview.candidate_name,
                'interviewerName': new_interview.interviewer_name,
                'year': new_interview.year,
                'type': new_interview.type,
                'tips': new_interview.tips,
                'tags': data.get('tags', []),
                'questions': questions_data
            }
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Error adding interview experience: {str(e)}'}), 500

@app.route('/interview-experiences/<int:interview_id>', methods=['GET'])
@jwt_required()
def get_interview_experience(interview_id):
    try:
        interview = InterviewExperience.query.get(interview_id)
        
        if not interview:
            return jsonify({'message': 'Interview experience not found'}), 404
        
        # Get questions associated with this interview
        questions = InterviewQuestion.query.filter_by(interview_id=interview.id).all()
        
        questions_data = []
        for question in questions:
            questions_data.append({
                'id': question.id,
                'question': question.question,
                'answer': question.answer
            })
        
        # Parse tags
        tags = interview.tags.split(',') if interview.tags else []
        
        return jsonify({
            'interview': {
                'id': interview.id,
                'company': interview.company,
                'candidateName': interview.candidate_name,
                'interviewerName': interview.interviewer_name,
                'year': interview.year,
                'type': interview.type,
                'tips': interview.tips,
                'created_at': interview.created_at.isoformat(),
                'created_by': interview.created_by,
                'tags': tags,
                'questions': questions_data
            }
        }), 200
    except Exception as e:
        return jsonify({'message': f'Error fetching interview experience: {str(e)}'}), 500


# @app.route('/api/duckduckgo-search', methods=['GET'])
# def duckduckgo_search():
#     query = request.args.get('q')
    
#     if not query:
#         return jsonify({'error': 'Missing search query'}), 400
    
#     try:
#         # DuckDuckGo search
#         headers = {
#             'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
#         }
#         response = requests.get(
#             f'https://html.duckduckgo.com/html/?q={query}',
#             headers=headers
#         )
        
#         if response.status_code != 200:
#             return jsonify({'error': 'Failed to fetch search results'}), 500
        
#         # Parse the HTML response
#         soup = BeautifulSoup(response.text, 'html.parser')
#         results = []
        
#         # Extract search results
#         for result in soup.select('.result'):
#             title_elem = result.select_one('.result__a')
#             snippet_elem = result.select_one('.result__snippet')
            
#             if title_elem and title_elem.get('href'):
#                 title = title_elem.get_text(strip=True)
#                 url = title_elem.get('href')
#                 description = snippet_elem.get_text(strip=True) if snippet_elem else ''
                
#                 results.append({
#                     'title': title,
#                     'url': url,
#                     'description': description
#                 })
        
#         return jsonify({'results': results})
    
#     except Exception as e:
#         return jsonify({'error': str(e)}), 500
# app.py (Flask backend)


@app.route('/api/search-dsa', methods=['POST'])
def search_dsa():
    data = request.json
    query = data.get('query', '')
    sites = data.get('sites', [])
    
    if not query:
        return jsonify({"error": "Query is required"}), 400
    
    # Format site-specific search query for DuckDuckGo
    site_restrictions = " OR ".join([f"site:{site}" for site in sites])
    search_query = f"{query} ({site_restrictions})"
    
    try:
        # Using DuckDuckGo HTML API (they don't have an official API)
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        response = requests.get(
            f"https://html.duckduckgo.com/html/?q={search_query}",
            headers=headers
        )
        
        if response.status_code != 200:
            return jsonify({"error": "Failed to fetch search results"}), 500
        
        # Parse the HTML response
        soup = BeautifulSoup(response.text, 'html.parser')
        results = []
        
        # Extract search results
        for result in soup.select('.result'):
            title_elem = result.select_one('.result__title')
            url_elem = result.select_one('.result__url')
            snippet_elem = result.select_one('.result__snippet')
            
            if title_elem and url_elem:
                title = title_elem.get_text(strip=True)
                url = url_elem.get('href') if url_elem.get('href') else url_elem.get_text(strip=True)
                
                # Clean URL if it's from DuckDuckGo's redirect
                if '/duckduckgo.com/' in url:
                    url_match = re.search(r'uddg=([^&]+)', url)
                    if url_match:
                        url = requests.utils.unquote(url_match.group(1))
                
                # Identify source website
                source = None
                for site in sites:
                    if site in url:
                        source = site
                        break
                
                snippet = snippet_elem.get_text(strip=True) if snippet_elem else ""
                
                results.append({
                    "title": title,
                    "url": url,
                    "snippet": snippet,
                    "source": source
                })
                
                # Limit to 10 results
                if len(results) >= 20:
                    break
        
        return jsonify({"results": results})
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# classroom type discussion backend
@app.route('/api/classroom/create', methods=['POST'])
@jwt_required()
def create_classroom():
    try:
        current_user = get_jwt_identity()
        data = request.get_json()
        
        if not data or not data.get('name'):
            return jsonify({'message': 'Classroom name is required'}), 400
        
        new_classroom = Classroom(
            name=data.get('name'),
            description=data.get('description', ''),
            created_by=current_user
        )
        
        db.session.add(new_classroom)
        db.session.flush()  # Get the ID without committing
        
        # Add creator as a member
        membership = ClassroomMembership(
            user_id=current_user,
            classroom_id=new_classroom.id
        )
        
        db.session.add(membership)
        db.session.commit()
        
        return jsonify({
            'message': 'Classroom created successfully',
            'classroom': {
                'id': new_classroom.id,
                'name': new_classroom.name,
                'description': new_classroom.description,
                'created_by': new_classroom.created_by,
                'created_at': new_classroom.created_at.isoformat()
            }
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Error creating classroom: {str(e)}'}), 500

@app.route('/api/classroom/join', methods=['POST'])
@jwt_required()
def join_classroom():
    try:
        current_user = get_jwt_identity()
        data = request.get_json()
        
        if not data or not data.get('classroom_id'):
            return jsonify({'message': 'Classroom ID is required'}), 400
        
        classroom_id = data.get('classroom_id')
        
        # Check if classroom exists
        classroom = Classroom.query.get(classroom_id)
        if not classroom:
            return jsonify({'message': 'Classroom not found'}), 404
        
        # Check if user is already a member
        existing_membership = ClassroomMembership.query.filter_by(
            user_id=current_user,
            classroom_id=classroom_id
        ).first()
        
        if existing_membership:
            return jsonify({'message': 'You are already a member of this classroom'}), 400
        
        # Add user as a member
        membership = ClassroomMembership(
            user_id=current_user,
            classroom_id=classroom_id
        )
        
        db.session.add(membership)
        db.session.commit()
        
        return jsonify({
            'message': 'Joined classroom successfully',
            'classroom': {
                'id': classroom.id,
                'name': classroom.name,
                'description': classroom.description,
                'created_by': classroom.created_by,
                'created_at': classroom.created_at.isoformat()
            }
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Error joining classroom: {str(e)}'}), 500

@app.route('/api/classrooms', methods=['GET'])
@jwt_required()
def get_classrooms():
    try:
        current_user = get_jwt_identity()
        
        # Get all classrooms the user is a member of
        memberships = ClassroomMembership.query.filter_by(user_id=current_user).all()
        classroom_ids = [membership.classroom_id for membership in memberships]
        
        classrooms = Classroom.query.filter(Classroom.id.in_(classroom_ids)).all()
        
        result = []
        for classroom in classrooms:
            result.append({
                'id': classroom.id,
                'name': classroom.name,
                'description': classroom.description,
                'created_by': classroom.created_by,
                'created_at': classroom.created_at.isoformat()
            })
        
        return jsonify({'classrooms': result}), 200
    except Exception as e:
        return jsonify({'message': f'Error fetching classrooms: {str(e)}'}), 500

@app.route('/api/classroom/<int:classroom_id>/message', methods=['POST'])
@jwt_required()
def send_message(classroom_id):
    try:
        current_user = get_jwt_identity()
        data = request.get_json()
        
        if not data or not data.get('content'):
            return jsonify({'message': 'Message content is required'}), 400
        
        # Check if classroom exists
        classroom = Classroom.query.get(classroom_id)
        if not classroom:
            return jsonify({'message': 'Classroom not found'}), 404
        
        # Check if user is a member
        membership = ClassroomMembership.query.filter_by(
            user_id=current_user,
            classroom_id=classroom_id
        ).first()
        
        if not membership:
            return jsonify({'message': 'You are not a member of this classroom'}), 403
        
        # Create new message
        new_message = ClassroomMessage(
            user_id=current_user,
            classroom_id=classroom_id,
            content=data.get('content')
        )
        
        db.session.add(new_message)
        db.session.commit()
        
        return jsonify({
            'message': 'Message sent successfully',
            'message': {
                'id': new_message.id,
                'user_id': new_message.user_id,
                'content': new_message.content,
                'timestamp': new_message.timestamp.isoformat()
            }
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Error sending message: {str(e)}'}), 500

@app.route('/api/classroom/<int:classroom_id>/messages', methods=['GET'])
@jwt_required()
def get_messages(classroom_id):
    try:
        current_user = get_jwt_identity()
        
        # Check if classroom exists
        classroom = Classroom.query.get(classroom_id)
        if not classroom:
            return jsonify({'message': 'Classroom not found'}), 404
        
        # Check if user is a member
        membership = ClassroomMembership.query.filter_by(
            user_id=current_user,
            classroom_id=classroom_id
        ).first()
        
        if not membership:
            return jsonify({'message': 'You are not a member of this classroom'}), 403
        
        # Get all messages for this classroom
        messages = ClassroomMessage.query.filter_by(classroom_id=classroom_id).order_by(ClassroomMessage.timestamp.asc()).all()
        
        result = []
        for message in messages:
            result.append({
                'id': message.id,
                'user_id': message.user_id,
                'content': message.content,
                'timestamp': message.timestamp.isoformat()
            })
        
        return jsonify({'messages': result}), 200
    except Exception as e:
        return jsonify({'message': f'Error fetching messages: {str(e)}'}), 500

# Add these lines after initializing the app and before creating tables
register_updates_blueprint(app)

# Make sure these models are created when creating tables
with app.app_context():
    try:
        # Create tables if they don't exist
        db.create_all()
        logger.info("Database tables created successfully")
    except Exception as e:
        logger.error(f"Error creating database tables: {str(e)}")
        raise

def send_welcome_email(email, username):
    try:
        # Create message
        msg = MIMEMultipart('alternative')
        msg['From'] = f"DEP Platform <{os.getenv('EMAIL_USERNAME')}>"
        msg['To'] = email
        msg['Subject'] = 'Welcome to DEP Platform'

        # Create HTML version of the email
        html = f"""
        <html>
            <head>
                <style>
                    body {{
                        font-family: Arial, sans-serif;
                        line-height: 1.6;
                        color: #333333;
                        max-width: 600px;
                        margin: 0 auto;
                        padding: 20px;
                    }}
                    .header {{
                        background-color: #1a237e;
                        color: white;
                        padding: 20px;
                        text-align: center;
                        border-radius: 5px;
                    }}
                    .content {{
                        background-color: #ffffff;
                        padding: 20px;
                        border-radius: 5px;
                        margin-top: 20px;
                    }}
                    .footer {{
                        text-align: center;
                        margin-top: 20px;
                        font-size: 12px;
                        color: #666666;
                    }}
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>Welcome to DEP Platform</h1>
                </div>
                <div class="content">
                    <p>Dear {username},</p>
                    <p>Thank you for registering with the DEP Platform! Your account has been successfully created.</p>
                    <p>You can now access all the features of our platform using your registered email address and password.</p>
                    <p>If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
                    <p>Best regards,<br>DEP Platform Team</p>
                </div>
                <div class="footer">
                    <p>This is an automated message, please do not reply to this email.</p>
                    <p>© 2024 DEP Platform. All rights reserved.</p>
                </div>
            </body>
        </html>
        """

        # Create plain text version
        text = f"""
        Welcome to DEP Platform

        Dear {username},

        Thank you for registering with the DEP Platform! Your account has been successfully created.

        You can now access all the features of our platform using your registered email address and password.

        If you have any questions or need assistance, please don't hesitate to contact our support team.

        Best regards,
        DEP Platform Team

        This is an automated message, please do not reply to this email.
        © 2024 DEP Platform. All rights reserved.
        """

        # Attach both versions
        msg.attach(MIMEText(text, 'plain'))
        msg.attach(MIMEText(html, 'html'))

        # Create SMTP session
        server = smtplib.SMTP(os.getenv('EMAIL_SERVER'), int(os.getenv('EMAIL_PORT')))
        server.starttls()
        server.login(os.getenv('EMAIL_USERNAME'), os.getenv('EMAIL_PASSWORD'))
        
        # Send email
        server.send_message(msg)
        server.quit()
        
        logger.info(f"Welcome email sent successfully to {email}")
        return True
    except Exception as e:
        logger.error(f"Error sending welcome email to {email}: {str(e)}")
        return False

@app.route('/check-credentials', methods=['POST'])
def check_credentials():
    try:
        data = request.get_json()
        
        if not data or not all(key in data for key in ['email', 'username']):
            return jsonify({
                'error': 'Missing fields',
                'message': 'Both email and username are required'
            }), 400

        # Check if email exists
        existing_email = User.query.filter_by(email=data['email']).first()
        if existing_email:
            return jsonify({
                'error': 'Email exists',
                'message': 'This email is already registered'
            }), 409

        # Check if username exists
        existing_username = User.query.filter_by(username=data['username']).first()
        if existing_username:
            return jsonify({
                'error': 'Username exists',
                'message': 'This username is already taken'
            }), 409

        return jsonify({
            'message': 'Credentials available',
            'available': True
        }), 200

    except Exception as e:
        print(f"Error checking credentials: {str(e)}")
        return jsonify({
            'error': 'Server error',
            'message': 'An unexpected error occurred. Please try again later.'
        }), 500

if __name__ == '__main__':
    app.run(debug=True)