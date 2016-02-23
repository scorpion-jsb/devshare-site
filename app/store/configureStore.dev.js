import { createStore, applyMiddleware, compose } from 'redux'
import rootReducer from '../reducers'
import thunk from 'redux-thunk'
import { createMiddleware } from 'redux-grout'
import { syncHistory } from 'react-router-redux'
const devSettings = {logLevel: 'trace', envName: 'local'}

export default function configureStore (initialState, history) {
  const groutMiddleware = createMiddleware('tessellate', devSettings)
  const reduxRouterMiddleware = syncHistory(history)
  const createStoreWithMiddleware = compose(
    applyMiddleware(thunk, groutMiddleware, reduxRouterMiddleware),
    typeof window === 'object' && typeof window.devToolsExtension !== 'undefined' ? window.devToolsExtension() : f => f
  )(createStore)
  const store = createStoreWithMiddleware(rootReducer, initialState)

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      const nextRootReducer = require('../reducers')
      store.replaceReducer(nextRootReducer)
    })
  }

  return store
}
