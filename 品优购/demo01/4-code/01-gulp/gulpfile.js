// 1.0 引入gulp核心包 
const gulp=require("gulp");

// 2.0 定义任务 
// gulp.task("hello",()=>{
//   console.log("新年好1");
// });
// gulp.task("default",()=>{
//   console.log("默认任务");
// });


// 1 告诉gulp任务 完成的  done 函数
// gulp.task("hello",(done)=>{
//   console.log("新年好");
//   //  调用 done 表示 该任务完成了 
//   done();
// });

// 2 返回 一个 promise 对象就可以  promise es6 用来解决 回调函数 层层嵌套的技术 
// 了解即可
// gulp.task("hello",()=>{
//   return new Promise((resolve,reject)=>{
//     console.log("新年好");
//     resolve();
//   });
// });


// 3 复制 粘贴的任务  copy
// gulp.task("copy",()=>{
//   // 3.1 获取文件 src
//   // gulp.src("文件的路径")
//  return gulp.src("src/index.html")
//   //  gulp 运行 处理 文件流 
//   // gulp.dest("存放的路径")
//   .pipe(gulp.dest("dist/"));
// });


// 4.1 定义 普通任务
// gulp.task("hello1",(done)=>{
//   console.log("hello1");

//   done();
// });
// // 4.2 定义 普通任务
// gulp.task("hello2",(done)=>{
//   console.log("hello2");
//   done();
// });
// // 4.3 定义 普通任务
// gulp.task("hello3",(done)=>{
//   console.log("hello3");
//   done();
// });

// // 4.4 定义一个 运行其他 任务的 任务
// gulp.task("default",gulp.series(["hello1","hello2","hello3"]));


// 5 监控 src下的index.html 文件改变 打印当前的时间
gulp.task("watch_html",()=>{
  // 监控文件
  // gulp.watch("src/index.html",要执行的任务名称)
  gulp.watch("src/index.html",gulp.series("time"));
});

// 5.1 打印时间的 任务
gulp.task("time",(done)=>{
  console.log((new Date).toLocaleString());
  done();
});