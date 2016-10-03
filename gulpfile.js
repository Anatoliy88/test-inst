'use strict';

var gulp = require('gulp'),
    notify = require("gulp-notify"),
    browserSync = require('browser-sync'),
    autoprefixer = require('gulp-autoprefixer'),
    stylus = require('gulp-stylus'),
    pug = require('gulp-pug'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    concat = require('gulp-concat'),
    uglifyjs = require('gulp-uglifyjs'),
    minifyCss = require('gulp-minify-css'),
    del = require("del"),
    rename = require("gulp-rename"),    
    plumber = require('gulp-plumber'),
    cache = require('gulp-cache');

// browser-sync server

gulp.task('browser-sync', function() {
  browserSync({
    server: {
      baseDir: 'app'
    }
  });
});

//pug

gulp.task('pug', function buildHTML() {
  return gulp.src('app/pug/**/*.pug')
  .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
  .pipe(pug({
    pretty: true
  }))
  .pipe(gulp.dest('app/'))
});

// stylus

gulp.task('stylus', function () {
  return gulp.src('app/stylus/main.styl')
  .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
  .pipe(stylus({
    compress: true
  }))
  .pipe(autoprefixer({
          browsers: ['last 15 versions','> 1%', 'ie 8', 'ie 7'],
          cascade: false
      }))
  .pipe(minifyCss({compatibility: 'ie8'}))
  .pipe(rename({suffix: '.min'}))
  .pipe(gulp.dest('app/css'))
  .pipe(browserSync.reload({stream: true}))
});

// scripts

gulp.task('libs', function(){
  return gulp.src([
    'app/assets/jquery/dist/jquery.min.js',
    // 'app/assets/owl-carousel/owl-carousel/owl.carousel.min.js'
  ])
  .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
  .pipe(concat('libs.min.js'))
  .pipe(uglifyjs())
  .pipe(gulp.dest('app/js'));
});

gulp.task('js', function(){
  return gulp.src([
    'app/js/main.js'
  ])
  .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
  .pipe(concat('main.min.js'))
  .pipe(uglifyjs())
  .pipe(gulp.dest('app/js'));
});

// watch

gulp.task('watch',['browser-sync', 'stylus', 'libs', 'pug', 'js'], function () {
  gulp.watch('app/stylus/**/*.styl', ['stylus']);
  gulp.watch('app/pug/**/*.pug', ['pug']);
  gulp.watch('app/*.html', browserSync.reload);
  gulp.watch('app/js/**/*.js', browserSync.reload);
});

// clean

gulp.task('clean', function() {
  return del.sync('dist');
});

// imagemin

gulp.task('img', function() {
  return gulp.src('app/assets/images/**/*')
    .pipe(cache(imagemin({
      progressive: true,
      svgoPlugins: [{removeViewBox: false}],
      use: [pngquant({})]
    })))
    .pipe(gulp.dest('dist/assets/images'));
});

//build

gulp.task('build', ['clean', 'img', 'stylus', 'libs'], function() {

  var buildCss = gulp.src([
      'app/css/main.min.css'
    ])
    .pipe(gulp.dest('dist/css'));

  var buildFonts = gulp.src('app/assets/fonts/**/*')
    .pipe(gulp.dest('dist/fonts'));

  var buildJs = gulp.src('app/js/**/*')
    .pipe(gulp.dest('dist/js'));

  var buildHtml = gulp.src('app/*.html')
    .pipe(gulp.dest('dist'));

});

//clear cache

gulp.task('clear', function (callback) {
  return cache.clearAll();
});

// default

gulp.task('default', ['watch']);
