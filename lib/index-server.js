'use strict';

import React from 'react';
import Grout from 'kyper-grout';
import Root from '../app/root';
import createHistory from 'history/lib/createMemoryHistory';
import { reduxReactRouter } from 'redux-router/server';
import { memoryHistory } from 'react-router';
import configureStore from '../app/store/configureStore';

export default (cb) => {
  // Compile an initial state
  let grout = new Grout();
  let initialState = {entities: {accounts:{}}, account: {}};
  if(grout.currentUser){
    initialState.account = grout.currentUser;
    initialState.entities.accounts[grout.currentUser.id] = grout.currentUser;
  }
  // Create a new Redux store instance
  const store = configureStore(initialState, memoryHistory);

  // Grab the initial state from our Redux store
  const finalState = store.getState();

  return cb({
    appData: finalState,
    appMarkup: React.renderToString(<Root store={ store } />)
  });
}
