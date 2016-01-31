import React from 'react';
import { Route, IndexRoute } from 'react-router'
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
    Signup,
  } from './containers';
export default (
  <Route path="/" component={ App }>
    <IndexRoute component={ Home } />
    <Route path="account" component={ Account } />
    <Route path="login" component={ Login }/>
    <Route path="recover" component={ Recover } />
    <Route path="signup" component={ Signup }/>
    <Route path="about" component={ About } />
    <Route path=":username/:projectName" component={ Project } />
    <Route path=":username" component={ Projects } />
    <Route path="*" component={ NotFound } />
  </Route>
);
