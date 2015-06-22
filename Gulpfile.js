var gulp = require('gulp'),
connect = require('gulp-connect'),
ngConstant = require('gulp-ng-constant'),
rename = require("gulp-rename"),
s3 = require("gulp-s3"),
template = require("gulp-template");

var pkg = require('./package.json');
var conf = require('./config.json');
var refBuilder = require('./lib/refBuilder');

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

//TODO: Handle scripts per env
gulp.task('scriptTags', function () {
    return gulp.src(conf.devFolder + "/index.html")
    .pipe(template({scripts:refBuilder.buildScriptTags("local")}))
    // Writes config.js to dist/ folder
    .pipe(gulp.dest(conf.distFolder));
});

gulp.task('s3Upload', function() {
	var s3Config = {
		"key":process.env.HYPERCUBE_S3_KEY,
		"secret":process.env.HYPERCUBE_S3_SECRET,
		"bucket":"hyper-cube",
		"region":"us-east-1"
	}
	gulp.src('./' + conf.devFolder + '/**')
    .pipe(s3(s3Config));
});

gulp.task('connect', function() {
  connect.server({
    root: conf.devFolder || 'app',
    livereload: true,
    port: conf.port || 3000
  });
});

gulp.task('upload', ['buildEnv', 'scriptTags', 's3Upload']);//TODO: Have this build for prod env
gulp.task('default', ['buildEnv', 'scriptTags', 'connect']);