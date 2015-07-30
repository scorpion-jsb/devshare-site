angular.module('hypercube', [
    'ui.router', 
    'ngMaterial', 
    'ngStorage', 
    'angular-jwt',

    'hypercube.auth',
    'hypercube.const',

    'hypercube.nav',

    'hypercube.account',
    'hypercube.home',
    'hypercube.applications',
    'hypercube.application',
    'hypercube.templates'
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
 })
//Set environment based on host
.service('ENV', ['$location', 'CONST', '$window', function ($location, CONST, $window){
  //TODO: Check for other environments as well (staging)
  console.log('host from window:', $window.location.host.split(":")[0])
  if($location.host() == "localhost"){
    return {serverUrl:CONST.local.SERVER_URL, fbUrl:CONST.local.FB_URL, logging:true};
  } else {
    return {serverUrl:CONST.production.SERVER_URL, fbUrl:CONST.production.FB_URL, logging:false};
  }
}])
.config(['$provide', function ($provide) {
  $provide.decorator('$log', ['$delegate', '$window', function ($delegate, $window){
    // Keep track of the original debug method, we'll need it later.
    var origDebug = $delegate.debug;
    var origLog = $delegate.log;
    var origError = $delegate.error;

    /*
     * Intercept the call to $log.debug() so we can add on 
     * our enhancement. We're going to add on a date and 
     * time stamp to the message that will be logged.
     */
     //Not local development
     if($window.location.host.split(":")[0] != "localhost"){
      //Replace all functions with noop
      $delegate.log = angular.noop;
      $delegate.info = angular.noop;
      $delegate.debug = angular.noop;
      $delegate.warn = angular.noop;
      // $delegate.error = angular.noop;
      $delegate.error = function () {
        //Pass this to trackjs
        var args = [].slice.call(arguments);
        //Handle argument not being a string
        var mappedArgs = _.map(args, function(arg){
          if(_.isObject(arg) || !_.isString(arg)){
            return JSON.stringify(arg, null, 2);
          }
          return arg;
        });
        $window.trackJs.console.error.apply(null, mappedArgs);
      };
     } else {
      //Local 
      // $delegate.debug = function () {
      //   var args = [].slice.call(arguments);
      //   args[0] = [new Date().toString(), ': ', args[0]].join('');
        
      //   // Send on our enhanced message to the original debug method.
      //   origDebug.apply(null, args);
      // };

      };
      return $delegate;
     }]);
  $provide.decorator('$exceptionHandler', ["$delegate", "$window", function ($delegate, $window) {
    return function (exception, cause) {
      console.log('$window.location:', $window.location.host);
      if($window.location.host.split(":")[0] != "localhost") {
        console.warn('exception:', exception, cause);
        if($window.trackJs){
          $window.trackJs.track(exception);
        }
      }
      //Running locally
      else {
        console.log('exception:', exception, cause);

        $delegate(exception, cause);
      } 
    }; 
  }]); 
}]);
