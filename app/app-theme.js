angular.module('hypercube')
.config(function($mdThemingProvider) {
  $mdThemingProvider.theme('default')
    .primaryPalette('blue')
    .accentPalette('pink')
  $mdThemingProvider.theme('docs-dark', 'default').dark();
})