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
    return gulp.src('less/main.less')
        // .pipe(less({ compress: true }))
        .pipe(less({ compress: false }))
        .on('error', notify.onError({
            title: 'Error running something',
            message: 'Error: <%=error.message %>'
        }))
        .pipe(rename({ extname: '.min.css' }))
        .pipe(gulp.dest('css/'));
});

// 监听 less 变化
gulp.task('watch', ['less'], function () {
    // less watching
    var watcher = gulp.watch('less/**/*.less', ['less']);
    watcher.on('change', function (event) {
        var path = event.path.substring(
            event.path.indexOf('less\\')
        );
        console.log('┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉');
        console.log('File ' + path + ' was ' + event.type + ' bulid.');
    });
});

// 压缩混淆 js
gulp.task('mjs', function() {
    return gulp.src([
            'js/*.js',
            'js/lib/fastclick.js',
            'js/lib/imlayer.js'
        ],{base: 'js'})
        .pipe(uglify())
        .pipe(rename({extname: '.js'}))
        .pipe(gulp.dest('.', {cwd: 'js/build'}));
});

// 复制 js
gulp.task('copyJs', ['mjs'], function() {
    // return gulp.src(['static/js/utils/jweixin-1.0.0.js'])
    //     .pipe(gulp.dest('static/js/dist/utils'))
});

// build
gulp.task('default', ['less', 'mjs', 'copyJs'], function () {
});