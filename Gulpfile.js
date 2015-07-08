var gulp = require('gulp'),
connect = require('gulp-connect'),
ngConstant = require('gulp-ng-constant'),
rename = require('gulp-rename'),
s3 = require('gulp-s3'),
template = require('gulp-template'),
ngAnnotate = require('gulp-ng-annotate'),
concat = require('gulp-concat'),
rename = require('gulp-rename'),
clean = require('gulp-clean');

var pkg = require('./package.json');
var conf = require('./config.json');
var refBuilder = require('./lib/refBuilder');
var assets = require('./assets');
var locatedStyleAssets = locateAssets('styles');
var locatedAppAssets = locateAssets('app');
var locatedVendorAssets = locateAssets('vendor');

function locateAssets(assetType){
  return assets[assetType].map(function(asset){
    return './' + conf.devFolder + '/' + asset;
  });
}
/** Copy Style Assets to single styles.css file in distFolder
 */
//TODO: Handle scripts per env
gulp.task('assets:style', function () {
  return gulp.src(locatedStyleAssets)
  .pipe(concat('styles.css'))
  .pipe(gulp.dest(conf.distFolder + '/'));
});

/** Copy Vendor libs to single vendor.js file in distFolder
 */
//TODO: Handle scripts per env
gulp.task('assets:vendor', function () {
  return gulp.src(locatedVendorAssets)
  // Writes vendor.js to dist/ folder
  .pipe(concat('vendor.js'))
  .pipe(gulp.dest(conf.distFolder));
});
/** Angular annotation and Application files concatination to hypercube.js
   */
gulp.task('assets:app', function () {
  return gulp.src(locatedAppAssets)
    .pipe(ngAnnotate())
    .pipe(concat('hypercube.js'))
    .pipe(gulp.dest(conf.distFolder));
});

/** Copy HTML files to distFolder in respective locations
 */
//TODO: Convert html files to js?
gulp.task('copyHtml', function(){
    return gulp.src([conf.devFolder + '/**/*.html', '!' + conf.devFolder + '/index-template.html', '!' + conf.devFolder + '/index.html'], {base:'./app/'})
    .pipe(gulp.dest(conf.distFolder));
});

/** Build script and style tags to place into HTML
 */
gulp.task('assetTags:dev', function () {
  return gulp.src(conf.devFolder + '/index-template.html')
    .pipe(template({scripts:refBuilder.buildScriptTags('local'), styles:refBuilder.buildStyleTags('local')}))
    // Writes script reference to index.html dist/ folder
    .pipe(rename('index.html'))
    .pipe(gulp.dest(conf.devFolder));

});

gulp.task('assetTags:prod', function () {
  return gulp.src(conf.devFolder + '/index-template.html')
    .pipe(template({scripts:refBuilder.buildScriptTags('prod'), styles:refBuilder.buildStyleTags('prod')}))
    // Writes script reference to index.html devfolder
    .pipe(rename('index.html'))
    .pipe(gulp.dest(conf.distFolder));
});

/** Create Angular constants file
 */
//TODO: Have this build per environment
gulp.task('buildEnv', function () {
  return ngConstant({
    name: 'hypercube.const',
    constants: { VERSION:pkg.version,  DB_URL:conf.envs.local.authUrl || 'localhost:4000', FB_URL:conf.envs.local.fbUrl},
    stream:true
  })
  // Writes config.js to dist/ folder
  .pipe(rename('app-const.js'))
  .pipe(gulp.dest(conf.devFolder));
});

/** Upload dist folder to S3
*/
gulp.task('s3Upload', function() {
	var s3Config = {
		key:process.env.HYPERCUBE_S3_KEY,
		secret:process.env.HYPERCUBE_S3_SECRET,
		bucket:'hyper-cube',
		region:'us-east-1'
	}
	gulp.src('./' + conf.distFolder + '/**')
    .pipe(s3(s3Config));
});

/** Run local server to host app folder
*/
gulp.task('connect:dev', function() {
  connect.server({
    root: conf.devFolder || 'app',
    // livereload: true,
    port: conf.port || 3000
  });
});
/** Run local server to host dist folder
*/
gulp.task('connect:dist', function() {
  connect.server({
    root: conf.distFolder || 'dist',
    // livereload: true,
    port: conf.port || 3000
  });
});

gulp.task('clean', function(){
  return gulp.src(conf.distFolder)
  .pipe(clean());
});

gulp.task('watch-assets', function(){
  gulp.watch(['./assets.js'], ['assets']);
});
gulp.task('watch-html', function(){
  gulp.watch([conf.devFolder + '/**/*.html'], ['copyHtml']);
});
gulp.task('assets', ['copyHtml', 'assets:vendor','assets:app', 'assets:style', 'assetTags:dev', 'assetTags:prod']);//TODO: Have this build for prod env

gulp.task('build', ['buildEnv', 'assets']);

gulp.task('upload', ['build', 's3Upload']);

gulp.task('default', ['buildEnv', 'assetTags:dev', 'watch-assets', 'watch-html', 'connect:dev']);

gulp.task('dist', ['build', 'connect:dist']);
