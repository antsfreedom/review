//获取应用实例
var util = require('../../../utils/util.js')
var app = getApp()
Page({
    data: {
        title: '充值',
        user_info:null,
        formData:{
            pay_type:'wxmpapppay',
            money:'0.01',
        },
        requestUrl: 'wallet/recharge/index'
    },
    setValue:function(e) {
        let formData = this.data.formData;
        formData[e.currentTarget.id] = e.detail.value;
        this.setData({"formData":formData});
    },
    onLoad: function(options) {
        var that = this;
        util.ly_request({
            url: that.data.requestUrl,
            data: {},
            success: function(res) {
                let response = res;
                console.log(res.data.data.user_info.money)
                that.setData({
                    "user_info":res.data.data.user_info,
                });

            }
        });

    },
    formSubmit: function(e) {
        var that = this;
        wx.login({
            success: function(res) {
                if (res.code) {
                    // 获取openid
                    util.ly_request({
                        url: 'wxapp/index/login',
                        data: {
                            code: res.code,
                            api: '1' // 这里设置这个固定参数后后台会直接返回openid等数据
                        },
                        success: function(res) {
                            var data = res.data
                            console.log(data)
                            if (data.status == '1') {
                                // 提交支付请求
                                var postdata = that.data.formData;
                                postdata.openid = data.data.openid;
                                util.ly_request({
                                    url: that.data.requestUrl,
                                    data: postdata,
                                    method: 'POST',
                                    success: function(res) {
                                        res = res.data
                                        if (res.status == '1') {
                                            if (res.json) {
                                                // 调用微信小程序内置的支付接口
                                                // 接口返回的res.json是后端生成的微信支付字符串
                                                var payobj = JSON.parse(res.json);
                                                payobj.success = 'function(res){wx.showToast({title: "充值成功", icon: "success", duration: 2000});}';
                                                payobj.fail = 'function(res){wx.showToast({title: "充值失败", icon: "success", duration: 2000});}';
                                                console.log(payobj);
                                                var result = wx.requestPayment(payobj);
                                                console.log(result);
                                            } else  {
                                                wx.showToast({
                                                    title: '微信支付订单创建失败',
                                                    icon: 'loading',
                                                    duration: 10000
                                                })

                                                setTimeout(function() {
                                                    wx.hideToast()
                                                }, 2000)
                                            }
                                        } else  {
                                            wx.showToast({
                                                title: data.info,
                                                icon: 'loading',
                                                duration: 10000
                                            })

                                            setTimeout(function() {
                                                wx.hideToast()
                                            }, 2000)
                                        }
                                    }
                                })
                            } else {
                                wx.showToast({
                                    title: 'openid获取失败' + data.info,
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
});
