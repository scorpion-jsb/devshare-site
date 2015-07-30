angular.module('hypercube')
.controller('ApplicationsCtrl', ['$scope', '$http', '$state', '$log', 'applicationsService', '$mdDialog', function ($scope, $http, $state, $log, applicationsService, $mdDialog){
		// $log.log('ApplicationsCtrl');
		$scope.data = {
			loading:false,
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
			$scope.showToast('Error: ' + err.message || err);
		});
		$scope.startNew = function(ev){
			$mdDialog.show({
				controller: function($scope, $mdDialog){
					$scope.create = function(newAppData){
						$mdDialog.answer(newAppData);
					};
					$scope.cancel = function(){
						$mdDialog.cancel();
					};
				},
	      templateUrl: 'applications/applications-new.html',
	      parent: angular.element(document.body),
	      targetEvent: ev,
			}).then(function(answer) {
				$log.info('Create answered:', answer);
	      $scope.createApp(answer);
	    }, function() {
	    	$log.log('New Dialog was canceled');
	    });
		};

		$scope.createApp = function(appData){
			$scope.data.loading = true;
			applicationsService.add(appData).then(function (newApp){
				$scope.data.loading = false;
				$log.log('Application created successfully:', newApp);
				$state.go('app.settings', {name:newApp.name});
			}, function(err){
				$log.error('[ApplicationsCtrl.create()] Error creating application:', err);
				$scope.data.loading = false;
				$scope.data.error = err;
				$scope.showToast('Error: ' + err.message || err);
			});
		};
		$scope.delete = function(ind, ev){
			var application = $scope.applications[ind];
			$scope.showConfirm(ev, {title:"Delete", description:"Are you sure you want to delete " + application.name + " ?"}).then(function(){
				$log.log('calling delete with id:', application._id);
				applicationsService.del(application.name).then(function(deletedApp){
					$log.log('application deleted successfully', deletedApp);
					$scope.applications.splice(ind, 1);
				}, function(err){
					$log.error('Error loading applications', err);
					$scope.data.error = err;
					$scope.showToast('Error: ' + err.message || err);
				});
			});
		};
}])