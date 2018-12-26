'use strict';

import {src, dest, watch, parallel, series} from 'gulp';
import cssMin from 'gulp-clean-css'
import concat from 'gulp-concat'
import googleWebFonts from 'gulp-google-webfonts'
import gulp from 'gulp'
import imageMin from 'gulp-imagemin'
import merge from 'merge-stream'
import plumber from 'gulp-plumber'
import prefixer from 'gulp-autoprefixer'
import rimraf from 'rimraf'
import sass from 'gulp-sass'
import uglify from 'gulp-uglify-es'
import sourceMaps from 'gulp-sourcemaps'

const template = 'kiev24'

const dir = {
    src: `src-${template}`,
    build: `local/templates/${template}`,
    nm: `node_modules/`
}

// Declare path object with project paths
const path = {
    build: {
        js: `${dir.build}`,
        css: `${dir.build}`,
        images: `${dir.build}/images/`,
        fonts: `${dir.build}/fonts/`
    },
    src: {
        js: [
            `${dir.nm}/jquery/dist/jquery.min.js`,
            `${dir.nm}/owl.carousel/dist/owl.carousel.min.js`,
            `${dir.nm}/bootstrap/dist/js/bootstrap.bundle.js`,
            `${dir.nm}/jasny-bootstrap/dist/js/jasny-bootstrap.min.js`,
            `${dir.nm}/lightbox2/src/js/lightbox.js`,
            `${dir.nm}/jquery.cookie/jquery.cookie.js`,
            `${dir.nm}/js-cookie/src/js.cookie.js`,
            `${dir.src}/js/partials/**/*.js`,
            `${dir.src}/js/helper.js`
        ],
        scss: [
            `${dir.nm}/bootstrap/scss/bootstrap.scss`,
            `${dir.nm}/owl.carousel/src/scss/owl.carousel.scss`,
            `${dir.nm}/owl.carousel/src/scss/owl.theme.default.scss`,
            `${dir.src}/styles/template_styles.scss`
        ],
        css: [
            `${dir.build}/fonts.css`,
            `${dir.nm}/lightbox2/dist/css/lightbox.css`,
            `${dir.nm}/jasny-bootstrap/dist/css/jasny-bootstrap.css`
        ],
        fonts: `${dir.src}/fonts/`,
        images: `${dir.src}/images/**/*.*`,
        webFonts: 'fonts.list',
        fontAwesome: 'node_modules/@fortawesome/fontawesome-free/webfonts/*.*'
    },
    watch: {
        js: `${dir.src}/js/**/*.js`,
        styles: `${dir.src}/styles/**/*.scss`,
        images: `${dir.src}/images/**/*.*`
    },
    clean: `${dir.build}`
}

// Options for Google WebFonts
const options = {
    fontsDir: 'fonts',
    cssDir: ''
    //cssFilename: 'fonts.css'
}

// Clean build folder
export const clean = (cb) => rimraf(path.clean, cb)

// Download web fonts and put them to source, then copy to build
export const buildFonts = () => {
    let google = src(path.src.webFonts)
        .pipe(googleWebFonts(options))
        .pipe(dest(`${dir.build}`));

    let fontAwesome = gulp.src(path.src.fontAwesome)
        .pipe(dest(path.build.fonts));

    return merge(google, fontAwesome);
}

// Minify images and copy them to build
export const buildImages = () => src(path.src.images)
    .pipe(imageMin({
        progressive: true,
        svgoPlugins: [{ removeViewBox: false }],
        interlaced: true
    }))
    .pipe(dest(path.build.images))

// Compile one JS-file of all scripts with mapping file
export const buildScripts = () => src(path.src.js)
    .pipe(plumber())
    .pipe(sourceMaps.init())
    .pipe(concat('app.js'))
    .pipe(uglify())
    .pipe(sourceMaps.write('.'))
    .pipe(plumber.stop())
    .pipe(dest(path.build.js))

// Compile CSS-file from all SASS and CSS with mapping and put it to build
export const buildStyles = () => {
    let scssFiles = src(path.src.scss)
        .pipe(sass())
        .pipe(concat('styles.scss'));

    let cssFiles = src(path.src.css)
        .pipe(concat('styles.css'));

    return merge(scssFiles, cssFiles)
        .pipe(concat('template_styles.css'))
        .pipe(plumber())
        .pipe(sourceMaps.init())
        .pipe(prefixer())
        .pipe(cssMin())
        .pipe(sourceMaps.write('.', {debug: true}))
        .pipe(plumber.stop())
        .pipe(dest(path.build.css))
}

// Starting watch
export const devWatch = () => {
    watch(path.watch.styles, buildStyles);
    watch(path.watch.images, buildImages);
    watch(path.watch.js, buildScripts);
}

// Development Task
export const dev = series(parallel(buildStyles, buildScripts), devWatch)

// Serve Task
export const build = series(parallel(buildStyles, buildScripts))

// Default task
export default dev;