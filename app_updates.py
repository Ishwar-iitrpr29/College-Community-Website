# Flask routes for the personalized updates system
from flask import Blueprint, jsonify, request, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
import logging
from datetime import datetime, timedelta, timezone, UTC
from mdp_ranking import MDPRankingSystem

# Initialize the MDP ranking system
mdp_system = MDPRankingSystem()

# Create a blueprint for the updates API
updates_bp = Blueprint('updates', __name__)

# Logger
logger = logging.getLogger(__name__)

@updates_bp.route('/api/log-state-transition', methods=['POST'])
@jwt_required()
def log_state_transition():
    """
    Log a user state transition for the MDP model.
    """
    current_user = get_jwt_identity()
    data = request.get_json()
    
    if not data:
        return jsonify({'message': 'No data provided'}), 400
    
    # Extract data
    user_id = data.get('userId', current_user)
    from_state = data.get('fromState')
    to_state = data.get('toState')
    action = data.get('action')
    reward = data.get('reward')  # Optional
    
    # Validate required fields
    if not from_state or not to_state or not action:
        return jsonify({'message': 'Missing required fields'}), 400
    
    # Log the transition in the MDP system
    mdp_system.log_transition(user_id, from_state, to_state, action, reward)
    
    return jsonify({'message': 'State transition logged successfully'}), 200

@updates_bp.route('/api/user-state', methods=['GET'])
@jwt_required()
def get_user_state():
    """
    Get the current state of a user.
    """
    current_user = get_jwt_identity()
    user_id = request.args.get('userId', current_user)
    
    # Get the user's state history
    state_history = mdp_system.user_states.get(user_id, [])
    
    # Default to 'idle' if no history
    current_state = state_history[-1] if state_history else 'idle'
    
    return jsonify({
        'userId': user_id,
        'currentState': current_state,
        'stateHistory': state_history[-10:] if state_history else []  # Return last 10 states
    }), 200


@updates_bp.route('/api/latest-updates', methods=['GET'])
@jwt_required()
def get_latest_updates():
    """
    Get personalized latest updates for the user.
    """
    try:
        current_user = get_jwt_identity()
        logger.info(f"Getting updates for user: {current_user}")
        
        # Collect updates from different sources
        updates = []
        
        # 1. Get recent group messages
        from models import ClassroomMessage, ClassroomMembership, Classroom, User
        
        # Get classrooms the user is a member of
        user_memberships = ClassroomMembership.query.filter_by(user_id=current_user).all()
        classroom_ids = [membership.classroom_id for membership in user_memberships]
        
        # Get recent messages from these classrooms
        seven_days_ago = datetime.now(timezone.utc) - timedelta(days=7)

        recent_messages = ClassroomMessage.query.filter(
            ClassroomMessage.classroom_id.in_(classroom_ids),
            ClassroomMessage.timestamp >= seven_days_ago
        ).order_by(ClassroomMessage.timestamp.desc()).limit(20).all()
        
        # Format messages
        for message in recent_messages:
            # Get classroom info
            classroom = Classroom.query.get(message.classroom_id)
            
            # Skip if classroom not found
            if not classroom:
                continue
                
            # Get sender info
            sender = User.query.filter_by(username=message.user_id).first()
            sender_name = sender.username if sender else message.user_id
            
            updates.append({
                'id': f"message_{message.id}",
                'type': 'group_message',
                'title': f"New message in {classroom.name}",
                'description': message.content[:100] + ('...' if len(message.content) > 100 else ''),
                'timestamp': message.timestamp.isoformat(),
                'sourceId': message.classroom_id,
                'sender': sender_name,
                'color': '#1976d2',  # Blue color for messages
                'tags': ['discussion', classroom.name]
            })
        
        # 2. Get recent material uploads
        from models import Upload
        
        recent_uploads = Upload.query.order_by(
            Upload.created_at.desc()
        ).limit(20).all()
        
        for upload in recent_uploads:
            updates.append({
                'id': f"material_{upload.id}",
                'type': 'material',
                'title': f"New material: {upload.course_code}",
                'description': upload.description,
                'timestamp': upload.created_at.isoformat(),
                'sourceId': upload.id,
                'sender': upload.author,
                'color': '#9c27b0',  # Purple color for materials
                'tags': upload.tags.split(',') if upload.tags else []
            })
        
        # 3. Get recent placement data
        from models import Placement
        
        recent_placements = Placement.query.order_by(
            Placement.created_at.desc()
        ).limit(10).all()
        
        for placement in recent_placements:
            updates.append({
                'id': f"placement_{placement.id}",
                'type': 'placement',
                'title': f"New {placement.type} opportunity at {placement.company}",
                'description': f"{placement.role} - {placement.mode} ({placement.year})",
                'timestamp': placement.created_at.isoformat(),
                'sourceId': placement.id,
                'sender': placement.created_by,
                'color': '#2e7d32',  # Green color for placements
                'tags': [placement.type, placement.company, placement.year]
            })
        
        # 4. Get recent interview experiences
        from models import InterviewExperience
        
        recent_interviews = InterviewExperience.query.order_by(
            InterviewExperience.created_at.desc()
        ).limit(10).all()
        
        for interview in recent_interviews:
            updates.append({
                'id': f"interview_{interview.id}",
                'type': 'interview',
                'title': f"New interview experience at {interview.company}",
                'description': f"{interview.candidate_name}'s {interview.type} interview experience",
                'timestamp': interview.created_at.isoformat(),
                'sourceId': interview.id,
                'sender': interview.created_by,
                'color': '#ed6c02',  # Orange color for interviews
                'tags': interview.tags.split(',') if interview.tags else []
            })
        
        # Rank updates using the MDP system
        ranked_updates = mdp_system.rank_updates(current_user, updates)
        
        return jsonify({
            'updates': ranked_updates,
            'count': len(ranked_updates)
        }), 200
        
    except Exception as e:
        logger.error(f"Error fetching updates: {str(e)}", exc_info=True)
        return jsonify({'message': f'Error fetching updates: {str(e)}'}), 500

# Register the blueprint with the Flask app
def register_updates_blueprint(app):
    app.register_blueprint(updates_bp)

