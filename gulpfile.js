const gulp = require('gulp');
const plumber = require('gulp-plumber');
const sourcemap = require('gulp-sourcemaps');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const server = require('browser-sync').create();
const csso = require('gulp-csso');
const rename = require('gulp-rename');
const svgstore = require('gulp-svgstore');
const del = require('del');
const tildeImporter = require('node-sass-tilde-importer');
const webpackStream = require('webpack-stream');
const webpackConfig = require('./webpack.config.js');
const gcmq = require('gulp-group-css-media-queries');


const html = () => {
  return gulp.src('src/*.html')
    .pipe(plumber())
    .pipe(gulp.dest('build'));
}

const css = () => {
  return gulp.src('src/styles/style.scss')
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass({
      importer: tildeImporter
    }))
    .pipe(postcss([autoprefixer({
      grid: true,
    })]))
    .pipe(gcmq())
    .pipe(csso())
    .pipe(rename('style.min.css'))
    .pipe(sourcemap.write('.'))
    .pipe(gulp.dest('build/css'))
    .pipe(server.stream());
};

const js = () => {
  return gulp.src(['src/js/main.js'])
    .pipe(webpackStream(webpackConfig))
    .pipe(gulp.dest('build/js'))
};

const copy = () => {
  return gulp.src([
    'src/fonts/**',
    'src/img/**',
  ], {
    base: 'src',
  })
    .pipe(gulp.dest('build'));
};

const clean = () => {
  return del('build');
};

const sprite = () => {
  return gulp.src('src/img/sprite/*.svg')
    .pipe(svgstore({inlineSvg: true}))
    .pipe(rename('sprite.svg'))
    .pipe(gulp.dest('build/img'));
};

const copySvg = () => {
  return gulp.src('src/img/**/*.svg', {base: 'src'})
    .pipe(gulp.dest('build'));
};

const copyImages = () => {
  return gulp.src('src/img/**/*.{png,jpg,webp}', {base: 'src'})
    .pipe(gulp.dest('build'));
};

const syncServer = () => {
  server.init({
    server: 'build/',
    index: 'index.html',
    notify: false,
    open: true,
    cors: true,
    ui: false,
  });

  gulp.watch('src/*.html', gulp.series(html, refresh));
  gulp.watch('src/styles/**/*.{scss,sass}', gulp.series(css));
  gulp.watch('src/js/**/*.{js,json}', gulp.series(js, refresh));
  gulp.watch('src/img/**/*.svg', gulp.series(copySvg, sprite, html, refresh));
  gulp.watch('src/img/**/*.{png,jpg,webp}', gulp.series(copyImages, html, refresh));
};

const refresh = (done) => {
  server.reload();
  done();
};

const start = gulp.series(clean, html, css, js, copy, sprite, syncServer);
const build = gulp.series(clean, html, css, js, copy, sprite);

exports.start = start;
exports.build = build;
