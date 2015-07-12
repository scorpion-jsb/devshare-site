angular.module('hypercube.application', ['hypercube.application.editor', 'hypercube.application.settings','hypercube.application.preview'])
.run(function ($rootScope, $state) {
  //Set route change listener to add state name to scope (for active css class on buttons)
  $rootScope.$on('$stateChangeStart', function (event, next) {
  	console.log('state change:', event, next);
  	$rootScope.stateName = next.name;
  });
});