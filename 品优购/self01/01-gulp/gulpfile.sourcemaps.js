const gulp = require('gulp');
// 1.0 编译less的插件
const less = require("gulp-less");
// 1.0 添加浏览器前缀的插件  
const autoprefixer = require('gulp-autoprefixer');
// 1.0 引入 生成map文件的插件
const gulp_map = require('gulp-sourcemaps');

// 其less文件如果是包含关系的话，
// 他只会跟踪到第一个这个包含文件根标签出现的位置，
// 不是包含的话就跟踪到期具体所在的位置？？
gulp.task('css1', () => {
    return gulp.src('src/*.less')
        // 2.1 先记录以下 less源文件的 内容
        .pipe(gulp_map.init())
        .pipe(less())
        .pipe(autoprefixer({
            browsers: ['last 2 versions']
        }))
        // 2.2 生成css文件之前 顺带生成map文件
        .pipe(gulp_map.write('.'))
        .pipe(gulp.dest('dist/css/'))
})