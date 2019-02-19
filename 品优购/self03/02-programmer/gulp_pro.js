console.log("构建 生成任务");
const gulp = require("gulp");
const less = require("gulp-less");
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const rev = require("gulp-rev");
const revCollector = require("gulp-rev-collector");
const del = require('del');
const babel = require('gulp-babel');
var uglify = require('gulp-uglify');
const fileInclude = require("gulp-file-include");
gulp.task("del", () => {
    return del(["dist"]);
});


gulp.task('css', () => {
    return gulp.src('src/css/*.less')
        .pipe(less())
        .pipe(autoprefixer({
            browsers: [' last 2 versions']
        }))
        .pipe(cleanCSS())
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
        .pipe(revCollector())
        // 4 合并成功后，将html文件放置到dist文件夹内
        .pipe(gulp.dest('dist/'));
})

gulp.task("lib", () => {
    return gulp.src("src/lib/**")
        .pipe(gulp.dest("dist/lib/"));
});

gulp.task("default", gulp.series(["del", "lib", "css", "js", "html"]));