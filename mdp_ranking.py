# MDP-based ranking system for personalized updates
import numpy as np
from collections import defaultdict
import logging

logger = logging.getLogger(__name__)

class MDPRankingSystem:
    """
    A Markov Decision Process based ranking system for personalizing updates.
    """
    def __init__(self, gamma=0.9, theta=0.01, max_iterations=100):
        """
        Initialize the MDP ranking system.
        
        Args:
            gamma: Discount factor (0 to 1)
            theta: Convergence threshold
            max_iterations: Maximum number of iterations for value iteration
        """
        self.gamma = gamma  # Discount factor
        self.theta = theta  # Convergence threshold
        self.max_iterations = max_iterations
        
        # State values
        self.state_values = defaultdict(float)
        
        # State transition counts: (state, action, next_state) -> count
        self.transitions = defaultdict(int)
        
        # State-action rewards: (state, action) -> [rewards]
        self.rewards = defaultdict(list)
        
        # State-action counts: (state, action) -> count
        self.state_action_counts = defaultdict(int)
        
        # User state history: user_id -> [states]
        self.user_states = defaultdict(list)
        
        # Define rewards for different actions
        self.action_rewards = {
            'post': 5,
            'search': 2,
            'view': 1,
            'upload': 4,
            'comment': 3
        }
        
        # Define states
        self.states = [
            'searching_materials',
            'posting_discussions',
            'viewing_experiences',
            'uploading_materials',
            'browsing_placements',
            'idle'
        ]

    def log_transition(self, user_id, from_state, to_state, action, reward=None):
        """
        Log a state transition for a user.
        
        Args:
            user_id: The user identifier
            from_state: The starting state
            to_state: The ending state
            action: The action taken
            reward: Optional explicit reward (if None, use default action rewards)
        """
        if reward is None:
            # Use default reward for this action type
            action_type = action.split('_')[0]  # e.g., 'view_material' -> 'view'
            reward = self.action_rewards.get(action_type, 0)
        
        # Update transition counts
        self.transitions[(from_state, action, to_state)] += 1
        
        # Update rewards
        self.rewards[(from_state, action)].append(reward)
        
        # Update state-action counts
        self.state_action_counts[(from_state, action)] += 1
        
        # Update user state history
        self.user_states[user_id].append(to_state)
        
        logger.debug(f"Logged transition for user {user_id}: {from_state} -> {to_state} via {action} with reward {reward}")
        
        # Periodically update the value function
        if sum(self.state_action_counts.values()) % 100 == 0:
            self.update_value_function()

    def get_transition_probability(self, state, action, next_state):
        """
        Calculate the probability of transitioning from state to next_state given action.
        
        Args:
            state: Current state
            action: Action taken
            next_state: Resulting state
            
        Returns:
            Probability of the transition
        """
        # Count transitions from state via action
        total = sum(self.transitions[(state, action, s)] for s in self.states)
        
        if total == 0:
            return 0.0
            
        # Count transitions from state via action to next_state
        count = self.transitions[(state, action, next_state)]
        
        return count / total

    def get_expected_reward(self, state, action):
        """
        Calculate the expected reward for taking action in state.
        
        Args:
            state: Current state
            action: Action taken
            
        Returns:
            Expected reward
        """
        rewards = self.rewards[(state, action)]
        if not rewards:
            return 0.0
            
        return sum(rewards) / len(rewards)

    def update_value_function(self):
        """
        Update the state value function using value iteration.
        """
        # Initialize value function if empty
        for state in self.states:
            if state not in self.state_values:
                self.state_values[state] = 0.0
        
        # Value iteration
        for _ in range(self.max_iterations):
            delta = 0
            
            for state in self.states:
                v = self.state_values[state]
                
                # If we've never seen this state, skip it
                if not any(self.state_action_counts[(state, a)] > 0 for a in self.action_rewards):
                    continue
                
                # Calculate the new value
                actions = [a for a in self.action_rewards if self.state_action_counts[(state, a)] > 0]
                
                if not actions:
                    continue
                
                # Find the maximum expected value
                max_value = float('-inf')
                
                for action in actions:
                    expected_reward = self.get_expected_reward(state, action)
                    expected_value = expected_reward
                    
                    for next_state in self.states:
                        prob = self.get_transition_probability(state, action, next_state)
                        if prob > 0:
                            expected_value += self.gamma * prob * self.state_values[next_state]
                    
                    max_value = max(max_value, expected_value)
                
                # Update the value function
                if max_value != float('-inf'):
                    self.state_values[state] = max_value
                    
                    # Check for convergence
                    delta = max(delta, abs(v - self.state_values[state]))
            
            # Check if we've converged
            if delta < self.theta:
                logger.info(f"Value iteration converged after {_+1} iterations")
                break
        
        logger.info(f"Updated state values: {dict(self.state_values)}")

    def get_user_preferences(self, user_id):
        """
        Get the user's preferences based on their state history.
        
        Args:
            user_id: The user identifier
            
        Returns:
            Dictionary mapping content types to preference scores
        """
        # If we don't have data for this user, return default preferences
        if user_id not in self.user_states or not self.user_states[user_id]:
            return {
                'group_message': 1.0,
                'material': 1.0,
                'placement': 1.0,
                'interview': 1.0
            }
        
        # Map states to content types
        state_to_content = {
            'searching_materials': 'material',
            'posting_discussions': 'group_message',
            'viewing_experiences': 'interview',
            'uploading_materials': 'material',
            'browsing_placements': 'placement',
            'idle': None
        }
        
        # Count state occurrences
        state_counts = defaultdict(int)
        for state in self.user_states[user_id]:
            state_counts[state] += 1
        
        # Calculate preference scores based on state values and frequencies
        preferences = defaultdict(float)
        total_states = len(self.user_states[user_id])
        
        for state, count in state_counts.items():
            content_type = state_to_content.get(state)
            if content_type:
                # Combine state value and frequency
                state_value = self.state_values.get(state, 0)
                frequency = count / total_states
                
                # Preference is a combination of value and frequency
                preferences[content_type] += 0.7 * state_value + 0.3 * frequency
        
        # Ensure all content types have a score (minimum 0.1)
        for content_type in ['group_message', 'material', 'placement', 'interview']:
            if content_type not in preferences:
                preferences[content_type] = 0.1
        
        # Normalize preferences
        total = sum(preferences.values())
        if total > 0:
            for content_type in preferences:
                preferences[content_type] /= total
                
        logger.info(f"User {user_id} preferences: {dict(preferences)}")
        return dict(preferences)

    def rank_updates(self, user_id, updates):
        """
        Rank updates based on user preferences.
        
        Args:
            user_id: The user identifier
            updates: List of update objects with 'type' field
            
        Returns:
            Sorted list of updates
        """
        preferences = self.get_user_preferences(user_id)
        
        # Score each update based on user preferences
        scored_updates = []
        for update in updates:
            update_type = update.get('type')
            preference_score = preferences.get(update_type, 0.5)
            
            # Calculate recency score (newer items get higher scores)
            timestamp = update.get('timestamp')
            if timestamp:
                # Convert to seconds since epoch
                import datetime
                if isinstance(timestamp, str):
                    timestamp = datetime.datetime.fromisoformat(timestamp.replace('Z', '+00:00'))
                
                # Ensure both datetimes are timezone-aware
                now = datetime.datetime.now(datetime.timezone.utc)
                if timestamp.tzinfo is None:
                    timestamp = timestamp.replace(tzinfo=datetime.timezone.utc)
                
                age_hours = (now - timestamp).total_seconds() / 3600
                recency_score = max(0, 1 - (age_hours / 168))  # Decay over a week
            else:
                recency_score = 0.5
            
            # Final score is a combination of preference and recency
            final_score = 0.7 * preference_score + 0.3 * recency_score
            
            scored_updates.append((update, final_score))
        
        # Sort by score (descending)
        scored_updates.sort(key=lambda x: x[1], reverse=True)
        
        # Return sorted updates
        return [update for update, _ in scored_updates]

