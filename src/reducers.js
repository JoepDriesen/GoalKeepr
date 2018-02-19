import * as actions from "./actions"

const initialState = {
  credentialsDialogOpen: false,
  gettingCredentials: false,
  ghUsername: undefined,
  ghPassword: undefined,
  repoName: undefined,
  passphrase: undefined,
  categories: [],
  goals: {},
  editGoal: null,
  editCategory: null,
  isFetching: false,
  appError: null,
}

export default function rootReducer(state = initialState, action) {
  switch (action.type) {
    case actions.FETCH_DATA_REQUESTED:
      return {
        ...state,
        isFetching: true,
      }
    case actions.FETCH_DATA_SUCCEEDED:
      return {
        ...state,
        isFetching: false,
        categories: action.categories,
        goals: action.goals,
      }
    case actions.FETCH_DATA_FAILED:
    case actions.SAVE_GOAL_FAILED:
      return {
        ...state,
        isFetching: false,
        appError: action.error,
      }
    case actions.GET_CREDENTIALS:
      return {
        ...state,
        gettingCredentials: true,
      }
    case actions.RETURN_CREDENTIALS:
      return {
        ...state,
        gettingCredentials: false,
        ghUsername: action.credentials.ghUsername,
        ghPassword: action.credentials.ghPassword,
        repoName: action.credentials.repoName,
        passphrase: action.credentials.passphrase,
      }
    case actions.OPEN_CREDENTIALS_DIALOG:
      return {
        ...state,
        credentialsDialogOpen: true,
      }
    case actions.CLOSE_CREDENTIALS_DIALOG:
      return {
        ...state,
        credentialsDialogOpen: false,
      }
    case actions.SAVE_CREDENTIALS:
      return {
        ...state,
        credentialsDialogOpen: false,
      }
    case actions.CHANGE_CREDENTIALS_FIELD:
      return {
        ...state,
        [action.fieldName]: action.value,
      }  
    case actions.CLEAR_ERROR:
      return {
        ...state,
        appError: null,
      }
    case actions.EDIT_GOAL:
      return {
        ...state,
        editGoal: action.goalId,
      }
    case actions.EDIT_GOAL_FIELD:
      return {
        ...state,
        goals: {
          ...state.goals,
          [action.goalId]: {
            ...state.goals[action.goalId],
            [action.fieldName]: action.value,
          },
        }
      }
    case actions.SAVE_GOAL_REQUESTED:
      return {
        ...state,
        isFetching: true,
        editGoal: null,
      }
    case actions.SAVE_GOAL_SUCCEEDED:
      return {
        ...state,
        isFetching: false,
      }
    default:
      return state
  }
}