$(function() {
    let Baseurl = 'http://api.pyg.ak48.xyz/';

    // 公共的基础的url
    //   const BaseUrl="http://api.pyg.ak48.xyz";
    if (window.template) {
        // 左边Baseurl是属性   右边的Baseurl是属性值
        template.defaults.imports.Baseurl = Baseurl;
    }
    // 定义一个 zepto 发送请求的 前 拦截器
    // 会在 每个请求 发送前运行一次
    $.ajaxSettings.beforeSend = function(xhr, ajaxObj) {
        //#region  拦截器的分析
        /*  xhr ajax的js 原生的对象
            ajaxObj zepto封装过的   =  $.ajax({配置对象})  {配置对象}
            console.log("发送前的拦截");
            console.log(" ajax的js 原生的对象",xhr);
            console.log("zepto封装过的ajax的参数对象",ajaxObj);
            总结   最终的发送请求的 url 是 由 ajaxObj.url 来确定  
            现在的 ajaxObj.url = "home/swiperdata"  
        */
        //#endregion
        // console.log(xhr);
        // XMLHttpRequest {setRequestHeader: ƒ, onreadystatechange: ƒ, readyState: 0, timeout: 0, withCredentials: false, …}
        // console.log(ajaxObj);
        // {type: "get", url: "home/swiperdata", success: ƒ, beforeSend: ƒ, error: ƒ, …}
        ajaxObj.url = Baseurl + "api/public/v1/" + ajaxObj.url;
        // console.log(ajaxObj.url);  //http://api.pyg.ak48.xyz/api/public/v1/home/goodslist
        // 启用正在等待图标，，图标样式设置在common.lesszh中
        $('body').addClass('loadding');
    }

    // 发送 数据回来之后 会被调用的拦截器
    $.ajaxSettings.complete = function() {
        $('body').removeClass('loadding');
    }


    $.extend($, {
        // 根据url上的key来获取对应的值
        // list.html?cid=100
        // getUrl("cid")=100
        getUrl: function(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) return decodeURI(r[2]);
            return null;
        },
        checkPhone: function(phone) {
            if (!(/^1[34578]\d{9}$/.test(phone))) {
                return false;
            } else {
                return true;
            }
        }
    })

})