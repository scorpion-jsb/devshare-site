angular.module('hypercube.applications')
.factory('applicationsService', ['$q', '$http', '$log', '$rootScope', 'ENV', 'AuthService', function ($q, $http, $log, $rootScope, ENV, AuthService) {
	var applications = null;
	return {
		add:function(applicationData){
			var d = $q.defer();
			if(!applicationData){
				$log.warn('[ApplicationsService.add()] No application data');
				d.reject({message:'Name required to create new application'});
			}
			AuthService.getCurrentUser().then(function(currentUser){
				applicationData.owner = currentUser._id;
				$log.debug('requesting new app with:', applicationData);
				$http.post(ENV.serverUrl + '/apps', applicationData)
				.then(function (apiRes){
					d.resolve(apiRes.data);
				})
				.catch(function (errRes){
					//TODO: Handle different error response codes
					$log.error('Error adding application: ', errRes.data);
					d.reject({message:errRes.data});
				});
			});
			return d.promise;
		},
		update:function(applicationId, applicationData){
			var deferred = $q.defer();
			$http.put(ENV.serverUrl + '/apps/'+ applicationId, applicationData)
			.then(function (apiRes){
				deferred.resolve(apiRes.data);
			})
			.catch(function (errRes){
				//TODO: Handle different error response codes
				deferred.reject(errRes.data);
			});
			return deferred.promise;
		},
		get:function(applicationName){
			var deferred = $q.defer();
			// console.log('Loading application with ID:', applicationName);
			var endpointUrl = ENV.serverUrl + "/apps";
			var isList = true;
			if(applicationName){
				endpointUrl = endpointUrl + "/" + applicationName;
				isList = false;
			}
			$http.get(endpointUrl)
			.then(function (apiRes){
				if(isList){
					applications = apiRes.data;
				} else {
					//TODO: Update application in list
				}
				deferred.resolve(apiRes.data);
			})
			.catch(function (errRes){
				//TODO: Handle different error response codes
				$log.error('Error loading application data', errRes.data);
				deferred.reject(errRes.data);
			});
			return deferred.promise;
		},
		del:function(applicationName){
			var deferred = $q.defer();
			// $log.log('Loading application with ID:', applicationName);
			if(applicationName){
				endpointUrl =  ENV.serverUrl + "/apps/" + applicationName;
			}
			$http.delete(endpointUrl)
			.then(function (apiRes){
				// applications = apiRes.data;
				deferred.resolve(apiRes.data);
			})
			.catch(function (errRes){
				//TODO: Handle different error response codes
				$log.error('Error deleting application', errRes.data);
				deferred.reject(errRes.data);
			});
			return deferred.promise;
		}
	};
}])