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
      $scope.demo = {
        topDirections: ['left', 'up'],
        bottomDirections: ['down', 'right'],
        isOpen: false,
        availableModes: ['md-fling', 'md-scale'],
        selectedMode: 'md-scale',
        availableDirections: ['up', 'down', 'left', 'right'],
        selectedDirection: 'down'
      };
  $scope.aceChanged = function(e) {
  };

  $scope.open= function(node){
    //TODO: Open node from synced db
    if(node.type == "file") {
      Editor.openFile(node).then(function (openedFile){
        $log.log('file opened:', openedFile);
        $scope.currentFile = openedFile;
      });
    }
  };
  $scope.createNew = function(){
    var newObj = {path:$scope.data.newName};
    if($scope.data.createMode == "folder"){
      $scope.files.$addFolder(newObj);
      $log.log('New folder added:', $scope.files);
    } else {
      $scope.files.$addFile(newObj).then(function(file){
        console.log('Add file successful:', file);
        // $scope.openFile();
        //Reload structure
        Editor.getFiles().then(function(fileStructure){
          $scope.files = fileStructure;
          $log.info('Structure set:', $scope.files);
        });
      });
      $log.log('New file added:', $scope.files);
    }
    $scope.data = {newName: null, createMode:null};
  };
  $scope.publishCurrentFile = function(){
    Editor.publishCurrent().then(function (publishedFile){
      $log.info('Publish successful:', publishedFile);
      $scope.currentFile = null;
      $scope.showToast('Publish successful');
    });
  };
  $scope.remove = function(node, ev){
    //TODO: Show confirm
    $scope.showConfirm(ev,  {title:"Delete", description:"Are you sure you want to delete " + node.name + " ?"}).then(function(){

    });
  };
}])