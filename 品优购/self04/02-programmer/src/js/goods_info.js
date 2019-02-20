$(function() {

    // console.log(goods_id);
    init();

    function init() {
        getGoodsinfo();
    }

    // 发送请求
    function getGoodsinfo() {
        let GoodsId = { goods_id: getUrl('goods_id') };
        $.get('goods/detail', GoodsId, function(res) {
            if (res.meta.status === 200) {
                // res.data中本来获得的数据就是对象形式的，，可以直接通过属性获取值？
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

    // url抽取需要的参数
    function getUrl(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return decodeURI(r[2]);
        return null;
    }
})