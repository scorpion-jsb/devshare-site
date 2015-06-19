angular.module('hypercube')
.controller('ApplicationsCtrl', ['$scope', '$http', '$state', '$log', 'applicationsService', function($scope, $http, $state, $log, applicationsService){
		// $log.log('ApplicationsCtrl');
		$scope.data = {
			loading:true,
			error:null
		};
		applicationsService.get().then(function (applicationsList){
			$scope.data.loading = false;
			$log.log('Applications list loaded:', applicationsList);
			$scope.applications = applicationsList;
		}, function (err){
			$log.error('[ApplicationsCtrl.get()] Error loading applications', err);
			$scope.data.loading = false;
			$scope.data.error = err;
		});
		$scope.create = function(appData){
			applicationsService.add(appData).then(function(newApp){
				$log.log('Application created successfully:', newApp);
				$state.go('app', {name:newApp.name});
			}, function(err){
				$log.error('[ApplicationsCtrl.create()] Error loading applications', err);
				$scope.data.loading = false;
				$scope.data.error = err;
			});
		};
		$scope.delete = function(ind){
			$scope.data.loading = true;
			var applicationId = $scope.applications[ind]._id;
			applicationsService.delete(applicationId).then(function(response){
				$log.info('application deleted successfully');
			}, function(err){
				$log.error('Error loading applications', err);
				$scope.data.loading = false;
				$scope.data.error = err;
			});
		};
}])