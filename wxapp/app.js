//app.js
var util = require('./utils/util.js')
App({
    globalData: {
        userInfo: null,
        store_id:1
    },
    onLaunch: function() {
        //调用API从本地缓存中获取数据
        var logs = wx.getStorageSync('logs') || []
        logs.unshift(Date.now())
        wx.setStorageSync('logs', logs)

        // 登陆
        this.getUserInfo();
    },
    // 用户登陆
    login: function(cb) {
        var that = this
        util.ly_request({
            url: 'wxapp/index/login_check',
            success: function(res) {
                var data = res.data
                if (data.status == '1') {
                    console.log(res.info)
                    wx.showToast({
                        title: '已登陆',
                        icon: 'loading',
                        duration: 10000
                    })

                    setTimeout(function() {
                        wx.hideToast()
                    }, 2000)
                } else {
                    //调用登录接口
                    wx.login({
                        success: function(res) {
                            if (res.code) {
                                //如果没有注册账号，系统会自动注册账号并绑定openid
                                util.ly_request({
                                    url: 'wxapp/index/login',
                                    data: {
                                        code: res.code,
                                        nickName: that.globalData.userInfo.nickName,
                                        avatarUrl: that.globalData.userInfo.avatarUrl
                                    },
                                    success: function(res) {
                                        var data = res.data
                                        if (data.status == '1') {
                                            console.log('登陆成功' + data.info)
                                            wx.showToast({
                                                title: data.info,
                                                icon: 'loading',
                                                duration: 10000
                                            })

                                            setTimeout(function() {
                                                wx.hideToast()
                                            }, 2000)
                                        } else {
                                            wx.showToast({
                                                title: '登陆失败：' + data.info,
                                                icon: 'loading',
                                                duration: 10000
                                            })

                                            setTimeout(function() {
                                                wx.hideToast()
                                            }, 2000)
                                        }
                                    },
                                    error: function() {
                                        console.log('用户登陆失败' + res.errMsg)
                                    },
                                    fail: function() {
                                        console.log('请求失败' + res.errMsg)
                                    }
                                })
                            } else {
                                console.log('获取用户登录态失败！' + res.errMsg)
                            }
                        }
                    });
                }
            },
            error: function() {
                console.log('请求失败' + res.errMsg)
            },
            fail: function() {
                console.log('请求失败' + res.errMsg)
            }
        });
    },
    // 获取用户信息
    getUserInfo: function(cb) {
        var that = this
        if (this.globalData.userInfo) {
            typeof cb == "function" && cb(this.globalData.userInfo)
        } else {
            //调用登录接口
            wx.login({
                success: function() {
                    wx.getUserInfo({
                        success: function(res) {
                            that.globalData.userInfo = res.userInfo
                            typeof cb == "function" && cb(that.globalData.userInfo);
                        }
                    })
                }
            })
        }
    }
})
