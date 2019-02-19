const gulp = require('gulp');

const fileInclude = require('gulp-file-include');
// 1.0 引入 自动刷新浏览器插件
const broswerSync = require('browser-sync');

// 编写编译html的任务
gulp.task('html', () => {
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

// 2.0 定义一个 开启服务器的任务和动态更新的任务 
// 希望 修改 html源文件的时候  先自动触发 编译 html的任务 再去刷新浏览器 
gulp.task('serve', () => {
        broswerSync({
            // 开启本地服务器
            server: {
                // 要运行的项目的路径
                baseDir: 'dist'
            },
            // 端口号
            port: 8080,
            // 3.4 关闭浏览器右上方的黑色的提示框
            notify: false
        });
        //  4 使用watch开监控页面的变化（页面只能是src中的  不是dist中的） 发生变化之后  先执行重新编译html任务
        // 然后执行刷新浏览器页面任务reload
        gulp.watch('src/*.html', gulp.series(["html", "reload"]))
    })
    // 刷新页面
gulp.task('reload', (done) => {
    broswerSync.reload();
    // done是任务完成的设置
    done();
})

// 默认任务
gulp.task('default', gulp.series(["html", "serve"]))