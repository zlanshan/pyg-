// 引入gulp核心包
const gulp = require('gulp');
// gulp执行任务
// gulp.task('hello', (done) => {
//     // done是标志任务完成的状况
//     console.log('helloworld');
//     done();
// })

// 2 返回 一个 promise 对象就可以  
// promise es6 用来解决 回调函数 层层嵌套的技术 
// gulp.task('hello1', () => {
//     return new Promise((resolve, reject) => {
//         console.log('新的一年，新的开始');
//         resolve();
//     })
// })

// 3 复制 粘贴的任务  copy  这个任务名称可以任意取，只是最后执行任务名需一致
// 其任务的具体意义看内部的代码文件
// gulp.task('hello2', () => {
//     return gulp.src('src/index.html')
//         .pipe(gulp.dest('dist/'));
// });


gulp.task('h1', (done) => {
    console.log('h1');
    done();
})
gulp.task('h2', (done) => {
    console.log('h2');
    done();
})
gulp.task('h3', (done) => {
    console.log('h3');
    done();
})

/* series
让 gulp的一些任务 安装 正常 顺序执行 
1 把sass文件编译成 css文件  
2 把css文件 压缩 或者 添加浏览器前缀 
 */
// 定义一个 运行其他 任务的 任务
gulp.task('h4', gulp.series(["h1", "h2", "h3"]));
// 要想直接写成gulp就能执行任务的话，，其task中闭包函任务default】，否则不能执行gulp
gulp.task('default', gulp.series(["h1", "h2", "h3"]))

// watch 监控文件  实时更改，可以设置一个任务来测试这个健康事件如时间
// series是运行其他任务的任务，，即其任务需现在外面定义才能使用，且名称得一致
gulp.task('watchfile', () => {
    gulp.watch('src/index.html', gulp.series('time'));
})

gulp.task('time', (done) => {
    console.log((new Date).toLocaleString());
    done();
})