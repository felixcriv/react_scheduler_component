var gulp = require('gulp');
var browserify = require('browserify');
//transform jsx to js
var reactify = require('reactify');
//convert to stream
var source = require('vinyl-source-stream');
var nodemon = require('gulp-nodemon');

gulp.task('browserify', function() {
    //source
    browserify('./src/js/main.js')
        //convert jsx to js
        .transform('reactify')
        //creates a bundle
        .bundle()
        .pipe(source('main.js'))
        .pipe(gulp.dest('dist/js'))
});

gulp.task('copy', function() {

    gulp.src('src/index.html')
        .pipe(gulp.dest('dist'));
    gulp.src('src/assets/**/*.*')
        .pipe(gulp.dest('dist/assets'));
});

gulp.task('nodemon', function(cb) {
    var called = false;

    return nodemon({
        script: 'server.js'
    }).on('start', function() {
        if (!called) {
            called = true;
            cb();
        }
    });
});

gulp.task('default', ['browserify', 'copy', 'nodemon'], function() {

    return gulp.watch('src/**/*.*', ['browserify', 'copy']);
});
