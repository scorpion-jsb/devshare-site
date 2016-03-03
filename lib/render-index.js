'use strict';

var fs = require('fs')
var path = require('path')
var config = require(path.resolve(__dirname, '..', 'config.json'))
var indexPath = path.resolve(__dirname, '..', 'index.html')
var indexMarkup = fs.readFileSync(indexPath).toString()

function renderIndex (options) {
  if (!options) { options = {} }

  var appMarkup = options.dev ?
    '' :
    options.appMarkup || ''

  var appData = options.dev ? '' : `<script>window.__INITIAL_STATE__ = ${JSON.stringify(options.appData)};</script>`
  return indexMarkup
    .replace('<!-- app -->', appMarkup)
    .replace('<!-- app-data -->', appData)
    .replace(
      '<!-- script -->',
      options.dev ?
        '<script src="/assets/bundle.js"></script>' :
        '<script src="/assets/bundle.' + options.hash + '.js"></script>')
    .replace(
      '<!-- style -->',
      options.dev ?
        '' :
        '<link rel="stylesheet" href="/assets/style.' + options.hash + '.css" />')
    .replace('<!-- analytics -->',
      options.dev
      ? ''
      : '<!-- Google Analytics -->' +
      `<script>\n` +
        `window.ga=window.ga||function(){(ga.q=ga.q||[]).push(arguments)};ga.l=+new Date;\n` +
        `ga('create', '${config.gaTrackingId}', 'auto');\n` +
        `ga('send', 'pageview');\n` +
      `</script>\n` +
      `<script async src='//www.google-analytics.com/analytics.js'></script>\n` +
      '<!-- End Google Analytics -->\n'
    )
}

module.exports = renderIndex
