angular.module('hypercube', [
    'ui.router', 
    'ngMaterial', 
    'ngStorage', 
    'angular-jwt',

    'hypercube.auth',
    'hypercube.account',
    'hypercube.nav',
    'hypercube.home', 
    'hypercube.roles', 
    'hypercube.users'
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
 });