/* DEPS */
var gulp        = require('gulp')
var minifyCSS   = require('gulp-minify-css')
var uglify      = require('gulp-uglify')
var concat      = require('gulp-concat')
var watch       = require('gulp-watch')
var swPrecache  = require('sw-precache')
var packageJson = require('./package.json')
var path        = require('path')
var $           = require('gulp-load-plugins')()

/* CONFIGS */
var rootDir  = 'content/themes/casper/assets/dist'; // root of dist dir for processed assets to be indexed by sw
var DIST_DIR = ''; // save generated service-worker to project root
var jsSrc    = [
      // 'bower_components/jquery/dist/jquery.min.js',
      // 'content/themes/casper/assets/js/jquery.fitvids.js',
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

gulp.task('css', function(){
  return gulp.src('content/themes/casper/assets/css/screen.css')
    .pipe(minifyCSS(cssConfig))
    .pipe(gulp.dest('content/themes/casper/assets/dist/css'))
})

gulp.task('move-sw-toolbox', function () {
  return gulp.src('node_modules/sw-toolbox/sw-toolbox.js')
    .pipe(uglify(uglifyConfig))
    .pipe(gulp.dest('content/themes/casper/assets/dist/js'))
});

gulp.task('js', ['move-sw-toolbox'], function(){
  return gulp.src(jsSrc)
    .pipe(concat('bundle.min.js'))
    .pipe(uglify(uglifyConfig))
    .pipe(gulp.dest('content/themes/casper/assets/dist/js'))
})

// function writeServiceWorkerFile(rootDir, handleFetch, callback) {
//   var config = {
//     cacheId: packageJson.name,
//     dynamicUrlToDependencies: {
//       'dynamic/page1': [
//         path.join(rootDir, 'views', 'layout.jade'),
//         path.join(rootDir, 'views', 'page1.jade')
//       ],
//       'dynamic/page2': [
//         path.join(rootDir, 'views', 'layout.jade'),
//         path.join(rootDir, 'views', 'page2.jade')
//       ]
//     },
//     // If handleFetch is false (i.e. because this is called from generate-service-worker-dev), then
//     // the service worker will precache resources but won't actually serve them.
//     // This allows you to test precaching behavior without worry about the cache preventing your
//     // local changes from being picked up during the development cycle.
//     handleFetch: handleFetch,
//     logger: $.util.log,
//     staticFileGlobs: [
//       'content/themes/casper/assets/dist/css/*.css',
//       'content/themes/casper/assets/dist/js/*.js'
//       // rootDir + '/css/**/*.css',
//       // rootDir + '/**.html',
//       // rootDir + '/images/**.*',
//       // rootDir + '/js/**/*.js'
//     ],
//     stripPrefix: 'content/themes/casper',
//     // verbose defaults to false, but for the purposes of this demo, log more.
//     verbose: true
//   };
//
//   swPrecache.write(path.join(rootDir, 'service-worker.js'), config, callback);
// }
//
// gulp.task('generate-service-worker-dev', function(callback) {
//   writeServiceWorkerFile(DIST_DIR, false, callback);
// });
//
// gulp.task('generate-service-worker-prod', function(callback) {
//   writeServiceWorkerFile(DIST_DIR, true, callback);
// });

gulp.task('watch', function() {
  gulp.watch(['content/themes/casper/assets/js/*.js','!content/themes/casper/assets/dist/**/*.js'], ['js'])
  gulp.watch(['content/themes/casper/assets/css/*.css','!content/themes/casper/assets/**/*.css'], ['css'])
})

gulp.task('dev', ['css', 'js', 'watch']);

gulp.task('prod', ['css', 'js']);
