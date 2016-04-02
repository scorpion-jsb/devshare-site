import React from 'react' // eslint-disable-line
import ReactDOM from 'react-dom'
import createRoutes from './router'
import { Provider } from 'react-redux'
import configureStore from './store/configureStore'
import { browserHistory } from 'react-router'
import Devshare from 'devshare'

let initialData = {entities: {projects: {}, users: {}}}

if (Devshare.currentUser) {
  initialData.account = Devshare.currentUser
  initialData.entities.users[Devshare.currentUser.username] = Devshare.currentUser
}

const initialState = window.__INITIAL_STATE__ || initialData

const store = configureStore(initialState, browserHistory)

let rootElement = document.getElementById('root')

ReactDOM.render(
  <Provider store={ store }>
    { createRoutes(browserHistory) }
  </Provider>, rootElement
)
