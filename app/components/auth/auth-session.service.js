angular.module('hypercube.auth')
.service('Session', ['$log', '$sessionStorage', '$rootScope','jwtHelper', '$q', '$aws', function ($log, $sessionStorage, $rootScope, jwtHelper, $q, $aws) {
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
  this.create = function (token, awsToken) {
    $sessionStorage.token = token;
    this.tokenData = jwtHelper.decodeToken(token);
    this.role = this.tokenData.role;
    $aws.updateConfig();
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