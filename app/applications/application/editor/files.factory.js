angular.module('hypercube.application.editor')

//References location based on app name and returns extended firebaseArray
.factory('Files', ['fbutil', 'FilesListFactory', 'FILES_LOCATION', function (fbutil, FilesListFactory, FILES_LOCATION) {
	return function (appName){
		var ref = fbutil.ref(FILES_LOCATION, appName);
  	return FilesListFactory(ref);
	}
}])

//Accepts Firebase ref and returns extended firebaseArray
.factory("FilesListFactory", ['$firebaseArray', 'File', 'Folder', '$firebaseObject', '$q', '$log', '$s3', function ($firebaseArray, File, Folder, $firebaseObject, $q, $log, $s3) {
  return $firebaseArray.$extend({
    // override the $createObject behavior to return a File object
    $$added: function(snap) {
      $log.log('[filesFactory] snap:', snap.val());
      var val = snap.val();
      if(val.type == 'folder' || _.has(val, 'children') || _.isArray(val)){
        var item = new Folder(snap);
        //Use key to set item name if it does not exist
        if(!_.has(item, 'name')){
          item.name = snap.key();
        }
        return item;
      } else {
        return new File(snap);
      }
    },
    //Get files array in "children" format to be used with structure tree directive
    $getStructure:function(bucketName){
      var d = $q.defer();
      var self = this;
      $s3.getObjects(bucketName).then(function (structureArray){
        var childStructure = childStructureFromArray(structureArray);
        $log.info('childStructure from s3:', structureArray);
        self.$saveFbObj(childStructure).then(function(newArray){
          $log.warn('structure save:', newArray);
          d.resolve(newArray);
        }, function (err){
          d.reject(err);
        });
      }, function (err){
        d.reject(err);
      });
      return d.promise;
    },
    //Make File a Firebase object and combine its current data with data in Firebase
    $saveFbObj:function(saveData){
      var fbObj = $firebaseObject(this.$ref());
      var d = $q.defer();
      var self = this;
      fbObj.$loaded().then(function(){
        //Set by key within structure
        if(!_.isArray(saveData)){
          fbObj.$value = _.extend({},saveData);
        } else {
          //Save all non existing keys based on name
          _.each(saveData, function(fileObj){
            //TODO: Handle more than one period here
            var objName = fileObj.name.replace(".", ":");
            if(!_.has(fbObj, objName)){
              fbObj[objName] = fileObj;
            }
          });
        }
        //Save current value into fb object
        fbObj.$save().then(function(){
          self.$loaded().then(function(){
            d.resolve(self.$list);
          }, function(err){
            $log.error('[FilesList.$saveFbObj]Error loading files Firebase object:', err);
            d.reject(err);
          });
        }, function (err){
          $log.error('[FilesList.$saveFbObj]Error Saving files:', err);
          d.reject(err);
        });
      }, function (err){
        $log.error('[FilesList.$saveFbObj]Error loading files as Firebase object:', err);
        d.reject(err);
      });
      return d.promise;
    },
    $addFile:function(fileData){
      //TODO: Save file within correct path
      var file = new File({path:fileData.path});
      var d = $q.defer();
      $log.log('new fileObj:', file);
      // var self = this;
      // _.each(pathArray, function (loc){
      // });
      //Save as firebase object with key
      var self = this;
      var fileObj = $firebaseObject(file.makeRef(self.$ref()));
      $log.log('[$addFile] fileObj set:', fileObj);
      fileObj.$loaded().then(function(){
        //Check to make sure name is not taken
        var key = file.makeKey();
        if(_.has(fileObj, key)){
          //TODO: Check and keep modifying until key doesn't exist
          key += "-1";
        }
        //Set by key within structure
        fileObj.$value = file;
        fileObj.$save().then(function(){
          d.resolve(file);
        }, function (err){
          $log.error('Error adding file:', err);
          d.reject(err);
        });
      }, function (err){
        $log.error('Error loading stucture:', err);
        d.reject(err);
      });
      return d.promise;
    },
    //Add folder
    $addFolder:function(folderData){
      //TODO: Handle non-existing/malformed
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
    }
  });
}])

//----------- Utility functions ------------//
//
function buildStructureObject(file){
  var pathArray;
  console.log('buildStructure with:', file);
  if(_.has(file, 'path')){
    //Coming from files already having path (structure)
    pathArray = file.path.split("/");
  } else {
    //Coming from aws
    pathArray = file.Key.split("/");
    // console.log('file before pick:', file);
    file = _.pick(file, "Key");
    file.path = file.Key;
    file.name = file.Key;
  }
  var currentObj = file;
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
        if(file.$id){
          currentObj.$id = file.$id;
        }
      }
    });
    return finalObj;
  }
}

//Convert from array file structure (from S3) to "children" structure used in Editor GUI (angular-tree-control)
//Examples for two files (index.html and /testFolder/file.js):
//Array structure: [{path:"index.html"}, {path:"testFolder/file.js"}]
//Children Structure [{type:"folder", name:"testfolder", children:[{path:"testFolder/file.js", name:"file.js", filetype:"javascript", contentType:"application/javascript"}]}]
function childStructureFromArray(fileArray){
  // console.log('childStructureFromArray called:', fileArray);
  //Create a object for each file that stores the file in the correct "children" level
  var mappedStructure = fileArray.map(function (file){
    return buildStructureObject(file);
  });
  return combineLikeObjs(mappedStructure);
}
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
      // console.log('extended obj:',likeObj);
    }
  });
  return finishedArray;
}