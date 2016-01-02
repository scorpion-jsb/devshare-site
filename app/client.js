import React from 'react';
import ReactDOM from 'react-dom';
import { reduxReactRouter } from 'redux-router';
import { createHistory } from 'history';
import { getGrout } from 'redux-grout';
import Root from './root';
import configureStore from './store/configureStore';

let grout = getGrout();

const store = configureStore({account: grout.currentUser, entities: {projects:[]}}, reduxReactRouter, createHistory);

let rootElement = document.getElementById('root');

ReactDOM.render(
  <Root store={ store } />, rootElement
);
