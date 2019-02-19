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
gulp.task("del",()=>{
 return del(["dist"]);
});


gulp.task("css", () => {
  return gulp.src("src/css/*.less")
    .pipe(less())
    .pipe(autoprefixer({
      browsers: ['last 2 versions']
    }))
    .pipe(cleanCSS())
    .pipe(rev())
    .pipe(gulp.dest("dist/css/"))
    .pipe(
      rev.manifest({
        path: "rev-css-mainfest.json"
      })
    )
    .pipe(gulp.dest("rev/"));
});


gulp.task("js", () => {
  return gulp.src("src/js/*.js")
    .pipe(babel())
    .pipe(uglify({ 
      mangle: {
        toplevel: true
      }
    }))
    .pipe(rev())
    .pipe(gulp.dest("dist/js/"))
    .pipe(
      rev.manifest({
        path: "rev-js-mainfest.json"
      })
    )
    .pipe(gulp.dest("rev/"));
});

gulp.task("html", () => {
  return gulp.src(["src/*.html","rev/*.json"])
    .pipe(fileInclude({
      prefix: '@@',
      basepath: 'src/components/'
    }))
    .pipe(revCollector())
    .pipe(gulp.dest("dist/"));
});
gulp.task("lib", () => {
  return gulp.src("src/lib/**")
    .pipe(gulp.dest("dist/lib/"));
});

gulp.task("default",gulp.series(["del","lib","css","js","html"]));