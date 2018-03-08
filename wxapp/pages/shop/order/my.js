//index.js
//获取应用实例
var util = require('../../../utils/util.js')
var app = getApp()
Page({
    data: {
        list:[],
        requestUrl:'shop/order/my',
        requestData: {
            status:null,
            p: 1
        },
        loading: false,
        order_status:[{
            status: -1,
            label: '已删除'
        },{
            status: 0,
            label: '已关闭'
        },{
            status: 1,
            label: '待付款'
        },{
            status: 3,
            label: '待发货'
        },{
            status: 5,
            label: '已发货'
        },{
            status: 7,
            label: '已签收'
        },{
            status: 9,
            label: '已确认收货'
        },{
            status: 11,
            label: '退货中'
        },{
            status: 13,
            label: '已退货'
        }],
        tab_links:[{
            title:'全部',
            class:'tab-link active',
            status: 'all'
        },{
            title:'待付款',
            class:'tab-link',
            status: 1
        },{
            title:'待发货',
            class:'tab-link',
            status: 3
        },{
            title:'已发货',
            class:'tab-link',
            status: 5
        },{
            title:'待评价',
            class:'tab-link',
            status: 9
        }]
    },
    onLoad(options) {
        var that = this;
        loadList(that,false);
    },
    toggleTab(e) {
        var id = e.currentTarget.id;
        var tab_link = this.data.tab_links;
        var that = this;
        tab_link.map((x,i) => {
            if(x.status == id) {
                x.class = 'tab-link active';
                if(x.status != 'all') {
                    that.setData({
                        'requestData.status': x.status,
                        'requestData.p':1
                    });
                    loadList(that,false);
                } else {
                    that.setData({
                        'requestData.status': null,
                        'requestData.p':1
                    })
                    loadList(that,false);
                }
            } else {
                x.class = 'tab-link';
            }
            return x;
        });
        that.setData({"tab_links":tab_link});
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
function loadList(that,concat,callback) {
    if(!that.data.loading) {
        that.setData({loading: !that.data.loading})
        util.ly_request({
            url:that.data.requestUrl,
            data: that.data.requestData,
            success(res) {
                var data = res.data;
                that.setData({loading: !that.data.loading});
                if(data.status) {
                    if(concat) {
                        that.setData({'list': that.data.list.concat(data.data.data_list)});
                    } else {
                        that.setData({'list': data.data.data_list});
                    }
                    if(callback){
                        callback();
                    }
                }
            }
        })
    }
}