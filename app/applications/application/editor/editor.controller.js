angular.module('hypercube.application.editor')
.controller('EditorCtrl', ['$rootScope', '$scope', '$log', 'Editor',  'application', function($rootScope, $scope, $log, Editor, application){
	$scope.data = {createMode:false, newFileName:null};
  $scope.file = {};
  $log.info('$scope.application:', $scope.application);
  Editor.getStructure($scope.application).then(function (fileStructure){
    console.log('file stucture:', fileStructure);
  })
  //TODO: Change file mode dynamically (editor service)
	$scope.aceLoaded = function(_editor) {
    // Options
    // _editor.setReadOnly(true);
    Editor.setAce(_editor);
  };

  $scope.aceChanged = function(e) {
    //TODO: Sync these changes with a db
  };
  $scope.openFile = function(){
    //TODO: Open file from synced db
    Editor.openFile().then(function (openedFile){
      $log.log('file opened:', openedFile);
    }, function (err){
      $log.error('[EditorCtrl.openFile()] Error opening file:', err);
    });
  };
  $scope.newFile = function(){
    Editor.newFile(application, $scope.data.newFileName).then(function (openedFile){
      $log.log('file opened:', openedFile);
    }, function (err){
      $log.error('[EditorCtrl.newFile()] Error creating new file:', err);
    });
  };
  $scope.uploadFile = function(){

  };
}])