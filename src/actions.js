export const FETCH_DATA_REQUESTED = "FETCH_DATA_REQUESTED"
export const FETCH_DATA_SUCCEEDED = "FETCH_DATA_SUCCEEDED"
export const FETCH_DATA_FAILED = "FETCH_DATA_FAILED"

export const GET_CREDENTIALS = "GET_CREDENTIALS"
export const RETURN_CREDENTIALS = "RETURN_CREDENTIALS"

export const OPEN_CREDENTIALS_DIALOG = "OPEN_CREDENTIALS_DIALOG"
export const CLOSE_CREDENTIALS_DIALOG = "CLOSE_CREDENTIALS_DIALOG"
export const SAVE_CREDENTIALS = "SAVE_CREDENTIALS"
export const CHANGE_CREDENTIALS_FIELD = "CHANGE_CREDENTIALS_FIELD"

export const EDIT_GOAL = "EDIT_GOAL"
export const EDIT_GOAL_FIELD = "EDIT_GOAL_FIELD"
export const CLOSE_EDIT_GOAL = "CLOSE_EDIT_GOAL"

export const SAVE_GOAL_REQUESTED = "SAVE_GOAL_REQUESTED"
export const SAVE_GOAL_SUCCEEDED = "SAVE_GOAL_SUCCEEDED"
export const SAVE_GOAL_FAILED = "SAVE_GOAL_FAILED"

export const DELETE_GOAL = "DELETE_GOAL"

export const CLEAR_ERROR = "CLEAR_ERROR"

export function fetchData() {
  return {
    type: FETCH_DATA_REQUESTED,
  }
}

export function getCredentials() {
  return {
    type: GET_CREDENTIALS,
  }
}

export function openCredentialsDialog() {
  return {
    type: OPEN_CREDENTIALS_DIALOG,
  }
}

export function closeCredentialsDialog() {
  return {
    type: CLOSE_CREDENTIALS_DIALOG,
  }
}

export function saveCredentials(ghUsername, ghPassword, repoName, passphrase) {
  return {
    type: SAVE_CREDENTIALS,
    ghUsername,
    ghPassword,
    repoName,
    passphrase,
  }
}

export function changeCredentialsField(fieldName, value) {
  return {
    type: CHANGE_CREDENTIALS_FIELD,
    fieldName,
    value,
  }
}

export function clearError() {
  return {
    type: CLEAR_ERROR,
  }
}

export function editGoal(goalId) {
  return {
    type: EDIT_GOAL,
    goalId,
  }
}

export function editGoalField(goalId, fieldName, value) {
  return {
    type: EDIT_GOAL_FIELD,
    goalId,
    fieldName,
    value,
  }
}

export function saveGoal(goal) {
  return {
    type: SAVE_GOAL_REQUESTED,
    goal,
  }
}

export function deleteGoal(goalId) {
  return {
    type: DELETE_GOAL,
    goalId,
  }
}