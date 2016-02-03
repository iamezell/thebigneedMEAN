var gulp = require('gulp');
var jshint = require('gulp-jshint');
var jscs = require('gulp-jscs');
var sass = require('gulp-sass');
var inject = require('gulp-inject');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var uglify = require('gulp-uglify');
//var gulpPrint = require('gulp-print');
var buffer = require('vinyl-buffer');
var Server = require('karma').Server;
var browserSync = require('browser-sync').create();
var nodemon =  require('gulp-nodemon');
var watch = require('gulp-watch');
var glob = require('glob');
var rename = require('gulp-rename');
var es = require('event-stream');
var srcPath = 'src';
var destPath = 'public/stylesheets';
var fs =require('fs');
var path = require('path');
var concat = require('gulp-concat');
var cssimport = require('gulp-cssimport');
var cssmin = require('gulp-cssmin');


function getFolders(dir){
  return fs.readdirSync(dir)
  .filter(function(file){
    return fs.statSync(path.join(dir, file)).isDirectory();
  });
}

gulp.task('jscs', function(){
	return gulp.src('./src/js/app.js')
	.pipe(jscs())
	.pipe(jshint())
	.pipe(jshint.reporter('jshint-stylish',{verbose:true}))
	.pipe(jshint.reporter('fail'))
});

gulp.task('js-watch', ['vet'], function(){
  console.log('something changed');
  browserSync.reload();
});

gulp.task('test', function (done) {
  new Server({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, done).start();
});

gulp.task('start',['vet'], function(){
  browserSync.init({
    proxy: 'http://localhost:3000',
    port: 5000,
    injectChanges: false
  });

 // all browsers reload after tasks are complete
 gulp.watch(['src/**/**/*.js', 'src/sass/**/*.scss','views/*.ejs'],['js-watch']);
})


gulp.task('nodemon', function(cb){
  var started = false;

  return nodemon({
   script: 'bin/www'

  }).on('start', function(){
    //to avoid nodemon being started multiple times
       if(!started){
         cb();
         started = true;
       }
     
     })
});


gulp.task('vet', ['test','jscs','sass','nodemon'], function(){
	
	return browserify('./src/app/TBN.js')
	.bundle()
	// Pass desired output filename to vinyl-source-stream
  .pipe(source('bundle.js'))
     // Start piping stream to tasks!
	.pipe(buffer())
	// .pipe(jshint())
	// .pipe(jshint.reporter('jshint-stylish',{verbose:true}))
	// .pipe(jshint.reporter('fail'))
	// Start piping stream to tasks!
  .pipe(uglify({mangle:false}))
  .pipe(gulp.dest('./public/javascripts'));
});



gulp.task('sass', function(){
  return gulp.src(['./src/sass/*.scss'])
  .pipe(sass().on('error', sass.logError))
  .pipe(cssmin())
  .pipe(rename('tbn.min.css'))
  .pipe(gulp.dest('./public/stylesheets/'))
})
