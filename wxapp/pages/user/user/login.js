var util = require('../../../utils/util.js');

Page({
    data: {
        requestUrl: 'user/user/login',

    },
    onLoad: function(options) {
        // 页面初始化 options为页面跳转所带来的参数
    },
    onReady: function() {
        // 页面渲染完成
    },
    onShow: function() {
        // 页面显示
    },
    formSubmit: function(e) {
        util.ly_request({
            url: this.data.requestUrl,
            data: e.detail.value,
            method: 'POST',
            success: function(res) {
                if (!res.data.status) {
                    wx.showModal({
                        title: '提示',
                        content: res.data.info,
                        success: function(res) {
                            if (res.confirm) {
                                console.log('用户点击确定')
                            } else if (res.cancel) {
                                console.log('用户点击取消')
                            }
                        }
                    })
                } else {
                    wx.reLaunch({
                        url:'/pages/user/index/index'
                    });
                }
            }
        })
    }
})
