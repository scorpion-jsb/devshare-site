angular.module('hypercube.account')
.controller('AccountCtrl', ['$scope','AuthService', '$state', function($scope, AuthService, $state){
	
	// set-up loading state
	$scope.signupData = {
		loading: false,
		missing:{username:false, password:false}
	};
	$scope.loginData = {
		loading: false,
		missing:{username:false, password:false}
	};
	// --------------- Auth Session ----------------- //
	$scope.login = function() {
		$scope.loginData.loading = true;
		if(!$scope.loginData.username || $scope.loginData.username.length < 1){
			$scope.loginData.missing.username = true;
		}
		if(!$scope.loginData.password || $scope.loginData.password.length < 1){
			$scope.loginData.missing.password = true;
		}
		if($scope.loginData.username && $scope.loginData.password){
			AuthService.login($scope.loginData)
			.then(function (authData){
				$log.log('Successful login:', authData);
				$scope.loginData.loading = false;
				$scope.showToast("Logged in");
				$state.go('users');
			}, function (err){
				$scope.loginData = {loading:false, email:null, password:null};
			});
		}
	};
	$scope.logout = function(){
		AuthService.logout().then(function(){
			console.log('logout successful');
      // $scope.showToast('Successfully Logged Out');
			//TODO: Refresh page after logout
			$state.go('home');
		}, function(err){
			console.error('error logging out');
		});
	};
	$scope.signup = function(){
		AuthService.signup($scope.signupForm).then(function(){
			console.log('Signup successful');
			//TODO: Refresh page after logout
      // $scope.showToast('Successfully signed up');
			$state.go('users');
		}, function(err){
			console.error('error siging up:', err);
		});
	};
}])