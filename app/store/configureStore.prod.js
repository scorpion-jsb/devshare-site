import { createStore, applyMiddleware, compose } from 'redux';
import rootReducer from '../reducers';
import thunk from 'redux-thunk';
import routes from '../routes';
import { createMiddleware } from 'redux-grout';
const prodSettings = {envName: 'local'};
let groutMiddleware = createMiddleware('tessellate', prodSettings);

export default function configureStore(initialState, reduxReactRouter, createHistory) {
  const createStoreWithMiddleware = compose(
    applyMiddleware(thunk, groutMiddleware),
    reduxReactRouter({
      routes,
      createHistory
    })
  )(createStore);
  const store = createStoreWithMiddleware(rootReducer, initialState);


  return store;
}
