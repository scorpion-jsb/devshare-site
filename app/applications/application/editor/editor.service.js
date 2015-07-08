var filesLocation = 'appFiles';

angular.module('hypercube.application.editor')

.service('Editor', [ '$http', '$log', '$q', 'DB_URL', 'Files', function ($http, $log, $q, DB_URL, Files){
	
	this.setAce = function(aceEditor){
		this.ace = aceEditor;
		this.ace.setTheme('ace/theme/monokai');
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
	this.openFile = function(appData, fileData){
		$log.log('Editor.openFile()');
		var d = $q.defer();
		this.setFileType(fileData.filetype);
		if(appData.frontend.files){
			//Load contents by using path parameter
			//fileData.path
			var apiUrl = DB_URL + '/apps/' + appData.name + '/files?action=getObject&key=' + fileData.path;
			$http.get(apiUrl).success(function (openUrlRes){
				$log.info('[Editor] File open url retreived successfully:', openUrlRes);
				//TODO: User signed url to open file
				d.resolve(openUrlRes.data);
			}).error(function (errRes){
				$log.error('[Editor] Error creating new file:', err);
				d.reject(err);
			});
		} else {
			//Get app data to check again for files
		}
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
//File Object 
.factory('File', ['$firebaseObject', function ($firebaseObject){
	function File(snap){
		angular.extend(this, snap.val()); //Add current value from Firebase
		angular.extend(this,$firebaseObject(snap.ref())); //Add firebaseObject functionality
		// this.$id = snap.key();
		// this.name = snap.val().name || "test.html";
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
.factory("FilesFactory", ['$firebaseArray', 'File', function ($firebaseArray, File) {
  return $firebaseArray.$extend({
    // override the $createObject behavior to return a File object
    $$added: function(snap) {
      return new File(snap);
    },

    // override the $$updated behavior to call a method on the File
    // $$updated: function(snap) {
    //   var msg = this.$getRecord(snap.key());
    //   return msg.update(snap);
    // }
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