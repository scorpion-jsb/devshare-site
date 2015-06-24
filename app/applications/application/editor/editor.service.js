angular.module('hypercube.application.editor')

.service('Editor', [ '$http', '$log', '$q', 'DB_URL', function ($http, $log, $q, DB_URL){
	
	this.newFile = function(fileData, fileContents){
		$log.log('Editor.newFile()');
		var d = $q.defer();
		var apiUrl = DB_URL + '/apps';
		$http.post(apiUrl).success(function (newFileRes){
			$log.info('[Editor] New file created successfully:', newFileRes);
			d.resolve(newFileRes.data);
		}).error(function (errRes){
			$log.error('[Editor] Error creating new file:', err);
			d.reject(err);
		});
		return d.promise;
	};
}])

.service('editorService', ['$log', function ($log){
	this.newFile = function(){
		$log.log('Editor.newFile');
	};
}]);