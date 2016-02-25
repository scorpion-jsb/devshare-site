import { createStore, applyMiddleware, compose } from 'redux'
import rootReducer from '../reducers'
import thunk from 'redux-thunk'
import { createMiddleware } from 'redux-grout'
import { syncHistory } from 'react-router-redux'
const prodSettings = { envName: 'prod' }
let groutMiddleware = createMiddleware('tessellate', prodSettings)

export default function configureStore (initialState, history) {
  const reduxRouterMiddleware = syncHistory(history)
  const createStoreWithMiddleware = compose(
    applyMiddleware(thunk, groutMiddleware, reduxRouterMiddleware)
  )(createStore)
  const store = createStoreWithMiddleware(rootReducer, initialState)

  return store
}
