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


## Notes

### Code Like a Pro
Hypercube starts you off with top tier industry standard libraries and resources (Angular/React/Ionic, Grunt/Gulp, Custom Templates/Yeoman, Firebase/Sockets, AWS) so that as your applications gain popularity you can build off of a strong foundation. Don't worry about the downsides of finding/combining these libraries and configuring them - we handle that for you. 

### My other computer is a cloud
Instead of spending ages setting up your development environent (paths, bash_profiles, and service secrets/keys), Hypercube provides you with a preconfiged environment that can easily be modified. Countless hours have already been spent by the open source community coming up with the best development environment setups/automations - Why reinvent the wheel?

### Well....What if??
Hypercube securily stores backups of your application code that can be downloaded at any time. Also, everything is built with open source libraries, so all of your code will work the same way on other platforms. As much as we would hate to see you go, [we have tutorials]() that explain downloading your code as well as how to host it on other platforms.

### Dogfood
Hypercube is actually a web application that is build the same way that applicaitons on the platform itself are build. You start off with the same settings we use to develop/run Hypercube, so we are in this together! Sometimes, when we are feeling trippy, we even develop Kyper it within itself! [More info on Cubeception]()

Why is this Free?
You only start paying for Hypercube when we start paying. The free tier offerings from the services that Hypercube is built on, including Amazon Web Services, allow for most usage. Eventually, as there becomes more users, a free account will entail signing up to the required services for your app, such as hosting, seperatley (so that you cover the resource usage).

Coming Soon
* Project Collaborators
* Realtime Preview (See your app change while you code)
* Importing code from Squarespace and other platforms

## TODO

* Select template when creating application
* Click to publish whole app
* Realtime Preview
* Make collaborators work
* Implement amazon cognito so most AWS actions can be moved to client side
* Intro documentation (How it uses AWS/S3 and automatically sets you up with that as well as other industry standard tools)
* Import Code from Squarespace
* Create a template from the current project (custom templates)
* Allow change of root file for website
* Yeoman Generator Support
* $log decorator
* Angular Plugin
* Getting Started guide for Angular plugin
* React Plugin
* Getting Started guide for React plugin
