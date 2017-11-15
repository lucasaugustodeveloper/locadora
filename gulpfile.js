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
    root: './src',
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
    .pipe(gulp.dest('./src/assets/stylesheets'))
})

gulp.task('usemin', () => {
  return gulp.src('dist/**/*.html')
    .pipe(usemin({
      js: [concat, uglify]
    }))
    .pipe(gulp.dest('dist'))
})
gulp.task('htmlmin', ['usemin'], () => {
  gulp.src('./src/*.html')
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
    .pipe(gulp.dest('./dist/assets/images'))
})

gulp.task('watchHTML', () => {
  gulp.src('./src/*.html')
    .pipe(connect.reload())
})
gulp.task('watchCSS', () => {
  gulp.src(files.css)
    .pipe(connect.reload())
})
gulp.task('watchJS', () => {
  gulp.src(files.js)
    .pipe(connect.reload())
})

gulp.task('watch', () => {
  gulp.watch(['./src/*.html'], ['watchHTML'])
  gulp.watch(['./src/assets/stylesheets/**/*.css'], ['watchCSS'])
  gulp.watch(['./src/assets/javascripts/**/*.js'], ['lintJs', 'watchJS'])
  gulp.watch(['./src/assets/sass/**/*.scss'], ['sass'])
})

gulp.task('ghpages', () => {
  gulp.src('./dist/**/*')
    .pipe(ghpages())
})

gulp.task('build', ['copy', 'sass', 'imagemin'])
gulp.task('livereload', ['connect', 'watch'])
gulp.task('lints', ['lintScss', 'lintJs'])
gulp.task('deploy', ['build', 'ghpages'])

