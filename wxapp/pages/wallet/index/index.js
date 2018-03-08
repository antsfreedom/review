//获取应用实例
var util = require('../../../utils/util.js')
var app = getApp()
Page({
    data: {
        title: '钱包',
        userInfo: {},
        storage: '',
        requestUrl: 'wallet/index/index',
    },
    onLoad: function(options) {
        var that = this;
        util.ly_request({
            url: that.data.requestUrl,
            data: {},
            success: function(res) {
                let response = res;
                console.log(res.data.data)
                wx.setStorage({
                    key: "userInfo",
                    data: res.data.data.user_info
                });
                that.setData({ 
                    "userInfo": res.data.data.user_info ,
                });

            }
        });
    },
    tapName: function(event) {
        wx.showToast({  
            title: '该功能正在开发',  
        })  
    },
    recharge: function() {
        wx.navigateTo({
            url: '/pages/wallet/recharge/index'
        })
    },
    redbag: function() {
        wx.navigateTo({
            url: '/pages/wallet/redbag/my'
        })
    },
    coupon: function() {
        wx.navigateTo({
            url: '/pages/wallet/coupon/my'
        })
    },
    appstore: function() {
        wx.navigateTo({
            url: '/pages/appstore/index/index'
        })
    },
    bill: function() {
        wx.navigateTo({
            url: '/pages/wallet/index/my'
        })
    },  
});




