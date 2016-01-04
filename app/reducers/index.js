import { combineReducers } from 'redux';
import { routerStateReducer } from 'redux-router';
import tabs from './tabs';
import { Reducers } from 'redux-grout';
const { account, entities } = Reducers;

const rootReducer = combineReducers({
  account,
  entities,
  tabs,
  router: routerStateReducer
});

export default rootReducer;
