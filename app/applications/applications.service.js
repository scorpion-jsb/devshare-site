angular.module('hypercube.applications')
.factory('applicationsService', ['$q', '$http', '$log', '$rootScope', 'DB_URL', function ($q, $http, $log, $rootScope, DB_URL) {
	var applications = null;
	return {
		add:function(applicationData){
			var d = $q.defer();
			console.log('$rootScope:', $rootScope);
			applicationData.owner = $rootScope.currentUser._id;
			$http.post(DB_URL + '/apps', applicationData)
			.then(function (apiRes){
				d.resolve(apiRes.data);
			})
			.catch(function (errRes){
				//TODO: Handle different error response codes
				$log.error('Error loading application', errRes.data);
				d.reject(errRes.data);
			});
			return d.promise;
		},
		update:function(applicationId, applicationData){
			var deferred = $q.defer();
			$http.put(DB_URL + '/apps/'+ applicationId, applicationData)
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
			var endpointUrl = DB_URL + "/apps";
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
		del:function(applicationId){
			var deferred = $q.defer();
			// $log.log('Loading application with ID:', applicationId);
			if(applicationId){
				endpointUrl =  DB_URL + "apps/" + applicationId;
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