var gulp = require('gulp');
var jshint = require('gulp-jshint');
var jscs = require('gulp-jscs');
var util = require('gulp-util');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var gulpPrint = require('gulp-print');
var buffer = require('vinyl-buffer');
var Server = require('karma').Server;

gulp.task('jscs', function(){
	return gulp.src('./src/js/app.js')
	.pipe(jscs())
	.pipe(jshint())
	.pipe(jshint.reporter('jshint-stylish',{verbose:true}))
	.pipe(jshint.reporter('fail'))
});
gulp.task('test', function (done) {
  new Server({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, done).start();
});

gulp.task('vet', ['test','jscs'], function(){

	return browserify('./src/js/app.js')
	.bundle()
	//Pass desired output filename to vinyl-source-stream
    .pipe(source('bundle.js'))
 //    // Start piping stream to tasks!
 	.pipe(buffer())
	// .pipe(jshint())
	// .pipe(jshint.reporter('jshint-stylish',{verbose:true}))
	// .pipe(jshint.reporter('fail'))
	// // Start piping stream to tasks!
   .pipe(gulp.dest('./public/javascripts'));
});
