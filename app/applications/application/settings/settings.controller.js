angular.module('hypercube.application.editor')
.controller('SettingsCtrl', ['$rootScope', '$scope', '$log','$q', 'application', function($rootScope, $scope, $log, $q, application){
  //Copy application data into scope
  console.log('application loaded:', $scope.application);
  $scope.application = _.extend({},application);
  
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

}])