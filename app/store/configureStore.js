import { createStore, applyMiddleware, compose } from 'redux';
import rootReducer from '../reducers';
import thunk from 'redux-thunk';
import routes from '../routes';
import { createMiddleware } from 'redux-grout';
let groutMiddleware = createMiddleware('tessellate', {logLevel: 'trace'});

export default function configureStore(initialState, reduxReactRouter, createHistory) {
  const createStoreWithMiddleware = compose(
    applyMiddleware(thunk, groutMiddleware),
    reduxReactRouter({
      routes,
      createHistory
    }),
    typeof window === 'object' && typeof window.devToolsExtension !== 'undefined' ? window.devToolsExtension() : f => f
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
