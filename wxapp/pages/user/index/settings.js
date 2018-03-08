// pages/user/index.js
let util = require('../../../utils/util.js');
Page({
    data: {
        requestUrl: 'user/user/logout'
    },
    logout:function() {
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
                                console.log('用户点击取消')
                            } else if (res.cancel) {
                                console.log('用户点击取消')
                            }
                        }
                    });
                    return;
                } else {
                    wx.clearStorage();
                    wx.reLaunch({
                        url: '/pages/shop/index/index'
                    })
                }
            }
        })
    }
})
