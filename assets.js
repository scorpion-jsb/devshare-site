module.exports = {
	style:[
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
		'bower/angular-ui-ace/ui-ace.js'
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

		'components/nav/nav.module.js',
		'components/nav/nav.controller.js',

		'home/home.module.js',
		'home/home.controller.js',

		'account/account.module.js',
		'account/account.controller.js',

		'applications/applications.module.js',
		'applications/applications.service.js',
		'applications/applications.controller.js',
		'applications/application.controller.js',

		'applications/application/application.module.js',
		'applications/application/application.controller.js',

		'applications/application/editor/editor.module.js',
		'applications/application/editor/editor.controller.js',
		'applications/application/editor/editor.service.js',

		'applications/application/settings/settings.module.js',
		'applications/application/settings/settings.controller.js',

		'applications/application/preview/preview.module.js',
		'applications/application/preview/preview.controller.js',

	]
};
