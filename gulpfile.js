'use strict';

const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const plumber = require('gulp-plumber');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const server = require('browser-sync').create();
const mqpacker = require('css-mqpacker');
const minify = require('gulp-csso');
const rename = require('gulp-rename');
const imagemin = require('gulp-imagemin');
const run = require('run-sequence');
const del = require('del');

gulp.task('style', function() {
  gulp.src('sass/style.scss')
    .pipe(plumber())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer(),
      mqpacker({
        sort: true
      })
    ]))
    .pipe(gulp.dest('build/css'))
    .pipe(minify())
    .pipe(rename('style.min.css'))
    .pipe(gulp.dest('build/css'))
    .pipe(gulp.dest('css'))
    .pipe(server.stream());
});

gulp.task('images', function() {
  return gulp.src('build/img/**/*.{png,jpg,gif}')
    .pipe(imagemin([
      imagemin.optipng({optimizationLevel: 3}),
      imagemin.jpegtran({progressive: true})
    ]))
    .pipe(gulp.dest('build/img'))
    .pipe(gulp.dest('img'));
});

gulp.task('html:copy', function() {
  return gulp.src('*.html')
    .pipe(gulp.dest('build'));
});

gulp.task('html:update', ['html:copy'], function(done) {
  server.reload();
  done();
});

gulp.task('js:copy', function() {
  return gulp.src('js/**/*.js')
    .pipe(gulp.dest('build/js'));
});

gulp.task('js:update', ['js:copy'], function(done) {
  server.reload();
  done();
});

gulp.task('serve', function() {
  server.init({
    server: 'build/',
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch('sass/**/*.{scss,sass}', ['style']);
  gulp.watch('*.html', ['html:update']);
  gulp.watch('js/**/*.js', ['js:update']);
});

gulp.task('build', function(fn) {
  run(
    'clean',
    'copy',
    'copy-img',
    'style',
    'images',
    fn
  );
});

gulp.task('copy', function() {
  return gulp.src([
      'fonts/**/*.{woff,woff2}',
      'js/**/*.js',
      '*.html',
      '*.ico'
    ], {
      base: '.'
    })
    .pipe(gulp.dest('build'));
});

gulp.task('copy-img', function() {
  return gulp.src('img-src/*.{png,jpg,gif,svg}')
    .pipe(gulp.dest('build/img'))
    .pipe(gulp.dest('img'));
});

gulp.task('clean', function() {
  return del([
      'build',
      'css/*.css',
      'img/**/*.{png,jpg,gif,svg}'
    ]);
});
