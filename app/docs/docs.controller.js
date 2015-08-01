angular.module('hypercube.docs')

.controller('DocsCtrl', ['$scope', '$log', '$window', 'ENV',  function ($scope, $log, $window, ENV){
	$scope.docs = function(type){
		if(type && type == 'rest'){
			console.log('ENV:', ENV.serverUrl);
			console.log('url:', ENV.serverUrl + '/docs/index.html');
			$window.location.href = ENV.serverUrl + '/docs/index.html';
		}
		if(type && type == 'start'){
			// $state.go('docs.start');
		}
	};
}]);
