$(function() {
    init();

    function init() {
        // 获取本地存储中的用户信息
        let userInfo = $.getLogin();
        if (!userInfo) {
            mui.toast('你还没有登录，请先登录');
            location.href = 'login.html';
            return;
        } else {
            $('body').fadeIn();
            // 查询购物车数据
            getOrderlist();
            // 绑定事件
            eventList();
        }

    }

    function eventList() {
        $('.order_list').on('tap', '.mui-numbox button', function() {
            totalPrice();
        })

        // 编辑按钮绑定事件
        $('.edit_btn').on('tap', function() {
            // 这里先判断是否有商品，才能考虑是否能切换类名
            if ($('.cart_item').length === 0) {
                mui.toast('您还未添加商品，请前往其他商品页面添加商品');
                return;
            } else {
                $('body').toggleClass('body_status');

                if ($('body').hasClass('body_status')) {
                    // $('.edit_btn').text('完成');
                    $(this).text('完成');
                    // console.log('111');
                } else {
                    $('.edit_btn').text('编辑');
                    // 编辑购物车？？
                    // editCart();
                    let $lis = $('.cart_item');
                    // 同步数据
                    async($lis);

                }
            }

        })

        // 删除按钮绑定事件
        $('.del_btn').on('tap', function() {
            let dchecked = $('.cart_item .chk_inp:checked').parents("li");
            console.log(dchecked);
            if (dchecked.length === 0) {
                mui.toast('你还未uanzhong任何需要删除的商品');
                return;
            } else {
                mui.confirm("您确定要删除这些商品嘛", "提示", ["确定", "取消"], function(btnType) {
                    //    确定删除数据
                    if (btnType.index == 0) {
                        mui.toast('删除数据');
                        // deleteCart();
                        // if( $(".cart_item").length===0){

                        // }
                        let lichecked = $(".cart_item .chk_inp").not(":checked").parents("li");

                        // 同步数据
                        async(lichecked);
                        // 同步数据执行完后还是可以执行下面的代码
                        // console.log('删除完后无数据的情况');

                        // 思考数据若是全部删除后，如何将这完成的按钮转变成编辑
                        // $('.cart_item').length这计算的是前面的li的数量？？
                        // console.log($('.cart_item').length);即长度是变化的
                        // 但是同步数据后不应该是没有li标签的嘛？？
                        if (lichecked.length === 0) {

                            $('body').removeClass('body_status');
                            $('.edit_btn').text('编辑');
                        } else {

                        }
                        // 取消删除数据
                    } else if (btnType.index == 1) {

                    }
                })
            }
        })
    }


    // 查询购物车页面
    function getOrderlist() {
        $.get('my/cart/all', function(res) {
            // console.log(JSON.parse(res.data.cart_info));
            if (res.meta.status === 200) {
                let data = res.data.cart_info;
                // value="{{value.amount}}"为什么这个获取不到呢？是后期dom元素没有获取到其中的数值，导致amount未定义
                // console.log(JSON.parse(data));
                var html = template('orderTp', { obj: JSON.parse(data) });
                $('.order_list').html(html);

                // mui在mui.init()中会自动初始化基本控件,但是 动态添加的Numbox组件需要手动初始化
                mui('.mui-numbox').numbox();
                //    计算总价格
                totalPrice();
            }
        })
    }

    function totalPrice() {
        /* lis为jq对象，jq对象如何转为dom对象呢？ */
        let $lis = $('.cart_item');
        // console.log(lis);
        // 先转换成dom元素
        let countPrice = 0;
        for (var i = 0; i < $lis.length; i++) {
            let li = $lis[i];
            let tmpObj = $(li).data('obj');
            let unitPrice = tmpObj.goods_price;
            // console.log(tmpObj);
            //   dom对象转换成jq对象，只要在用上$即可
            let goods_amount = $(li).find('.mui-numbox-input').val();
            // console.log(unitPrice);
            // let goods_price = a;
            countPrice += goods_amount * unitPrice;
        }
        $('.pyg_total_price').text(countPrice);


    }

    function async($lis) {
        let goodsObj = {};
        for (var i = 0; i < $lis.length; i++) {
            let li = $lis[i];
            // 为什么到这里的时候amount没有呢，是因为动态生成嘛，也不是吧
            let tmpObj = $(li).data('obj');
            // console.log(tmpObj);
            // 数量是动态变化的
            //获取的元素的内容值不能写错，否则 amount是未定义的，导致后期的查询购物车数据也哟偶问题
            tmpObj.amount = $(li).find('.mui-numbox-input').val();
            // console.log(tmpObj.amount);
            // 这是所有商品的信息
            // console.log(tmpObj);goods_id设置意义？是根据goods_id设置对象
            // goodsObj对象中的属性---属性值goods_id：{tmpObj}
            let goods_id = tmpObj.goods_id;
            goodsObj[goods_id] = tmpObj; //obj[key]=value;
        }

        $.post('my/cart/sync', { infos: JSON.stringify(goodsObj) }, function(res) {
                // console.log(res);
                if (res.meta.status === 200) {
                    mui.toast('同步数据成功');
                    getOrderlist();
                }
            })
            // }
    }

    // 编辑按钮事件
    function editCart() {

        // if ($('.cart_item').length === 0) {
        //     mui.toast('您还未添加商品，请前往其他商品页面添加商品');
        // } else {
        let $lis = $('.cart_item');
        // 不写for循环的话，默认查找第一个编辑的li元素
        let goodsObj = {};
        for (var i = 0; i < $lis.length; i++) {
            let li = $lis[i];
            // 为什么到这里的时候amount没有呢，是因为动态生成嘛，也不是吧
            let tmpObj = $(li).data('obj');
            // console.log(tmpObj);
            // 数量是动态变化的
            //获取的元素的内容值不能写错，否则 amount是未定义的，导致后期的查询购物车数据也哟偶问题
            tmpObj.amount = $(li).find('.mui-numbox-input').val();
            // console.log(tmpObj.amount);
            // 这是所有商品的信息
            // console.log(tmpObj);goods_id设置意义？是根据goods_id设置对象
            // goodsObj对象中的属性---属性值goods_id：{tmpObj}
            let goods_id = tmpObj.goods_id;
            goodsObj[goods_id] = tmpObj; //obj[key]=value;
        }

        $.post('my/cart/sync', { infos: JSON.stringify(goodsObj) }, function(res) {
                // console.log(res);
                if (res.meta.status === 200) {
                    mui.toast('同步编辑数据成功');
                    getOrderlist();
                }
            })
            // }
    }

    // 删除按钮事件
    function deleteCart() {

        let lichecked = $(".cart_item .chk_inp").not(":checked").parents("li");
        // console.log(lichecked);
        // 删除和编辑按钮的下面请求参数的获取方式是一致的，只是li不同，，可以封装下
        let deleteParam = {};

        for (var i = 0; i < lichecked.length; i++) {
            let li = lichecked[i];
            let tmpObj = $(li).data('obj');
            // console.log(tmpObj);
            tmpObj.amount = $(li).find('.mui-numbox-input').val();

            let goods_id = tmpObj.goods_id;
            deleteParam[goods_id] = tmpObj;
        }
        $.post('my/cart/sync', { infos: JSON.stringify(deleteParam) }, function(res) {
            if (res.meta.status === 200) {
                mui.toast('同步删除操作成功');
                getOrderlist();

            }
        })


    }


})