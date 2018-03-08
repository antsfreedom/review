var util = require('../../../utils/util.js');
Page({
    data: {
        tab_links:[{
            type:'email',
            title:'邮箱注册',
            class:'tab-link active',
        },{
            type:'mobile',
            title:'手机注册',
            class:'tab-link',
        },{
            type:'username',
            title:'用户名注册',
            class:'tab-link',
        }],
        formData:{
            reg_type:'email',
            email:'',
            mobile:''
        },
        sendVerify: {
            timerText:'发送验证码',
            hasSend:false
        },
        tab_show:0,
        isAgree:false,
        requestUrl:'user/user/register',
        verifyEmailUrl:'user/user/send_mail_verify',
        verifyMobileUrl:'user/user/send_mobile_verify',
    },
    bindAgreeChange: function (e) {
        this.setData({
            isAgree: !!e.detail.value.length
        });
    },
    toggleTab:function(e) {
        let id = e.currentTarget.id;
        this.setData({"tab_show":id});
        let tab_link = this.data.tab_links;
        tab_link.map((x,i) => {
            if(i == id) {
                x.class = 'tab-link active';
                this.setData({"formData.reg_type":x.type});
            } else {
                x.class = 'tab-link';
            }
            return x;
        });
        this.setData({"tab_links":tab_link});
    },
    setValue:function(e) {
        let formData = this.data.formData;
        formData[e.currentTarget.id] = e.detail.value;
        this.setData({"formData":formData});
    },
    send_email_verify:function() {
        this.setData({"sendVerify.hasSend":!this.data.sendVerify.hasSend});
        let data = {},that = this;
        data['title'] = '注册验证';
        data['email'] = this.data.formData.email;
        let filter  = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        if (!filter.test(data['email'])) {
            wx.showModal({
                title: '提示',
                content: '请输入有效邮箱！',
                success: function(res) {
                    if (res.confirm) {
                        util.time(that,1);
                    } else if (res.cancel) {
                        util.time(that,5);
                    }
                }
            });
            return;
        }
        util.ly_request({
            url: this.data.verifyEmailUrl,
            data: data,
            success:function(res){
                // 发送失败
                if(!res.data.status){
                    wx.showModal({
                        title: '提示',
                        content: res.data.info,
                        success:function(res) {
                            util.time(that,5);
                        }
                    });
                    return;
                }
                // 发送成功
                util.time(that,30);
            }
        });
    },
    send_mobile_verify:function() {
        this.setData({"sendVerify.hasSend":true});
        let data = {},that = this;
        data['title'] = '注册验证';
        data['mobile'] = this.data.formData.mobile;
        let filter  = /^1\d{10}$/;
        if (!filter.test(data['mobile'])) {
            wx.showModal({
                title: '提示',
                content: '请输入有效手机号！',
                success: function(res) {
                    if (res.confirm) {
                        util.time(that,1);
                    } else if (res.cancel) {
                        util.time(that,5);
                    }
                }
            });
            return;
        }
        util.ly_request({
            url: this.data.verifyMobileUrl,
            data: data,
            success: function(res){
                // 发送失败
                if(!res.data.status){
                    wx.showModal({
                        title: '提示',
                        content: res.data.info,
                        success:function(res) {
                            util.time(that,5);
                        }
                    });
                    return;
                }
                // 发送成功
                util.time(that,30);
            }
        });
    },
    formSubmit:function() {
        let data = {};
        data = Object.assign(data,this.data.formData);
        util.ly_request({
            url: this.data.requestUrl,
            data: this.data.formData,
            method: 'POST',
            success: function(res){
                if(!res.data.status) {
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
                        title: '注册成功',
                        icon: 'success',
                        duration: 2000
                    });
                    wx.reLaunch({
                        url: '/pages/home/index/index'
                    })
                }
            }
        })
    }
})
