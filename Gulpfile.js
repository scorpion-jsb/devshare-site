var gulp = require('gulp'),
connect = require('gulp-connect'),
ngConstant = require('gulp-ng-constant'),
rename = require("gulp-rename"),
s3 = require("gulp-s3");

var pkg = require('./package.json');
var conf = require('./config.json');

gulp.task('config', function () {
    return ngConstant({
      name: 'hypercube.const',
      constants: { VERSION:pkg.version,  DB_URL:conf.localServer},
      stream:true
    })
    // Writes config.js to dist/ folder
    .pipe(rename("app-const.js"))
    .pipe(gulp.dest(conf.devFolder));
});

gulp.task('upload', function() {
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
 
gulp.task('default', ['connect']);