angular.module('hypercube.application.editor')

//Folder Object
.factory('Folder', ['$firebaseObject', '$firebaseArray', 'File', function ($firebaseObject, $firebaseArray, File){
	function Folder(snap){
		//Check that snap is a snapshot
		if(_.isFunction(snap.val)){ //Snap is a snapshot
			angular.extend(this, snap.val()); //Add current folder info from Firebase
			_.extend(this,$firebaseArray(snap.ref())); //Add firebaseObject functionality
			//Handle children not existing
			if(!_.has(this, 'children')){
				this.children = [{}];
			} else {
				this.children = $firebaseArray(snap.ref().child('children'));
				// console.log('fb array:', this.children);
			}
			//Handle name not existing
			if(_.isFunction(this.key)){ //Use snap.key() for name
				this.name = this.key();
			} 
		} else { //Snap is not a snapshot
			_.extend(this, snap);
		}
		if(!_.has(this, 'type')){
			this.type = "folder";
		}
	}
	Folder.prototype = {
	};
	return Folder;
}]);
