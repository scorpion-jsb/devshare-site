angular.module('hypercube.applications')
.controller('ApplicationCtrl', ['$scope', '$http', '$stateParams', 'applicationsService', function($scope, $http, $stateParams, applicationsService){
		$scope.data = {
			loading:false,
			error:null,
			editing:false
		};
		//Load application data based on name
		if($stateParams.name){
			$scope.data.loading = true;
			//TODO: Use already loaded applications list? Maybe in service?
			applicationsService.get()
			.then(function (applicationList){
				console.log('application Detail Ctrl: application data loaded:', applicationList);
				$scope.applications = applicationList;
				$scope.application = _.findWhere($scope.applications, {name:$stateParams.name});
				console.log('Application loaded:', $scope.application);
			}).catch(function (err){
				console.error('application Detail Ctrl: Error loading application with id:' + $stateParams.name, err);
				$scope.data.error = err;
			}).finally(function(){
				$scope.data.loading = false;
			});
		} else {
			console.error('application Detail Ctrl: Invalid application id state param');
			$scope.data.error = 'application Id is required to load application data';
		}
		//TODO: Make owner select an input that searches instead of a dropdown

		$scope.update = function(){
			$scope.data.editing = false;
			$scope.data.loading = true;
			applicationsService.update($stateParams.name, $scope.application)
			.then(function (appData){
				console.log('application Detail Ctrl: application data loaded:', appData);
				// $scope.application = apiRes.data;
			}).catch(function (err){
				console.error('Error loading applications', err);
				$scope.data.error = err;
			}).finally(function(){
				$scope.data.loading = false;
			});
		};
		
}])