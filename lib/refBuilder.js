var _ = require('underscore'),
assets = require('../assets');

exports.buildScriptTags = function (env){
  if(!env){
    var env = "local";
  }
  var commentText = "\n\t\t\t<!-- Scripts -->";
  var vendorScripts = scriptAssets(env, "vendor");
  var appScripts = scriptAssets(env, "app");
  return commentText +  vendorScripts  + appScripts;
};
exports.buildStyleTags = function (env){
  if(!env){
    var env = "local";
  }
  return styleAssets(env, "styles");
};
//Builds script tags based on environment and asset name
function scriptAssets(env, name){
  //NOTE: Vendor lib is always direct reference
  if (env && env === 'local' || name === 'vendor') {
    // Directly reference scripts
    var scriptTags = assets[name].map(function (url) {
      return '\n\t\t\t<script src="/' + url + '"></script>';
    });
    return scriptTags.join("");
  } else {
    var path = name + '.js';
    if(name == "app"){
      path = "hypercube.js";
    }
    return '\n\t\t\t<script src="' + path + '"></script>';
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