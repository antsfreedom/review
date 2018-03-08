//index.js
//获取应用实例
var util = require('../../../utils/util.js')
var app = getApp()
Page({
    data: {
        list:[],
        requestUrl:'shop/mark/my',
        requestData: {
            p: 1
        },
        loading: false
    },
    onLoad(options) {
        var that = this;
        loadList(that,false);
    },
    onReachBottom() {
        var that = this;
        that.setData({
            'requestData.p': that.data.requestData.p + 1,
        })
        loadList(that,true);
    },
    onPullDownRefresh() {
        var that = this;
        that.setData({'requestData.p': 1})
        loadList(that,false,function(){
            wx.stopPullDownRefresh();
        })
    },
    goodsMark(e) {
        var that = this;
        util.ly_request({
            url:'shop/mark/add/data_id/' + e.currentTarget.id,
            success(res) {
                var data = res.data;
                if(data.status) {
                    var that = this;
                    that.setData({'requestData.p': 1})
                    loadList(that,false);
                }
            }
        });
    },
})
function loadList(that,concat,callback) {
    if(!that.data.loading) {
        that.setData({loading: !that.data.loading})
        util.ly_request({
            url:that.data.requestUrl,
            data: that.data.requestData,
            success(res) {
                var data = res.data;
                console.log(data.data.table_data_list);
                that.setData({loading: !that.data.loading});
                if(data.status) {
                    if(concat) {
                        that.setData({'list': that.data.list.concat(data.data.table_data_list)});
                    } else {
                        that.setData({'list': data.data.table_data_list});
                    }
                    if(callback){
                        callback();
                    }
                }
            }
        })
    }
}