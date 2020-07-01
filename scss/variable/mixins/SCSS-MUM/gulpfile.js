'use strict';
 
var gulp = require('gulp');
var sass = require('gulp-sass');
var glob = require('gulp-sass-glob');
 
sass.compiler = require('node-sass');
 
gulp.task('sass', function () {
  return gulp.src('./scss/*.scss')
    .pipe(glob())
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(gulp.dest('./css'));
});
 
gulp.task('sass:watch', function () {
  gulp.watch('./**/*.scss', ['sass']);
});