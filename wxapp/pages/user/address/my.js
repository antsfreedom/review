var util = require('../../../utils/util.js');

Page({
    data: {
        requestUrl:'user/address/my',
        addressList: null
    },
    onLoad:function() {
        var that = this;
        // 获取用户地址
        util.ly_request({
            url: that.data.requestUrl,
            success: function(res) {
                console.log(res.data.data.table_data_list);
                that.setData({"addressList":res.data.data.table_data_list});
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
                }
            }
        })
    }
})
