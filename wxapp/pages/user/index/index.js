// pages/user/index.js
let util = require('../../../utils/util.js');
Page({
    data: {
        userInfo: null,
        requestUrl: 'user/index/index'
    },
    onLoad: function(options) {
        var that = this;
        util.ly_request({
            url: that.data.requestUrl,
            data: {},
            success: function(res) {
                let response = res;
                if (!response.data.status || !response.data.data.user_info) {
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
