/* DEPS */
var gulp      = require('gulp')
var minifyCSS = require('gulp-minify-css')
var uglify    = require('gulp-uglify')
var concat    = require('gulp-concat')
var watch     = require('gulp-watch')
var imageop   = require('gulp-image-optimization')
var del       = require('del')

/* CONFIGS */
var jsSrc = [
  'content/themes/casper/assets/js/index.js',
  'node_modules/prefetch/prefetch.js',
  'content/themes/casper/assets/js/app.js'
]

/* MINIFY CSS CONFIG */
var cssConfig = {
  compatibility: '',
  // advanced: true,
  aggressiveMerging: true,
  debug: true
}

/* UGLIFYJS CONFIG */
var uglifyConfig = {}
var imageOpConfig = {
  optimizationLevel: 5,
  progressive: true,
  interlaced: true
}

gulp.task('del-img', function () {
  del.sync('image-proc/opto/*')
});

gulp.task('img', ['del-img'], function() {
  gulp.src('image-proc/raw/**/*')
    .pipe(imageop(imageOpConfig))
    .pipe(gulp.dest('image-proc/opto'))
})

gulp.task('css', function(){
  return gulp.src('content/themes/casper/assets/css/screen.css')
    .pipe(minifyCSS(cssConfig))
    .pipe(gulp.dest('content/themes/casper/assets/dist/css'))
})

gulp.task('js', function(){
  return gulp.src(jsSrc)
    .pipe(concat('bundle.min.js'))
    .pipe(uglify(uglifyConfig))
    .pipe(gulp.dest('content/themes/casper/assets/dist/js'))
})

gulp.task('watch', function() {
  gulp.watch([
    'content/themes/casper/assets/js/*.js',
    '!content/themes/casper/assets/dist/js/bundle.min.js'
  ], ['js'])
  gulp.watch([
    'content/themes/casper/assets/css/*.css',
    '!content/themes/casper/assets/dist/css/screen.css'
  ], ['css'])
  gulp.watch([
    'image-proc/raw/**.*',
  ], ['img'])
})

gulp.task('default', ['css', 'js', 'img', 'watch']);
