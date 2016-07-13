var gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename');

gulp.task('js-concat', function(){
    return gulp.src([
        'src/rushjs-layer.js',
        'src/rushjs-engine.js',
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

gulp.task('default', ['js-uglify']);