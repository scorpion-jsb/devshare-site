angular.module('hypercube.nav')
.controller('NavCtrl', ['$rootScope', '$scope', 'AuthService', '$state', function ($rootScope, $scope, AuthService, $state){
  // $scope.navButtons = [{text:'Templates', state:'templates'}];
  $scope.clickBtn = function(ind){
    console.log("going to state:", $scope.navButtons[ind].state);
    $state.go($scope.navButtons[ind].state);
  };
  $scope.logout = function () {
    AuthService.logout().then(function () {
      $scope.showToast("Logout Successful");
      $state.go('home');
    }, function (err){
      console.error('Error logging out:', err);
      $state.go('home');
    });
  };
  $scope.clickTitle = function(){
  	if($rootScope.currentUser){
  		$state.go('apps');
  	} else {
  		$state.go('home');
  	}
  };
}])