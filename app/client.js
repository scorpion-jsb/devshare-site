import React from 'react'; // eslint-disable-line
import ReactDOM from 'react-dom';
import createRoutes from './router';
import { Provider } from 'react-redux';
import configureStore from './store/configureStore';
import { browserHistory } from 'react-router';
import Grout from 'kyper-grout';

let grout = new Grout();
let initialData = {entities: {projects: {}, users: {}}};

if(grout.currentUser){
  initialData.account = grout.currentUser;
  initialData.entities.users[grout.currentUser.username] = grout.currentUser;
}
const initialState = window.__INITIAL_STATE__ || initialData;

const store = configureStore(initialState, browserHistory);

let rootElement = document.getElementById('root');

ReactDOM.render(
  <Provider store={ store }>
    { createRoutes(browserHistory) }
  </Provider>, rootElement
);
