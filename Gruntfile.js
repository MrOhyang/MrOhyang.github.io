module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        
        // Task
        sass: {
            dist: {
                options: {
                    sourcemap: 'none',
                    // compact 一行, compressed 压缩, expanded 展开
                    style: 'expanded'
                },
                files: [{
                    expand: true,
                    cwd: 'sass',
                    src: ['**/*.scss'],
                    dest: 'css/',
                    ext: '.css'
                }]
            }
        },
        react: {
            files: {
                expand: true,
                cwd: 'js/react/src',
                src: ['**/*.js'],
                dest: 'js/react/build/',
                ext: '.js'
            }
        },
        watch: {
            css: {
                files: ['sass/**/*.scss'],
                tasks: ['sass']
            },
            jsxTransition:{
                files: ['js/react/src/**/*.js'],
                tasks: ['react']
            }
        }
    });

    // 加载包含 "Tast" 任务的插件。
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-react');

    // 默认被执行的任务列表。
    grunt.registerTask('default', ['sass', 'watch']);

};