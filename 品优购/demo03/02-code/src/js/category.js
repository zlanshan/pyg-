$(function() {
  /* 
  0 
    1 全局变量的声明 一定要放在 代码的最前面
    2 setHTML 作用相对于是一段css 修改样式 最好也放入到head里面 紧挨着 link文件 充当样式的设置的作用就可以
  1 动态渲染页面 
  2 优化 使用插件 iscroll.js 来实现页面的滚动条效果 
    1 左侧可以实现滚动条
    2 点击左侧菜单  被点击菜单 往上 置顶效果  
    3 右侧内容 弹簧效果 
      1 一般的标签都生成之后 肯定拥有高度 
      2 图片标签 生成之后 马上拥有高度吗？
        1 因为标签生成之后 图片高度 一般取决于内容
        2 图片标签的src属性去发送请求去获取图片内容 假设  图片 100M大大图片 瞬间就加载完毕
        3 图片标签生成之后 必须要等待一小会 内容都请求回来 此时 图片才会 真实的高度 
  3 优化 使用h5的本地存储 功能 去缓存 接口的数据 
    1 要缓存的数据 是 发送请求 去获取的数据 
    2 一打开页面的时候 先判断 本地存储中有没有旧的数据
      1 没有旧的数据 
        1 直接发送请求获取新的数据
        2 把接口的数据 存入到本地存储中  key:localData
          格式 : { data:result.data,time:Date.now() }
      2 有旧的数据 判断数据是否过期
        1 没有过期  再去使用缓存中的数据
        2 已经是过期 直接发送请求获取新的数据
  4 优化 使用rem单位 去改造当前的页面   
    1 不一定所有的页面的都使用rem 而是看情况而定  
    2 先引入一段动态根据屏幕宽度 修改 根标签的js 
    3 再根据 需求 去把样式中的px单位 修改 rem单位
      比例关系 :  1rem=100px   1px = 0.01rem 
  
   */

  // 定义全局变量 存放 发送请求后的要渲染的数据 result.data
  let Datas = null;
  let LeftScroll = null;
  init();


  
  function init() {

    renderMain();
    eventList();
 
  
  
   
  }
  

  // 把页面中所有的绑定事件的代码都放到方法中
  function eventList() {
    // 绑定左侧菜单的点击事件 绑定事件 是否要用 委托
    // console.log($(".left_wrap li"));
    $(".left_wrap").on("tap", " li", function() {
      /* 
      1 激活选中 排他
      2 获取被点击的左侧菜单的li标签的索引
      3 动态去 加载右侧的 数据 关键在于 渲染的索引上！！！
       */
      $(this)
        .addClass("active")
        .siblings()
        .removeClass("active");

      // 使用zepto内置的方法来获取 dom元素的索引
      let index = $(this).index();
      // console.log(index);
      // 根据被点击的索引 来渲染右侧的内容
      renderRight(index);

      // 左侧被点击的菜单 往上滚动置顶
      LeftScroll.scrollToElement(this);
    });
  }

  // 渲染页面
  function renderMain() {
    // 3.2 判断  存入的数据的格式  {data:[],time:5454545};

    // 获取本地存储中的 数据 null 要么 字符串
      let localStr=localStorage.getItem("localData");

      if(!localStr){
        // 不存在
        console.log("缓存不存在");
        getCategories();
      }else {
        // 存在 
        let localObj=JSON.parse(localStr);
        // 判断数据是否过期 过期时间 10s 
        // Date.now() 单位 毫秒 1s=1000ms
        if(Date.now()-localObj.time>1000*60){
          // 数据过期了
          console.log("数据过期了");
          getCategories();
        }else{
          // 没有过期
          console.log("使用旧的数据");

          // 获取旧的数据
          Datas=localObj.data;
          renderLeft();
          renderRight(0);
        }
      }



    // // 3.2 判断 是否存在缓存数据  规定 本地存储中的key localData:'["1","2"]'
    // // 获取缓存数据 要么是一个 空数组 []  要么 正常 [1,3,4..] 数组 

    
    // let localArrStr=localStorage.getItem("localData");// null 要么是一个字符串 
    // let localArr=localArrStr?JSON.parse(localArrStr):[];

    // // 判断缓存是否存在
    // if(localArr.length==0){
    //   // 没有缓存
    //   console.log("没有缓存");
    //   getCategories();
    // }else{
    //   // 存在缓存
    //   console.log("存在缓存");
    // }
    
  }

  // 发送请求获取数据 
  function getCategories() {
    /* 
    1 打开页面发送请求获取所有的数据
    2 全部渲染第一层数据=左侧菜单数据 
    3 默认 先渲染左侧的第一个菜单 大家电 对应的右侧的所有的数据
    4 点击左侧菜单的时候 再根据被点击的菜单 去渲染 对应的 右侧的数据
      1 先绑定左侧菜单的点击事件
        让被点击的菜单激活选中效果 
      2 
     */
    $.get("categories", function(result) {
      // console.log(result);
      if (result.meta.status === 200) {
        // 请求成功

        // 渲染左侧菜单数据
        // let leftArr=result.data;
        Datas = result.data;

        // 把数据存入到本地存储中
        let localObj={
          data:Datas,
          time:Date.now()
        };

        localStorage.setItem("localData",JSON.stringify(localObj));

        renderLeft();

        // 右侧内容 要循环渲染的数据
        renderRight(0);
      }
    });
  }

  // 渲染左侧数据
  function renderLeft() {
    let leftArr = Datas;
    let leftHtml = template("leftTpl", { arr: leftArr });
    $(".left_wrap").html(leftHtml);

    // 初始化左侧的滚动条
    LeftScroll = new IScroll(".left_menu");

 
  }
  // 渲染右侧数据
  function renderRight(index) {
    let rightArr = Datas[index].children;
    let rightHtml = template("rightTpl", { arr: rightArr });
    // 渲染右侧图片路径不正确 去问后台 沟通一下
    // 把接口的前缀和图片的路径 拼接就可以了
    $(".right_content").html(rightHtml);

    // 初始化右侧的滚动条 有bug
    // iscroll插件想要成功初始化 必须要等待 里面的标签都有了高度之后 才能起作用

    // 必须要等待 图片都加载完毕了 再进行 滚动条的初始化
    // 必须要等待 最后一张的图片（是索引的最后一张？） 加载完毕了 再去初始化 
    // 指的是 最后一张 加载完毕的图片 
    // img 标签 onload事件

    // 获取图片数组的长度
    let imgLength=  $(".right_content img").length;
    $(".right_content img").on("load", function() {
      imgLength--;
      if(imgLength==0){
        // console.log("最后一张被初始化");
        let rightIscroll = new IScroll(".right_content");
      }
    });
  }


});
