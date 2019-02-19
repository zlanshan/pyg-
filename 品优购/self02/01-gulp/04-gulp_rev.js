const gulp = require('gulp');

const less = require('gulp-less');

const autoprefixer = require('gulp-autoprefixer');

const babel = require('gulp-babel');
const fileInclude = require('gulp-file-include');
const uglify = require('gulp-uglify');
// 1.0 引 给 静态资源 添加指纹的 包
const rev = require('gulp-rev');

const revCollector = require('gulp-rev-collector');
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
        //  2.2 存放css,生成了带有指纹的 css文件
        .pipe(gulp.dest('dist/css/'))
        // 生成一个map文件  映射关系使用 
        // 3 将 css文件和css指纹文件的映射关系写到文件中

    .pipe(
            rev.manifest({
                path: "rev-css-mainfest.json"
            })
        )
        .pipe(gulp.dest('rev/'));
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
        // 生成一个map文件  映射关系使用 
        //  3  将 js文件和js指纹文件的映射关系写到文件中
        .pipe(
            rev.manifest({
                path: "rev-js-mainfest.json"
            })
        )
        // 4 存入起来，给后面html修改引用使用
        .pipe(gulp.dest('rev/'));
});

gulp.task("html", () => {
    // 同时获取 页面文件 和 指纹映射文件
    return gulp.src(["src/*.html", "rev/*.json"])
        .pipe(fileInclude({
            prefix: '@@',
            basepath: 'src/components/'
        }))
        // 修改 html中静态资源 变成 带有指纹
        .pipe(revCollector())
        .pipe(gulp.dest("dist/"));
});


gulp.task('default', gulp.series(['css', 'js', 'html']));