angular.module('hypercube.application.editor')

//Folder Object
.factory('Folder', ['$firebaseObject', '$firebaseArray', 'File', function ($firebaseObject, $firebaseArray, File){
	function Folder(snap){
		console.warn('create folder with:', snap);
		//Check that snap is a snapshot
		if(_.isFunction(snap.val)){ //Snap is a snapshot
			angular.extend(this, snap.val()); //Add current value from Firebase
			_.extend(this,$firebaseObject(snap.ref())); //Add firebaseObject functionality
			console.warn('folder:', this);
			if(!_.has(this, 'children')){ //Fill children parameter if folder without children
				this.children = [{}];
			} else {
				this.children = $firebaseArray(snap.ref().child('children'))
				console.log('fb array:', this.children);
			}
			if(!_.has(this, 'name')){
				this.name = this.$id;
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
