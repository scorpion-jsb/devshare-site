angular.module('hypercube.auth')

.factory('AuthService', ['$q', '$http', '$log', '$sessionStorage','$rootScope', 'Session', 'AUTH_EVENTS', 'USER_ROLES', 'ENV', function ($q, $http, $log, $sessionStorage, $rootScope, Session, AUTH_EVENTS, USER_ROLES, ENV) {
	return {
		isAuthenticated : function (){
			return Session.exists();
		},
		isAuthorized: function (authorizedRoles){
			// $log.log('Authorized roles:', authorizedRoles);
			 if (!angular.isArray(authorizedRoles)) {
	      authorizedRoles = [authorizedRoles];
	    }
	    // $log.log('[isAuthorized()] Role: '+ Session.getRole() +' Is allowed:', authorizedRoles.indexOf(Session.getRole()) !== -1);
	    return (this.isAuthenticated() && authorizedRoles.indexOf(Session.getRole()) !== -1);
		},
		getCurrentUser:function (){
			var deferred = $q.defer();
			if($rootScope.currentUser){
				deferred.resolve($rootScope.currentUser);
			} else if(Session.exists()){
				$http.get(ENV.serverUrl + '/user')
				.then(function (successRes){
					// $log.log('currentUser response:', successRes);
					if(successRes.status == 401){
						$rootScope.currentUser = null;
						Session.destroy();
						deferred.reject();
					} else {
						$rootScope.currentUser = successRes.data;
						deferred.resolve($rootScope.currentUser);
					}
				}).catch(function (errRes){
					$log.error('Error in requesting user:', errRes);
					deferred.reject(errRes.data);
				});
			} else {
				$log.info('No token found');
				deferred.reject();
			}
			return deferred.promise;
		},
		signup:function (signupData){
			var deferred = $q.defer();
			$log.log('signup called with:', signupData);
			var self = this;
			//TODO: Check confirm
			$http.post(ENV.serverUrl + '/signup', {
	      username:signupData.username,
	      email: signupData.email,
	      password: signupData.password,
	      name:signupData.name,
	      title:signupData.title || "Alpha User",
	      role:'user'
	    })
	    .then(function (successRes){
	    	// $log.log('[AuthService.signup()]: Signup successful:', successRes.data);
	    	//Login with new user
	    	self.login({username:successRes.data.username, password:signupData.password}).then(function (newUser){
					$log.info('[AuthService.signup()] New user logged in successfully:', newUser);
	    		deferred.resolve(successRes.data);
	    	}, function (err){
					$log.error('[AuthService.signup()] Error Logging in as new user:', err);
	    		deferred.reject(err);
	    	});
	    })
	    .catch(function (apiResponse) {
	      $log.error('[AuthService.signup()] Error signing up:', apiResponse);
	      deferred.reject(apiResponse.data);
	      // TODO: Handle Invalid username / password combination.
	    });
	    return deferred.promise;
		},
		login:function (loginData){
			var deferred = $q.defer();
			var self = this;
			// $log.log('[AuthService.login()] Login called with:', loginData);
			//TODO: Login with username or email
			$http.put(ENV.serverUrl + '/login', {
	      username: loginData.username,
	      password: loginData.password
	    })
	    .then(function (successRes){
	    	$log.log('[AuthService.login()] Login successful:', successRes);
	    	Session.create(successRes.data.token);
	    	$rootScope.currentUser = successRes.data.user;
	    	$rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
	    	deferred.resolve($rootScope.currentUser);
	    })
	    .catch(function (errRes) {
	      $log.error('Error logging in:', errRes);
	    	$rootScope.$broadcast(AUTH_EVENTS.loginFailed);
	      if (errRes.status === 401) {
    			$log.error('invalid email/password combo', errRes);
      	}
	      deferred.reject(errRes.data);
	    });
	    return deferred.promise;
		},
		logout:function (){
			$log.log('user service: logout called');
			var deferred = $q.defer();
			$http.put(ENV.serverUrl + '/logout').then(function(){
				Session.destroy();
				$rootScope.currentUser = null;
				$rootScope.$broadcast(AUTH_EVENTS.logoutSuccess);
				deferred.resolve(null);
			}, function(err){
				$log.error('Error logging out:', err);
				deferred.reject(err);
			});
			return deferred.promise;
		},
		updateAccount:function (userId, userData){
			var deferred = $q.defer();
			$log.log('Updating user with id: ' + userId, userData);
			//TODO: Get User id from token
			$http.put(ENV.serverUrl + '/user/'+ userId, userData)
			.then(function (updateRes){
				$log.log('Profile update responded:', updateRes.data);
				$rootScope.currentUser = updateRes.data;
				deferred.resolve(updateRes.data);
			})
			.catch(function (errRes){
				//TODO: Handle different error response codes
				$log.error('Error loading user', errRes.data);
				deferred.reject(errRes.data);
			});
			return deferred.promise;
		}
	};
}])
.factory('AuthResolver', function ($q, $rootScope, $state) {
  return {
    resolve: function () {
      var deferred = $q.defer();
      var unwatch = $rootScope.$watch('currentUser', function (currentUser) {
        if (angular.isDefined(currentUser)) {
          if (currentUser) {
            deferred.resolve(currentUser);
          } else {
            deferred.reject();
            $state.go('login');
          }
          unwatch();
        }
      });
      return deferred.promise;
    }
  };
});