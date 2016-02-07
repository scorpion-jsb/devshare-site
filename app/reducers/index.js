import { combineReducers } from 'redux';
import { routeReducer } from 'react-router-redux';
import tabs from './tabs';
import { Reducers } from 'redux-grout';
const { account, entities } = Reducers;

const rootReducer = combineReducers({
  account,
  entities,
  tabs,
  router: routeReducer
});

export default rootReducer;
