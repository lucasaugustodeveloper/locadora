const gulp = require('gulp')
const connect = require('gulp-connect')
const sass = require('gulp-sass')
const imagemin = require('gulp-imagemin')
const lint = require('gulp-eslint')
const prefixer = require('gulp-autoprefixer')
const sourcemaps = require('gulp-sourcemaps')
const clean = require('gulp-clean')
const ghpages = require('gulp-gh-pages')
const usemin = require('gulp-usemin')
const concat = require('gulp-concat')
const uglify = require('gulp-uglify')
const htmlmin = require('gulp-htmlmin')

const files = {
  js   : './src/assets/javascripts/**/*.js',
  img  : './src/assets/images/**/*',
  sass : './src/assets/sass/**/*.scss',
  css  : './src/assets/stylesheets/**/*.css'
}

gulp.task('default', () => {})

gulp.task('copy', ['clean'], () => {
  gulp.src(['./src/*.html', files.sass, files.css])
    .pipe(gulp.dest('./dist'))
})
gulp.task('clean', () => {
  return gulp.src('./dist')
    .pipe(clean())
})

gulp.task('connect', () => {
  connect.server({
    root: './dist',
    livereload: true
  })
})

gulp.task('sass', () => {
  gulp.src(files.sass)
    .pipe(sourcemaps.init())
    .pipe(sass({
      outputStyle: 'compressed'
    }).on('error', sass.logError))
    .pipe(prefixer({
      browsers: ['last 15 versions'],
      cascade: false
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./dist/assets/stylesheets'))
})

gulp.task('usemin', ['copyHtml'], () => {
  gulp.src('dist/**/*.html')
    .pipe(usemin({
      js: [concat, uglify]
    }))
    .pipe(gulp.dest('dist'))
})
gulp.task('htmlmin', () => {
  gulp.src('./src/**/*.html')
    .pipe(htmlmin({
      collapseWhitespace: true
    }))
    .pipe(gulp.dest('./dist'))
})

gulp.task('lintJs', () => {
  gulp.src(files.js)
    .pipe(lint())
    .pipe(lint.format())
    .pipe(lint.failAfterError())
    .pipe(connect.reload())
})

gulp.task('imagemin', () => {
  gulp.src(files.img)
    .pipe(imagemin({
      interlaced: true,
      progressive: true,
      optimizationLevel: 7,
    }))
    .pipe( gulp.dest('./dist/assets/images') )
})

gulp.task('watch', () => {
  gulp.watch([
    './src/assets/sass/**/*'
  ], ['lintScss', 'sass'])

  gulp.watch([
    './dist/assets/stylesheets/**/*'
  ], [connect.reload()])

  gulp.watch([
    './dist/*.html'
  ], ['htmlmin', 'usemin', connect.reload()])

  gulp.watch([
    './src/assets/javascripts/**/*'
  ], ['lint', connect.reload()])
})

gulp.task('ghpages', () => {
  gulp.src('./dist/**/*')
    .pipe(ghpages())
})

gulp.task('build', ['copyJs', 'pug', 'sass', 'copyJs', 'imagemin'])
gulp.task('livereload', ['connect', 'watch'])
gulp.task('lints', ['lintScss', 'lintJs'])
gulp.task('deploy', ['build', 'ghpages'])

