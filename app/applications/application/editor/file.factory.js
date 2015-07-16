angular.module('hypercube.application.editor')

//File Object 
.factory('File', ['$firebaseObject', '$firebaseUtils', function ($firebaseObject, $firebaseUtils){
  function File(snap){
    //Check that snap is a snapshot
    if(_.isFunction(snap.val)){ //Snap is a snapshot
      angular.extend(this, snap.val()); //Add current value from Firebase
      _.extend(this, $firebaseObject(snap.ref())); //Add firebaseObject functionality
      // this.$id = snap.key();
      if(this.type == 'folder' && !this.children){ //Fill children parameter if folder without children
        this.children = ['mock child'];
      }
      this.makeKey();
    } else { //Snap is not a snapshot
      angular.extend(this, snap);
    }
    if(!this.type){
      this.type = "file";
    }
    // this.setDefaults(snap);
  }
  File.prototype = {
    setDefaults: function(snapshot) {
      var oldData = angular.extend({}, this.data);
      // add a parsed date to our widget
      // this._date = new Date(this.data.date);
      if(!this.filetype){
        this.filetype = "javascript";
      }
    },
    getExt:function(path){
      var re = /(?:\.([^.]+))?$/;
      var fileName = _.last(this.path.split("/")) || path;
      console.warn('Get ext calling with: ' + re.exec(fileName)[1]);
      return re.exec(fileName)[1];
    },
    getTypes:function(){
      this.contentType = extToContentType(this.getExt());
      this.fileType = extToFileType(this.getExt());
    },
    makeKey:function(){
      console.log('makeKey called with:', this);
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
    }
  };
  return File;
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
}])