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

    // 设置全局变量，便于函数中改变及引用
    let Datas = null;
    let leftScroll = null;
    init();

    // 初始化函数
    function init() {
        renderMain();
        eventList();
    }

    // 动态生成的事件
    function eventList() {
        // 绑定左侧菜单的点击事件 绑定事件 是否要用 委托

        // 事件委托的方式设置动态生成的元素的点击事件，且此事件是移动端的，点击事件是tap
        $('.pyg_view_left').on('tap', 'li', function() {
            /* 
              1 激活选中 排他
              2 获取被点击的左侧菜单的li标签的索引
              3 动态去 加载右侧的 数据 关键在于 渲染的索引上！！！
              */
            //链式编程  jq的addClass添加类名  siblings为兄弟元素 removeClass为删除类名
            $(this).addClass('active').siblings().removeClass('active');
            // 使用zepto内置的方法来获取 dom元素的索引
            let index = $(this).index();
            // 渲染右边的数据，根据点击的li的索引值不同，渲染不同的数据
            renderRight(index);
            //   // 左侧被点击的菜单 往上滚动置顶 
            leftScroll.scrollToElement(this);
        })
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
    // 渲染页面，缓存数据
    function renderMain() {
        // 判断  存入的数据的格式  {data:[],time:5454545};
        // 获取本地永久存储的数据
        let localStr = localStorage.getItem('localData');
        //  缓存不存在
        if (!localStr) {
            // 缓存不存在就重新发送请求
            getCategory();
        } else {
            // 获取的数据是字符串型的，需先转换成对象的原数据类型
            let localObj = JSON.parse(localStr);
            // 获取的对象数据的属性time的值
            let time = localObj.time;
            // 设置一个数据存储时间的最大值
            let maxTime = 1000 * 60;
            // (Date.now() - time) > maxTime
            if ((Date.now() - time) > maxTime) {
                console.log('数据过期了');
                //  数据过期了，就需重新发送请求
                getCategory();
            } else {
                // 获取的对象数据的属性data的值，在重新渲染下做有变的页面数据
                Data = localObj.data;
                renderLeft();
                // 右边默认是从0开始的
                renderRight(0);
            }
        }
    }

    // 发送请求的函数
    function getCategory() {
        /* 
    1 打开页面发送请求获取所有的数据
    2 全部渲染第一层数据=左侧菜单数据 
    3 默认 先渲染左侧的第一个菜单 大家电 对应的右侧的所有的数据
    4 点击左侧菜单的时候 再根据被点击的菜单 去渲染 对应的 右侧的数据
      1 先绑定左侧菜单的点击事件
        让被点击的菜单激活选中效果 
      2 
     */
        // ajax请求，jq中设置的get，post简易版的
        $.get('categories', function(res) {
            if (res.meta.status === 200) {
                // 将res.data数据存储到全局变量Datas中的
                Datas = res.data;
                // 设置本地存储中的对象,// 把数据存入到本地存储中
                let localObj = {
                    data: Datas,
                    time: Date.now()
                };
                // 设置本地永久存储的设置项
                localStorage.setItem('localData', JSON.stringify(localObj));
                // 左边的数据渲染
                renderLeft();

                // 右边的数据渲染
                renderRight(0);
            }

        })
    }

    function renderLeft() {
        // 左边的数据渲染
        // 拿到数据
        let leftArr = Datas;
        // 模板引擎
        var leftHtml = template('viewLeft', { data: leftArr });
        // 将模板写入到对应的区域
        $('.pyg_view_left').html(leftHtml);
        // 设置滚动条的, // 初始化左侧的滚动条
        leftScroll = new IScroll('.pyg_view_left');
        //    点击菜单往上置顶
        // leftScroll.scrollToElement(this);
    }

    function renderRight(index) {
        // 右边的数据渲染，获取数据
        let rightArr = Datas[index].children;
        // let datas = res.data[index].children;
        var rightHtml = template('viewRight', { data: rightArr })
        $('.pyg_view_right').html(rightHtml);
        // 初始化右侧的滚动条 有bug
        // iscroll插件想要成功初始化 必须要等待 里面的标签都有了高度之后 才能起作用

        // 必须要等待 图片都加载完毕了 再进行 滚动条的初始化
        // 必须要等待 最后一张的图片（是索引的最后一张？） 加载完毕了 再去初始化 
        // 指的是 最后一张 加载完毕的图片 
        // img 标签 onload事件



        // 图片加载需要时间，且要获取到图片的高度，才能算出右边的中体的高度，进而滚动条的效果实现
        // 因而可以先算出总共能一次获取到多少图片
        let imgLength = $('.pyg_view_right img').length;
        // 图片的方法,img.onload 实现图片预加载方法
        $('.pyg_view_right img').on('load', function() {
            //   每张图片加载一次后，其imgLength就减1，知道记录到计算最后一张图片的时候在设置滚动条方法
            imgLength--;
            // 知道最后一张图片的加载完毕获取到高度
            if (imgLength == 0) {
                // 代码动能进来
                // console.log('right');
                // console.log($('.pyg_view_right'));
                var rightScroll = new IScroll('.pyg_view_right');
            }
        })
    }
})