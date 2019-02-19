const gulp = require('gulp');
// 1.0 引入 插件
const less = require('gulp-less');
// 2.0 编写 编译less文件的任务
gulp.task('css1', () => {
    // 2.1 获取要 编译的less文件,需明确你文件所在的路径
    return gulp.src('src/*.less')
        // 2.2 使用less插件进行编译
        .pipe(less())
        // 2.3 存放到dist文件夹下 
        .pipe(gulp.dest('dist/css/'));
})