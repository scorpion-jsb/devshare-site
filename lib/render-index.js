'use strict';

var fs = require('fs');
var path = require('path');
var config = require(path.resolve(__dirname, '..', 'config.json'));
var indexPath = path.resolve(__dirname, '..', 'index.html');
var indexMarkup = fs.readFileSync(indexPath).toString();

function renderIndex(options) {
  if (!options) { options = {}; }

  var appMarkup = options.dev ?
    '' :
    options.appMarkup || '';

  var appData = `<script>window.__INITIAL_STATE__ = ${JSON.stringify(options.appData)};</script>` && '';
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
      options.dev ?
        '' :
        '<script>\n'+
          `\t(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){\n` +
            `\t\t(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),\n` +
            `\t\tm=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)\n` +
          `\t})(window,document,'script','//www.google-analytics.com/analytics.js','ga');\n` +
          `\tga('create', '${gaTrackingId}', 'auto');\n` +
          `\tga('send', 'pageview')\n` +
        '</script>');
}

module.exports = renderIndex;
