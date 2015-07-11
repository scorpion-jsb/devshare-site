angular.module('hypercube.application.editor')
.controller('EditorCtrl', ['$rootScope', '$scope', '$log', 'Editor',  'application', function($rootScope, $scope, $log, Editor, application){
	$scope.data = {createMode:null, newFileName:null};
  $scope.file = {};
  $log.info('$scope.application:', $scope.application);
  Editor.setApplication($scope.application);
  Editor.getFiles().then(function(fileStructure){
    $scope.files = fileStructure;
    $log.info('Structure set:', $scope.files);
  });
  //TODO: Change file mode dynamically (editor service)
	$scope.aceLoaded = function(_editor) {
    // Options
    Editor.setAce(_editor);
  };

  $scope.aceChanged = function(e) {
  };

  $scope.openFile = function(file){
    //TODO: Open file from synced db
    Editor.openFile(file).then(function (openedFile){
      $log.log('file opened:', openedFile);
    });
  };
  $scope.createNew = function(){
    var newObj = {path:$scope.data.newName};
    if($scope.data.createMode == "folder"){
      $scope.files.$addFolder(newObj);
      $log.log('New folder added:', $scope.files);
    } else {
      $scope.files.$addFile(newObj).then(function(folder){
        $scope.openFile(folder);
      });
      $log.log('New file added:', $scope.files);
    }
    $scope.data = {newName: null, createMode:null};
  };
  $scope.publishCurrentFile = function(){
    Editor.publishCurrent().then(function (publishedFile){
      $log.info('Publish successful:', publishedFile);
    });
  };
}])