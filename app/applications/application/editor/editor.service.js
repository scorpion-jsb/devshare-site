angular.module('hypercube.application.editor')

.service('Editor', [ '$http', '$log', '$q', 'DB_URL', function ($http, $log, $q, DB_URL){
	this.setAce = function(aceEditor){
		$log.log('Editor.newFile()');
		this.ace = aceEditor;
		this.ace.setTheme('ace/theme/monokai');
	};
	this.getAce = function(){
		if(this.ace){
			return this.ace;
		} else {
			$log.error('No current ace editor available.');
		}
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
	this.newFile = function(appData, filePath){
		$log.log('Editor.newFile()');
		var d = $q.defer();
		var apiUrl = DB_URL + '/apps/' + appData.name + '/files?action=putObject&key=' + filePath;
		$http.get(apiUrl).success(function (newUrlRes){
			$log.info('[Editor] New file url generated successfully:', newUrlRes);
			//Make put request to new url
			$http.put(newUrlRes, {Body:'asdf'}).success(function(newFileRes){
				$log.info('New file created:', newFileRes);
				d.resolve(newFileRes.data);
			}).error(function (err){
				$log.error('Error putting new file to signed url:', err);
				d.reject(err);
			})
		}).error(function (errRes){
			$log.error('[Editor] Error creating new file:', errRes);
			d.reject(errRes);
		});
		return d.promise;
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
}])

.service('editorService', ['$log', function ($log){
	this.newFile = function(){
		$log.log('Editor.newFile');
	};
}]);