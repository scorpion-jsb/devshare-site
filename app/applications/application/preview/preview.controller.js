angular.module('hypercube.application.preview')
.controller('PreviewCtrl', ['$scope', '$log', 'application', '$sce', '$window', function($scope, $log, application, $sce, $window){
	//TODO:Make Iframe container a directive
  $scope.application = application;
  $log.info('application loaded in preview contorller:', $scope.application);
  $scope.previewData = {device:'computer', width:$window.innerWidth, height:$window.innerHeight, url:$sce.trustAsResourceUrl("http://" + application.frontend.siteUrl)};
	$scope.setDevice = function(device){
		if (device === 'iphone6') {
      $scope.previewData.width = '375px';
      $scope.previewData.height = '667px';
      $scope.previewData.device = 'iphone6';
    }
    else if (device === 'iphone5') {
      $scope.previewData.device = 'iphone5';
      $scope.previewData.width = '320px';
      $scope.previewData.height = '568px';
    }
    else {
      $scope.previewData.device = 'computer';
      $scope.previewData.width = $window.innerWidth;
      $scope.previewData.height = $window.innerHeight;
    }
	};
  $scope.addHosting = function(){
    //TODO: Call to application service to add hosting
  };
}])