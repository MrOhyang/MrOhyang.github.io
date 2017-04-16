/**
 * Created by ouyangyibin on 2017-01-23 09:54:03
 */
var gulp = require('gulp');
var less = require('gulp-less');
var rename = require('gulp-rename');
var notify = require('gulp-notify');
var uglify = require('gulp-uglify');

// 编译 main.less
gulp.task('less', function (cb) {
    return gulp.src('bin/less/main.less')
        // .pipe(less({ compress: true }))
        .pipe(less({ compress: false }))
        .on('error', notify.onError({
            title: 'Error running something',
            message: 'Error: <%=error.message %>'
        }))
        .pipe(rename({ extname: '.min.css' }))
        .pipe(gulp.dest('bin/css/'));
});

// 监听 less 变化
gulp.task('watch', ['less'], function () {
    // less watching
    var watcher = gulp.watch('bin/less/**/*.less', ['less']);
    watcher.on('change', function (event) {
        var path = event.path.substring(
            event.path.indexOf('less\\')
        );
        console.log('┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉');
        console.log('File ' + path + ' was ' + event.type + ' bulid.');
    });
});

// build
gulp.task('default', ['less'], function () {
});