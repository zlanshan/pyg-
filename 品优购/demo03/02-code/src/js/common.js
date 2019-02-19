$(function() {
  // 定义一个 zepto 发送请求的 前 拦截器
  // 会在 请求 发送前运行
  // console.log("1.0 绑定一个 ajax发送前的 事件 ");
  $.ajaxSettings.beforeSend = function(xhr, ajaxObj) {
    // console.log("3.0 发送前 被拦截了一下");
    //#region  拦截器的分析
    /*  xhr ajax的js 原生的对象
  ajaxObj zepto封装过的   =  $.ajax({配置对象})  {配置对象}
  console.log("发送前的拦截");
  console.log(" ajax的js 原生的对象",xhr);
  console.log("zepto封装过的ajax的参数对象",ajaxObj);
  总结   最终的发送请求的 url 是 由 ajaxObj.url 来确定  
  现在的 ajaxObj.url = "home/swiperdata"  */
    //#endregion
    // console.log("拼接前的ajaxObj.url " + ajaxObj.url);
    ajaxObj.url = "http://api.pyg.ak48.xyz/api/public/v1/" + ajaxObj.url;
    // console.log("拼接后的ajaxObj.url " + ajaxObj.url);
  };
});
