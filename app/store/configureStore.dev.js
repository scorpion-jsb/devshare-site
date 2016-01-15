import { createStore, applyMiddleware, compose } from 'redux';
import rootReducer from '../reducers';
import thunk from 'redux-thunk';
import routes from '../routes';
import { createMiddleware } from 'redux-grout';
const devSettings = {logLevel: 'trace', envName: 'local'};
let groutMiddleware = createMiddleware('tessellate', devSettings);
import DevTools from '../helpers/DevTools';

export default function configureStore(initialState, reduxReactRouter, createHistory) {
  const createStoreWithMiddleware = compose(
    applyMiddleware(thunk, groutMiddleware),
    reduxReactRouter({
      routes,
      createHistory
    }),
    DevTools.instrument()
  )(createStore);
  const store = createStoreWithMiddleware(rootReducer, initialState);

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      const nextRootReducer = require('../reducers');
      store.replaceReducer(nextRootReducer);
    });
  }

  return store;
}
