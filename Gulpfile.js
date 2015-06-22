var gulp = require('gulp'),
connect = require('gulp-connect'),
ngConstant = require('gulp-ng-constant'),
rename = require("gulp-rename"),
s3 = require("gulp-s3"),
template = require("gulp-template"),
ngAnnotate = require('gulp-ng-annotate'),
concat = require('gulp-concat');

var pkg = require('./package.json');
var conf = require('./config.json');
var refBuilder = require('./lib/refBuilder');
var assets = require('./assets');
console.log('assets:', assets.app);
var locatedStyleAssets = assets.style.map(function(asset){
  return "./" + conf.devFolder + "/" + asset;
});
var locatedAppAssets = assets.app.map(function(asset){
  return "./" + conf.devFolder + "/" + asset;
});
var locatedVendorAssets = assets.vendor.map(function(asset){
  return "./" + conf.devFolder + "/" + asset;
})

//TODO: Handle scripts per env
gulp.task('copy', function () {
    return gulp.src(locatedVendorAssets)
    // Writes config.js to dist/ folder
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest(conf.distFolder + "/"));
});
gulp.task('copyHtml', function(){
    return gulp.src((conf.devFolder + "/**/*.html"))
    .pipe(gulp.dest(conf.distFolder+"/"));
})
/** Angular annotation and file concatination
 */
gulp.task('buildAssets', function () {
  return gulp.src(locatedAppAssets)
    .pipe(ngAnnotate())
    .pipe(concat('app.js'))
    .pipe(gulp.dest(conf.distFolder + '/'));
});

//TODO: Handle scripts per env
gulp.task('assetTags', function () {
  return gulp.src(conf.devFolder + "/index.html")
    .pipe(template({scripts:refBuilder.buildScriptTags(), styles:refBuilder.buildStyleTags()}))
    // Writes config.js to dist/ folder
    .pipe(gulp.dest(conf.distFolder));
});

//TODO: Have this build per environment
gulp.task('buildEnv', function () {
    return ngConstant({
      name: 'hypercube.const',
      constants: { VERSION:pkg.version,  DB_URL:conf.localServer},
      stream:true
    })
    // Writes config.js to dist/ folder
    .pipe(rename("app-const.js"))
    .pipe(gulp.dest(conf.distFolder));
});
/** Upload dist folder to S3
*/
gulp.task('s3Upload', function() {
	var s3Config = {
		"key":process.env.HYPERCUBE_S3_KEY,
		"secret":process.env.HYPERCUBE_S3_SECRET,
		"bucket":"hyper-cube",
		"region":"us-east-1"
	}
	gulp.src('./' + conf.distFolder + '/**')
    .pipe(s3(s3Config));
});

gulp.task('connect', function() {
  connect.server({
    root: conf.distFolder || 'dist',
    livereload: true,
    port: conf.port || 3000
  });
});

gulp.task('upload', ['buildEnv', 'assetTags', 's3Upload']);//TODO: Have this build for prod env
gulp.task('default', ['buildEnv', 'copy', 'scriptTags', 'connect']);