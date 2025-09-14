
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

    userName: "",
    userPhone: "",
    userPwd: "",
  },



  getUserName: function (e) {
    this.setData({
      userName: e.detail.value
    });

  },
  getPhoneNumber (e) {
    console.log("xxx"+e.detail.code)
    this.setData({
      userPhone: e.detail.code
    });
  },
  getUserPwd: function (e) {
    this.setData({ userPwd: e.detail.value });
  },

  login:function(){

      app.showModel();
    var self = this;
    var postParams = "is_ajax=1&data[username]=" + this.data.userName + "&data[password]=" + this.data.userPwd;
    wx.request({//登录
      url: app.globalData.http_api + "s=member&c=login",
      data: postParams,
      method: 'post',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      success: function (res) {
        console.log(res.data);
        if (res.data.code == 1) {
          // 登录成功储存会员信息
          wx.clearStorageSync();
          wx.setStorageSync('member_uid', res.data.data.member.id);
          wx.setStorageSync('member_auth', res.data.data.auth);
          wx.setStorageSync('member', res.data.data.member);
          // 跳转到会员页面
          wx.showToast({
            title: "登录成功",
            icon: 'success',
            success: function () {
              wx.reLaunch({ url: "../member/index" });
            },
            duration: 2000
          })
        }
        else {
            wx.showModal({
                showCancel: false,
                content: res.data.msg
            })
        }
      }
    })
    },

  /**
 * 如果之前有授权，直接会获得用户信息
 * 如果没有授权会弹出授权窗口，要求授权
 * 授权成功，获得用户信息。未获得用户授权则userinfo为undefined
 */
  bindGetUserInfo: function (res) {
    // 声明一个变量接收用户授权信息
    var userinfo = res.detail.userInfo;
    // 判断是否授权  true 替换微信用户头像
    console.log(res);
    if (userinfo != undefined) {
      app.showModel();
      wx.login({
        success: function (res2) {
          //发起网络请求D
          wx.request({
            url: app.globalData.http_api + "s=weixin&c=member&m=xcx",
            data: {
              json: res.detail.rawData,
              js_code: res2.code
            },
            method: 'post',
            header: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            success: function (res) {
              console.log(res.data);
              if (res.data.code) {
                if (res.data.msg == 'login') {
                  // 登录成功
                  console.log("登录成功了");
                  wx.setStorageSync('member_uid', res.data.data.member.id);
                  wx.setStorageSync('member_auth', res.data.data.auth);
                  wx.setStorageSync('member', res.data.data.member);

                  wx.showToast({
                    title: "登录成功",
                    icon: 'success',
                    success: function () {
                      wx.reLaunch({ url: "../member/index" });
                    }
                  })

                } else {
                  // 绑定账号注册
                  wx.setStorageSync('oauth', res.data.data);
                  wx.showActionSheet({
                    itemList: ['绑定已有账号', '注册新账号'],
                    success: function (res) {
                      if (res.tapIndex == 1) {
                        wx.navigateTo({ url: "../login/register" });
                      } else {
                        wx.navigateTo({ url: "../login/bang" });
                      }
                    },
                    fail: function (res) {
                      console.log(res.errMsg)
                    }
                  })

                  //
                }
              } else {
                // 失败了
                wx.showModal({
                  showCancel: false,
                  content: res.data.msg
                })
              }
            }
          });

        }});
             
    } else {
      wx.showModal({
        title: '提示',
        content: '您必须授权才能使用所有功能',
        showCancel: false,
      })
    }
    console.log(this.data.userinfo);
  },


  bindGetPhoneNumber: function (e) {
    var codeObj =e.detail.code;
    //------执行Login
    wx.login({
      success: (res) => {
        if (res.code) {
         // console.log(res.code);
          wx.request({
            url: app.globalData.http_api + "s=weixin&c=member&m=xcx_phone",
            method: 'post',
            header: {
              'Content-Type': 'application/x-www-form-urlencoded',
              // 'content-type': 'application/json'
            },
            data: {
                js_code: codeObj,
            },
            success: function (res) {
              if (res.code) {
                wx.request({
                  url: app.globalData.http_api + "s=weixin&c=member2&m=xcx2",
                  method: 'post',
                  header: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    // 'content-type': 'application/json'
                  },
                  data: {
                      se: res.code,
                      // encryptedData: JSON.stringify(telObj) ,
                      // iv: JSON.stringify(ivObj)
                  },
                  success: function (res2) {
                  }
                });
              }
            }
          });
        }

      }
    });
  },

  weixinLogin: function () {
    //发起微信登陆
    var self = this;
    app.showModel();
    wx.login({
      success: function (res) {
        console.log(res);
        if (res.code) {
          wx.getUserInfo({
            success: function (userRes) {


              app.showModel();
              //发起网络请求D
              wx.request({
                url: app.globalData.http_api + "s=weixin&c=member&m=xcx",
                data: {
                  json: userRes.rawData,
                  js_code: res.code
                },
                method: 'post',
                header: {
                  'Content-Type': 'application/x-www-form-urlencoded',
                },
                success: function (res) {
                  console.log(res.data);
                  if (res.data.code) {
                    if (res.data.msg == 'login') {
                      // 登录成功
                      console.log("登录成功了");
                      wx.setStorageSync('member_uid', res.data.data.member.id);
                      wx.setStorageSync('member_auth', res.data.data.auth);
                      wx.setStorageSync('member', res.data.data.member);

                      wx.showToast({
                        title: "登录成功",
                        icon: 'success',
                        success: function () {
                          wx.reLaunch({ url: "../member/index" });
                        }
                      })

                    } else {
                      // 绑定账号注册
                      wx.setStorageSync('oauth', res.data.data);
                      wx.showActionSheet({
                        itemList: ['绑定已有账号', '注册新账号'],
                        success: function (res) {
                          if (res.tapIndex == 1) {
                            wx.navigateTo({ url: "../login/register" });
                          } else {
                            wx.navigateTo({ url: "../login/bang" });
                          }
                        },
                        fail: function (res) {
                          console.log(res.errMsg)
                        }
                      })

                      //
                    }
                  } else {
                    // 失败了
                    wx.showModal({
                      showCancel: false,
                      content: res.data.msg
                    })
                  }
                }
              });
            }
          });
        } else {
          console.log('登录失败：' + res.errMsg)
        }
      }
    });
  }


})