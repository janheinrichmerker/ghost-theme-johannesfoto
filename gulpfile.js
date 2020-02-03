'use strict';

const {series, parallel, src, dest} = require("gulp");
const sass = require("gulp-sass");
const del = require("del");
const webpack = require("webpack-stream");
const uglify = require("gulp-uglify");
const autoPrefix = require("gulp-autoprefixer");
const csso = require("gulp-csso");
const rename = require('gulp-rename');
const zip = require('gulp-zip');

function styles() {
    return src("assets/css/main.scss")
        .pipe(sass({
            outputStyle: "nested",
            precision: 10,
            includePaths: ['.'],
            onError: console.error.bind(console, 'Sass error:')
        }))
        .pipe(autoPrefix())
        .pipe(csso())
        .pipe(dest("dist/assets/css"));
}

function fonts() {
    return src("node_modules/@fortawesome/fontawesome-free/webfonts/fa-brands*")
        .pipe(dest("dist/assets/fonts"));
}

function assets() {
    return src(["assets/**", "!assets/js/**", "!assets/css/**"])
        .pipe(dest("dist/assets"));
}

function scripts() {
    let mode;
    if (process.env.NODE_ENV === "production") {
        mode = "production";
    } else {
        mode = "development";
    }
    return src("assets/js/main.js")
        .pipe(webpack({
            mode: mode,
            output: {
                filename: "main.js",
            }
        }))
        .pipe(dest("dist/assets/js"))
        .pipe(uglify())
        .pipe(rename({
            extname: '.min.js'
        }))
        .pipe(dest("dist/assets/js"));
}

function templates() {
    return src(["**/*.hbs", "!dist/**", "!node_modules/**"], {base: "."})
        .pipe(dest("dist"));
}

function meta() {
    return src(["package.json", "README.md"])
        .pipe(dest("dist"));
}

function clean() {
    return del(["dist"]);
}

exports.clean = clean;

const build = series(
    clean,
    parallel(
        styles,
        fonts,
        assets,
        scripts,
        templates,
        meta
    )
);
exports.build = build;

const bundle = series(
    build,
    function () {
        return src("dist/**")
            .pipe(zip("johannesfoto.zip"))
            .pipe(dest("dist"));
    }
);
exports.bundle = bundle;

exports.default = build;