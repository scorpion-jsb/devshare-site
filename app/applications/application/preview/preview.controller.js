angular.module('hypercube.application.preview')
.controller('PreviewCtrl', ['$scope', '$log', 'application', '$sce', '$window', function($scope, $log, application, $sce, $window){
	//TODO:Make Iframe container a directive
  $scope.previewData = {width:document.getElementById('iframe-container').offsetWidth, height:document.getElementById('iframe-container').offsetHeight, url:$sce.trustAsResourceUrl("http://" + application.frontend.siteUrl)};
	$scope.setDevice = function(device){
		if (device === 'iphone6') {
      $scope.previewData.width = '375px';
      $scope.previewData.height = '667px';
    }
    else if (device === 'iphone5') {
      $scope.previewData.width = '320px';
      $scope.previewData.height = '568px';
    }
    else {
      $scope.previewData.width = document.getElementById('iframe-container').offsetWidth;
      $scope.previewData.height = document.getElementById('iframe-container').offsetHeight;
    }
	}
}])