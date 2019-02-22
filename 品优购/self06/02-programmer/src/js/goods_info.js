$(function() {
    // 全局变量 该商品的详细信息
    let GlobalGoodsInfo = null;

    // console.log(goods_id);
    init();

    function init() {
        getGoodsinfo();
        eventList();
    }

    function eventList() {
        $('.pyg_gi_cart').on('tap', function() {
            // let userInfo = localStorage.getItem("userInfo");

            // 如果本地存储中不存在键userinfo，即不存在用户信息，就跳转到登录页面
            if (!$.getLogin()) {
                mui.toast('您还没有登录');
                // 记录此次浏览页面的地址并存入到会话存储中，也能存储到本地存储，依情况而定
                // sessionStorage.setItem("pageUrl", location.href);
                $.setInfo();
                setTimeout(() => {
                    location.href = 'login.html';
                }, 1000)
            } else {
                // console.log("3333");
                // 即存在用户信息，能向购物车中添加数据
                // let userStr = JSON.parse(userInfo);
                // userStr与res.data数据的区别？？userStr只是此次点击页面后获取的商品详情数据，
                // 不能代替全部的商品详情的情况，永远是此次跳转到登录页面记录的商品数据
                // let userObj = {
                //     cat_id: userStr.cat_id,
                //     goods_id: userStr.goods_id,
                //     goods_name: userStr.goods_name,
                //     goods_number: userStr.goods_number,
                //     goods_price: userStr.goods_price,
                //     goods_small_logo: userStr.goods_small_logo,
                //     goods_weight: userStr.goods_weight,
                // }
                let userObj = {
                    cat_id: GlobalGoodsInfo.cat_id,
                    goods_id: GlobalGoodsInfo.goods_id,
                    goods_name: GlobalGoodsInfo.goods_name,
                    goods_number: GlobalGoodsInfo.goods_number,
                    goods_price: GlobalGoodsInfo.goods_price,
                    goods_small_logo: GlobalGoodsInfo.goods_small_logo,
                    goods_weight: GlobalGoodsInfo.goods_weight,
                }
                let token = $.getLogin().token;
                // console.log(token);
                $.post("my/cart/add", { info: JSON.stringify(userObj) }, function(res) {
                        // console.log("1111");
                        if (res.meta.status === 200) {
                            console.log("2222");
                            /* mui会根据ua判断,弹出原生对话框还是h5绘制的对话框,在基座中默认会弹出原生对话框,
                            可以配置type属性,使得弹出h5模式对话框 两者区别:
                            1.原生对话框可以跨webview,2.h5对话框样式统一而且可以修改对话框属性或样式 */
                            // mui.confirm(message,title,btnValue,callback[,type])
                            // message是提示对话框上的内容string，，title提示对话框谁给你显示的标题string
                            // btnValue是提示对话框上按钮显示的内容Array，callback为对话框上关闭的回调函数Function
                            // type--value:'div'-是否使用h5绘制的对话框
                            mui.confirm(
                                "要不要跳转到购物车页面",
                                "添加成功", ["确定", "取消"],
                                // btnType只是一个形参，回调函数内部还设置了属性？？
                                function(btnType) {
                                    if (btnType.index === 0) {
                                        location.href = 'cart.html';
                                    } else if (btnType.index === 1) {

                                    }

                                });
                        } else {
                            $.setInfo();
                            setTimeout(() => {
                                location.href = 'login.html';
                            }, 1000);
                        }
                    })
                    // $.ajax({
                    //     type: 'post',
                    //     url: 'my/cart/add',
                    //     data: { info: JSON.stringify(userObj) },
                    //     headers: {
                    //         "Authorization": token
                    //     },
                    //     success: function(res) {
                    //         // console.log("1111");
                    //         if (res.meta.status === 200) {
                    //             console.log("2222");
                    //             /* mui会根据ua判断,弹出原生对话框还是h5绘制的对话框,在基座中默认会弹出原生对话框,
                    //             可以配置type属性,使得弹出h5模式对话框 两者区别:
                    //             1.原生对话框可以跨webview,2.h5对话框样式统一而且可以修改对话框属性或样式 */
                    //             // mui.confirm(message,title,btnValue,callback[,type])
                    //             // message是提示对话框上的内容string，，title提示对话框谁给你显示的标题string
                    //             // btnValue是提示对话框上按钮显示的内容Array，callback为对话框上关闭的回调函数Function
                    //             // type--value:'div'-是否使用h5绘制的对话框
                    //             mui.confirm(
                    //                 "要不要跳转到购物车页面",
                    //                 "添加成功", ["确定", "取消"],
                    //                 // btnType只是一个形参，回调函数内部还设置了属性？？
                    //                 function(btnType) {
                    //                     if (btnType.index === 0) {
                    //                         location.href = 'cart.html';
                    //                     } else if (btnType.index === 1) {

                //                     }

                //                 });
                //         }

                //     }
                // })

            }
        })
    }
    // 发送请求
    function getGoodsinfo() {
        let GoodsId = { goods_id: $.getUrl('goods_id') };
        $.get('goods/detail', GoodsId, function(res) {
            if (res.meta.status === 200) {
                // res.data中本来获得的数据就是对象形式的，，可以直接通过属性获取值？
                GlobalGoodsInfo = res.data;

                let data = res.data;
                // console.log(data);
                var html = template('goodsInfoTp', { data: data });
                // pics找不到？？
                // var html = template('goodsInfoTp', data);
                $('.pyg_view').html(html);
                //获得slider插件对象
                var gallery = mui('.mui-slider');
                gallery.slider({
                    interval: 5000 //自动轮播周期，若为0则不自动播放，默认为0；
                });
            }

        })

    }

    // url抽取需要的参数公共js中

})