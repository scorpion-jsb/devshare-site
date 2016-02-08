import React from 'react'; // eslint-disable-line
import { Route, IndexRoute, Router } from 'react-router';
import {
    About,
    Account,
    App,
    Home,
    Login,
    NotFound,
    Project,
    Projects,
    Recover,
    Signup
  } from './containers';

export default function(history) {
  return (
    <Router history={ history }>
      <Route path="/" component={ App }>
        <IndexRoute component={ Home } />
        <Route path="account" component={ Account } />
        <Route path="login" component={ Login }/>
        <Route path="recover" component={ Recover } />
        <Route path="signup" component={ Signup }/>
        <Route path="about" component={ About } />
        <Route path=":username/:projectName" component={ Project } />
        <Route path=":username" component={ Projects } />
      </Route>
    </Router>
      );
      // <Route path="*" component={ NotFound } />
}
