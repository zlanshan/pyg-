$(function() {
    /* 
    1 打开页面的时候 做事
      1 马上触发 mui的下拉刷新
      2 下拉刷新组件显示的同时 触发callback函数
      3 在callback函数里面 发送ajax请求获取数据
      4 在请求成功之后 关闭 下拉刷新组件 
    2 动态渲染数据
      1 为了方便修改接口要求的参数 把参数定义成一个全局变量
    3 上拉加载下一页功能
      0 执行下拉刷新要的数据 和执行上拉加载要的数据 都是用 getGoodSearch 方法来获取 
      1 启用上拉组件 mui.init pullRefresh 里面加了 up的属性 
      2 修改代码 
        1 执行 下拉刷新功能 渲染页面 全部替换 $("div").html()  和 结束下拉组件 
        2 执行 上拉加载下一页的时候  渲染页面 追加 $("div").append() 和  结束上拉组件
        3 综上所述 数据请求回来之后的 后续行为 根据情况而定 
      3 上拉加载下一页的逻辑
        1 判断这一类数据 有没有下一页 没有 给出提示  
          假设 总条数 101条  页容量 10   总页数 =11 
              总的条数 10条 页容量  4  总页数  3 页  
            ？ =  Math.ceil( 101 / 10);
            ？ =  Math.ceil( 10 / 4);

          总的页码公式 = Math.ceil( 总条数(已知) / 页容量（已知）)
        2 总的页数的赋值 等待请求成功之后 result.data.tatal 
        3 在up的callback里面 判断是否有下一页 
        4 存在下一页数据 
          1 给 pagenum++
          2 直接调用发送请求的函数
          3 请求成功之后 
            1 追加新的数据 到 ul标签上 
            2 结束上拉刷新组件 
      4 以上代码还存在bug
        1 不断执行 上拉加载之后 pagenum变成 3 
        2 重新 执行 下拉刷新的时候 bug 就产生了  
          1 直接拿 pagenum =3 去发送请求
          2 数据 3条 回来之后 直接 全部替换 $().html(); 导致 页面上显示只有3条数据 3条数 是最后的一页的数据
          3 正常的下拉刷新操作 请求的数据 应该 pagenum=1 10数据 
     

      3 当用户 手动下拉页面的时候 希望操作 刷新页面而已（不是手动点击刷新按钮，而是希望看到数据还是第一次打开页面的时候）
        pagenum=1 ..  用户手动下拉页面的时候 得到的效果  =  自己点击刷新按钮的 效果
      4 总结
        1 当用户手动出发下拉刷新的时候
          1 重置 页码 1 
          2 重置 上拉加载 组件 （因为它在加载到最后一页的时候被手动 停用了）
    5 添加一个正在等待的图标
      1 发送请求之前 显示  给body添加一个class 该图标就显示
      2 请求回来之后 隐藏  给body移除这个class 该图片被隐藏 
      3 在所有的请求 发送前 显示  使用zepto发送前的拦截器 显示
      4 在所有的请求 请求回来之后 隐藏  使用zepto发送后的拦截器 
    6 在mui中 上拉加载和下拉刷新组件中 a标签的跳转行为被 禁止
      1 原因 mui 后期是可以把 移动web 通过它的工具 打包成一个 app  
        1 移动web的页面跳转 有点难看 直接禁用
        2 担心用户手势操作的  无法去出发 上拉和下拉  直接禁用 a标签 
      2 解决
        1 修改 mui的源码 就可以。 
        2 把a标签当成是一个普通div  
          给a标签绑定 tap点击事件 
            获取被点击的a标签的href属性
            通过js 的方式来跳转。。
   */

    let GoodsObj = {
        query: '',
        // cid怎么直接从url中取数据？getUrl函数中设置了
        cid: getUrl('cid'),
        pagenum: 1,
        pagesize: 10
    }
    let TotalPages = 1;

    init();

    function eventList() {
        // 给下拉刷新组件的中的a标签绑定tap点击事件 进行跳转跳转
        $('.pyg_gl_view').on('tap', 'a', function() {
            // 浏览器地址栏的url为a标签的地址
            location.href = this.href;

        })
    }

    function init() {

        mui.init({
            pullRefresh: {
                container: ".pyg_view",
                down: {
                    auto: true,
                    //  触发下拉刷新时自动触发
                    callback: function() {
                        GoodsObj.pagenum = 1;
                        // 重置 组件,放置再次的话还是不能解决下方没有更多数据的情况，且页面还是在不断加载中，不符合
                        // mui('.pyg_view').pullRefresh().refresh(true);
                        getGoodslist(function(data) {

                            var html = template('goodslistTp', { data: data });
                            $('.pyg_gl_view').html(html);
                            // 结束下拉刷新
                            mui('.pyg_view').pullRefresh().endPulldownToRefresh();

                            // 重置组件，这也有代码放置位置的问题，即获取数据后在重置组件
                            mui('.pyg_view').pullRefresh().refresh(true);
                        });

                    }
                },
                up: {
                    //  触发上拉刷新时自动触发
                    callback: function() {
                        getGoodslist(function(data) {
                            GoodsObj.pagenum++;
                            if (GoodsObj.pagenum > TotalPages) {
                                // 为什么打印不出来数据
                                console.log('没有更多的数据了111');
                                // 结束上拉加载更多 如果没有数据 传入 true 否则 传入 false
                                mui('.lt_view').pullRefresh().endPullupToRefresh(false);
                            } else {
                                console.log('还有数据')
                                var html = template('goodslistTp', { data: data });
                                $('.pyg_gl_view').append(html);
                                // 结束上拉加载更多 如果没有数据 传入 true 否则 传入 false
                                mui('.pyg_view').pullRefresh().endPullupToRefresh(true);
                            }
                        });

                    }
                }
            }
        });

        eventList();

    }


    function getGoodslist(cb) {
        $.get('goods/search', GoodsObj, function(res) {
            if (res.meta.status === 200) {
                // console.log('1111');
                let data = res.data.goods;
                let total = res.data.total;
                TotalPages = Math.ceil(total / GoodsObj.pagesize);
                cb(data);
            }
        })
    }
    // 根据url上的key来获取对应的值
    // list.html?cid=100
    // getUrl("cid")=100
    function getUrl(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return decodeURI(r[2]);
        return null;
    }

})