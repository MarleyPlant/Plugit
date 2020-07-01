var gulp        = require('gulp'),
    sass        = require('gulp-sass'),
    rename      = require('gulp-rename'),
    cssmin      = require('gulp-cssnano'),
    prefix      = require('gulp-autoprefixer'),
    plumber     = require('gulp-plumber'),
    sassLint    = require('gulp-sass-lint'),
    sourcemaps  = require('gulp-sourcemaps'),
    glob    = require('gulp-sass-glob');


var buildpath = "./public"

var sassOptions = {
  outputStyle: 'expanded',
  includePaths: ['node_modules']
};

var prefixerOptions = {
};

// BUILD SUBTASKS
// ---------------

function compileStyles() {
  return gulp.src(buildpath + '/scss/*.scss')
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(glob())
    .pipe(sass(sassOptions))
    .pipe(prefix(prefixerOptions))
    .pipe(rename('main.css'))
    .pipe(gulp.dest(buildpath + '/stylesheets'))
    .pipe(cssmin())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(buildpath + '/stylesheets'))
}

function watchStyles() {
  gulp.watch(buildpath + '/scss/**/*.scss', compileStyles);
}

// BUILD TASKS
// ------------

const compile = gulp.parallel( compileStyles )
const watch = gulp.parallel( watchStyles )
const defaultTasks = gulp.series( compile )

exports.default = defaultTasks