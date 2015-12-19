/* DEPS */
var gulp         = require('gulp')
var minifyCSS    = require('gulp-minify-css')
var uglify       = require('gulp-uglify')
var concat       = require('gulp-concat')
var watch        = require('gulp-watch')
var imageop      = require('gulp-image-optimization')
var del          = require('del')
var pngquant     = require('imagemin-pngquant')
var imageminWebp = require('imagemin-webp');
var resize       = require('gulp-image-resize');
var rename       = require('gulp-rename');

/* CONFIGS */
var jsSrc = [
  'content/themes/casper/assets/js/index.js',
  'node_modules/prefetch/prefetch.js',
  'content/themes/casper/assets/js/app.js'
]
var imgRawSrc = [
  'image-proc/raw/**/*.jpg',
  'image-proc/raw/**/*.jpeg',
  'image-proc/raw/**/*.JPG',
  'image-proc/raw/**/*.png',
  'image-proc/raw/**/*.PNG'
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
  interlaced: true,
  use: [
    pngquant( {quality: '65-80', speed: 4} ),
    imageminWebp( {quality: 50} )
  ]
}

gulp.task('img-del', function () {
  del.sync('image-proc/opto/*')
  del.sync('image-proc/resized/*')
});

gulp.task('img-resize-1024', function () {
  return gulp.src(imgRawSrc)
    .pipe(resize({ width: 1024, format: 'jpg' }))
    .pipe(rename({ suffix: '-1024'}))
    .pipe(gulp.dest('image-proc/resized'))
});

gulp.task('img-resize-500', function () {
  return gulp.src(imgRawSrc)
    .pipe(resize({ width: 500, format: 'jpg' }))
    .pipe(rename({ suffix: '-500'}))
    .pipe(gulp.dest('image-proc/resized'))
});

gulp.task('img-resize-300', function () {
  return gulp.src(imgRawSrc)
    .pipe(resize({ width: 300, format: 'jpg' }))
    .pipe(rename({ suffix: '-300'}))
    .pipe(gulp.dest('image-proc/resized'))
});

gulp.task('img-resize-200sq', function () {
  return gulp.src(imgRawSrc)
    .pipe(resize({ crop: true, width: 200, height: 200, format: 'jpg' }))
    .pipe(rename({ suffix: '-200sq'}))
    .pipe(gulp.dest('image-proc/resized'))
});

gulp.task('img-resize', ['img-resize-1024', 'img-resize-500', 'img-resize-300', 'img-resize-200sq'], function(){
  console.log('img resize complete!')
})

gulp.task('img', ['img-del', 'img-resize'], function() {
  return gulp.src('image-proc/resized/**/*')
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
