var gulp = require('gulp'),
    stylus = require('gulp-stylus'),
    concat = require('gulp-concat'),
    minifyCss = require('gulp-minify-css'),
    uglify = require('gulp-uglify');


gulp.task('styles', function () {
  gulp.src('./assets/Stylus/styles.styl')
    .pipe(stylus({
      compress: true
    }))
    .pipe(gulp.dest('./assets/css/'));
});

gulp.task('minify-styles', function() {
  return gulp.src('./assets/css/vendor/*.css')
    .pipe(minifyCss())
    .pipe(gulp.dest('./assets/css/vendor/'));
});

gulp.task('minify-scripts', function() {
    return gulp.src('./assets/js/vendor/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('./assets/js/vendor/'))
});

gulp.task('concat-styles', function() {
  return gulp.src('./assets/css/vendor/*.css')
    .pipe(concat('vendor.css'))
    .pipe(gulp.dest('./assets/css/vendor/'));
});

gulp.task('concat-scripts', function() {
  return gulp.src('./assets/js/vendor/*.js')
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest('./assets/js/vendor/'));
});