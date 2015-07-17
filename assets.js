module.exports = {
		// 'bower/firepad/dist/firepad.css',

	styles:[
		'bower/angular-material/angular-material.min.css',
		'bower/font-awesome/css/font-awesome.min.css',
		// 'bower/angular-tree-control/css/tree-control.css', //Moved to template due to image references
		'bower/devices.css/assets/devices.min.css',
		'app.css',
		'components/nav/nav.css',
		'applications/applications.css',
		'applications/application/editor/editor.css'
	],
	vendor: [
		'bower/ace-builds/src-min-noconflict/ace.js',
		'bower/angular/angular.js',
		'bower/angular-animate/angular-animate.js',
		'bower/angular-aria/angular-aria.min.js',
		'bower/ui-router/release/angular-ui-router.min.js',
		'bower/angular-material/angular-material.min.js',
		'bower/angular-jwt/dist/angular-jwt.min.js',
		'bower/ngstorage/ngStorage.min.js',
		'bower/underscore/underscore-min.js',
		'bower/angular-ui-ace/ui-ace.js',
		'bower/aws-sdk-js/dist/aws-sdk.min.js',
		'bower/firebase/firebase.js',
		'bower/angularfire/dist/angularfire.js',
		'bower/firepad/dist/firepad.min.js',
		'bower/aws-sdk-js/dist/aws-sdk.js',
		'bower/angular-tree-control/angular-tree-control.js'
	],
	app: [
		'app.js',
		'app-routes.js',
		'app-theme.js',
		'app-const.js',
		'app.controller.js',

		'components/auth/auth.module.js',
		'components/auth/auth.service.js',
		'components/auth/auth.config.js',
		'components/auth/auth.directive.js',
		'components/auth/auth-session.service.js',
		'components/firebase.utils/firebase.utils.js',


		'components/nav/nav.module.js',
		'components/nav/nav.controller.js',

		'components/aws/aws.module.js',

		'home/home.module.js',
		'home/home.controller.js',

		'account/account.module.js',
		'account/account.controller.js',

		'applications/applications.module.js',
		'applications/applications.service.js',
		'applications/applications.controller.js',

		'applications/application/application.module.js',
		'applications/application/application.controller.js',

		'applications/application/editor/editor.module.js',
		'applications/application/editor/editor.controller.js',
		'applications/application/editor/editor.service.js',
		'applications/application/editor/files.factory.js',
		'applications/application/editor/file.factory.js',
		'applications/application/editor/folder.factory.js',


		'applications/application/settings/settings.module.js',
		'applications/application/settings/settings.controller.js',

		'applications/application/preview/preview.module.js',
		'applications/application/preview/preview.controller.js',

	]
};
