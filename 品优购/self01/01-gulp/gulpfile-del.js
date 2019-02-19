// 1.0 引入核心 gulp
const gulp = require('gulp');
// 2.0 引入 删除 插件
const del = require('del');
// 3.0 删除任务 删除 dist内容
gulp.task('delete', () => {
    // return 是任务完成的结果
    return del(['dist']);
})