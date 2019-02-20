$(function() {
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
        let url = 'http://api.pyg.ak48.xyz/api/public/v1/';
        ajaxObj.url = url + ajaxObj.url;
        // console.log(ajaxObj.url);  //http://api.pyg.ak48.xyz/api/public/v1/home/goodslist
        // 启用正在等待图标，，图标样式设置在common.lesszh中
        $('body').addClass('loadding');
    }

    // 发送 数据回来之后 会被调用的拦截器
    $.ajaxSettings.complete = function() {
        $('body').removeClass('loadding');
    }

})