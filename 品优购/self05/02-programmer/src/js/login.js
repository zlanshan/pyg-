$(function() {

    init();

    function init() {
        eventList();
    }

    function eventList() {
        // 绑定 登录 按钮 点击事件
        $('.pyg_login').on('tap', function() {
            /* 
      1 获取 输入框的值
      2 进行合法性的验证
        1 用户名 就是 手机号码的验证 
        2 密码的验证 长度 一定要不少于 6 。。
      3 假设 不通过  给出一个用户提示 
      4 通过验证 再去执行 剩下逻辑--重点！！！
        1 构造登录要的参数
        2 发送请求 post
        3 登录的 错误的提示信息 展示
        4 把请求成功的信息 result.data  直接存入本地存储中  
          先对象 转成 json字符串 再进行存储  
        5 页面 要跳转到哪里去？？？
          0 先弹出一个提示 登录成功
          0.5 延迟一会 再跳转页面
          1 从哪来 跳哪去 
          2 默认就跳转到 首页 
       */
            // 获取输入框中的内容且除去前后的空格
            let username = $("input[name='username']").val().trim();
            let password = $("input[name='password']").val().trim();

            if (!$.checkPhone(username)) {
                mui.toast('手机号码不合法');
                return;
            }
            if (password.length < 6) {
                mui.toast('密码强度太弱，不安全');
                return;
            }
            // 请求需传入的数据对象
            let userInfo = {
                    username,
                    password
                }
                //    发送登录成功的请求
            $.ajax({
                type: 'post',
                url: 'login',
                data: userInfo,
                success: function(res) {
                    if (res.meta.status !== 200) {
                        // 显示登录失败的提示框
                        mui.toast('登录不成功');
                    } else {
                        // 显示登录成功的信息提示框
                        mui.toast(res.meta.msg);
                        // 登录成功后把用户信息存入到本地存储中
                        localStorage.setItem("userInfo", JSON.stringify(res.data));
                        // 获取会话存储中从哪个页面跳过来的url地址
                        // 4.6 获取 会话存储中的来源页面  null 或者 正常的路径
                        let pageurl = sessionStorage.getItem('pageUrl');
                        // 需要给用户的登录成功提醒，而不是直接跳转，需等待一下
                        /*  if (!pageurl) {
                             location.href = 'index.href'
                         } else {
                             location.href = pageurl;
                         } */
                        if (!pageurl) {
                            pageurl = 'index.html';
                        } else {

                        }
                        setTimeout(() => {
                            location.href = pageurl;
                        }, 1000)

                    }
                }
            })
        })
    }

})