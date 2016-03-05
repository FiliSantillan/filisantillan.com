// Dependencias
var gulp = require('gulp'),
    stylus = require('gulp-stylus'),
    uglify = require('gulp-uglify'),
    minifyCss = require('gulp-minify-css'),
    concat = require('gulp-concat'),
    gcmq = require('gulp-group-css-media-queries'),
    path = {},
    stylusTasks = ['styles'];

// Path - Watch
path.watch = {
    stylus: ['./assets/stylus/*.styl']
};

// Monitorea cambios en los estilos
gulp.task('watch', function () {
    gulp.watch(path.watch.stylus, stylusTasks);
});

// Compila stylus a css
gulp.task('styles', function () {
  gulp.src('./assets/stylus/styles.styl')
    .pipe(stylus({
      compress: true
    }))
    .pipe(gulp.dest('./assets/css/'));
});

// Minifica archivos JS
gulp.task('minify-js', function() {
  return gulp.src('./assets/js-dev/vendor/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('./assets/js/vendor/'));
});

// Minifica archivos CSS (Vendor)
gulp.task('minify-css', function() {
  return gulp.src('./assets/css-dev/vendor/*.css')
    .pipe(minifyCss())
    .pipe(gulp.dest('./assets/css/vendor/'));
});

// Minifica archivos CSS (Stylus)
gulp.task('minify-stylus', function() {
  return gulp.src('./assets/css/styles.css')
    .pipe(minifyCss())
    .pipe(gulp.dest('./assets/css/'));
});

// Concatena archivos JS
gulp.task('concat-js', function() {
  return gulp.src('./assets/js/vendor/*.js')
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest('./assets/js/vendor/'));
});

// Concatena archivos CSS
gulp.task('concat-css', function() {
  return gulp.src('./assets/css/vendor/*.css')
    .pipe(concat('vendor.css'))
    .pipe(gulp.dest('./assets/css/vendor/'));
});

// Agrupa los media-queries
gulp.task('group-mq', function () {
  gulp.src('./assets/css/styles.css')
    .pipe(gcmq())
    .pipe(gulp.dest('./assets/css'));
});