var gulp = require('gulp');
var jshint = require('gulp-jshint');
var jscs = require('gulp-jscs');
var util = require('gulp-util');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var gulpPrint = require('gulp-print');
var buffer = require('vinyl-buffer');
var Server = require('karma').Server;
var browserSync = require('browser-sync').create();
var nodemon =  require('gulp-nodemon');
var watch = require('gulp-watch');
var glob = require('glob');
var rename = require('gulp-rename');
var es = require('event-stream');

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
})
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
 gulp.watch(['src/**/**/**/*.js', 'views/*.ejs'],['js-watch']);
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
})


gulp.task('vet', ['test','jscs','nodemon'], function(){
	
	glob('./src/**/js/**.js', function(err, files){
          if(err) done(err);

          var tasks = files.map(function(entry){
            return browserify({entries:[entry]})
            .bundle()
            .pipe(source(entry))
            .pipe(buffer())
            .pipe(rename({extname:'.bundle.js'}))
            .pipe(gulp.dest('./public/javascripts'))
          })
          es.merge(tasks).on('end', function(){
            console.log('done');
          });
        });
	//return browserify('./src/js/app.js')
	//.bundle()
	//Pass desired output filename to vinyl-source-stream
    //.pipe(source('bundle.js'))
     // Start piping stream to tasks!
// 	.pipe(buffer())
	// .pipe(jshint())
	// .pipe(jshint.reporter('jshint-stylish',{verbose:true}))
	// .pipe(jshint.reporter('fail'))
	// // Start piping stream to tasks!
   //.pipe(gulp.dest('./public/javascripts'));
});
