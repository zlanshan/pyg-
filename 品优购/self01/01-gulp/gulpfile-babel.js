const gulp = require('gulp');
/* 增加 babel的配置文件
用来告诉 babel 把哪个版本 编译成哪个版本  多用于js文件
 */
// 1.0 引入 编译js 插件
const babel = require('gulp-babel');
// 2.0 编写处理 js的任务
gulp.task('js', () => {
        return gulp.src('src/*.js')
            // 2.1 经过babel编译  .bavelrc是配置此文件的版本修改
            .pipe(babel())
            .pipe(gulp.dest('dist/js/'))
    })
    // gulp.task('css', () => {
    //     return gulp.src('src/*.css')
    //         .pipe(babel())
    //         .pipe(gulp.dest('dist/css/'))
    // })