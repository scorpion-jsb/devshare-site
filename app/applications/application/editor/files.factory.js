angular.module('hypercube.application.editor')

//References location based on app name and returns extended firebaseArray
.factory('Files', ['fbutil', 'FilesListFactory', 'FILES_LOCATION', function (fbutil, FilesListFactory, FILES_LOCATION) {
	return function (appName){
		var ref = fbutil.ref(FILES_LOCATION, appName);
  	return FilesListFactory(ref);
	}
}])

//Accepts Firebase ref and returns extended firebaseArray
.factory("FilesListFactory", ['$firebaseArray', 'File', 'Folder', '$firebaseObject', '$q', '$log', function ($firebaseArray, File, Folder, $firebaseObject, $q, $log) {
  return $firebaseArray.$extend({
    // override the $createObject behavior to return a File object
    $$added: function(snap) {
      console.log('snap:', snap.val());
      if(snap.val().type == 'folder' || _.has(snap.val(), 'children')){
        return new Folder(snap);
      } else {
        return new File(snap);
      }
    },
    $addFile:function(fileData){
      //TODO: Handle path
      //TODO: Save file within correct path
      var file = new File({path:fileData.path});
      file.getTypes();
      var d = $q.defer();
      this.$add(file).then(function(){
        d.resolve(file);
      }, function (err){
        d.reject(err);
      });
      return d.promise;
    },
    //Add folder
    $addFolder:function(folderData){
      //TODO: Handle path
      var pathArray = folderData.path.split("/");
      var folder = new Folder({name:_.last(pathArray), path:folderData.path});
      var self = $firebaseObject(this.$ref());
      var d = $q.defer();
      self.$loaded().then(function(){
        //TODO: Check for other folders that match
        // _.findWhere(self, {name:folder.name})
        var key = folder.name;
        //Check to make sure name is not taken
        if(_.has(self, key)){
          key += "-1";
        }
        //Set by key within structure
        self[key] = folder;
        self.$save().then(function(){
          d.resolve(self);
        }, function (err){
          console.log('Error adding folder:', err);
          d.reject(err);
        });
      }, function (err){
        console.log('Error loading stucture:', err);
        d.reject(err);
      });
      return d.promise;
    },
    //Get files array in "children" format to be used with structure tree directive
    $getStructure:function(){
      var d = $q.defer();
      var self = this;
      self.$loaded().then(function(structureArray){
        var finalArray = [];
        var mappedStructure = structureArray.map(function (file){
          var pathArray = file.path.split("/");
          var currentObj = file;
          var currentLevel = {};
          if(pathArray.length == 1){
            currentObj.name = pathArray[0];
            if(!_.has(currentObj,'type')){
              currentObj.type = "file";
            } 
            currentObj.path = pathArray[0];
            return currentObj;
          } else {
            var finalObj = {};
            _.each(pathArray, function (loc, ind, list){
              // $log.debug('loop:', loc, ind, currentObj);
              if(ind != list.length - 1){ //Not the last loc
                currentObj.name = loc;
                currentObj.path = _.first(list, ind + 1).join("/");
                currentObj.type = "folder";
                currentObj.children = [{}];
                //TODO: Find out why this works
                if(ind == 0 ){
                  finalObj = currentObj;
                }
                currentObj = currentObj.children[0];
              } else {
                currentObj.type = "file";
                currentObj.name = loc;
                currentObj.path = pathArray.join("/");
              }
            });
            return finalObj;
          }
        });
        self.structure = combineLikeObjs(mappedStructure);
        d.resolve(self.structure);
      });
      return d.promise;
    },
    //Make File a Firebase object and combine its current data with data in Firebase
    $saveFbObj:function(saveData){
      var fbObj = $firebaseObject(this.$ref());
      var d = $q.defer();
      fbObj.$loaded().then(function(){
        //Set by key within structure
        fbObj.$value = _.extend({},saveData);
        //Save current value into fb object
        fbObj.$save().then(function(){
          d.resolve();
        }, function (err){
          $log.log('Error adding files:', err);
          d.reject(err);
        });
      }, function (err){
        $log.log('Error adding files:', err);
        d.reject(err);
      });
      return d.promise;
    }
  });
}])

//----------- Utility functions ------------//

//Recursivley combine children of object's that have the same names
function combineLikeObjs(mappedArray){
  var takenNames = [];
  var finishedArray = [];
  _.each(mappedArray, function(obj, ind, list){
    if(takenNames.indexOf(obj.name) == -1){
      takenNames.push(obj.name);
      finishedArray.push(obj);
    } else {
      var likeObj = _.findWhere(mappedArray, {name:obj.name});
      //Combine children of like objects
      likeObj.children = _.union(obj.children, likeObj.children);
      likeObj.children = combineLikeObjs(likeObj.children);
      console.log('extended obj:',likeObj);
    }
  });
  return finishedArray;
}