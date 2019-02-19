$(function () {
  init()
  function init() {
    getSwiperData();
    getCatItems();
    GetGoodsList();
  }
  // 获取首页轮播图 数据
  function getSwiperData() {
    // console.log("2.0 开始发送 首页轮播图的 请求");
    $.ajax({
      url:"home/swiperdata",
      success:function (result) {
        // console.log("4.0 发送成功后的回调 函数 ");
        // console.log(result);
        // 判断请求是否成功
        if(result.meta.status===200){
          // 成功
          let arr=result.data;
          let html=template("swiperTpl",{arr:arr});
          $(".pyg_swiper").html(html);
         
          var gallery = mui('.mui-slider');
          gallery.slider({
            interval: 5000 //自动轮播周期，若为0则不自动播放，默认为0；
          });
       
        }
      }
    })
  }
  // 获取首页 分类菜单数据
  function getCatItems() {
    // $.get("接口的路径",?参数对象,成功回调函数)
    $.get("home/catitems",function (result) {
      // console.log(result);
      if(result.meta.status===200){
        // 成功
        // 开始拼接html
        // let arr=result.data;
        // let html="";
        // for (let i = 0; i < arr.length; i++) {
        //   html+=`
        //   <a href="javascript:;"> <img src="${arr[i].image_src}" alt=""> </a>
        //   `;
        // }
        // // 插入到对应的结构当中
        // $(".pyg_nav").html(html);

        let arr=result.data;
        let arrHtml=arr.map((v,i)=>{
          return  ` <a href="javascript:;"> <img src="${arr[i].image_src}" alt=""> </a> `
        })
        // 插入到对应的结构当中
        $(".pyg_nav").html(arrHtml.join(''));
      }
    })
    
  }

  // 获取首页商品数据
  function GetGoodsList() {
    $.get("home/goodslist",function (result) {
      if(result.meta.status===200){
        // 请求成功
        let arr=result.data;
        
        let html=template("listTpl",{arr:arr});
        $(".pyg_goods_list").html(html);
      }
      
    })
    
  }

})