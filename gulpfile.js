const gulp = require("gulp");
const plumber = require("gulp-plumber");
const sourcemap = require("gulp-sourcemaps");
const less = require("gulp-less");
const del = require("del");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const csso = require("gulp-csso");
const rename = require("gulp-rename");
const imagemin = require("gulp-imagemin");
const webp = require("gulp-webp");
const svgstore = require("gulp-svgstore");
const htmlmin = require("gulp-htmlmin");
const uglify = require("gulp-uglify-es").default;
const sync = require("browser-sync").create();

// Styles

const styles = () => {
  return gulp.src("source/less/style.less")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(less())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(csso())
    .pipe(rename("style.min.css"))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("build/css"))
    .pipe(sync.stream());
}

exports.styles = styles;

// Images

const images = () => {
  return gulp.src("source/img/**/*.{png,jpg,svg}")
    .pipe(imagemin([
      imagemin.optipng({optimizationLevel: 3}),
      imagemin.mozjpeg({progressive: true}),
      imagemin.svgo()
    ]))
    .pipe(gulp.dest("source/img"));
}

exports.images = images;

// Webp

const webpImg = () => {
  return gulp.src("source/img/**/*.{png,jpg}")
    .pipe(webp({quality: 90}))
    .pipe(gulp.dest("source/img"));
}

exports.webpImg = webpImg;

// Sprite

const sprite = () => {
  return gulp.src("source/img/**/{icon-*,icon_*,academy-*}.svg")
    .pipe(svgstore())
    .pipe(rename("sprite.svg"))
    .pipe(gulp.dest("build/img"));
}

exports.sprite = sprite;

// HTML

const html = () => {
  return gulp.src("source/*.html", {base: "source"})
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest("build"))
    .pipe(sync.stream());
}

exports.html = html;

// JS

const js = () => {
  return gulp.src("source/js/**/*.js")
    .pipe(uglify())
    .pipe(rename({extname: ".min.js"}))
    .pipe(gulp.dest("build/js"))
    .pipe(sync.stream());
}

exports.js = js;

// Copy

const copy = () => {
  return gulp.src([
    "source/fonts/**/*.{woff,woff2}",
    "source/img/**",
    "source/js/**",
    "source/*.ico"
    ], {
    base: "source"
    })
    .pipe(gulp.dest("build"));
}

exports.copy = copy;

// Clean

const clean = () => {
  return del("build");
}

exports.clean = clean;

// Build

const build = gulp.series(
  clean, images, webpImg, copy, styles, sprite, html, js
);

exports.build = build;

// Server

const server = (done) => {
  sync.init({
    server: {
      baseDir: 'build'
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

exports.server = server;

// Watcher

const watcher = () => {
  gulp.watch("source/less/**/*.less", gulp.series("styles"));
  gulp.watch("source/*.html", gulp.series("html")).on("change", sync.reload);
  gulp.watch("source/js/*.js", gulp.series("js"));
}

exports.default = gulp.series(
  build, server, watcher
);
