angular.module('hypercube')
// Whitelist Urls

.config(function($stateProvider, $urlRouterProvider, $mdThemingProvider, USER_ROLES, $sceDelegateProvider) {
  $sceDelegateProvider.resourceUrlWhitelist([
   // Allow same origin resource loads.
   'self',
   // // Allow loading from our assets domain.  Notice the difference between * and **.
   // 'http://srv*.assets.example.com/**'
   'http://*.s3.amazonaws.com/**'
   ]);
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
      abstract:true,
      url:'/apps/:name',
      authorizedRoles:[USER_ROLES.admin, USER_ROLES.editor, USER_ROLES.user],
      templateUrl:'applications/application/application.html',
      controller:'ApplicationCtrl',
      resolve:{
        application:function(applicationsService, $q, $stateParams){
          return $q(function(resolve, reject){
            applicationsService.get().then(function (applicationList){
              console.log('application Detail Ctrl: application data loaded:', applicationList);
              resolve(_.findWhere(applicationList, {name:$stateParams.name}));
            }, function(err){
              reject(err);
            });
          });
        }
      }
    })
    .state('app.settings', {
      url:'/settings',
      templateUrl:'applications/application/settings/settings.html',
      controller:'SettingsCtrl'
    })
    .state('app.editor', {
      url:'/editor',
      templateUrl:'applications/application/editor/editor.html',
      controller:'EditorCtrl'
    })
    .state('app.preview', {
      url:'/preview',
      templateUrl:'applications/application/preview/preview.html',
      controller:'PreviewCtrl'
    })
    .state('account', {
      parent:'nav',
      url:'/account',
      templateUrl:'account/account-index.html',
      controller:'AccountCtrl'
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