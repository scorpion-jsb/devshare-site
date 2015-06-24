angular.module('hypercube.account')
.controller('AccountCtrl', ['$scope','AuthService', '$state', '$log', function($scope, AuthService, $state, $log){
	
	// set-up loading state
	$scope.signupData = {
		loading: false,
		missing:{username:false, password:false}
	};
	$scope.loginData = {
		loading: false,
		missing:{username:false, password:false}
	};
	$scope.userData = $scope.currentUser;
	// --------------- Auth Session ----------------- //
	$scope.login = function() {
		if(!$scope.loginData.username || $scope.loginData.username.length < 1){
			$scope.loginData.missing.username = true;
			$scope.showToast("Username or Email is required to login");
		} else if(!$scope.loginData.password || $scope.loginData.password.length < 1){
			$scope.loginData.missing.password = true;
			$scope.showToast("Password requried to login");
		} else {
			$scope.loginData.loading = true;
			AuthService.login($scope.loginData)
			.then(function (authData){
				$log.log('Successful login:', authData);
				$scope.loginData.loading = false;
				$scope.showToast("Logged in");
				$state.go('apps');
			}, function (err){
				$scope.loginData = {loading:false, username:null, password:null};
				$scope.showToast("Error Logging in");
			});
		}
	};
	$scope.logout = function(){
		AuthService.logout().then(function(){
			$log.log('logout successful');
      // $scope.showToast('Successfully Logged Out');
			//TODO: Refresh page after logout
			$state.go('home');
		}, function(err){
			$log.error('error logging out');
		});
	};
	$scope.signup = function(){
		AuthService.signup($scope.signupForm).then(function(){
			$log.log('Signup successful');
      $scope.showToast('Successfully signed up');
			$state.go('apps');
		}, function(err){
			$log.error('error siging up:', err);
		});
	};
	$scope.update = function(){
		AuthService.updateProfile($scope.user).then(function (updatedAccount){
			$log.log('Account update successful');
      $scope.showToast('User account updated successfully');
		}, function(err){
			$log.error('error logging out');
		});
	};
}])