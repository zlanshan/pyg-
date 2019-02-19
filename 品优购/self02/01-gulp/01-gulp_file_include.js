const gulp = require('gulp');
const fileInclude = require('gulp-file-include');

gulp.task('html', () => {
    // 获取文件
    return gulp.src('src/index.html')
        // 文件合并的加载模板文件
        .pipe(fileInclude({
            // 3.1 模板语法的识别符号
            prefix: '@@',
            // 3.2 定义组件路径
            basepath: 'src/components',
            context: {
                title: "我们的页面"
            }
        }))
        // 4 合并成功后，将html文件放置到dist文件夹内
        .pipe(gulp.dest('dist/'));
})