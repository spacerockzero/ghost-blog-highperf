/* DEPS */
var gulp      = require('gulp')
var minifyCSS = require('gulp-minify-css')
var uglify    = require('gulp-uglify')
var concat    = require('gulp-concat')
var watch     = require('gulp-watch')

/* CONFIGS */
var jsSrc = [
  // 'bower_components/jquery/dist/jquery.min.js',
  // 'content/themes/casper/assets/js/jquery.fitvids.js',
  'content/themes/casper/assets/js/index.js',
  // 'node_modules/prefetch/prefetch.js',
  // 'content/themes/casper/assets/js/app.js'
]

/* MINIFY CSS CONFIG */
var cssConfig = {
  compatibility: '',
  // advanced: true,
  aggressiveMerging: true,
  debug: true
}

/* UGLIFYJS CONFIG */
var uglifyConfig = {

}

gulp.task('css', function(){
  return gulp.src('content/themes/casper/assets/css/screen.css')
    // .pipe(minifyCSS(cssConfig))
    .pipe(gulp.dest('content/themes/casper/assets/css/dist'))
})

gulp.task('js', function(){
  return gulp.src(jsSrc)
    .pipe(concat('bundle.min.js'))
    // .pipe(uglify(uglifyConfig))
    .pipe(gulp.dest('content/themes/casper/assets/js/dist'))
})

gulp.task('watch', function() {
  gulp.watch(['content/themes/casper/assets/js/*.js','!content/themes/casper/assets/js/dist/bundle.min.js'], ['js'])
  gulp.watch(['content/themes/casper/assets/css/*.css','!content/themes/casper/assets/css/dist/screen.css'], ['css'])
})

gulp.task('default', ['css', 'js', 'watch']);
