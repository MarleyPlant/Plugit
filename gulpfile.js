var gulp        = require('gulp'),
    sass        = require('gulp-sass'),
    rename      = require('gulp-rename'),
    cssmin      = require('gulp-cssnano'),
    prefix      = require('gulp-autoprefixer'),
    plumber     = require('gulp-plumber'),
    sassLint    = require('gulp-sass-lint'),
    sourcemaps  = require('gulp-sourcemaps');

var buildpath = "/frontend/www"

var sassOptions = {
  outputStyle: 'expanded',
  includePaths: ['node_modules']
};

var prefixerOptions = {
  browsers: ['last 2 versions']
};

// BUILD SUBTASKS
// ---------------

function compileStyles() {
  return gulp.src('/frontend/scss/main.scss')
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sass(sassOptions))
    .pipe(prefix(prefixerOptions))
    .pipe(rename('main.css'))
    .pipe(gulp.dest(buildpath + '/css'))
    .pipe(cssmin())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(buildpath + '/css'))
}

function watchStyles() {
  gulp.watch('app/express/scss/**/*.scss', compileStyles);
}

// BUILD TASKS
// ------------

const compile = gulp.parallel( compileStyles )
const watch = gulp.parallel( watchStyles )
const defaultTasks = gulp.series( compile, watch )

exports.default = defaultTasks
