'use strict';

const gulp = require('gulp');
const $ = require('gulp-load-plugins')();
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const series = require('stream-series');
const del = require('del');
const vinylPaths = require('vinyl-paths');
const http = require('http');
const runSequence = require('run-sequence');
const browserSync = require('browser-sync').create();
const babel = require('gulp-babel');
const pug = require('gulp-pug');
const browserify = require('browserify');

const path = {
  js: {
    src: 'public/**/*.js',
    entry: 'public/scripts/index.js',
    dist: 'dist/**/*.js'
  },
  pug: {
    src: 'public/**/*.pug'
  },
  indexHtml: 'dist/index.html',
  css: {
    main: 'dist/styles/index.css',
    dest: 'dist'
  },
  scss: {
    variables: 'public/styles/variables.scss',
    mixins: 'public/styles/mixins.scss',
    src: 'public/**/*.scss',
    main: 'public/styles/index.scss'
  },
  img: ['public/**/*.png', 'public/**/*.svg', 'public/**/*.jpg'],
  dist: 'dist'
};

gulp.task('serve', cb => { 
  runSequence(
    'clean',
    'images',
    'styles',
    'bundle',
    'pug',
    'start',
    'watch',
    cb
  );
});

gulp.task('clean', () => {
  return del([
    path.dist
  ], {
    dot: true
  });
});

gulp.task('bundle', () => {
  const b = browserify({
    entries: path.js.entry,
    debug: true
  });

  return b.bundle()
    .pipe(source('index.js'))
    .pipe(buffer())
    .pipe(babel())
    .pipe(gulp.dest(path.dist));
});

gulp.task('styles', () => {
  const sassOptions = {
    style: 'expanded'
  };
  const variables = gulp.src(path.scss.variables, {read: false});
  const mixins = gulp.src(path.scss.mixins, {read: false});
  const inject = gulp.src([
    path.scss.src,
    `!${path.scss.main}`,
    `!${path.scss.variables}`,
    `!${path.scss.mixins}`,
    '!node_modules/**/*.scss'
  ], { read: false });
  const options = {
    transform: function(filePath) {
        return `@import "${filePath}";`;
    },
    starttag: '// injector',
    endtag: '// endinjector',
    addRootSlash: false
  };

  return gulp.src(path.scss.main)
    .pipe($.inject(series(variables, mixins, inject), options))
    .pipe($.sourcemaps.init())
    .pipe($.sass(sassOptions)).on('error', errorHandler('Sass'))
    .pipe($.autoprefixer()).on('error', errorHandler('Autoprefixer'))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest(path.css.dest));
});

gulp.task('images', () => {
  return gulp.src(path.img)
    .pipe(gulp.dest(path.dist));
});

gulp.task('pug', () => {
  return gulp.src(path.pug.src)
    .pipe(pug({
      pretty: true
    }))
    .pipe(gulp.dest(path.dist))
});

gulp.task('start', cb => {
  browserSync.init({
    server: true,
    index: 'dist/index.html',
    notify: false,
    files: path.scss.src
  });
  cb();
});

gulp.task('watch', () => {

  gulp.watch(path.scss.src, ['styles']);

  gulp.watch(path.img, () => runSequence('clean', 'images', 'styles', 'bundle', 'pug'));

  gulp.watch(path.js.src, () => {
    runSequence('bundle', 'reload');
  });

  gulp.watch(path.pug.src, ['pug', 'reload']);

});

gulp.task('reload', function (cb) {
  browserSync.reload();
  cb();
})

function errorHandler(name) {
  return function (err) {
    $.util.log($.util.colors.red(`[${name}]`), err.toString());
    this.emit('end');
  }
}