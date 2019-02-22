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

        // xhr.setRequestHeader("Authorization", "xxxx");
        if (ajaxObj.url.indexOf("/my/") != -1) {
            // 存在这个字段 私有路径 必须要带上token 存放在请求头中。。
            console.log('当前接口是私有路径', ajaxObj.url);
            // 调用ajax原生的方法 设置请求头参数
            xhr.setRequestHeader("Authorization", $.getLogin().token)
        } else {
            // 公开路径 不用去管请求头的token
            console.log('当前接口是公有路径', ajaxObj.url);

        }
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
        },
        // 存入 分类数据
        setCates: function(localObj) {
            // 存储数据
            localStorage.setItem('localData', JSON.stringify(localObj));
        },
        // 获取本地存储中的分类数据 要么是一个对象 要么就是 null 
        getCates: function() {
            // 获取数据，需返回一个数值的
            let localStr = localStorage.getItem('localData');
            if (localStr) {
                let localObj = JSON.parse(localStr);
                return localObj;
            } else {
                return null;
            }
        },
        // 设置当前的页面路径
        setInfo: function() {
            sessionStorage.setItem("pageUrl", location.href);
        },
        // 获取本地存中的已经存好的页面路径
        getInfo: function() {
            let pageurl = sessionStorage.getItem('pageUrl');
            return pageurl;
        },
        setLogin: function(data) {
            localStorage.setItem("userInfo", JSON.stringify(data));

        },
        getLogin: function(param) {
            let userInfo = localStorage.getItem("userInfo");
            if (userInfo) {
                let userStr = JSON.parse(userInfo);
                return userStr;
            } else {
                return null;
            }
        }
    })

})