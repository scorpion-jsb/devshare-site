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
  // Editor.getStructure($scope.application).then(function (fileStructure){
  //   console.log('file stucture:', fileStructure);
  // })
  //TODO: Change file mode dynamically (editor service)
	$scope.aceLoaded = function(_editor) {
    // Options
    // _editor.setReadOnly(true);
    Editor.setAce(_editor);
  };

  $scope.aceChanged = function(e) {
    //TODO: Sync these changes with a db
  };
  $scope.openFile = function(file){
    //TODO: Open file from synced db
    Editor.openFile(file).then(function (openedFile){
      $log.log('file opened:', openedFile);
    }, function (err){
      $log.error('[EditorCtrl.openFile()] Error opening file:', err);
    });
  };
  $scope.createNew = function(){
    // $scope.files.$add({name:$scope.data.newFileName});
    //TODO: Handle creating both file and folder
    //TODO: Make sure file name can be key name
    var newObj = {path:$scope.data.newName};
    if($scope.data.createMode == "folder"){
      $scope.files.$addFolder(newObj);
      $log.log('New folder added:', $scope.files);
    } else {
      $scope.files.$addFile(newObj);
      $log.log('New file added:', $scope.files);
    }
  };
  $scope.uploadFile = function(){

  };
}])