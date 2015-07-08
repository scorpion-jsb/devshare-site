var filesLocation = 'appFiles';

angular.module('hypercube.application.editor')

.service('Editor', [ '$http', '$log', '$q', 'DB_URL', 'Files', function ($http, $log, $q, DB_URL, Files){
	this.setAce = function(aceEditor){
		this.ace = aceEditor;
		this.ace.setTheme('ace/theme/monokai');
		this.ace.$blockScrolling = Infinity; //Disable warning message
	};
	this.setApplication = function(applicationData){
		this.application = applicationData;
		$log.log('Application data set in editor', this.application);
	};
	this.getAce = function(){
		if(this.ace){
			return this.ace;
		} else {
			$log.error('No current ace editor available.');
		}
	};
	//Get firebase array of file structure
	this.getFiles = function(){
		return Files(this.application.name).$loaded();
	};
	this.setFileType = function(type){
		$log.log('[Editor.setFileType()] Called with type:', type);
		if(!type){
			type = 'javascript';
		}
		if(!this.ace){
			$log.error('[Editor.setFileType()] File type can not be set without ace editor instance.');
		} else {
			var setType = 'ace/mode/' + type;
			$log.log('Setting filetype:', setType);
			return this.ace.getSession().setMode("ace/mode/javascript");
		}
	};
	this.openFile = function(file){
		$log.log('Editor.openFile()');
		var d = $q.defer();
		//// Create Firepad.
		this.setFileType(file.filetype);
    var firepad = Firepad.fromACE(file.$ref(), this.ace, {
      defaultText: '// JavaScript Editing with Firepad!\nfunction go() {\n  var message = "Hello, world.";\n  console.log(message);\n}'
    });
		return d.promise;
	};
	// this.newFile = function(appData, filePath){
	// 	$log.log('[Editor.newFile()] Called with:', appData, filePath);
	// 	var d = $q.defer();
	// 	var apiUrl = DB_URL + '/apps/' + appData.name + '/files?key=' + filePath + '&action=putObject';
	// 	$http.get(apiUrl).success(function (newUrlRes){
	// 		$log.info('[Editor.newFile()] New file url generated successfully:', newUrlRes);
	// 		//Make put request to new url
	// 		$http.put(newUrlRes, {Body:'asdf'}).success(function(newFileRes){
	// 			$log.info('New file created:', newFileRes);
	// 			d.resolve(newFileRes.data);
	// 		}).error(function (err){
	// 			$log.error('Error putting new file to signed url:', err);
	// 			d.reject(err);
	// 		})
	// 	}).error(function (errRes){
	// 		$log.error('[Editor] Error creating new file:', errRes);
	// 		d.reject(errRes);
	// 	});
	// 	return d.promise;
	// };

}])
//Folder Object 
.factory('Folder', ['$firebaseObject', '$firebaseArray', function ($firebaseObject, $firebaseArray){
	function Folder(snap){
		//Check that snap is a snapshot
		if(snap.val()){
			//Snap is a snapshot
			angular.extend(this, snap.val()); //Add current value from Firebase
			_.extend(this,$firebaseObject(snap.ref())); //Add firebaseObject functionality
			//Fill children parameter if folder without children
			
			if(!this.children){
				this.children = [{}];
			} else {
				this.children = $firebaseArray(snap.ref().child('children'));
			}
		} else {
			//Snap is not a snapshot
			angular.extend(this, snap);
		}
		if(!this.type){
			this.type = "folder";
		}
		// this.$id = snap.key();
		// this.name = snap.val().name || "test.html";
		// this.setDefaults(snap);
	}
	Folder.prototype = {
    addFile: function(snapshot) {
      var oldData = angular.extend({}, this.data);
    },
	};
	return Folder;
}])
//File Object 
.factory('File', ['$firebaseObject', function ($firebaseObject){
	function File(snap){
		//Check that snap is a snapshot
		if(snap.val()){
			//Snap is a snapshot
			angular.extend(this, snap.val()); //Add current value from Firebase
			_.extend(this,$firebaseObject(snap.ref())); //Add firebaseObject functionality
			//Fill children parameter if folder without children
			if(this.type == 'folder' && !this.children){
				this.children = ['mock child'];
			}
		} else {
			//Snap is not a snapshot
			angular.extend(this, snap);
		}
		if(!this.type){
			this.type = "file";
		}
		// this.$id = snap.key();
		// this.setDefaults(snap);
	}
	File.prototype = {
    setDefaults: function(snapshot) {
      var oldData = angular.extend({}, this.data);
      // add a parsed date to our widget
      // this._date = new Date(this.data.date);
			if(!this.filetype){
				this.filetype = "javascript";
			}
    },
	};
	return File;
}])
//Files list factory the outputs extended firebaseArray
.factory("FilesFactory", ['$firebaseArray', 'File', 'Folder', function ($firebaseArray, File, Folder) {
  return $firebaseArray.$extend({
    // override the $createObject behavior to return a File object
    $$added: function(snap) {
    	if(snap.val().type == 'folder' || _.has(snap.val(), 'children')){
    		return new Folder(snap);
    	} else {
      	return new File(snap);
    	}
    },
    $addFile:function(fileData){
    	//TODO: Handle path
    	var pathArray = fileData.path.split("/");
    	//TODO: Handle file types
    	//TODO: Make key be safe version of name
    	// var self = this;
    	// _.each(pathArray, function (loc){
    	// });
    	// var filePath = self.$ref();
    	this.$add({name:fileData.path, type:'file', filetype:fileData.filetype || 'javascript'});
    },
    $addFolder:function(folderData){
    	//TODO: Handle path
    	var pathArray = folderData.path.split("/");
    	this.$add({name:folderData.path, type:'folder', children:[{}]});
    }
  });
}])
.factory('Files', ['fbutil', 'FilesFactory', function (fbutil, FilesFactory) {
	return function (appName){
		var ref = fbutil.ref(filesLocation, appName);
  	return FilesFactory(ref);
	}
}])
.service('editorService', ['$log', function ($log){
	this.newFile = function(){
		$log.log('Editor.newFile');
	};
}]);