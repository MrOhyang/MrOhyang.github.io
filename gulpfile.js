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

gulp.task('default', ['sass', 'react'], function(){
	console.log('build. run tasks...[\'sass\', \'react\']');
});