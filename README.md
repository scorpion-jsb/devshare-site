# Devshare Site

[![Release][release-image]][release-url]
[![Build Status][travis-image]][travis-url]
[![Dependency Status][daviddm-image]][daviddm-url]
[![License][license-image]][license-url]
[![Code Style][code-style-image]][code-style-url]

[![Gitter][gitter-image]][gitter-url]

>Customizable open-source collaborative code editor and project building tool

Runs on [devshare.js](https://github.com/KyperTech/devshare) which uses [Tessellate](http://tessellate.kyper.io) for application data management.

Visit [devshare.io](http://devshare.io) to begin sharing you development.

## Local Development

1. Clone repo: `git@github.com:KyperTech/devshare-site.git`
2. Install dependencies: `npm install`
3. Run dev server `npm start`

## Production

Use `npm run production` in place of `npm start` to start the production server instead of the hot-reloading dev server.

## Frameworks/Libraries

* [React](https://facebook.github.io/react/) - View logic
* [redux](https://github.com/rackt/redux) - State management
* [Webpack](https://webpack.github.io/) - Building/Bundling
* [Material UI](http://www.material-ui.com/#/) - Google Material styling
* [tessellate platform](https://github.com/KyperTech/tessellate) - Authentication and Application data API
* [devshare.js](https://github.com/prescottprue/devshare) - Client side library for
* [redux-devshare](https://github.com/KyperTech/redux-devshare) - Redux connector for devshare library (state management connected to auth & app data API)

[release-image]: https://img.shields.io/github/release/KyperTech/devshare-site.svg?style=flat-square
[release-url]: https://github.com/KyperTech/devshare-site/releases
[travis-image]: https://img.shields.io/travis/KyperTech/devshare-site/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/KyperTech/devshare-site
[daviddm-image]: https://img.shields.io/david/KyperTech/devshare-site.svg?style=flat-square
[daviddm-url]: https://david-dm.org/KyperTech/devshare
[license-image]: https://img.shields.io/npm/l/devshare-site.svg?style=flat-square
[license-url]: https://github.com/KyperTech/devshare-site/blob/master/LICENSE
[code-style-image]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square
[code-style-url]: http://standardjs.com/
[gitter-image]: https://img.shields.io/gitter/room/nwjs/nw.js.svg?style=flat-square
[gitter-url]: https://gitter.im/KyperTech/devshare-site
