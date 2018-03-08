var util = require('../../../utils/util.js');

Page({
    data: {
        requestUrl: 'user/center/profile',
        radioItems: [
            {name: '男', value: 1},
            {name: '女', value: -1, checked: true},
            {name: '保密', value: 0}
        ],
        formData:{
            gender:''
        }
    },
    onLoad:function() {{
        var that = this;
        wx.getStorage({
            key: 'userInfo',
            success: function(res) {
                that.setData({"formData":res.data});
                let radioItems = that.data.radioItems;
                radioItems.map((elem, index) => {
                    if(elem.value == res.data.gender) {
                        elem.checked = true;
                    } else {
                        elem.checked = false;
                    }
                    return elem;
                });
                that.setData({'radioItems':radioItems});
            }
        })
    }},
    setValue:function(e) {
        let radioItems = this.data.radioItems;
        var that = this;
        radioItems.map((elem, index) => {
            if(elem.value == e.detail.value) {
                elem.checked = true;
                that.setData({'formData.gender':e.detail.value});
            } else {
                elem.checked = false;
            }
            return elem;
        });
        that.setData({'radioItems':radioItems});
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
