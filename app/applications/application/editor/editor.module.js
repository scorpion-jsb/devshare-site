angular.module('hypercube.application.editor', [
	'firebase',
	'firebase.utils',
	'ui.ace',
	'treeControl',
	'hypercube.const',
	'hypercube.auth',
	'hypercube.aws'
])

.constant('FILES_LOCATION', 'appFiles');
