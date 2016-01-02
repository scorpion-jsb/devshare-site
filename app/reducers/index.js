import { combineReducers } from 'redux';
import { routerStateReducer } from 'redux-router';
import { Reducers } from 'redux-grout';
const { account, entities } = Reducers;

const rootReducer = combineReducers({
  account,
  entities,
  router: routerStateReducer
});

export default rootReducer;
