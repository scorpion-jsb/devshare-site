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
    Try
  } from './containers';
export default (
  <Route path="/" component={ App }>
    <IndexRoute component={ Home } />
    <Route path="account" component={ Account } />
    <Route path="login" component={ Login }/>
    <Route path="recover" component={ Recover } />
    <Route path="signup" component={ Signup }/>
    <Route path="about" component={ About } />
    <Route path="try/:projectName" component={ Try } />
    <Route path=":owner/:projectName" component={ Project } />
    <Route path=":owner" component={ Projects } />
    <Route path="*" component={ NotFound } />
  </Route>
);
