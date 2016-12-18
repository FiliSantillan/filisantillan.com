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
        .src('./assets/src/styles/main.styl')
        .pipe(plumber({
            errorHandler: onError
        }))
        .pipe(stylus({
            'include css': true
        }))
        .pipe(rename('styles.css'))
        .pipe(gulp.dest('./assets/src/css-dev/'))
})

gulp.task('cmq', function() {
    return gulp
        .src('./assets/src/css-dev/*.css')
        .pipe(plumber({
            errorHandler: onError
        }))
        .pipe(cmq())
        .pipe(gulp.dest('./assets/src/css-dev/'))
})

gulp.task('prefix', function() {
    return gulp
        .src('./assets/src/css-dev/*.css')
        .pipe(plumber({
            errorHandler: onError
        }))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: true
        }))
        .pipe(minifyCss())
        .pipe(gulp.dest('./assets/dist/css/'))
        .pipe(livereload())
})

// gulp.task('concat', function() {

//     var views = gulp
//         .src('./src/js/views/*.js')
//         .pipe(plumber({
//             errorHandler: onError
//         }))
//         .pipe(concat('views.js'))
//         .pipe(gulp.dest('./dist/js/'))

//     var vendor = gulp
//         .src('./src/js/vendor/*.js')
//         .pipe(plumber({
//             errorHandler: onError
//         }))
//         .pipe(concat('vendor.js'))
//         .pipe(gulp.dest('./dist/js/'))

//     return merge(cloudPrivate, social_group);
// })


// gulp.task('minifyJS', function() {
//     var js = gulp
//         .src('./dist/js/*')
//         .pipe(plumber({
//             errorHandler: onError
//         }))
//         .pipe(uglify())
//         .pipe(gulp.dest('./dist/js'))

//     var jsRender = gulp
//         .src('./dist/js-render/*')
//         .pipe(plumber({
//             errorHandler: onError
//         }))
//         .pipe(uglify())
//         .pipe(concat('render.js'))
//         .pipe(gulp.dest('./dist/js/'))

//     var reload = gulp
//         .src('./dist')
//         .pipe(livereload())

//     return merge(js, jsRender, reload)
// })

gulp.task('c-img', function() {
    return gulp
        .src('./assets/src/images/**/*')
        .pipe(plumber({
            errorHandler: onError
        }))
        .pipe(imagemin({
            optimizationLevel: 5
        }))
        .pipe(gulp.dest('./assets/dist/images/'))
})

gulp.task('build-styles', function() {
    runSequence('styles', 'cmq', 'prefix')
})

// gulp.task('build-js', function() {
//     runSequence(['concat'], 'emerald', 'minifyJS')
// })

gulp.task('watch', function() {
    livereload.listen({ start: true })
    gulp.watch('./assets/src/styles/**/*.styl', ['build-styles'])
    // gulp.watch('./src/js/**/*.js', ['build-js'])
})

gulp.task('default', function() {
    runSequence(['build-styles'], 'watch') //runSequence(['build-styles', 'build-js'], 'watch')
})