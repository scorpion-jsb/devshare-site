module.exports = function(grunt){
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
    conf: grunt.file.readJSON('config.json'),
		watch:{
 			html: {
        files: ['<%= conf.devFolder %>/**/*.html'],
        options: {
          livereload: true
        }
      },
      js: {
        files: ['<%= conf.devFolder %>/**/*.js'],
        options: {
          livereload: true
        }
      },
      bower: {
        files: ['bower.json'],
        // tasks:['wiredep']
      }
		},
		connect: {
      dev: {
        options: {
          port: '<%= conf.port %>',
          // keepalive: true, keeping grunt running
          livereload: true,
          base: './<%= conf.devFolder %>/',
          open: {
            target: 'http://localhost:<%= conf.port %>',
            appName: 'Google Chrome',
          }
        }
      },
      dist: {
        options: {
          port: '<%= conf.port %>',
          livereload: true,
          base: './<%= conf.distFolder %>/',
          open: {
            target: 'http://localhost:<%= conf.port %>',
            appName: 'Google Chrome',
          }
        }
      }
    }
	});

	require('load-grunt-tasks')(grunt);
	grunt.registerTask('default', ['connect:dev', 'watch']);
};
