angular.module('hypercube.application', ['hypercube.application.editor', 'hypercube.application.settings','hypercube.application.preview'])
//Stop route changes that are not authorized and emit auth events
.run(function ($rootScope, $state) {

  //Set route change listener to stop naviation for unauthroized roles and emit auth events
  $rootScope.$on('$stateChangeStart', function (event, next) {
  	console.log('state change:', event, next);
  	$rootScope.stateName = next.name;
  });

})