angular.module('hypercube.application.editor')
.controller('EditorCtrl', ['$rootScope', '$scope', '$log', 'Editor',  'application', function($rootScope, $scope, $log, Editor, application){
	$scope.data = {createMode:false, newFileName:null};
  $scope.file = {};
  $log.info('$scope.application:', $scope.application);
  Editor.setApplication($scope.application);
  Editor.getFiles().then(function(fileStructure){
    $scope.files = fileStructure;
    $log.info('files set:', $scope.files);
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
  $scope.openFile = function(){
    //TODO: Open file from synced db
    Editor.openFile().then(function (openedFile){
      $log.log('file opened:', openedFile);
    }, function (err){
      $log.error('[EditorCtrl.openFile()] Error opening file:', err);
    });
  };
  $scope.newFile = function(){
    // $scope.files.$add({name:$scope.data.newFileName});
    //TODO: Make sure file name can be key name
    $scope.files.$add({name:$scope.data.newFileName, filetype:"javascript"});
    $log.log('files added to:', $scope.files);
  };
  $scope.uploadFile = function(){

  };
}])