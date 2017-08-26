const gulp = require('gulp')
const connect = require('gulp-connect')
const sass = require('gulp-sass')
const imagemin = require('gulp-imagemin')
const sassLint = require('gulp-scss-lint')
const lint = require('gulp-eslint')
const prefixer = require('gulp-autoprefixer')
const sourcemaps = require('gulp-sourcemaps')
const pug = require('gulp-pug')
const data = require('gulp-data')
const clean = require('gulp-clean')

const files = {
    js   : './src/assets/javascripts/**/*',
    img  : './src/assets/images/**/*',
    sass : './src/assets/sass/**/*',
    css  : './src/assets/stylesheets/**/*'
}

gulp.task('default', () => {})

gulp.task('copyJs', ['clean'], () => {
    gulp.src(files.js)
        .pipe(gulp.dest('./docs/assets/javascripts'))
})
gulp.task('clean', () => {
    return gulp.src('./docs/assets/javascripts')
        .pipe(clean())
})

gulp.task('connect', () => {
    connect.server({
        root: './docs',
        livereload: true
    })
})

gulp.task('pug', () => {
    gulp.src('./src/views/*.pug')
        .pipe(pug())
        .pipe(gulp.dest('./docs'))
})

gulp.task('sass', () => {
    gulp.src(files.sass)
        .pipe( sourcemaps.init() )
        .pipe( sass({
            outputStyle: 'compressed'
        }).on('error', sass.logError) )
        .pipe( sourcemaps.write('.') )
        .pipe( gulp.dest('./docs/assets/stylesheets') )
})

gulp.task('lintScss', () => {
    gulp.src(files.sass)
        .pipe(sassLint({
            filePipeOutput: 'report.json'
        }))
        .pipe(gulp.dest('./src/assets/sassReports'))
})

gulp.task('lintJs', () => {
    gulp.src(files.js)
        .pipe(lint())
        .pipe(lint.format())
        .pipe(lint.failAfterError())
        .pipe( connect.reload() )
})

gulp.task('imagemin', () => {
    gulp.src(files.img)
        .pipe(imagemin({
            interlaced: true,
            progressive: true,
            optimizationLevel: 7,
        }))
        .pipe( gulp.dest('./docs/assets/images') )
})

gulp.task('watch', () => {
    gulp.watch([
        './src/assets/sass/**/*'
    ], ['lintScss', 'sass'])

    gulp.watch([
        './src/assets/stylesheets/**/*'
    ], [connect.reload()])

    gulp.watch([
        './docs/*.html'
    ], [connect.reload()])

    gulp.watch([
        './src/assets/javascripts/**/*'
    ], ['lint', connect.reload()])
})

gulp.task('build', ['copyJs', 'pug', 'sass', 'copyJs', 'imagemin'])
gulp.task('livereload', ['connect', 'watch'])
gulp.task('lints', ['lintScss', 'lintJs'])
