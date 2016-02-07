'use strict';

import React from 'react'; //eslint-disable-line
// import Grout from 'kyper-grout';
import createRoutes from '../app/router';
import { match, RouterContext } from 'react-router';
import { renderToString } from 'react-dom/server';
import { Provider } from 'react-redux';
import createLocation from 'history/lib/createLocation';
import createMemoryHistory from 'history/lib/createMemoryHistory';
import configureStore from '../app/store/configureStore';

export default (url, cb) => {
  const memoryHistory = createMemoryHistory(url);
  let routes = createRoutes(memoryHistory);
  let location = createLocation(url);

  match({ routes, location }, (error, redirectLocation, renderProps) => {
    let initialState = {entities: {accounts:{}}, account: {}};
    const store = configureStore(initialState, memoryHistory);

    // Grab the initial state from our Redux store
    const finalState = store.getState();

    const rootComponent = renderToString(
      <Provider store={ store }>
        <RouterContext {...renderProps} />
      </Provider>
    );

    return cb({
      appData: finalState,
      appMarkup: rootComponent
    });
  });
};
