var gulp = require('gulp');
    mainBowerFiles = require('main-bower-files');
    filter = require("gulp-filter");

var buildpath = "express/www"
gulp.task('default', ['bower'])
gulp.task('bower', ['bower-js', 'bower-css'])

gulp.task("bower-js", function() {
  return gulp.src(mainBowerFiles())
    .pipe(filter('**/*.js'))
    .pipe(gulp.dest(buildpath + "/js"))
});

gulp.task("bower-css", function() {
  return gulp.src(mainBowerFiles())
    .pipe(filter('**/*.css'))
    .pipe(gulp.dest(buildpath + "/css"))
});

gulp.task("watch", function() {
  gulp.watch("src/**/**", ['default'])
})
