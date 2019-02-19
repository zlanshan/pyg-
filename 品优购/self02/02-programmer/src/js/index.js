$(function() {
    init();

    function init() {
        getSlide();
        getNav();
        getGoodsList();
    }


    function getSlide() {
        $.ajax({
            type: "get",
            url: "http://api.pyg.ak48.xyz/api/public/v1/home/swiperdata",
            // data: "data",
            // dataType: "dataType",
            success: function(res) {
                // console.log(res);
                if (res.meta.status === 200) {
                    var data = res.data;
                    // console.log(data)
                    var html = template('slideTp', { data: data });

                    $('.pyg_slide').html(html);

                    // 轮播图是动态生成的，这些自动播放的也需如此
                    //获得slider插件对象
                    var gallery = mui('.mui-slider');
                    gallery.slider({
                        interval: 5000 //自动轮播周期，若为0则不自动播放，默认为0；
                    });
                }
            }
        });
    }
    // 导航栏
    function getNav() {
        $.ajax({
            type: 'get',
            url: 'http://api.pyg.ak48.xyz/api/public/v1/home/catitems',
            success: function(res) {
                var html = template('navTp', { data: res.data });
                $('.pyg_nav').html(html);
            }
        })
    }

    // 商品列表
    function getGoodsList() {
        $.ajax({
            type: 'get',
            url: 'http://api.pyg.ak48.xyz/api/public/v1/home/goodslist',
            success: function(res) {
                console.log(res);
                var html = template('goodsTp', { data: res.data });
                $('.pyg_goods_list').html(html);
            }
        })
    }
})