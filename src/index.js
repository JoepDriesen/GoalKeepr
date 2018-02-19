import React from 'react'
import ReactDOM from 'react-dom'

import { createStore, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'

import reducer from "./reducers"
import sagas from "./sagas"

import './index.css'

import { Provider } from 'react-redux'
import App from './containers/AppContainer'
import registerServiceWorker from './registerServiceWorker'


const sagaMiddleware = createSagaMiddleware()
const store = createStore(reducer, applyMiddleware(sagaMiddleware))

sagaMiddleware.run(sagas)

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>, 
  document.getElementById('root')
)
registerServiceWorker()
