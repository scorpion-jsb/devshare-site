angular.module('hypercube.application.editor')
.controller('EditorCtrl', ['$rootScope', '$scope', '$log', 'Editor',  'application', function ($rootScope, $scope, $log, Editor, application){
	$scope.data = {createMode:null, newFileName:null};
  $scope.file = {};
  //TODO: Save expanded nodes and open file
    $scope.tree = { opts:{
      isLeaf:function(node){
        return node.type == "file";
      }
    }
  };
  Editor.application = $scope.application;
  Editor.getStructure().then(function(structure){
    $scope.structure = structure;
    $scope.$watch('structure', function(val){
      $log.debug('structure watch:', val)
    })
    $log.warn('getStructure returned', structure);
  });
	$scope.aceLoaded = function(_editor) {
      Editor.setAce(_editor);
    //TODO: Load saved list of expanded tree nodes
    // if(Editor.expandedNodes){
    //   $scope.tree.expandedNodes = Editor.expandedNodes;
    // }
    //TODO: load already exisiting session
    // if(!Editor.ace){
    // } else {
    //   _editor.setSession(Editor.session);
    // }
  };
  $scope.aceChanged = function(e) {
  };
  $scope.open = function(node){
    //TODO: Open node from synced db
    if(node.type == "file") {
      Editor.openFile(node).then(function (openedFile){
        // $log.log('file opened:', openedFile);
        // $scope.currentFile = openedFile;
        Editor.getStructure().then(function(structure){
          $scope.structure = structure;
          $scope.tree.expandedNodes.push(node);
        });
      });
    } else {
      // $scope.tree.expandedNodes.push(node);
      // Editor.expandedNodes = $scope.tree.expandedNodes;
    }
  };
  $scope.createNew = function(){
    var newObj = {path:$scope.data.newName};
    if($scope.data.createMode == "folder"){
      Editor.files.$addFolder(newObj);
      // $log.log('[EditorCtrl.createNew()] New folder added:', $scope.files);
    } else {
      Editor.files.$addFile(newObj).then(function(file){
        $log.log('[EditorCtrl.createNew()] Add file successful:', file);
        //TODO: Open newly created file
        // $scope.openFile();
        //TODO: There is a better way to do this
        //Reload structure
        Editor.getFiles().then(function(fileStructure){
          $scope.files = fileStructure;
          $log.info('Structure set:', $scope.files);
        });
      });
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
    //Show confirm
    $scope.showConfirm(ev,  {title:"Delete", description:"Are you sure you want to delete " + node.name + " ?"}).then(function(){

    });
  };
}])