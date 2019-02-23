$(function() {

    init();

    function init() {
        // 这些都是先判定是否有用户已经登录过
        let userinfo = $.getLogin();
        if (!userinfo) {
            $.setPageUrl();
            location.href = "login.html";
            return;
        } else {
            $("body").fadeIn();
            queryOrders(1);
        }
    }


    function queryOrders(type) {
        $.get('my/orders/all', { type: type }, function(res) {
            //   能获取到订单数据
            // console.log(res);
            // return;
            let data = res.data;
            let html = '';
            // 数组的foreach方法
            data.forEach((e, i) => {
                html += `<li>
                <div class="order_num_left">
                    <div class="order_title">订单编号</div>
                    <div class="order_info">${e.order_number}</div>
                </div>
                <div class="order_num_right">
                    ￥${e.order_price}
                </div>
            </li>`;
            })


            $('.order_num').html(html);
        })

        /*  let htmlArr = data.map((value, index) => {
             let h = `<li>
             <div class="order_num_left">
                 <div class="order_title">订单编号</div>
                 <div class="order_info">${e.order_number}</div>
             </div>
             <div class="order_num_right">
                 ￥${e.order_price}
             </div>
         </li>`;
             return h;
         })
         $('.order_num').html(html); */

    }
})