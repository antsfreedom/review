var util = require('../../../utils/util.js')
var app = getApp()
Page({
    data: {
        list:[],
        requestUrl: 'shopstore/index/index',
        requestData: {
            p: 1,
        },
        loading: false
    },
    onLoad: function() {
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
    }
})
function loadList (that,concat,callback) {
    if(!that.data.loading) {
        that.setData({loading: !that.data.loading})
        util.ly_request({
            url:that.data.requestUrl,
            data: that.data.requestData,
            success(res) {
                var data = res.data;
                that.setData({loading: !that.data.loading});
                var list = data.data.data_list;
                list.map((elem) => {
                    elem.city = elem.city.join(' ');
                    return elem;
                })
                if(data.status) {
                    if(concat) {
                        that.setData({'list': that.data.list.concat(list)});
                    } else {
                        that.setData({'list': list});
                    }
                    if(callback){
                        callback();
                    }
                }
            }
        })
    }
}
