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

function scriptAssets(env, name){
  if (env === 'local') {
    var scriptTags = assets[name].map(function (url) {
      return '<script src="/' + url + '"></script>';
    });
    return scriptTags.join("\n");
  } else {
    var path = 'public/js/' + name + '.js';
    return '<script src="' + path + '"></script>';
  }
}
