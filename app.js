//app.js
App({
 
  showModel:function(){
     wx.showToast({
      title: '正在加载....',
      icon: 'loading',
      duration: 5000
    });
  },

  globalData:{
    http_api:"http://xcx.zzzfq.com/index.php?v=1&appid=1&appsecret=PHPCMFE27A0A1F3A721&",
  }
})