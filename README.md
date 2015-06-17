# [Hypercube](http://hyper-cube.herokuapp.com)

## Description

[Hypercube](http://hyper-cube.herokuapp.com) is a platform that allows you to develop complete web applications (front-end & back-end) right in the browser. 

## Getting Started

### Local Development

1. Make sure you have NodeJS and GruntJS installed.
2. Clone this repository `git clone git@github.com:prescottprue/hypercube.git`
3. Run `npm install` to install development dependencies
4. Run `bower install` to install front end libraries
5. Run `grunt` to start a local server on `localhost:4000` for development.

## Layout

The front end AngularJS application is located within the `./app` and consists of app javascript files and main folders. The main folders contain modules which each represent a resource located within the [hypercube-server](http://github.com/prescottprue/hypercube-server). For example `./app/roles` contains an angular module that represents the roles resource of the backend API.

Each module contains a `*.module.js` file and files for any controllers/services/directives.

## Modules

### User

List and detail views/controllers for users

### Roles

List and detail views/controllers for roles

### Applications

List and detail views/controllers for applications

### Account

Login and Signup pages.

## TODO
* $log decorator
* Angular Plugin
* Getting Started guide for Angular plugin
* React Plugin
* Getting Started guide for React plugin
