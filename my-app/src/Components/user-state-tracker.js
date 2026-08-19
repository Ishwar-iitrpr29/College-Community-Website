// This file contains functions to track user states and transitions for the MDP model

// Define user states
const USER_STATES = {
    SEARCHING_MATERIALS: "searching_materials",
    POSTING_DISCUSSIONS: "posting_discussions",
    VIEWING_EXPERIENCES: "viewing_experiences",
    UPLOADING_MATERIALS: "uploading_materials",
    BROWSING_PLACEMENTS: "browsing_placements",
    IDLE: "idle",
  }
  
  // Define action rewards
  const ACTION_REWARDS = {
    POST: 5,
    SEARCH: 2,
    VIEW: 1,
    UPLOAD: 4,
    COMMENT: 3,
  }
  
  // Function to log user state transition
  const logStateTransition = async (userId, fromState, toState, action) => {
    try {
      const response = await fetch("http://localhost:5000/api/log-state-transition", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          userId,
          fromState,
          toState,
          action,
          timestamp: new Date().toISOString(),
        }),
      })
  
      if (!response.ok) {
        throw new Error("Failed to log state transition")
      }
  
      return await response.json()
    } catch (error) {
      console.error("Error logging state transition:", error)
      return null
    }
  }
  
  // Function to track user action and update state
  const trackUserAction = async (userId, action, context = {}) => {
    try {
      // Get current user state
      const stateResponse = await fetch(`http://localhost:5000/api/user-state?userId=${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
  
      if (!stateResponse.ok) {
        throw new Error("Failed to get user state")
      }
  
      const { currentState } = await stateResponse.json()
  
      // Determine new state based on action
      let newState = currentState
  
      switch (action) {
        case "search_materials":
          newState = USER_STATES.SEARCHING_MATERIALS
          break
        case "post_discussion":
          newState = USER_STATES.POSTING_DISCUSSIONS
          break
        case "view_experience":
          newState = USER_STATES.VIEWING_EXPERIENCES
          break
        case "upload_material":
          newState = USER_STATES.UPLOADING_MATERIALS
          break
        case "browse_placements":
          newState = USER_STATES.BROWSING_PLACEMENTS
          break
        default:
          newState = currentState
      }
  
      // Log the state transition
      if (currentState !== newState) {
        await logStateTransition(userId, currentState, newState, action)
      }
  
      return { previousState: currentState, newState }
    } catch (error) {
      console.error("Error tracking user action:", error)
      return { error: error.message }
    }
  }
  
  export { USER_STATES, ACTION_REWARDS, trackUserAction, logStateTransition }
  
  