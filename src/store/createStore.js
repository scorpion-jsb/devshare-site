import { applyMiddleware, compose, createStore } from 'redux'
import { routerMiddleware } from 'react-router-redux'
import thunk from 'redux-thunk'
import makeRootReducer from './reducers'
import { reactReduxFirebase, getFirebase } from 'react-redux-firebase'
import { reduxDevshare, getDevshare } from 'redux-devshare'
import { init } from 'devshare'
import { firebase as fbConfig, env } from '../config'

export default (initialState = {}, history) => {
  // ======================================================
  // Middleware Configuration
  // ======================================================
  const middleware = [
    thunk.withExtraArgument({ getFirebase, getDevshare }),
    routerMiddleware(history)
  ]

  // ======================================================
  // Store Enhancers
  // ======================================================
  const enhancers = []
  if (__DEV__) {
    const devToolsExtension = window.devToolsExtension
    if (typeof devToolsExtension === 'function') {
      enhancers.push(devToolsExtension())
    }
  }
  init({ env })
  // ======================================================
  // Store Instantiation and HMR Setup
  // ======================================================
  const store = createStore(
    makeRootReducer(),
    initialState,
    compose(
      applyMiddleware(...middleware),
      // TODO: Pass node environment directly
      reduxDevshare(
        { env }
      ),
      reactReduxFirebase(
          fbConfig,
        {
          userProfile: 'users',
          enableLogging: false
        },
      ),
      ...enhancers
      )
    )
  store.asyncReducers = {}

  if (module.hot) {
    module.hot.accept('./reducers', () => {
      const reducers = require('./reducers').default
      store.replaceReducer(reducers(store.asyncReducers))
    })
  }

  return store
}
