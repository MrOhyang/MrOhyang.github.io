var gulp = require('gulp');
var browserify = require("browserify");
var babelify = require("babelify");
var source = require("vinyl-source-stream");
var reactify = require('reactify');

/*
	gulp.watch(glob [, opts], tasks);
*/

gulp.task('react', function(){
	// var b = browserify({
	// 	entries: 'js/react/src/index.js',
	// 	transform: [reactify]
	// });

	// return b.bundle()
	// .pipe(source('bundle.js'))
	// .pipe(gulp.dest('js/react/build/'))

	// return gulp.src('js/react/src/*.js')
	// 	.pipe(browserify({transform: [reactify]}))
	// 	.pipe(source('hei.js'))
	// 	.pipe(gulp.dest('js/react/build/'));

	// console.log(gulp.src('js/react/src/index.js'));

	browserify('js/react/src/index.js')
		.transform(reactify)
		.bundle()
		.pipe(source())
		.pipe(gulp.dest('js/react/build/'))
});

gulp.task('watch', function(){
	var watcher = gulp.watch('js/react/src/**/*.js', ['react']);
	watcher.on('change', function(event){
		var path = /js\\react\\src\\(?:([^\s]+))$/.exec(event.path)[1];
		console.log('File ' + path + ' was ' + event.type + ' run tasks...');
	});
});

gulp.task('default', function(){
});