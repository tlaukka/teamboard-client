'use strict';


var gulp = require('gulp');

// copy various image assets to the distribution folder
gulp.task('copy-img', function() {
	return gulp.src([
			'./app/images/**/*.png',
			'./app/images/**/*.jpg',
			'./app/images/**/*.svg',
			'./app/images/**/*.ico',
		])
		.pipe(gulp.dest('./dist/images'));
});

// copy various font assets to the distribution folder
gulp.task('copy-font', function() {
	return gulp.src([
			'./bower_components/bootstrap-sass-official/vendor/assets/fonts/**/*.svg',
			'./bower_components/bootstrap-sass-official/vendor/assets/fonts/**/*.ttf',
			'./bower_components/bootstrap-sass-official/vendor/assets/fonts/**/*.woff',
			'./bower_components/fontawesome/**/*.svg',
			'./bower_components/fontawesome/**/*.ttf',
			'./bower_components/fontawesome/**/*.woff'
		])
		.pipe(gulp.dest('./dist/styles'));
});

// copy the various html assets to the distribution folder
gulp.task('copy-html', function() {
	var replace = require('gulp-replace');
	var stream  = gulp.src('./app/index.html');

	if(process.env.NODE_ENV === 'production') {
		// use minified: app.min.js
		stream.pipe(replace('app.js', 'app.min.js'));
	}

	return stream.pipe(gulp.dest('./dist/'));
});

// shorthand to run all static copy tasks in one go
gulp.task('copy', ['copy-img', 'copy-font', 'copy-html']);

// compile sass and concatenate to a single file in the distribution folder
gulp.task('sass', function() {

	var sass   = require('gulp-ruby-sass');
	var concat = require('gulp-concat');

	return gulp.src([
			'./app/styles/**/*.scss',
			'./bower_components/**/*.scss',
		])
		.pipe(sass())
		.pipe(concat('main.css'))
		.pipe(gulp.dest('./dist/styles/'));
});

gulp.task('jshint', function() {

		var jshint  = require('gulp-jshint');
		var stylish = require('jshint-stylish');

		return gulp.src('./app/scripts/**/*.js')
			.pipe(jshint('.jshintrc'))
			.pipe(jshint.reporter(stylish));
});

// run the browserify tool with browserify shim for bower support
gulp.task('browserify', function() {

	var _          = require('lodash');
	var source     = require('vinyl-source-stream');
	var browserify = require('browserify');
	var envify     = require('envify');
	var partialify = require('partialify');

	var stream = browserify('./app/scripts/index.js')
		.transform(envify)
		.transform(partialify)
		.bundle({ debug: process.env.NODE_ENV != 'production' });

	return stream.pipe(source('app.js'))
		.pipe(gulp.dest('./dist/scripts/'));
});

// serve the static content and start a livereload server
gulp.task('serve', ['sass', 'browserify', 'copy'], function() {

	var server = require('gulp-webserver');

	var serverOpts = { livereload: true, fallback: 'index.html' }

	if(process.env.HOSTNAME) {
		serverOpts.host = process.env.HOSTNAME;
	}

	return gulp.src('./dist').pipe(server(serverOpts));
});

gulp.task('uglify', ['browserify'], function() {
	var uglify = require('gulp-uglify');
	var rename = require('gulp-rename');

	return gulp.src('./dist/scripts/app.js')
		.pipe(uglify({ mangle: false }))
		.pipe(rename('app.min.js'))
		.pipe(gulp.dest('./dist/scripts/'));
});

gulp.task('build', ['uglify', 'sass', 'copy']);

// build the application, start a livereload server and set watchers
gulp.task('default', ['serve'], function() {
	gulp.watch('./app/**/*.html',        ['copy-html', 'browserify']);
	gulp.watch('./app/scripts/**/*.js',  ['jshint', 'browserify']);
	gulp.watch('./app/styles/**/*.scss', ['sass']);
});
