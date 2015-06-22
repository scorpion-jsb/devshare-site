var _ = require('underscore'),
assets = require('../assets');

exports.buildScriptTags = function (env){
  if(!env){
    var env = "local";
  }
  var vendorScripts = scriptAssets("prod", "vendor");
  var appScripts = scriptAssets("prod", "app");
  return vendorScripts.concat(appScripts);
};
exports.buildStyleTags = function (env){
  if(!env){
    var env = "local";
  }
  return styleAssets(env, "style");
};
function scriptAssets(env, name){
  if (env && env === 'local') {
    var scriptTags = assets[name].map(function (url) {
      return '<script src="/' + url + '"></script>';
    });
    return scriptTags.join("\n");
  } else {
    var path = name + '.js';
    return '\n<script src="' + path + '"></script>';
  }
}
function styleAssets(env, name){
  if (env && env === 'local') {
    var scriptTags = assets[name].map(function (url) {
      return '<link rel="stylesheet" href="' + url + '"></link>';
    });
    return scriptTags.join("\n");
  } else {
    var path = name + '.css';
    return '\n<link rel="stylesheet" href="' + path + '"></link>';
  }
}