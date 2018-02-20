import { call, put } from 'redux-saga/effects'
import { takeLatest } from 'redux-saga/effects'

import * as actions from "./actions"
import * as api from "./api"

import GES from "./githubEncryptedStorage"

let db

function* fetchData(action) {
  try {
    if (!db) {
      throw new Error("Database is not initialized!")
    }
    
    const categories = yield call(api.getAllCategories, db)
    const goals = yield call(api.getAllGoals, db)
    
    const categoryMapIds = categories.reduce((acc, c) => {
      acc[c.id] = c
      return acc
    }, {})
    const goalMapIds = goals.reduce((acc, g) => {
      acc[g.id] = g
      return acc
    }, {})
    
    goals.forEach(goal => {
      if (goalMapIds[goal.parent]) {
        goalMapIds[goal.parent].subGoals.push(goal.id)
      } else if (categoryMapIds[goal.category]) {
        categoryMapIds[goal.category].goals.push(goal.id)
      } else {
        console.log("Warning: category does not exist", goal)
      }
    })
    
    categories.forEach(c => {
      c.completeness = (category) => category.goals.reduce((acc, sG) => acc + goalMapIds[sG].completeness(goalMapIds[sG]), 0) / Math.max(1, category.goals.length)
    })
    goals.forEach(g => {
      g.completeness = (goal) => {
        if (goal.type === "group") {
          return goal.subGoals.reduce((acc, sG) => acc + goalMapIds[sG].completeness(goalMapIds[sG]), 0) / Math.max(goal.subGoals.length, 1)
        }
        if (goal.type === "boolean") {
          return goal.currentValue === "on" ? 100 : 0
        }
        if (goal.type === "cd") {
          const endTime = goal.date1.getTime() + goal.maxValue * 24 * 60 * 60 * 1000
          
          return 100 * (1 - Math.max(0, (endTime - Date.now()) / (24 * 60 * 60 * 1000)) / goal.maxValue)
        }
        if (goal.type === "cumulative") {
          return goal.currentValue === undefined || goal.maxValue === undefined ? 
            0 :
            goal.maxValue === 0 ? 100 : Math.round(100 * parseInt(goal.currentValue, 10) / parseInt(goal.maxValue, 10))
        }
        if (goal.type === "percentage") {
          console.log(goal)
          return  goal.currentValue === undefined ?
            0 :
            parseInt(goal.currentValue, 10)
        }
        if (goal.type === "revcd") {
          return Date.now() > goal.date1.getTime() + goal.maxValue * 24 * 60 * 60 * 1000 ?
            0 :
            100
        }
        console.error("Warning: Unknown goal type", goal)
        return 0
      }
    })
    
    const sortR = goals => goals.sort((g1, g2) => goalMapIds[g1].completeness(goalMapIds[g1]) - goalMapIds[g2].completeness(goalMapIds[g2])).forEach(g => goalMapIds[g].subGoals.length <= 0 || sortR(goalMapIds[g].subGoals))
    categories.forEach(c => sortR(c.goals))
    
    yield put({ type: actions.FETCH_DATA_SUCCEEDED, categories, goals: goalMapIds })
  } catch(err) {
    yield put({ 
      type: actions.FETCH_DATA_FAILED, 
      error: `Error while fetching categories: ${err.message}` })
  }
}

function* getCredentials(action) {
  try {
    db = GES(
      localStorage.getItem("ghUsername"), 
      localStorage.getItem("ghPassword"), 
      localStorage.getItem("repoName")
    )("GoalKeepr", localStorage.getItem("passphrase"))

    yield put({ 
      type: actions.RETURN_CREDENTIALS, 
      credentials: {
        ghUsername: localStorage.getItem("ghUsername"),
        ghPassword: localStorage.getItem("ghPassword"),
        repoName: localStorage.getItem("repoName"),
        passphrase: localStorage.getItem("passphrase"),
      },
    })

    yield put({ type: actions.FETCH_DATA_REQUESTED })
  } catch (err) {
    console.log(err)
    console.log(err.stack)
  }
}

function* saveCredentials(action) {
  action.ghUsername == null || localStorage.setItem("ghUsername", action.ghUsername)
  action.ghPassword == null || localStorage.setItem("ghPassword", action.ghPassword)
  action.repoName == null || localStorage.setItem("repoName", action.repoName)
  action.passphrase == null || localStorage.setItem("passphrase", action.passphrase)
  
  db = GES(
    localStorage.getItem("ghUsername"), 
    localStorage.getItem("ghPassword"), 
    localStorage.getItem("repoName")
  )("GoalKeepr", localStorage.getItem("passphrase"))
  
  yield put({ type: actions.FETCH_DATA_REQUESTED })
}

function* saveGoal(action) {
  try {
    if (!db) {
      throw new Error("Database is not initialized!")
    }
    yield call(api.updateGoal, db, action.goal)
    
    yield put({ type: actions.SAVE_GOAL_SUCCEEDED })
  } catch(err) {
    yield put({ 
      type: actions.SAVE_GOAL_FAILED, 
      error: `Error while saving goal: ${err.message}` })
  }
}

export default function* rootSaga() {
  yield takeLatest(actions.FETCH_DATA_REQUESTED, fetchData)
  yield takeLatest(actions.GET_CREDENTIALS, getCredentials)
  yield takeLatest(actions.SAVE_CREDENTIALS, saveCredentials)
  yield takeLatest(actions.SAVE_GOAL_REQUESTED, saveGoal)
}