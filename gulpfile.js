const gulp = require('gulp')
const connect = require('gulp-connect')
const sass = require('gulp-sass')
const imagemin = require('imagemin')
const sassLint = require('gulp-scss-lint')
const lint = require('gulp-eslint')
const prefixer = require('gulp-autoprefixer')
const sourcemaps = require('gulp-sourcemaps')
const pug = require('gulp-pug')
const data = require('gulp-data')

const files = {
    js   : './src/assets/javascripts/**/*',
    img  : './src/assets/images/**/*',
    sass : './src/assets/sass/**/*',
    css  : './src/assets/stylesheets/**/*'
}

gulp.task('default', () => {})

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
        .pipe(sourcemaps.init())
        .pipe(sass({
            outputStyle: 'compress'
        }).on('error', sass.logError()))
        .pipe(prefixer({
            browser: ['last 15 version'],
            cascade: false
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('assets/stylesheets'))
        .pipe( connect.reload() )
})

gulp.task('lintScss', () => {
    gulp.src(files.sass)
        .pipe(sassLint({
            filePipeOutput: 'report.json'
        }))
        .pipe(gulp.dest('assets/sassReports'))
        .pipe(connect.reload())
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
            svgoPlugins: [{removeViewBox: true}]
        }))
        .pipe(gulp.dest('assets/images'))
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

gulp.task('build', () => {})
gulp.task('livereload', ['connect', 'watch'])
