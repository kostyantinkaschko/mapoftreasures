import browserSync from "browser-sync"
import gulp from "gulp"
import del from "del"
import pug from "gulp-pug"
import coreSass from "sass"
import gulpSass from "gulp-sass"
import autoprefixer from "gulp-autoprefixer"
import concat from "gulp-concat"
import uglify from "gulp-uglify-es"
import imagemin from "gulp-imagemin"
import cache from "gulp-cache"
import gcmq from "gulp-group-css-media-queries"
import cleanCSS from "gulp-clean-css"

const sass = gulpSass(coreSass)

export const browserSyncFunc = () => {
    browserSync({
        server: {
            baseDir: "docs"
        },
        open: true,
        browser: "chrome",
        host: '192.168.0.105', // Додає доступність з локальної мережі
        port: 7777 // Встановлює порт (можете залишити його коментованим, якщо ви не хочете його використовувати)
    })
}

export const html = () => {
    return gulp
        .src([
            "src/pug/*.pug"
        ])
        .pipe(pug({
            //pretty: true
        }))
        .pipe(gulp.dest("docs"))
        .pipe(browserSync.reload({
            stream: true
        }))
}

export const css = () => {
    return gulp
        .src([
            "src/sass/*.css",
            "src/sass/*.sass",
            "src/sass/stylesheet.sass"
        ])
        .pipe(sass({
            outputStyle: "compressed" //expanded, compact
        })
            .on("error", sass.logError))
        .pipe(autoprefixer(["last 15 version"], {
            cascade: true
        }))
        .pipe(gcmq('style.css'))
        .pipe(concat("style.css"))
        .pipe(cleanCSS({
            compatibility: "ie8"
        }))
        .pipe(gulp.dest("docs/css"))
        .pipe(browserSync.reload({
            stream: true
        }))
}

export const js = () => {
    return gulp
        .src([
            "src/js/**/*.js"
        ])
        // .pipe(uglify.default())
        .pipe(concat("scripts.js"))
        .pipe(gulp.dest("docs/js"))
        .pipe(browserSync.reload({
            stream: true
        }))
}

export const files = () => {
    return gulp
    .src([
        "src/*.*"
    ], {dot: true})
    .pipe(gulp.dest("docs"))
    .pipe(browserSync.reload({
        stream: true
    }))
}

export const fonts = () => {
    return gulp
    .src([
        "src/fonts/**/*.*"
    ], {dot: true})
    .pipe(gulp.dest("docs/fonts"))
    .pipe(browserSync.reload({
        stream: true
    }))
}

export const images = () => {
    return gulp
    .src([
        "src/img/*.*"
    ], {dot: true})
    .pipe(cache(imagemin()))
    .pipe(gulp.dest("docs/img"))
    .pipe(browserSync.reload({
        stream: true
    }))
}

export const clear = () => {
    return Cache.clearAll()
}

export const delDocs = () => {
    return del("docs")
}

export const watch = () => {
    gulp.watch("src/sass/**/*.sass", gulp.parallel(css))
    gulp.watch("src/js/**/*.js", gulp.parallel(js))
    gulp.watch("src/pug/**/*.pug", gulp.parallel(html))
    gulp.watch("src/*.*", gulp.parallel(files))
    gulp.watch("src/fonts/**/*.*", gulp.parallel(fonts))
    gulp.watch("src/img/*.*", gulp.parallel(images))
}

export default gulp.series(
    delDocs,
    gulp.parallel(
        watch,
        html,
        css,
        js,
        files,
        fonts,
        images,
        browserSyncFunc
    )
)