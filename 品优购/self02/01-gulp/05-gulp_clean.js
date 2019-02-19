const gulp = require("gulp");
const less = require("gulp-less");
const autoprefixer = require('gulp-autoprefixer');
// 引入压缩 css的插件
const cleanCSS = require('gulp-clean-css');

gulp.task('css', () => {
    return gulp.src("src/css/*.less")
        .pipe(less())
        .pipe(autoprefixer({
            browsers: ['last 2 versions']
        }))
        .pipe(cleanCSS())
        .pipe(gulp.dest('dist/css/'))
})