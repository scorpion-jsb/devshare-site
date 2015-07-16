var filesLocation = 'appFiles';

angular.module('hypercube.application.editor')

.service('Editor', [ '$http', '$log', '$q', 'ENV', 'Files', 'File', 'AuthService', '$rootScope', '$s3', '$firebaseObject', 'fbutil', function ($http, $log, $q, ENV, Files, File, AuthService, $rootScope, $s3, $firebaseObject, fbutil){
	//Set Editor.ace and set secondary settings
	this.setAce = function(aceEditor){
		this.ace = aceEditor;
		this.session = aceEditor.getSession();
		this.ace.setTheme('ace/theme/monokai');
		this.ace.$blockScrolling = Infinity; //Disable warning message
	};
	//Get current application
	this.getApplication = function(){
		if(this.application){
			return this.application;
		} else {
			$log.error('[Editor.getAce()] No current ace editor available.');
			return null;
		}
		// $log.log('[Editor.setApplication] Application data set in editor', this.application);
	};
	//Get current Ace instance
	this.getAce = function(){
		if(this.ace){
			return this.ace;
		} else {
			$log.error('[Editor.getAce()] No current ace editor available.');
			return null;
		}
	};
	//Get firebase array of file structure
	this.getFiles = function(){
		var d = $q.defer();
		this.files = Files(this.application.name);
		var self = this;
		var filesObj = _.extend({}, $firebaseObject(self.files.$ref()));
		self.files.$loaded().then(function(){
			//Get s3 objects and save the data to firebase
			// $s3.getObjects(self.application.frontend.bucketName).then(function(s3Files){
			// 	//TODO: Compare here and add missing files to firebase
			// 	$log.info('[Editor.getFiles()] s3.getObjects:', s3Files);
			// 	files.$saveFbObj(s3Files).then(function(){
			// 		d.resolve(files);
			// 	}, function (err){
			// 		d.reject(err);
			// 	});
			// });
			d.resolve(self.files);
		}, function (err){
			$log.error('[Editor.getFiles()] Error loading files array:', err);
			d.reject(err);
		});
    return d.promise;
	};
	//Get File structure in "children" format to be used with tree viewing/control
	this.getStructure = function(){
		var d = $q.defer();
		var self = this;
		self.getFiles().then(function (files){
			files.$getStructure().then(function (structure){
				$log.debug('[Editor.getStructure()]:', structure, files);
				d.resolve(structure);
			}, function(err){
				d.reject(err);
			});
		}, function(err){
			d.reject(err);
		});
		return d.promise;
	}
	//Set editors file mode from provided type
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
			return this.ace.getSession().setMode(setType);
		}
	};
	//Open a file in the editor while safley emptying it if it had contents
	this.openFile = function(file){
		$log.log('Editor.openFile()', file);
		var d = $q.defer();
		var aceOptions = {};
		var self = this;
		//Check for already existing firepad
    if(_.has(this, 'firepad')){
      // Disconnect old firepad session
      this.firepad.dispose();
      // Empty out editor
      this.ace.getSession().setValue(null);
    }
		//If file is not a file, make it one
		if(!(file instanceof File)){
			file = new File(file);
		}
    //Set Default Editor text
		if(file.fileType == "javascript"){
			aceOptions.defaultText = '// ' + file.name;
		} else if(file.fileType == "html"){
			if(file.name == "index.html"){
				aceOptions.defaultText = '<!DOCTYPE html>\n<html lang="en">\n\t<head>\n\n\t</head>\n\t<body>\n\n\t</body>\n</html>';
			} else {
				aceOptions.defaultText = '<!-- '+ file.name +' -->';
			}
		}
		//Add current user information
		//User info loaded from AuthService
		// AuthService.getCurrentUser().then(function (currentUser){
			// aceOptions.userId = currentUser.username;
		// });
		//User info loaded from $rootScope
		if(_.has($rootScope, 'currentUser')){
			aceOptions.userId = $rootScope.currentUser.username;
		}
		this.setFileType(file.fileType);
  	this.currentFile = file;
		//Set firepad
		if(_.isFunction(file.$ref)){ //file is already a Firebase object
  		this.firepad = Firepad.fromACE(file.$ref(), this.ace, aceOptions);
		} else { //file is not a firebase object
			//Create firebase object by locating in Files array
			var structureArray = Files(this.application.name);
			structureArray.$loaded().then(function(){
				var fbFile = _.findWhere(structureArray, {path:file.path});
				console.log('fbFIle:', fbFile);
				self.currentFile = fbFile;
				self.firepad = Firepad.fromACE(fbFile.$ref(), self.ace, aceOptions);
  			d.resolve(self.currentFile);
			});
		}
		return d.promise;
	};
	//Publish the current file loaded in the editor to S3
	this.publishCurrent = function(){
		$log.log('Editor.publishCurrent()');
		var d = $q.defer();
		if(!this.currentFile){
			d.reject({message:'A file needs to be open to publish'});
		}
		$http.post(ENV.serverUrl + '/apps/'+ this.application.name + '/publish', {content:this.firepad.getText(), key:this.currentFile.path, contentType:this.currentFile.contentType}).then(function (){
			$log.info('File published successfully');
			d.resolve();
		}, function (errRes){
			$log.error('Error requesting publishFile:', errRes);
			d.reject(errRes);
		});
		return d.promise;
	};
	//Publish whole application to S3
	this.publish = function(){
		$log.log('Editor.publish()');
		//TODO: Have this publish whole application structure
		var d = $q.defer();
		return d.promise;
	};
}])
//Folder Object
.factory('Folder', ['$firebaseObject', '$firebaseArray', 'File', function ($firebaseObject, $firebaseArray, File){
	function Folder(snap){
		//Check that snap is a snapshot
		if(_.isFunction(snap.val)){ //Snap is a snapshot
			angular.extend(this, snap.val()); //Add current value from Firebase
			_.extend(this,$firebaseObject(snap.ref())); //Add firebaseObject functionality
			if(!this.children){ //Fill children parameter if folder without children
				this.children = [{}];
			} else {
				this.children = $firebaseArray(snap.ref().child('children'));
			}
		} else { //Snap is not a snapshot
			angular.extend(this, snap);
		}
		if(!this.type){
			this.type = "folder";
		}
	}
	Folder.prototype = {
	};
	return Folder;
}])
//File Object 
.factory('File', ['$firebaseObject', '$firebaseUtils', 'fbutil', '$q', '$log', function ($firebaseObject, $firebaseUtils, fbutil, $q, $log){
	function File(snap){
		//Check that snap is a snapshot
		if(_.isFunction(snap.val)){ //Snap is a snapshot
			angular.extend(this, snap.val()); //Add current value from Firebase
			_.extend(this, $firebaseObject(snap.ref())); //Add firebaseObject functionality
			// this.$id = snap.key();
			if(this.type == 'folder' && !this.children){ //Fill children parameter if folder without children
				this.children = ['mock child'];
			}
		} else { //Snap is not a snapshot
			angular.extend(this, snap);
			this.getTypes();
		}
		if(!this.type){
			this.type = "file";
		}
		// this.setDefaults(snap);
	}
	File.prototype = {
    //Get extension based on path
  	getExt:function(path){
    	var re = /(?:\.([^.]+))?$/;
    	var fileName = _.last(this.path.split("/")) || path;
    	$log.info('[File.getExt()]: Get ext calling with: ' + re.exec(fileName)[1]);
    	return re.exec(fileName)[1];
    },
    //Get fileType and contentType based on ext
    getTypes:function(){
    	var ext = this.getExt();
    	this.contentType = extToContentType(ext);
    	this.fileType = extToFileType(ext);
    },
    //Create a string that is usable as a Firebase key
    makeKey:function(){
    	// TODO: Handle more than one period
    	$log.log('[File.MakeKey] called with:', this);
    	if(_.has(this, 'name')){
    		var name = this.name;
    		return name.replace(".", ":");
    	} else if(_.has(this, 'path')){
    		var pathArray = this.path.split("/");
    		var name = _.last(pathArray);
    		this.name = name;
    		return name.replace(".", ":");
    	}
    },
    //Make File a Firebase object and combine its current data with data in Firebase
    addFbObj:function(appName){
			var ref = fbutil.ref(filesLocation, appName);
			//Make file a Firebase object
			var self = this;
			var fbSelf = _.extend({}, $firebaseObject(ref.push()));
			var d = $q.defer();
    	fbSelf.$loaded().then(function(){
    		//Set by key within structure
	    	fbSelf.$value = _.clone(self);
	    	//Save current value into fb object
	    	fbSelf.$save().then(function(){
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
	};
	return File;

}])
//Accepts Firebase ref and returns extended firebaseArray
.factory("FilesFactory", ['$firebaseArray', 'File', 'Folder', '$firebaseObject', '$q', '$log', function ($firebaseArray, File, Folder, $firebaseObject, $q, $log) {
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
    	file.addFbObj().then(function(){
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
    			var currentObj = {};
					var currentLevel = {};
					if(pathArray.length == 1){
						currentObj.name = pathArray[0];
						currentObj.type = "file";
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
				self.structure = mappedStructure;
    		d.resolve(mappedStructure);
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
.factory('Files', ['fbutil', 'FilesFactory', function (fbutil, FilesFactory) {
	return function (appName){
		var ref = fbutil.ref(filesLocation, appName);
  	return FilesFactory(ref);
	}
}]);
//----------- Utility functions ------------//
//Convert File extension to contentType
function extToContentType(ext){
	//Default content type
  var contentType = 'text/plain';
  //File type if statements
	if (ext=='html') {
		contentType = 'text/html'
	} else if(ext=='js') {
		contentType = 'application/javascript'
	} else if(ext=='css') {
		contentType = 'text/css'
	} else if(ext=='json') {
		contentType = 'application/json'
	} else if(ext=='jpg'||ext=='jpeg'||ext=='jpe') {
		contentType = 'image/jpeg'
	} else if(ext=='png') {
		contentType = 'image/png'
	} else if(ext=='gif') {
		contentType = 'image/gif'
	} else if(ext=='svg') {
		contentType = 'image/svg+xml'
	} else {
		contentType = 'application/octet-stream'
	}
	return contentType;
}
function extToFileType(ext){
	//Default content type
	return extToContentType(ext).split("/")[1];
}