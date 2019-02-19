const gulp = require('gulp');
const babel = require('gulp-babel');
// 1.0 引入 丑化的js 的插件+babel插件可以将es6的版本同时转换为es5版本
const uglify = require('gulp-uglify');

gulp.task('js', () => {
    return gulp.src('src/*.js')

    .pipe(babel())
        // 2.0 混淆和丑化js
        .pipe(uglify({
            // 3.1 丑化的等级
            mangle: {
                // 3.1.1 最高级
                toplevel: true
            }
        }))
        .pipe(gulp.dest('dist/js/'))
})