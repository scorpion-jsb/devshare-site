angular.module('hypercube.application.editor')
.controller('EditorCtrl', ['$rootScope', '$scope', '$log', function($rootScope, $scope, $log){
	$scope.data = {createMode:false};
  //TODO: Change file mode dynamically (editor service)
	$scope.aceLoaded = function(_editor) {
    // Options
    // _editor.setReadOnly(true);
    _editor.setTheme('ace/theme/monokai');
    _editor.getSession().setMode("ace/mode/javascript");
  };

  $scope.aceChanged = function(e) {
    //
  };
  $scope.newFile = function(){
    
  };
}])