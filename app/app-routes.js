angular.module('hypercube')
// Whitelist Urls

.config(function($stateProvider, $urlRouterProvider, $mdThemingProvider, USER_ROLES) {
  $stateProvider

    .state('nav', {
      abstract:true,
      views:{
        'topnav':{
          templateUrl:'components/nav/topnav.html',
          controller:'NavCtrl'
        },
        'main':{
          template:'<ui-view></ui-view>'
        }
      }
    })
    .state('home', {
      parent:'nav',
      url:'/',
      templateUrl:'home/home.html',
      controller:'HomeCtrl'
    })
    .state('apps', {
      parent:'nav',
      url:'/apps',
      authorizedRoles:[USER_ROLES.admin, USER_ROLES.editor, USER_ROLES.user],
      templateUrl:'applications/applications.html',
      controller:'ApplicationsCtrl'
    })
    .state('app', {
      parent:'nav',
      url:'/apps/:name',
      authorizedRoles:[USER_ROLES.admin, USER_ROLES.editor, USER_ROLES.user],
      templateUrl:'applications/application.html',
      controller:'ApplicationCtrl'
    })
    .state('signup', {
      parent:'nav',
      url:'/signup',
      templateUrl:'account/account-signup.html',
      controller:'AccountCtrl'
    })
    .state('login', {
      parent:'nav',
      url:'/login',
      templateUrl:'account/account-login.html',
      controller:'AccountCtrl'
    })
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/');
})