import { combineReducers } from 'redux'
import { routeReducer } from 'react-router-redux'
import { Reducers } from 'redux-grout'
import tabs from './tabs'
const { account, entities } = Reducers

const rootReducer = combineReducers({
  account,
  entities,
  tabs,
  router: routeReducer
})

export default rootReducer
