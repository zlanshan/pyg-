const gulp = require('gulp');
// 1.0 编译less的插件
const less = require('gulp-less');
// 1.0 添加浏览器前缀的插件  
const autoprefixer = require('gulp-autoprefixer');
/* 
1 先把less文件编译成 css文件
2 再把css文件 添加前缀 
 */

//  2.0 编译 处理css的任务
gulp.task('css', () => {

    return gulp.src('src/*.less')
        //  3.0 编译less
        .pipe(less())
        // 4.0 添加浏览器前缀,添加前缀的前提是h5c3的最新的样式属性等
        .pipe(autoprefixer({
            // 会 根据 主流的浏览器 的最新的两个版本 进行添加 前缀
            browsers: ['last 2 versions']
        }))
        .pipe(gulp.dest('dist/css/'))
})