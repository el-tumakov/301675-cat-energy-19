"use strict";

var gulp = require("gulp");
var imagemin = require("gulp-imagemin");
var webp = require("gulp-webp");
var plumber = require("gulp-plumber");
var sourcemap = require("gulp-sourcemaps");
var rename = require("gulp-rename");
var svgstore = require("gulp-svgstore");
var sass = require("gulp-sass");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var csso = require("gulp-csso");
var server = require("browser-sync").create();
var concat = require("gulp-concat");
var uglify = require("gulp-uglify");
var del = require("del");
var htmlmin = require("gulp-htmlmin");

gulp.task("images", function () {
  return gulp.src("source/img/**/*.{png,jpg,svg}")
    .pipe(imagemin([
      imagemin.optipng({optimizationLevel: 3}),
      imagemin.mozjpeg({quality: 85, progressive: true}),
      imagemin.svgo()
    ]))
    .pipe(gulp.dest("source/img"));
 });

gulp.task("webp", function () {
  return gulp.src("source/img/**/*.{png,jpg}")
    .pipe(webp({quality: 90}))
    .pipe(gulp.dest("source/img"));
});

gulp.task("sprite", function () {
  return gulp.src("source/img/spr-*.svg")
    .pipe(svgstore({
      inlineSvg: true
    }))
    .pipe(rename("sprite.svg"))
    .pipe(gulp.dest("build/img"));
});

gulp.task("css", function () {
  return gulp.src("source/sass/style.scss")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(gulp.dest("build/css"))
    .pipe(csso())
    .pipe(rename("style.min.css"))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("build/css"))
    .pipe(server.stream());
});

gulp.task("cleanScript", function () {
  return del("build/js/script.js");
});

gulp.task("script", function () {
  return gulp.src("source/js/*.js")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(concat("script.js"))
    .pipe(uglify())
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("build/js"))
    .pipe(server.stream());
});

gulp.task("htmlminify", function () {
  return gulp.src("source/*.html")
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest("build"));
});

gulp.task("copy", function () {
  return gulp.src([
    "source/fonts/**/*.{woff,woff2}",
    "source/img/**",
    "source/*.ico"
  ], {
    base: "source"
  })
  .pipe(gulp.dest("build"));
});

gulp.task("clean", function () {
  return del("build");
});

gulp.task("refresh", function (done) {
  server.reload();
  done();
 });

gulp.task("server", function () {
  server.init({
    server: "build/",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch("source/sass/**/*.scss", gulp.series("css"));
  gulp.watch("source/img/spr-*.svg", gulp.series("sprite", "refresh"));
  gulp.watch("source/js/**/*.js", gulp.series("cleanScript", "script"));
  gulp.watch("source/*.html", gulp.series("htmlminify", "refresh"));
});


gulp.task("build", gulp.series(
  "clean",
  "copy",
  "htmlminify",
  "css",
  "cleanScript",
  "script",
  "sprite"
));

gulp.task("start", gulp.series(
  "build",
  "server"
  ));
