var gulp = require('gulp'),
    stylus = require('gulp-stylus'),
    path = {},
    stylusTasks = ['styles'];

path.watch = {
    stylus: ['./assets/stylus/*.styl']
};

gulp.task('watch', function () {
    gulp.watch(path.watch.stylus, stylusTasks);
});

gulp.task('styles', function () {
  gulp.src('./assets/stylus/styles.styl')
    .pipe(stylus())
    .pipe(gulp.dest('./assets/css/'));
});