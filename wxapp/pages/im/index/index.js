let util = require('../../../utils/util.js');
Page({
    data: {
        requestUrl:'im/index/index',
        list: null
    },
    onLoad: function(options) {
        var that = this;
        loadMsg(that);
        loadMsg(that);
    }
})
function loadMsg(that) {
    util.ly_request({
        url: that.data.requestUrl,
        success:function(res){
            let response = res.data;
            if(response.status) {
                that.setData({'list':response.data.recent_list});
            }
        },
        error:function(err) {
            console.log('请求失败：' +err.errMsg);
        },
        complete:function(e) {
            console.log('请求完成：'+e.errMsg);
        }
    })
}