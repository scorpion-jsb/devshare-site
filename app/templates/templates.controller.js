angular.module('hypercube.templates')
.controller('TemplatesCtrl', ['$scope',  '$state', '$log', 'Templates', function ($scope, $state, $log, Templates){
		// $log.log('ApplicationsCtrl');
		console.log('templates:', Templates);
		Templates.get().then(function (templates){
			$scope.templates = templates;
		});
}]);