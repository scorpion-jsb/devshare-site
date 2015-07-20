angular.module('hypercube.application', ['hypercube.application.editor', 'hypercube.application.settings','hypercube.application.preview'])
.run(function ($rootScope, $state) {
  //Set route change listener to add state name to scope (for active css class on buttons)
  $rootScope.$on('$stateChangeStart', function (event, next) {
  	$rootScope.stateName = next.name;
	  var tabStates = ["app.editor", "app.preview", "app.settings"];
		_.each(tabStates, function(state, ind){
			if(next.name == state){
				$rootScope.currentTabInd = ind;
			}
		});
  });
});
