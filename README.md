# Devshare Site

[![Release][release-image]][release-url]
[![Build Status][travis-image]][travis-url]
[![Dependency Status][daviddm-image]][daviddm-url]
[![License][license-image]][license-url]
[![Code Style][code-style-image]][code-style-url]

[![Gitter][gitter-image]][gitter-url]

>Customizable open-source collaborative code editor and project building tool

Visit [devshare.io](http://devshare.io) to begin sharing you development.

## Frameworks/Libraries

* [devshare.js](https://github.com/KyperTech/devshare) - Main platform functionality (Add/Remove/Update projects, Uploading/Downloading files)
* [redux-devshare](https://github.com/KyperTech/redux-devshare) - Redux connector for devshare library
* [react](https://facebook.github.io/react/) - View logic
* [redux](https://github.com/rackt/redux) - State management
* [webpack](https://webpack.github.io/) - Building/Bundling
* [material-ui](http://www.material-ui.com/#/) - Google Material styling

## Local Development

1. Clone repo: `git@github.com:KyperTech/devshare-site.git`
2. Install dependencies: `npm install`
3. Create `src/config.js`
4. Run dev server `npm start`

If everything works, you should see the following:

While developing, you will probably rely mostly on `npm start`; however, there are additional scripts at your disposal:

|`npm run <script>`|Description|
|------------------|-----------|
|`start`|Serves your app at `localhost:3000`. HMR will be enabled in development.|
|`compile`|Compiles the application to disk (`~/dist` by default).|
|`dev`|Same as `npm start`, but enables nodemon for the server as well.|
|`dev:no-debug`|Same as `npm run dev` but disables devtool instrumentation.|
|`test`|Runs unit tests with Karma and generates a coverage report.|
|`test:dev`|Runs Karma and watches for changes to re-run tests; does not generate coverage reports.|
|`build`|Runs linter, tests, and then, on success, compiles your application to disk.|
|`build:dev`|Same as `build` but overrides `NODE_ENV` to "development".|
|`build:prod`|Same as `build` but overrides `NODE_ENV` to "production".|
|`lint`|Lint all `.js` files.|
|`lint:fix`|Lint and fix all `.js` files. [Read more on this](http://eslint.org/docs/user-guide/command-line-interface.html#fix).|


## Application Structure

The application structure presented in this boilerplate is **fractal**, where functionality is grouped primarily by feature rather than file type. Please note, however, that this structure is only meant to serve as a guide, it is by no means prescriptive. That said, it aims to represent generally accepted guidelines and patterns for building scalable applications. If you wish to read more about this pattern, please check out this [awesome writeup](https://github.com/davezuko/react-redux-starter-kit/wiki/Fractal-Project-Structure) by [Justin Greenberg](https://github.com/justingreenberg).

```
.
├── bin                      # Build/Start scripts
├── blueprints               # Blueprint files for redux-cli
├── build                    # All build-related configuration
│   └── webpack              # Environment-specific configuration files for webpack
├── config                   # Project configuration settings
├── server                   # Koa application (uses webpack middleware)
│   └── main.js              # Server application entry point
├── src                      # Application source code
│   ├── index.html           # Main HTML page container for app
│   ├── main.js              # Application bootstrap and rendering
│   ├── components           # Reusable Presentational Components
│   ├── containers           # Reusable Container Components
│   ├── layouts              # Components that dictate major page structure
│   ├── modules              # reducer, action, creators not part of a route
│   ├── routes               # Main route definitions and async split points
│   │   ├── index.js         # Bootstrap main application routes with store
│   │   └── Home             # Fractal route
│   │       ├── index.js     # Route definitions and async split points
│   │       ├── assets       # Assets required to render components
│   │       ├── components   # Presentational React Components
│   │       ├── container    # Connect components to actions and store
│   │       ├── modules **    # Collections of reducers/constants/actions
│   │       └── routes **    # Fractal sub-routes (** optional)
│   ├── static               # Static assets (not imported anywhere in source code)
│   ├── store                # Redux-specific pieces
│   │   ├── createStore.js   # Create and instrument redux store
│   │   └── reducers.js      # Reducer registry and injection
│   └── styles               # Application-wide styles
└── tests                    # Unit tests
```

## Thanks

Special thanks to @davezuko for creating [react-redux-starter-kit](https://github.com/davezuko/react-redux-starter-kit) which was a huge inspiration

[release-image]: https://img.shields.io/github/release/KyperTech/devshare-site.svg?style=flat-square
[release-url]: https://github.com/KyperTech/devshare-site/releases
[travis-image]: https://img.shields.io/travis/prescottprue/devshare-site/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/prescottprue/devshare-site
[daviddm-image]: https://img.shields.io/david/KyperTech/devshare-site.svg?style=flat-square
[daviddm-url]: https://david-dm.org/KyperTech/devshare-site
[license-image]: https://img.shields.io/npm/l/devshare-site.svg?style=flat-square
[license-url]: https://github.com/KyperTech/devshare-site/blob/master/LICENSE
[code-style-image]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square
[code-style-url]: http://standardjs.com/
[gitter-image]: https://img.shields.io/gitter/room/nwjs/nw.js.svg?style=flat-square
[gitter-url]: https://gitter.im/KyperTech/devshare-site
