angular.module('hypercube.nav')
.controller('NavCtrl', ['$scope', 'AuthService', '$state', function ($scope, AuthService, $state){
  $scope.logout = function () {
    AuthService.logout().then(function () {
      $scope.showToast("Logout Successful");
      $state.go('home');
    }, function (err){
      console.error('Error logging out:', err);
      $state.go('home');
    });
  };
}])