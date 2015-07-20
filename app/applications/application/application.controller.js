angular.module('hypercube.applications')
.controller('ApplicationCtrl', ['$scope', '$http', '$stateParams', 'application', 'applications', 'applicationsService', '$window', '$rootScope', '$log', function ($scope, $http, $stateParams, application, applications, applicationsService, $window, $rootScope, $log){
		$scope.data = {
			loading:false,
			error:null,
			editing:false
		};
		$scope.applications = applications;
		$scope.application = application;
		//Set tab to correct page when state changes

		$scope.update = function(){
			$scope.data.editing = false;
			$scope.data.loading = true;
			//TODO: Run update on application object
			applicationsService.update($stateParams.name, $scope.application)
			.then(function (appData){
				// $log.log('[$scope.update()] application data loaded:', appData);
				$scope.application = application;
			}).catch(function (err){
				$log.error('Error loading applications', err);
				$scope.data.error = err;
			}).finally(function(){
				$scope.data.loading = false;
			});
		};
		$scope.goTo = function(path){
			// $log.log('going to path: '+ path);
			$window.open("http://" + path);
		};
}]);