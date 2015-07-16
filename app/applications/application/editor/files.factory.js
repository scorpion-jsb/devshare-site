angular.module('hypercube.application.editor')

//References location based on app name and returns extended firebaseArray
.factory('Files', ['fbutil', 'FilesListFactory', 'FILES_LOCATION', function (fbutil, FilesListFactory, FILES_LOCATION) {
	return function (appName){
		var ref = fbutil.ref(FILES_LOCATION, appName);
  	return FilesListFactory(ref);
	}
}])


//Files list factory the outputs extended firebaseArray of firebaseObjects
.factory("FilesListFactory", ['$firebaseArray', 'File', 'Folder', '$firebaseObject', '$q', function ($firebaseArray, File, Folder, $firebaseObject, $q) {
  return $firebaseArray.$extend({
    // override the $createObject behavior to return a File object
    $$added: function(snap) {
    	if(snap.val().type == 'folder' || _.has(snap.val(), 'children')){
    		//TODO: Make this recursive so it goes all the way down
    		// _.map(snap.val().children, function (child){
    		// 	console.log('Child map:', child);
    		// 	if(child.type == "file"){
    		// 		return new File(child.ref());
    		// 	}
    		// })
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
    	// var self = this;
    	// _.each(pathArray, function (loc){
    	// });
    	//Save as firebase object with key
    	var self = this;
    	var fileObj = $firebaseObject(file.makeRef(self.$ref()));
	    console.log('fileObj set:', fileObj);
    	fileObj.$loaded().then(function(){
    		//Check to make sure name is not taken
    		var key = file.makeKey();
    		if(_.has(fileObj, key)){
    			key += "-1";
    		}
    		//Set by key within structure
	    	fileObj.$value = file;
	    	fileObj.$save().then(function(){
    			d.resolve();
    		}, function (err){
    			console.log('Error adding file:', err);
    			d.reject(err);
    		});
    	}, function (err){
    		console.log('Error loading stucture:', err);
    		d.reject(err);
    	});
    	return d.promise;
    },
    $addFolder:function(folderData){
    	//TODO: Handle path
    	var pathArray = folderData.path.split("/");
    	var folder = new Folder({name:_.last(pathArray), path:folderData.path});
    	var self = $firebaseObject(this.$ref());
    	var d = $q.defer();
    	self.$loaded().then(function(){
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