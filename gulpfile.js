var gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    connect = require('gulp-connect');

gulp.task('js-concat', function(){
    return gulp.src([
        'src/rushjs-layer.js',
        'src/rushjs-engine.js'
    ])
        .pipe( concat('rushjs.js') )
        .pipe( gulp.dest('dist') );
});

gulp.task('js-uglify',['js-concat'], function(){
    return gulp.src('dist/rushjs.js')
        .pipe( uglify() )
        .pipe( rename('rushjs.min.js') )
        .pipe( gulp.dest('dist') );
});

gulp.task('serve', function() {
    connect.server({
        port: 4000,
        root: 'tests',
        livereload: true
    });
});

gulp.task('watch', function () {
    gulp.watch([
        './src/*.js',
        './tests/**/*.js',
        './tests/**/*.html'
    ], ['js-concat', 'assets', 'html']);
});

gulp.task('assets', function () {
    gulp.src('./dist/rushjs.js')
        .pipe( gulp.dest('./tests/assets/') );
});

gulp.task('html', function () {
    gulp.src('./tests/**/*')
        .pipe( connect.reload() );
});

gulp.task('test', ['js-concat', 'assets', 'serve', 'watch']);
gulp.task('default', ['js-uglify']);
