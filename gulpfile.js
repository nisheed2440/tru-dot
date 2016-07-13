var gulp = require('gulp');
var wiredep = require('wiredep');
var inject = require('gulp-inject');
var sass = require('gulp-sass');
var sequence = require('run-sequence');
var browserSync = require('browser-sync').create();


gulp.task('wiredep', function () {
  return wiredep({
    src: 'index.html',
    exclude: []
  });
});

gulp.task('inject', function () {
  var target = gulp.src('./index.html');
  var sources = gulp.src([
    './app/app.js',
    './app/config/**/*.js',
    './app/services/**/*.js',
    './app/controllers/**/*.js',
    './app/components/**/*.js',
    './app/**/*.css'
  ], {read: false});
  return target.pipe(inject(sources, {relative: true}))
    .pipe(gulp.dest('./'));
});

gulp.task('sass', function () {
  return gulp.src('./app/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./app'));
});

gulp.task('default', function () {
  return sequence('sass', 'wiredep', 'inject');
});

gulp.task('watch', ['default'], browserSync.reload);

gulp.task('serve', ['default'], function () {

  // Serve files from the root of this project
  browserSync.init({
    server: {
      baseDir: "./"
    }
  });

  // add browserSync.reload to the tasks array to make
  // all browsers reload after tasks are complete.
  gulp.watch('./app/**/*.js', ['watch']);
  gulp.watch('./app/**/*.scss', ['watch']);
  gulp.watch('./app/**/*.html', ['watch']);
  gulp.watch('./*.html', ['watch']);
});
