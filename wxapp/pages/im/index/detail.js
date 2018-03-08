let util = require('../../../utils/util.js');
Page({
    data: {
        requestUrl: 'im/index/detail',
        addUrl:'im/index/add',
        user_info:null,
        to_user_info:null,
        talk_list: null,
        message: '',
        id: '',
        height: 400,
        p:2,
        loadMore: true
    },
    onLoad: function(options) {
        // 加载最新的10条消息
        var that = this;
        wx.getSystemInfo({
            success: function(res) {
                that.setData({'height':res.windowHeight - 50});
            }
        })
        that.setData({ "id": options.id });
        loadLastMsg(that);
        setInterval(function() {
            loadLastMsg(that);
        },1000);
    },
    setValue: function(e) {
        this.setData({ 'message': e.detail.value });
    },
    sendMsg: function(e) {
        // 发送消息
        var that = this;
        let temp = new Object();
        temp['message'] = that.data.message;
        temp['user'] = that.data.user_info;
        temp['type'] = 'sent';
        let talk_list = that.data.talk_list;
        talk_list.push(temp);
        that.setData({'talk_list':talk_list});
        util.ly_request({
            url: that.data.addUrl,
            data: {
                to_uid: that.data.to_user_info.id,
                message: that.data.message,
            },
            method:'POST',
            success: function(res) {
                that.setData({'message':''});
            }
        })
    },
    loadMore:function(e) {
        // 加载历史消息
        var that = this;
        loadMsg(that);
    }
});

function loadMsg(that) {
    if(that.data.loadMore) {
        util.ly_request({
            url: that.data.requestUrl,
            data: {
                id: that.data.id,
                p: that.data.p,
            },
            success: function(res) {
                let response = res.data;
                if(response.status && response.data.talk_list.length > 0) {
                    let p = that.data.p;
                    p ++;
                    let temp_list = response.data.talk_list.concat(that.data.talk_list);
                    that.setData({
                        'talk_list':temp_list,
                        'p': p
                    });
                } else {
                    that.setData({'loadMore': false});
                }
            },
            error: function(err) {
                console.log('请求失败：' + err.errMsg);
            },
            complete: function(e) {
                console.log('请求完成：' + e.errMsg);
            }
        })
    }
}
function loadLastMsg(that) {
    util.ly_request({
        url: that.data.requestUrl,
        data: {
            id: that.data.id,
            p: 1,
        },
        success: function(res) {
            let response = res.data;
            that.setData({
                'talk_list':response.data.talk_list,
                'user_info':response.data.user_info,
                'to_user_info':response.data.to_user_info,
                'p':2,
                'loadMore': true
            });
        },
        error: function(err) {
            console.log('请求失败：' + err.errMsg);
        },
        complete: function(e) {
            console.log('请求完成：' + e.errMsg);
        }
    })
}
