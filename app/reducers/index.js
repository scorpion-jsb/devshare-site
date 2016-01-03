import { combineReducers } from 'redux';
import { routerStateReducer } from 'redux-router';
import { Reducers } from 'redux-grout';
const { account, entities } = Reducers;
import tabs from './tabs';

const rootReducer = combineReducers({
  account,
  entities,
  tabs,
  router: routerStateReducer
});

export default rootReducer;
