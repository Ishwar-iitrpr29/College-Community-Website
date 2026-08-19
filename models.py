# Additional models for the MDP ranking system
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, timedelta
from werkzeug.security import check_password_hash, generate_password_hash
import random
import string

db = SQLAlchemy()

# Model to track user state transitions
class UserStateTransition(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String(80), nullable=False)
    from_state = db.Column(db.String(50), nullable=False)
    to_state = db.Column(db.String(50), nullable=False)
    action = db.Column(db.String(50), nullable=False)
    reward = db.Column(db.Float, nullable=True)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    
    __table_args__ = (
        db.Index('idx_user_id', 'user_id'),
        db.Index('idx_timestamp', 'timestamp')
    )

# Model to store user preferences
class UserPreference(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String(80), nullable=False, unique=True)
    group_message_pref = db.Column(db.Float, default=1.0)
    material_pref = db.Column(db.Float, default=1.0)
    placement_pref = db.Column(db.Float, default=1.0)
    interview_pref = db.Column(db.Float, default=1.0)
    last_updated = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'group_message': self.group_message_pref,
            'material': self.material_pref,
            'placement': self.placement_pref,
            'interview': self.interview_pref
        }

# Model to track user interactions with updates
class UpdateInteraction(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String(80), nullable=False)
    update_id = db.Column(db.String(100), nullable=False)
    update_type = db.Column(db.String(50), nullable=False)
    action = db.Column(db.String(50), nullable=False)  # view, click, dismiss
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    
    __table_args__ = (
        db.UniqueConstraint('user_id', 'update_id', name='unique_user_update'),
        db.Index('idx_user_update', 'user_id', 'update_id')
    )

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

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=True)
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