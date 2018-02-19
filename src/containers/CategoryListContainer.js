import { connect } from 'react-redux'

import * as actions from "../actions"

import CategoryList from '../components/CategoryList'

const mapStateToProps = state => {
  return {
    gettingCredentials: state.gettingCredentials,
    ghUsername: state.ghUsername,
    ghPassword: state.ghPassword,
    repoName: state.repoName,
    passphrase: state.passphrase,
    
    isFetching: state.isFetching,
    editGoal: state.editGoal,
    editCategory: state.editCategory,
    
    categories: state.categories,
    allGoals: state.goals,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onEditGoal: goalId => event => dispatch(actions.editGoal(goalId)),
    onEditGoalField: goalId => fieldName => value => dispatch(actions.editGoalField(goalId, fieldName, value)),
    onCloseEditGoal: event => dispatch(actions.editGoal(null)),
    onSaveGoal: goal => event => dispatch(actions.saveGoal(goal)),
    onDeleteGoal: goalId => event => dispatch(actions.deleteGoal(goalId)),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CategoryList)