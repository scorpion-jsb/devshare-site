angular.module('hypercube.application.editor')

//File Object 
.factory('File', ['$firebaseObject', '$firebaseUtils', 'fbutil', '$q', '$log', function ($firebaseObject, $firebaseUtils, fbutil, $q, $log){
  function File(snap){
    //Check that snap is a snapshot
    if(_.isFunction(snap.val)){ //Snap is a snapshot
      angular.extend(this, snap.val()); //Add current value from Firebase
      _.extend(this, $firebaseObject(snap.ref())); //Add firebaseObject functionality
      // this.$id = snap.key();
      if(this.type == 'folder' && !this.children){ //Fill children parameter if folder without children
        this.children = ['mock child'];
      }
    } else { //Snap is not a snapshot
      angular.extend(this, snap);
    }
    if(!this.type){
      this.type = "file";
    }
    if(!_.has(this, 'name')){
      this.getName();
    }
    this.getTypes();
    // this.setDefaults(snap);
  }
  File.prototype = {
    //Get extension based on path
    getExt:function(path){
      var re = /(?:\.([^.]+))?$/;
      var fileName = _.last(this.path.split("/")) || path;
      $log.info('[File.getExt()]: Get ext calling with: ' + re.exec(fileName)[1]);
      return re.exec(fileName)[1];
    },
    //Get fileType and contentType based on ext
    getTypes:function(){
      var ext = this.getExt();
      this.contentType = extToContentType(ext);
      this.fileType = extToFileType(ext);
    },
    getName:function(){
      this.name = _.last(this.path.split("/"));
    },
    //Create a string that is usable as a Firebase key
    makeKey:function(){
      // TODO: Handle more than one period
      $log.log('[File.MakeKey] called with:', this);
      if(_.has(this, 'name')){
        var name = this.name;
        return name.replace(".", ":");
      } else if(_.has(this, 'path')){
        var pathArray = this.path.split("/");
        var name = _.last(pathArray);
        this.name = name;
        return name.replace(".", ":");
      }
    },
    makeRef:function(appRef){
      //TODO: Create ref based on path
      //folder/index.html
      var pathArray = this.path.split("/");
      console.log('pathArray:', pathArray);
      var self = this;
      if(pathArray.length == 1){
        return appRef.child(self.makeKey());
      } else {
        var finalRef = appRef;
        console.log('appRef:', appRef);
        _.each(pathArray, function (loc, ind, list){
          //TODO: Handle more than one period here
          if(ind != list.length - 1){
            finalRef = finalRef.child(loc).child('children');
          } else {
            finalRef = finalRef.child(loc.replace(".", ":"));
          }
        });
        console.log('finalRef:', finalRef);
        return finalRef;
      }
    },
    //Make File a Firebase object and combine its current data with data in Firebase
    addFbObj:function(appName){
      var ref = fbutil.ref(filesLocation, appName);
      //Make file a Firebase object
      var self = this;
      var fbSelf = _.extend({}, $firebaseObject(this.makeRef()));
      var d = $q.defer();
      fbSelf.$loaded().then(function(){
        //Set by key within structure
        fbSelf.$value = _.clone(self);
        //Save current value into fb object
        fbSelf.$save().then(function(){
          d.resolve();
        }, function (err){
          $log.log('Error adding files:', err);
          d.reject(err);
        });
      }, function (err){
        $log.log('Error adding files:', err);
        d.reject(err);
      });
      return d.promise;
    }
  };
  return File;

}])

  //Utility functions
  //Convert File extension to contentType
  function extToContentType(ext){
    //Default content type
    var contentType = 'text/plain';
    //File type if statements
    if (ext=='html') {
      contentType = 'text/html'
    } else if(ext=='js') {
      contentType = 'application/javascript'
    } else if(ext=='css') {
      contentType = 'text/css'
    } else if(ext=='json') {
      contentType = 'application/json'
    } else if(ext=='jpg'||ext=='jpeg'||ext=='jpe') {
      contentType = 'image/jpeg'
    } else if(ext=='png') {
      contentType = 'image/png'
    } else if(ext=='gif') {
      contentType = 'image/gif'
    } else if(ext=='svg') {
      contentType = 'image/svg+xml'
    } else {
      contentType = 'application/octet-stream'
    }
    console.log("Ext: " + ext + "Content Type: " + contentType);
    return contentType;
  }
  function extToFileType(ext){
    //Default content type
    console.log("Ext: " + ext + "File Type: " + extToContentType(ext).split("/")[1]);
    return extToContentType(ext).split("/")[1];
  }