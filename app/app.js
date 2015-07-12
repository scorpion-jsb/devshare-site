angular.module('hypercube', [
    'ui.router', 
    'ngMaterial', 
    'ngStorage', 
    'angular-jwt',

    'hypercube.auth',
    'hypercube.const',

    'hypercube.nav',

    'hypercube.account',
    'hypercube.home',
    'hypercube.applications',
    'hypercube.application'

  ])
.directive('stopEvent', function () {
  return {
    restrict: 'A',
    link: function (scope, element, attr) {
      element.bind('mouseover', function (e){
        e.stopPropagation();
      })
      element.bind('click', function (e) {
        e.stopPropagation();
      });
    }
  };
 })
//Set environment based on host
.service('ENV', ['$location', 'CONST', function($location, CONST){
  //TODO: Check for other environments as well (staging)
  if($location.host() == "localhost"){
    return {serverUrl:CONST.local.SERVER_URL, fbUrl:CONST.local.FB_URL};
  } else {
    return {serverUrl:CONST.production.SERVER_URL, fbUrl:CONST.production.FB_URL};
  }
}]);