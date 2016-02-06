import React from 'react';
import ReactDOM from 'react-dom';
import Root from './root';
import configureStore from './store/configureStore';
import { reduxReactRouter } from 'redux-router';
import { browserHistory } from 'react-router';
import { syncHistory } from 'react-router-redux';
import Grout from 'kyper-grout';

let grout = new Grout();
let initialData = {entities: {accounts:{}}, account: {}};

if(grout.currentUser){
  initialData.account = grout.currentUser;
  initialData.entities.accounts[grout.currentUser.id] = grout.currentUser;
}
const initialState = window.__INITIAL_STATE__ || initialData;

const store = configureStore(initialState, browserHistory);

let rootElement = document.getElementById('root');

ReactDOM.render(
  <Root store={ store } />, rootElement
);
