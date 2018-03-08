var util = require('../../../utils/util.js');

Page({
    data: {
        requestUrl: 'user/center/profile',
        formData:{
            city:''
        }
    },
    onLoad:function() {{
        var that = this;
        wx.getStorage({
            key: 'userInfo',
            success: function(res) {
                console.log(res);
                that.setData({"formData":res.data});
            }
        })
    }},
    setValue:function(e) {
        let formData = this.data.formData;
        formData[e.currentTarget.id] = e.detail.value;
        this.setData({"formData":formData});
    },
    formSubmit: function(e) {
        var that = this;
        util.ly_request({
            url: that.data.requestUrl,
            data: that.data.formData,
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
                    wx.showToast({
                        title: '修改成功',
                        icon: 'success',
                        duration: 2000
                    });
                    wx.navigateBack({
                        delta: 1
                    });

                }
            }
        })
    }
})
