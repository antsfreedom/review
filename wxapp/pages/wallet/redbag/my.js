//获取应用实例
var util = require('../../../utils/util.js')
var app = getApp()
Page({
    data: {
        table_data_list:[],
        requestUrl: 'wallet/redbag/my'
    },
    onLoad: function(options) {
        var that = this;
        util.ly_request({
            url: that.data.requestUrl,
            data: {},
            success: function(res) {
                let response = res;
                console.log(res.data.data)
                that.setData({
                    "table_data_list":res.data.data.table_data_list,
                });
            }
        });
    },
});






          