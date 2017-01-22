// Dependences
var gulp = require('gulp'),
    runSequence = require('run-sequence'),
    gutil = require('gulp-util'),
    plumber = require('gulp-plumber'),
    merge = require('merge-stream'),
    rename = require('gulp-rename'),
    stylus = require('gulp-stylus'),
    cmq = require('gulp-combine-mq'),
    autoprefixer = require('gulp-autoprefixer'),
    minifyCss = require('gulp-minify-css'),
    fontmin = require('gulp-fontmin'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    livereload = require('gulp-livereload');

const imagemin = require('gulp-imagemin');

var onError = function(err) {
    gutil.log(gutil.colors.red('¡Oh, no! 😱'));
    gutil.beep();
    console.log(err);
}

gulp.task('styles', function() {
    return gulp
        .src('./src/styles/main.styl')
        .pipe(plumber({
            errorHandler: onError
        }))
        .pipe(stylus({
            'include css': true
        }))
        .pipe(rename('styles.css'))
        .pipe(gulp.dest('./src/css-dev/'))
})

gulp.task('cmq', function() {
    return gulp
        .src('./src/css-dev/*.css')
        .pipe(plumber({
            errorHandler: onError
        }))
        .pipe(cmq())
        .pipe(gulp.dest('./src/css-dev/'))
})

gulp.task('prefix', function() {
    return gulp
        .src('./src/css-dev/*.css')
        .pipe(plumber({
            errorHandler: onError
        }))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: true
        }))
        .pipe(minifyCss())
        .pipe(gulp.dest('./assets/css/'))
        .pipe(livereload())
})

gulp.task('c-fonts', function () {
    return gulp.src('./src/fonts/*')
        .pipe(fontmin())
        .pipe(gulp.dest('./assets/fonts/'));
});

gulp.task('concat', function() {

    var scripts = gulp
        .src('./src/js-dev/fili/*.js')
        .pipe(plumber({
            errorHandler: onError
        }))
        .pipe(concat('scripts.js'))
        .pipe(gulp.dest('./src/js-dev/'))

    var vendor = gulp
        .src('./src/js-dev/vendor/**/*.js')
        .pipe(plumber({
            errorHandler: onError
        }))
        .pipe(concat('vendor.js'))
        .pipe(gulp.dest('./src/js-dev/'))

    return merge(scripts, vendor);
})


gulp.task('minifyJS', function() {
    var scripts = gulp
        .src('./src/js-dev/scripts.js')
        .pipe(plumber({
            errorHandler: onError
        }))
        .pipe(uglify())
        .pipe(gulp.dest('./assets/js/'))

    var vendor = gulp
        .src('./src/js-dev/vendor.js')
        .pipe(plumber({
            errorHandler: onError
        }))
        .pipe(uglify())
        .pipe(gulp.dest('./assets/js/'))

    return merge(scripts, vendor)
})

gulp.task('c-images', function() {
    return gulp
        .src('./src/images/**/*')
        .pipe(plumber({
            errorHandler: onError
        }))
        .pipe(imagemin({
            optimizationLevel: 5
        }))
        .pipe(gulp.dest('./assets/images/'))
})

gulp.task('build-styles', function() {
    runSequence('styles', 'cmq', 'prefix')
})

gulp.task('build-js', function() {
    runSequence(['concat', 'minifyJS'])
})

gulp.task('watch', function() {
    livereload.listen({ start: true })
    gulp.watch('./src/styles/**/*.styl', ['build-styles'])
    gulp.watch('./src/js-dev/**/*.js', ['build-js'])
})

gulp.task('default', function() {
    runSequence(['build-styles', 'build-js'], 'watch')
})