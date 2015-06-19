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