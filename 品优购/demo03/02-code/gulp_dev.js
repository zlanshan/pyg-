console.log("构建开发任务");
const gulp = require("gulp");
const del = require('del');
const less = require("gulp-less");
const autoprefixer = require('gulp-autoprefixer');
const gulp_map = require("gulp-sourcemaps");
const babel = require('gulp-babel');
const fileInclude = require("gulp-file-include");
const browserSync = require("browser-sync");

// 0.5 删除 dist任务
gulp.task("del", () => {
  return del(["dist"]);
});


// 1.0 处理css 任务 
gulp.task("css", () => {
  return gulp.src("src/css/*.less")
    .pipe(gulp_map.init())
    .pipe(less())
    .pipe(autoprefixer({
      browsers: ['last 2 versions']
    }))
    .pipe(gulp_map.write("."))
    .pipe(gulp.dest("dist/css/"));
});

// 2.0 处理js 
gulp.task("js", () => {
  return gulp.src("src/js/*.js")
    .pipe(gulp_map.init())
    .pipe(babel())
    .pipe(gulp_map.write("."))
    .pipe(gulp.dest("dist/js/"));
});

// 3.0 处理 html 
gulp.task("html", () => {
  return gulp.src("src/*.html")
    .pipe(fileInclude({
      prefix: '@@',
      basepath: 'src/components/'
    }))
    .pipe(gulp.dest("dist/"));
});

// 4.0 复制 第三方的插件 到dist文件夹内
gulp.task("lib", () => {
  return gulp.src("src/lib/**")
    .pipe(gulp.dest("dist/lib/"));
});

// 5.0 自动开启浏览器  和 监控 文件改变 自动刷新
gulp.task("serve", () => {
  browserSync({
    server: {
      baseDir: "dist",
    },
    port: 9999,
    // 去掉页面中的提示 
    notify:false
  });

  // 监控  页面文件  和   组件文件
  gulp.watch(["src/*.html","src/components/*.html"], gulp.series(["html", "reload"]));
  // 监控 less文件改变
  gulp.watch("src/css/*.less", gulp.series(["css", "reload"]));
  // 监控 js 文件改变
  gulp.watch("src/js/*.js", gulp.series(["js", "reload"]));

});

gulp.task("reload",(done)=>{
  browserSync.reload();
  done();
})

// 00 定义默认任务
gulp.task("default", gulp.series(["del", "css", "js", "html", "lib","serve"]));