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