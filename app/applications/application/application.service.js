angular.module('hypercube.application')
.service('Application', ['applicationsService', '$q', '$log', function (applicationsService, $q, $log){
	function Application(appData){
		if(_.isString(appData)){
			this.name = appData;
		} else {
			_.extend(this, appData);
		}
	}
	Application.prototype = {
		save:function(newData){
			var d = $q.defer();
			var self = this;
			var appData = angular.copy(this);
			if(newData){
				appData = newData;
			}
			applicationsService.update(self.name, self).then(function (applicationData){
				console.log('Extending application with returned data:', applicationData);
				var updatedApp = _.extend(self, applicationData);
				console.log('Extended application', updatedApp);
				d.resolve(updatedApp);
			}, function (err){
				$log.error('Error saving application:', err);
				d.reject(err);
			});
			return d.promise;
		},
		get: function(){
			var d = $q.defer();
			var self = this;
			applicationsService.get(self.name).then(function (applicationData){
				var app = new Application(applicationData);
				d.resolve(app);
			}, function (err){
				$log.error('Error getting application:', err);
				d.reject(err);
			});
			return d.promise;
		},
		addStorage:function(){
			var d = $q.defer();
			var endpointUrl = ENV.serverUrl + "/apps/" + this.name + "/storage";
			$http.post(endpointUrl, {}).then(function (applicationData){
				$log.log('Adding storage successful:', applicationData);
				var app = new Application(applicationData);
				d.resolve(app);
			}, function (err){
				$log.error('[Application.addStorage()] Error getting application:', err);
				d.reject(err);
			});
			return d.promise;
		}
	};
	return Application;
}])