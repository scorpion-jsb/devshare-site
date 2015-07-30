angular.module('hypercube.templates')
.service('Templates', ['ENV', '$http', '$q', function (ENV, $http, $q){
	this.get = function(templateName){
		var d = $q.defer();
		var endpointUrl = ENV.serverUrl + '/templates';
		if(templateName){
			endpointUrl += '/'+ templateName;
		}
		$http.get(endpointUrl).then(function (apiRes){
			console.log('templates list loaded:', apiRes.data);
			d.resolve(apiRes.data);
		}, function (err){
			d.reject(err);
		})
		return d.promise;
	}
}])