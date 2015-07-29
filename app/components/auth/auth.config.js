angular.module('hypercube.auth')
//Enable Auth Interceptor
.config(function ($httpProvider) {
  $httpProvider.interceptors.push([
    '$injector',
    function ($injector) {
      return $injector.get('AuthInterceptor');
    }
  ]);
})
//Stop route changes that are not authorized and emit auth events
.run(function ($rootScope, $state, AUTH_EVENTS, AuthService, $log) {
  //Set current user
  AuthService.getCurrentUser(function(){
    $log.info('Current user set:', $rootScope.currentUser);
  });
  //Set route change listener to stop naviation for unauthroized roles and emit auth events
  $rootScope.$on('$stateChangeStart', function (event, next) {
    if(next.authorizedRoles){
      var authorizedRoles = next.authorizedRoles;
        if (!AuthService.isAuthorized(authorizedRoles)) {
        event.preventDefault();
        if (AuthService.isAuthenticated()) {
          // user's role is not within authorized roles
          $log.warn('User not allowed');
          $rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
          $state.go('login');
        } else {
          // user is not logged in
          $log.warn('User not logged in');
          $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
          $state.go('login');
        }
      }
    }
  });

})
//Intercept $http requests and responses
.factory('AuthInterceptor', function ($rootScope, $q, AUTH_EVENTS, Session, $log) {
  function isHTTP(url){
    if(url){
      return url.search(".html") == -1
    } else {
      return true;
    }
  }
  return {
    //Set auth header on request if it is available
    request: function (config) {
    	//Only if session exists or it is an outward request (not a template request)
      if (Session.exists() && isHTTP(config.url)) {
        config.headers.Authorization = "Bearer " + Session.token();
        // config.cache = true;
        // $log.debug("Authorized request to: " + config.url);
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
      //Let 401 through
      // if(response.status == 401){
      //   return $q.resolve(response);
      // }
      if(response.status == 0){
        console.warn('status is 0')
        $q.reject({message:'Server Error'});
      }
      return $q.reject(response);
    }
  };
})
