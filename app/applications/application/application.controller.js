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
		$rootScope.$on('$stateChangeStart', function (event, next) {
		  var tabStates = ["app.editor", "app.preview", "app.settings"];
			_.each(tabStates, function(state, ind){
				if($scope.stateName == state){
					$scope.currentTabInd = ind;
				}
			});
	  });
		$scope.update = function(){
			$scope.data.editing = false;
			$scope.data.loading = true;
			applicationsService.update($stateParams.name, $scope.application)
			.then(function (appData){
				$log.log('application Detail Ctrl: application data loaded:', appData);
				$scope.application = application;
			}).catch(function (err){
				$log.error('Error loading applications', err);
				$scope.data.error = err;
			}).finally(function(){
				$scope.data.loading = false;
			});
		};
		$scope.goTo = function(path){
			$log.log('going to path: '+ path);
			$window.open("http://" + path);
		};
}]);