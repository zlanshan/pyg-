const gulp = require('gulp');

const less = require('gulp-less');

const autoprefixer = require('gulp-autoprefixer');

const babel = require('gulp-babel');

const uglify = require('gulp-uglify');
// 1.0 引 给 静态资源 添加指纹的 包
const rev = require('gulp-rev');
/* 
1 添加指纹 css js 添加指纹
2 需要执行 一些 css的任务
3 执行 一些 js的任务
4 执行 处理html的任务 
 */
gulp.task('css', () => {
    return gulp.src('src/css/*.less')
        .pipe(less())
        .pipe(autoprefixer({
            browsers: [' last 2 versions']
        }))
        // 2.1 给css文件添加指纹
        .pipe(rev())
        //  2.2 存放css
        .pipe(gulp.dest('dist/css/'))
})

gulp.task('js', () => {
    return gulp.src('src/js/*.js')
        .pipe(babel())
        .pipe(uglify({
            mangle: {
                toplevel: true
            }
        }))
        .pipe(rev())
        .pipe(gulp.dest('dist/js/'))
});

gulp.task('default', gulp.series(['css', 'js']));