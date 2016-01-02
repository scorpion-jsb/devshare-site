import React from 'react';
import { Route, IndexRoute } from 'react-router'
import {
    App,
    Home,
    About,
    Account,
    Projects,
    Login,
    Signup,
    NotFound
  } from './containers';
export default (
  <Route path="/" component={ App }>
    <IndexRoute component={ Home } />
    <Route path="login" component={ Login }/>
    <Route path="signup" component={ Signup }/>
    <Route path="about" component={ About } />
    <Route path="account" component={ Account } />
    <Route path="projects" component={ Projects } />
    <Route path="*" component={ NotFound } />
  </Route>
);
