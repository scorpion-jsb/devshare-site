angular.module('hypercube.application.editor')

.service('Editor', [ '$http', '$log', '$q', 'ENV', 'Files', 'File', 'AuthService', '$rootScope', '$s3', '$firebaseObject', 'fbutil', function ($http, $log, $q, ENV, Files, File, AuthService, $rootScope, $s3, $firebaseObject, fbutil){
	//Set Editor.ace and set secondary settings
	this.setAce = function(aceEditor){
		this.ace = aceEditor;
		this.session = aceEditor.getSession();
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
		console.log("get files called with:", this);
		this.files = Files(this.application.name);
		var self = this;
		var filesObj = _.extend({}, $firebaseObject(self.files.$ref()));
		this.files.$loaded().then(function(files){
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
			d.resolve(files);
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
			self.getFiles().then(function(filesArray){
				var fbFile = _.findWhere(filesArray, {path:file.path});
				console.log('fbFile:', fbFile);
				self.firepad = Firepad.fromACE(fbFile.$ref(), self.ace, aceOptions);
  			d.resolve(file);
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
}]);
