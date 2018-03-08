//index.js
//获取应用实例
var util = require('../../../utils/util.js');
var app = getApp()
Page({
    data: {
        requestUrl:'shop/category/index',
        list:[],
        height:'',
    },
    onLoad() {
        var that = this;
        wx.getSystemInfo({
            success: function(res) {
                that.setData({height: res.windowHeight});
            }
        })
        util.ly_request({
            url: that.data.requestUrl,
            success(res) {
                var list = res.data.data.data_list;
                list.map((elem,index) => {
                    elem.class = 'cate-item';
                    if(elem._child) {
                        elem._child.map((e,i) => {
                            e.collapsible = true;
                        })
                    }
                })
                list[0].class = 'cate-item cate-item_active';
                that.setData({list: list })
            }
        })
    },
    toggleCate(e) {
        var id = e.currentTarget.id;
        var that = this;
        var list = that.data.list;
        list.map((e,i) => {
            if(e.id == id) {
                e.class = 'cate-item cate-item_active';
            } else {
                e.class = 'cate-item';
            }
            return e;
        })
        that.setData({list: list});
    },
    toggleShow(e) {
        var parent = e.currentTarget.dataset.parent;
        var id = e.currentTarget.id;
        var list = this.data.list;
        list.map((elem,index) => {
            if(elem.id == parent) {
                elem._child.map((e,i) => {
                    if(e.id == id) {
                        e.collapsible = !e.collapsible;
                    }
                    return e;
                })
            }
            return elem;
        })
        this.setData({list: list});
    }
})
