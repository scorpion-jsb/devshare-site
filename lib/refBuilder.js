var _ = require('underscore'),
assets = require('../assets');

exports.buildScriptTags = function (env){
  if(!env){
    var env = "local";
  }
  var vendorScripts = scriptAssets(env, "vendor");
  var appScripts = scriptAssets(env, "app");
  return vendorScripts.concat(appScripts);
};
exports.buildStyleTags = function (env){
  if(!env){
    var env = "local";
  }
  return styleAssets(env, "styles");
};
function scriptAssets(env, name){
  if (env && env === 'local') {
    var scriptTags = assets[name].map(function (url) {
      return '<script src="/' + url + '"></script>';
    });
    return scriptTags.join("\n");
  } else {
    var path = name + '.js';
    if(name == "app"){
      path = "hypercube.js";
    }
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
    var path = 'app.css';
    return '\n<link rel="stylesheet" href="./styles/' + path + '"></link>';
  }
}