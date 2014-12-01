'use strict';


var gulp = require('gulp');

// copy various image assets to the distribution folder
gulp.task('copy-img', function() {
	return gulp.src([
			'./app/images/**/*.png',
			'./app/images/**/*.jpg',
			'./app/images/**/*.jpeg',
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

// This file is needed for clipboard copying
gulp.task('copy-clip', function() {
	return gulp.src('./bower_components/zeroclipboard/dist/*.swf')
		.pipe(gulp.dest('./dist/zeroclipboard'));
});

// copy the various html assets to the distribution folder
gulp.task('copy-html', function() {
	var replace = require('gulp-replace');
	var stream  = gulp.src('./app/index.html');

	// When running in 'production' environment, we use minified assets.
	if(process.env.NODE_ENV === 'production') {
		stream.pipe(replace('app.js',           'app.min.js'));
		stream.pipe(replace('angular.js',       'angular.min.js'));
		stream.pipe(replace('TweenLite.js',     'TweenLite.min.js'));
		stream.pipe(replace('Draggable.js',     'Draggable.min.js'));
		stream.pipe(replace('CSSPlugin.js',     'CSSPlugin.min.js'));
		stream.pipe(replace('ZeroClipboard.js', 'ZeroClipboard.min.js'));
	}

	return stream.pipe(gulp.dest('./dist/'));
});

// Copy the 'global' libraries (non-browserify) to a 'scripts/lib' folder.
gulp.task('copy-vendor', function() {
	return gulp.src([
			'./node_modules/angular/angular.js',
			'./node_modules/angular/angular.min.js',

			'./node_modules/gsap/src/uncompressed/TweenLite.js',
			'./node_modules/gsap/src/minified/TweenLite.min.js',

			'./node_modules/gsap/src/uncompressed/utils/Draggable.js',
			'./node_modules/gsap/src/minified/utils/Draggable.min.js',


			'./node_modules/gsap/src/uncompressed/plugins/CSSPlugin.js',
			'./node_modules/gsap/src/minified/plugins/CSSPlugin.min.js',

			'./node_modules/zeroclipboard/dist/ZeroClipboard.js',
			'./node_modules/zeroclipboard/dist/ZeroClipboard.min.js',
		])
		.pipe(gulp.dest('./dist/scripts/lib/'));
});

// shorthand to run all static copy tasks in one go
gulp.task('copy', [
	'copy-img', 'copy-font', 'copy-clip', 'copy-html', 'copy-vendor',
]);

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
	var source     = require('vinyl-source-stream');
	var browserify = require('browserify');
	var envify     = require('envify');
	var exposify   = require('exposify');
	var partialify = require('partialify');

	// Configure 'globals' that are 'requirable'.
	exposify.config = {
		'angular':       'angular',
		'TweenLite':     'TweenLite',
		'Draggable':     'Draggable',
		'CSSPlugin':     'CSSPlugin',
		'ZeroClipboard': 'ZeroClipboard',
	}

	var stream = browserify('./app/scripts/index.js', {
			'debug': process.env.NODE_ENV != 'production',
		})
		.transform(envify).transform(partialify).transform(exposify).bundle();

	return stream.pipe(source('app.js'))
		.pipe(gulp.dest('./dist/scripts/'));
});

// serve the static content and start a livereload server
gulp.task('serve', ['sass', 'uglify', 'copy'], function() {
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
	gulp.watch('./app/**/*.html',        ['copy-html', 'uglify']);
	gulp.watch('./app/scripts/**/*.js',  ['jshint', 'uglify']);
	gulp.watch('./app/styles/**/*.scss', ['sass']);
});
