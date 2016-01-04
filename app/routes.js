import React from 'react';
import { Route, IndexRoute } from 'react-router'
import {
    App,
    Home,
    About,
    Account,
    Projects,
    Project,
    Login,
    Signup,
    NotFound,
    Try
  } from './containers';
export default (
  <Route path="/" component={ App }>
    <IndexRoute component={ Home } />
    <Route path="login" component={ Login }/>
    <Route path="signup" component={ Signup }/>
    <Route path="about" component={ About } />
    <Route path="account" component={ Account } />
    <Route path="projects" component={ Projects } />
    <Route path="projects/:projectName" component={ Project } />
    <Route path="try/:projectName" component={ Try } />
    <Route path="*" component={ NotFound } />
  </Route>
);
