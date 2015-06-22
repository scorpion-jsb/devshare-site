angular.module('hypercube', [
    'ui.router', 
    'ngMaterial', 
    'ngStorage', 
    'angular-jwt',
    'ui.ace',

    'hypercube.auth',
    'hypercube.const',

    'hypercube.nav',

    'hypercube.account',
    'hypercube.home',
    'hypercube.applications',
    'hypercube.application'

  ])

.directive('stopEvent', function () {
  return {
    restrict: 'A',
    link: function (scope, element, attr) {
      element.bind('mouseover', function (e){
        e.stopPropagation();
      })
      element.bind('click', function (e) {
        e.stopPropagation();
      });
    }
  };
 });
angular.module('hypercube')
// Whitelist Urls

.config(["$stateProvider", "$urlRouterProvider", "$mdThemingProvider", "USER_ROLES", function($stateProvider, $urlRouterProvider, $mdThemingProvider, USER_ROLES) {
  $stateProvider

    .state('nav', {
      abstract:true,
      views:{
        'topnav':{
          templateUrl:'components/nav/topnav.html',
          controller:'NavCtrl'
        },
        'main':{
          template:'<ui-view></ui-view>'
        }
      }
    })
    .state('home', {
      parent:'nav',
      url:'/',
      templateUrl:'home/home.html',
      controller:'HomeCtrl'
    })
    .state('apps', {
      parent:'nav',
      url:'/apps',
      authorizedRoles:[USER_ROLES.admin, USER_ROLES.editor, USER_ROLES.user],
      templateUrl:'applications/applications.html',
      controller:'ApplicationsCtrl'
    })
    .state('app', {
      parent:'nav',
      abstract:true,
      url:'/apps/:name',
      authorizedRoles:[USER_ROLES.admin, USER_ROLES.editor, USER_ROLES.user],
      templateUrl:'components/nav/sidenav-layout.html',
      controller:'ApplicationCtrl'
    })
    .state('app.settings', {
      url:'/settings',
      templateUrl:'applications/application/settings/settings.html',
      controller:'SettingsCtrl'
    })
    .state('app.editor', {
      url:'/editor',
      templateUrl:'applications/application/editor/editor.html',
      controller:'EditorCtrl'
    })
    .state('app.preview', {
      url:'/preview',
      templateUrl:'applications/application/preview/preview.html',
      controller:'PreviewCtrl'
    })
    .state('signup', {
      parent:'nav',
      url:'/signup',
      templateUrl:'account/account-signup.html',
      controller:'AccountCtrl'
    })
    .state('login', {
      parent:'nav',
      url:'/login',
      templateUrl:'account/account-login.html',
      controller:'AccountCtrl'
    })
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/');
}])
angular.module('hypercube')
.config(["$mdThemingProvider", function($mdThemingProvider) {
  $mdThemingProvider.theme('default')
    .primaryPalette('blue')
    .accentPalette('pink')
  $mdThemingProvider.theme('docs-dark', 'default').dark();
}])
angular.module("hypercube.const", [])

.constant("VERSION", "0.0.0")

.constant("DB_URL", "http://localhost:4000")

;
angular.module('hypercube')

  .controller('AppCtrl', ['$scope', '$state', '$mdToast', 'AuthService',  function ($scope, $state, $mdToast, AuthService) {
    $scope.toastPosition = {
      left: false,
      right: true,
      bottom: true,
      top: false
    };
    
  	$scope.getToastPosition = function () {
      return Object.keys($scope.toastPosition).filter(function (pos) { return $scope.toastPosition[pos]; }).join(' ');
    };
    $scope.showToast = function (toastMessage) {
      $mdToast.show(
      	$mdToast.simple().content(toastMessage)
        .position($scope.getToastPosition())
        .hideDelay(3000)
      );
    };

  }]);
angular.module('hypercube.auth', ['ui.router','angular-jwt', 'ngStorage', 'hypercube.const'])
.constant('AUTH_EVENTS', {
  loginSuccess: 'auth-login-success',
  loginFailed: 'auth-login-failed',
  logoutSuccess: 'auth-logout-success',
  sessionTimeout: 'auth-session-timeout',
  notAuthenticated: 'auth-not-authenticated',
  notAuthorized: 'auth-not-authorized'
})
//String match for each role
.constant('USER_ROLES', {
  all: '*',
  admin: 'admin',
  editor: 'editor',
  user:'user',
  guest: 'guest'
})
angular.module('hypercube.auth')

.factory('AuthService', ['$q', '$http', '$log', '$sessionStorage','$rootScope', 'Session', 'AUTH_EVENTS', 'USER_ROLES', 'DB_URL', function ($q, $http, $log, $sessionStorage, $rootScope, Session, AUTH_EVENTS, USER_ROLES, DB_URL) {
	return {
		isAuthenticated : function (){
			return Session.exists();
		},
		isAuthorized: function (authorizedRoles){
			$log.log('Authorized roles:', authorizedRoles);
			 if (!angular.isArray(authorizedRoles)) {
	      authorizedRoles = [authorizedRoles];
	    }
	    $log.info('[isAuthorized()] Role: '+ Session.getRole() +' Is allowed:', authorizedRoles.indexOf(Session.getRole()) !== -1);
	    return (this.isAuthenticated() && authorizedRoles.indexOf(Session.getRole()) !== -1);
		},
		getCurrentUser:function (){
			var deferred = $q.defer();
			if($rootScope.currentUser){
				deferred.resolve($rootScope.currentUser);
			} else if(Session.exists()){
				$http.get(DB_URL + '/user')
				.then(function (successRes){
					console.log('currentUser response:', successRes);
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
			console.log('signup called with:', signupData);
			var self = this;
			//TODO: Check confirm
			console.log('calling to:', DB_URL + '/signup');
			$http.post(DB_URL + '/signup', {
	      username:signupData.username,
	      email: signupData.email,
	      password: signupData.password,
	      name:signupData.name,
	      title:signupData.title
	    })
	    .then(function (successRes){
	    	$log.log('[AuthService.signup()]: Signup successful:', successRes.data);
	    	//Login with new user
	    	$log.log('[AuthService.signup()]: Logging in as new user');
	    	self.login({username:successRes.data.username, password:signupData.password}).then(function(){
					$log.info('New user logged in successfully:', err);
	    		deferred.resolve(successRes.data);
	    	}, function(err){
					$log.error('Error Logging in as new user:', err);
	    		deferred.reject(err);
	    	})
	    })
	    .catch(function (apiResponse) {
	      console.error('AuthService: Error signing up:', apiResponse);
	      deferred.reject(apiResponse.data);
	      // TODO: Handle Invalid username / password combination.
	    });
	    return deferred.promise;
		},
		login:function (loginData){
			var deferred = $q.defer();
			var self = this;
			$log.log('[AuthService.login()] Login called with:', loginData);
			//TODO: Login with username or email
			console.log("Login url:", DB_URL + '/login');
			$http.put(DB_URL + '/login', {
	      username: loginData.username,
	      password: loginData.password
	    })
	    .then(function (successRes){
	    	$log.log('[AuthService.login()] Login response:', successRes);
	    	Session.create(successRes.data.token);
	    	$rootScope.currentUser = successRes.data.user;
	    	$rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
	    	deferred.resolve($rootScope.currentUser);
	    })
	    .catch(function (errRes) {
	      console.error('Error logging in:', errRes);
	    	$rootScope.$broadcast(AUTH_EVENTS.loginFailed);
	      if (errRes.status === 209) {
    			console.error('invalid email/password combo', errRes);
      	}
	      deferred.reject(errRes.data);
	    });
	    return deferred.promise;
		},
		logout:function (){
			console.log('user service: logout called');
			var deferred = $q.defer();
			$http.put(DB_URL + '/logout').then(function(){
				Session.destroy();
				$rootScope.currentUser = null;
				$rootScope.$broadcast(AUTH_EVENTS.logoutSuccess);
				deferred.resolve(null);
			}, function(err){
				console.error('Error logging out:', err);
				deferred.reject(err);
			});
			return deferred.promise;
		},
		updateProfile:function (userId, userData){
			var deferred = $q.defer();
			console.log('Updating user with id: ' + userId, userData);
			//TODO: Get User id from token
			$http.put(DB_URL + '/user/'+ userId, userData)
			.then(function (updateRes){
				console.log('Profile update responded:', updateRes.data);
				deferred.resolve(updateRes.data);
			})
			.catch(function (errRes){
				//TODO: Handle different error response codes
				console.error('Error loading user', errRes.data);
				deferred.reject(errRes.data);
			});
			return deferred.promise;
		}
	};
}])
.factory('AuthResolver', ["$q", "$rootScope", "$state", function ($q, $rootScope, $state) {
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
}]);
angular.module('hypercube.auth')
//Enable Auth Interceptor
.config(["$httpProvider", function ($httpProvider) {
  $httpProvider.interceptors.push([
    '$injector',
    function ($injector) {
      return $injector.get('AuthInterceptor');
    }
  ]);
}])
//Stop route changes that are not authorized and emit auth events
.run(["$rootScope", "$state", "AUTH_EVENTS", "AuthService", function ($rootScope, $state, AUTH_EVENTS, AuthService) {
  //Set current user
  AuthService.getCurrentUser(function(){
    console.log('current user set:', $rootScope.currentUser);
  });
  //Set route change listener to stop naviation for unauthroized roles and emit auth events
  $rootScope.$on('$stateChangeStart', function (event, next) {
    if(next.authorizedRoles){
      var authorizedRoles = next.authorizedRoles;
        if (!AuthService.isAuthorized(authorizedRoles)) {
        event.preventDefault();
        if (AuthService.isAuthenticated()) {
          // user's role is not within authorized roles
          console.warn('User not allowed');
          $rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
          $state.go('login');
        } else {
          // user is not logged in
          console.warn('User not logged in');
          $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
          $state.go('login');
        }
      }
    }
  });

}])
//Intercept $http requests and responses
.factory('AuthInterceptor', ["$rootScope", "$q", "AUTH_EVENTS", "Session", "$log", function ($rootScope, $q, AUTH_EVENTS, Session, $log) {
  function isHTTP(url){
    return url.search(".html") == -1
  }
  return {
    //Set auth header on request if it is available
    request: function (config) {
    	//Only if session exists or it is an outward request (not a template request)
      if (Session.exists() && isHTTP(config.url)) {
        config.headers.Authorization = "Bearer " + Session.token();
        // config.cache = true;
        $log.debug("Authorized request to: " + config.url);
      }
      return config || $q.when(config);
    },
    //Broadcast auth error events
    responseError: function (response) { 
      $rootScope.$broadcast({
        401: AUTH_EVENTS.notAuthenticated,
        403: AUTH_EVENTS.notAuthorized,
        419: AUTH_EVENTS.sessionTimeout,
        440: AUTH_EVENTS.sessionTimeout
      }[response.status], response);
      return $q.reject(response);
    }
  };
}])
angular.module('hypercube.auth')

.directive('authRoles', ['AuthService', function(AuthService) {
  return {
    restrict: 'A',  // Forces the directive to be an attribute.
    transclude: 'element',
    scope:{
    	authRoles:'@'
    },
    link: function link(scope, element, attrs) {
      scope.$watch('authRoles', function(value, oldValue) {
        if (AuthService.isAuthorized(value.split(","))) {
          element.addClass("ng-hide");
        }
      }, true);
    }
  };
}])
angular.module('hypercube.auth')
.service('Session', ['$log', '$sessionStorage', '$rootScope','jwtHelper',  function ($log, $sessionStorage, $rootScope, jwtHelper) {
  this.exists = function(){
    return angular.isDefined($sessionStorage.token);
  };
  this.getRole = function(){
    if(this.role) return this.role; //Not available if refresh has occured
    if(this.exists()){
      $log.log('[Session.getRole] decoded token:', jwtHelper.decodeToken($sessionStorage.token));
      return jwtHelper.decodeToken($sessionStorage.token).role;
    } else {
      return "guest";
    }
  };
  this.token = function(){
    return angular.isDefined($sessionStorage.token) ? $sessionStorage.token : null;
  };
  this.create = function (token) {
    $sessionStorage.token = token;
    this.tokenData = jwtHelper.decodeToken(token);
    this.role = this.tokenData.role;
    // this.id = sessionId;
  };
  this.destroy = function () {
    //TODO: Revoke token on server?
    $rootScope.currentUser = null;
    this.tokenData = null;
    this.role = "guest";
    delete $sessionStorage.token;
    // this.id = null;
  };
}]);
angular.module('hypercube.nav', ['hypercube.auth'])
angular.module('hypercube.nav')
.controller('NavCtrl', ['$rootScope', '$scope', 'AuthService', '$state', function ($rootScope, $scope, AuthService, $state){
  $scope.logout = function () {
    AuthService.logout().then(function () {
      $scope.showToast("Logout Successful");
      $state.go('home');
    }, function (err){
      console.error('Error logging out:', err);
      $state.go('home');
    });
  };
  $scope.clickTitle = function(){
  	if($rootScope.currentUser){
  		$state.go('apps');
  	} else {
  		$state.go('home');
  	}
  }
}])
angular.module('hypercube.home', [])
angular.module('hypercube.home')

.controller('HomeCtrl', ['$scope', '$log', function($scope, $log){
	$log.log('HomeCtrl');
}]);
angular.module('hypercube.account', ['ui.router', 'hypercube.auth'])
angular.module('hypercube.account')
.controller('AccountCtrl', ['$scope','AuthService', '$state', function($scope, AuthService, $state){
	
	// set-up loading state
	$scope.signupForm = {
		loading: false,
		error:null
	};
	$scope.loginForm = {
		loading: false,
		error:null
	};

	// --------------- Auth Session ----------------- //
	$scope.login = function() {
		$scope.loginForm.loading = true;
		AuthService.login($scope.loginForm)
		.then(function (authData){
			console.log('Successful login:', authData);
			$scope.loginForm.loading = false;
			$scope.showToast("Logged in");
			$state.go('apps');
		}, function (err){
			$scope.loginForm = {loading:false, email:null, password:null};
		});
	};
	$scope.logout = function(){
		AuthService.logout().then(function(){
			console.log('logout successful');
      // $scope.showToast('Successfully Logged Out');
			//TODO: Refresh page after logout
			$state.go('home');
		}, function(err){
			console.error('error logging out');
		});
	};
	$scope.signup = function(){
		AuthService.signup($scope.signupForm).then(function(){
			console.log('Signup successful');
			//TODO: Refresh page after logout
      // $scope.showToast('Successfully signed up');
			$state.go('users');
		}, function(err){
			console.error('error siging up:', err);
		});
	};
}])
angular.module('hypercube.applications', ['hypercube.const'])
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
		del:function(applicationName){
			var deferred = $q.defer();
			// $log.log('Loading application with ID:', applicationName);
			if(applicationName){
				endpointUrl =  DB_URL + "/apps/" + applicationName;
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
angular.module('hypercube')
.controller('ApplicationsCtrl', ['$scope', '$http', '$state', '$log', 'applicationsService', function($scope, $http, $state, $log, applicationsService){
		// $log.log('ApplicationsCtrl');
		$scope.data = {
			loading:true,
			error:null
		};
		applicationsService.get().then(function (applicationsList){
			$scope.data.loading = false;
			$log.log('Applications list loaded:', applicationsList);
			$scope.applications = applicationsList;
		}, function (err){
			$log.error('[ApplicationsCtrl.get()] Error loading applications', err);
			$scope.data.loading = false;
			$scope.data.error = err;
		});
		$scope.create = function(appData){
			applicationsService.add(appData).then(function(newApp){
				$log.log('Application created successfully:', newApp);
				$state.go('app.editor', {name:newApp.name});
			}, function(err){
				$log.error('[ApplicationsCtrl.create()] Error loading applications', err);
				$scope.data.loading = false;
				$scope.data.error = err;
			});
		};
		$scope.delete = function(ind){
			$scope.data.loading = true;
			var applicationName = $scope.applications[ind].name;
			applicationsService.del(applicationName).then(function(response){
				$scope.applications.splice(ind, 1);
				$log.info('application deleted successfully');
			}, function(err){
				$log.error('Error loading applications', err);
				$scope.data.loading = false;
				$scope.data.error = err;
			});
		};
}])
angular.module('hypercube.application', ['hypercube.application.editor', 'hypercube.application.settings','hypercube.application.preview'])
angular.module('hypercube.applications')
.controller('ApplicationCtrl', ['$scope', '$http', '$stateParams', 'applicationsService', function($scope, $http, $stateParams, applicationsService){
		$scope.data = {
			loading:false,
			error:null,
			editing:false
		};
		//TODO: Move to a resolve
		//Load application data based on name
		if($stateParams.name){
			$scope.data.loading = true;
			console.log('applicationName:', $stateParams.name)
			applicationsService.get($stateParams.name)
			.then(function (applicationData){
				console.log('application Detail Ctrl: application data loaded:', applicationData);
				$scope.application = applicationData;
			}).catch(function (err){
				console.error('application Detail Ctrl: Error loading application with id:' + $stateParams.name, err);
				$scope.data.error = err;
			}).finally(function(){
				$scope.data.loading = false;
			});
		} else {
			console.error('application Detail Ctrl: Invalid application id state param');
			$scope.data.error = 'application Id is required to load application data';
		}
		//TODO: Make owner select an input that searches instead of a dropdown

		$scope.update = function(){
			$scope.data.editing = false;
			$scope.data.loading = true;
			applicationsService.update($stateParams.name, $scope.application)
			.then(function (appData){
				console.log('application Detail Ctrl: application data loaded:', appData);
				// $scope.application = apiRes.data;
			}).catch(function (err){
				console.error('Error loading applications', err);
				$scope.data.error = err;
			}).finally(function(){
				$scope.data.loading = false;
			});
		};
		
}])
angular.module('hypercube.application.editor', ['ui.ace'])
angular.module('hypercube.application.editor')
.controller('EditorCtrl', ['$rootScope', '$scope', '$log', function($rootScope, $scope, $log){
	//TODO: Change file mode dynamically (editor service)
	$scope.aceLoaded = function(_editor) {
    // Options
    // _editor.setReadOnly(true);
    _editor.setTheme('ace/theme/monokai');
    _editor.getSession().setMode("ace/mode/javascript");
  };

  $scope.aceChanged = function(e) {
    //
  };
}])
angular.module('hypercube.application.settings', [])
angular.module('hypercube.application.editor')
.controller('SettingsCtrl', ['$rootScope', '$scope', '$log','$q', function($rootScope, $scope, $log, $q){
	// $scope.aceConfig = {
	//   useWrapMode : true,
	//   theme:'monokai',
	//   mode: ,
	//   onLoad: aceLoaded,
	//   onChange: aceChanged,
	//   advanced:{
	//   	enableLiveAutocompletion:true
	//   }
	// }
  //TODO: Load users for collaborators options
  // usersService.get().then(function(usersList){
  //   $log('users service loaded:', usersList);
  // }, function(err){
  //   $log.error('error getting users list');
  // });
  $scope.getPossibleUsers = function(query){
    // $log.info('getPossibleUsers called with', query);
    // return $q(function(resolve){
    // });
      return loadContacts();
      function loadContacts() {
      var contacts = [
        'Marina Augustine',
        'Oddr Sarno',
        'Nick Giannopoulos',
        'Narayana Garner',
        'Anita Gros',
        'Megan Smith',
        'Tsvetko Metzger',
        'Hector Simek',
        'Some-guy withalongalastaname'
      ];
      return contacts.map(function (c, index) {
        var cParts = c.split(' ');
        var contact = {
          name: c,
          email: cParts[0][0].toLowerCase() + '.' + cParts[1].toLowerCase() + '@example.com'
        };
        contact._lowername = contact.name.toLowerCase();
        return contact;
      });
    }
  };
	$scope.aceLoaded = function(_editor) {
    // Options
    // _editor.setReadOnly(true);
    _editor.setTheme('ace/theme/monokai');
    _editor.getSession().setMode("ace/mode/javascript");
  };

  $scope.aceChanged = function(e) {
    //
  };
  $scope.setFileType = function(){
  	return "js";
  };
  function getFileMode(argFile){
    var fileMode = 'ace/mode/';
    // [TODO] add regex for file type
    if(argFile.hasOwnProperty('filetype')){
      fileMode = fileMode + argFile.filetype;
    } else {
    	fileMode = fileMode + "javascript";
    }
    return fileMode;
  }
}])
angular.module('hypercube.application.preview', [])

angular.module('hypercube.application.preview')
.controller('PreviewCtrl', ['$scope', '$log', function($scope, $log){

}])