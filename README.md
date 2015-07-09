# [Hypercube](http://hyper-cube.herokuapp.com)

## Description

[Hypercube](http://hyper-cube.herokuapp.com) is a platform that allows you to develop complete web applications (front-end & back-end) right in the browser.

Hypercube is built to allow the user to create, manage and build applications going from the MVP state to a full scale service. The platform is build to be framework agnostic, meaning that many of the most popular frameworks are offered by default, but plugins can be made to handle non-default actions.

The process of creating an app on Hypercube begins with the user entering a name and choosing a template application. From there, the user has full control of the application's front end and backend code. Along with this the use can control what type of libraries and database(s)the app will use, and of course, view the data visualtions that are generated from the usage of the application.

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
* Live Preview
* Upload of files/Hosted View
* $log decorator
* Angular Plugin
* Getting Started guide for Angular plugin
* React Plugin
* Getting Started guide for React plugin
