var gulp = require('gulp');
var sass = require('gulp-sass');
var react = require('gulp-react');

gulp.task('sass', function(){
	return gulp.src('sass/**/*.scss')
		.pipe(sass({
			outputStyle: 'expanded'
		}))
		.pipe(gulp.dest('css/'))
});

gulp.task('react', function(){
	return gulp.src('js/react/src/**/*.js')
		.pipe(react())
		.pipe(gulp.dest('js/react/build'))
});

gulp.task('react_coc', function(){
	return gulp.src('ACoc/js/react/src/**/*.js')
		.pipe(react())
		.pipe(gulp.dest('ACoc/js/react/build'))
});

gulp.task('sass_h5', function(){
	return gulp.src('AH5/sass/**/*.scss')
		.pipe(sass({
			outputStyle: 'expanded'
		}))
		.pipe(gulp.dest('AH5/css/'))
});

gulp.task('watch', function(){
	var watcher_arr = [];

	// sass wataching
	watcher_arr.push(
		gulp.watch('sass/**/*.scss', ['sass'])
	);
	watcher_arr[watcher_arr.length-1].on('change', function(event){
		var path = /sass\\(?:([^\s]+))$/.exec(event.path)[1];
		console.log('File ' + path + ' was ' + event.type + ' run [sass] task.');
	});

	// react wataching
	watcher_arr.push(
		gulp.watch('js/react/src/**/*.js', ['react'])
	);
	watcher_arr[watcher_arr.length-1].on('change', function(event){
		var path = /js\\react\\src\\(?:([^\s]+))$/.exec(event.path)[1];
		console.log('File ' + path + ' was ' + event.type + ' run [react] task.');
	});
});

gulp.task('watch_coc', function(){
	var watcher_arr = [];

	// react wataching
	watcher_arr.push(
		gulp.watch('ACoc/js/react/src/**/*.js', ['react_coc'])
	);
	watcher_arr[watcher_arr.length-1].on('change', function(event){
		var path = /ACoc\\js\\react\\src\\(?:([^\s]+))$/.exec(event.path)[1];
		console.log('File ' + path + ' was ' + event.type + ' run [react_coc] task.');
	});
});

gulp.task('watch_h5', function(){
	var watcher_arr = [];

	// AH5 sass watching
	watcher_arr.push(
		gulp.watch('AH5/sass/**/*.scss', ['sass_h5'])
	);
	watcher_arr[watcher_arr.length-1].on('change', function(event){
		var path = /AH5\\sass\\(?:([^\s]+))$/.exec(event.path)[1];
		console.log('File ' + path + ' was ' + event.type + ' run [sass_h5] task.');
	});
});

gulp.task('default', function(){
});