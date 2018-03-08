// pages/user/index.js
let util = require('../../../utils/util.js');
Page({
    data: {
        userInfo: {},
        requestUrl: 'user/index/index'
    },
    onLoad: function(options) {
        var that = this;
        util.ly_request({
            url: that.data.requestUrl,
            data: {},
            success: function(res) {
                let response = res;
                if (!response.data.status) {
                    wx.showModal({
                        title: '提示',
                        content: response.data.info,
                        success: function(res) {
                            if (res.confirm) {
                                if (response.data.login) {
                                    wx.reLaunch({
                                        url: '/pages/user/user/login'
                                    })
                                }
                                console.log('用户点击确定')
                            } else if (res.cancel) {
                                wx.reLaunch({
                                    url: '/pages/home/index/index'
                                })
                            }
                        }
                    });
                    return;
                }
                wx.setStorage({
                    key: "userInfo",
                    data: res.data.data.user_info
                });
                that.setData({ "userInfo": res.data.data.user_info });
            }
        })
    }
})
