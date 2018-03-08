var util = require('../../../utils/util.js');
var WxParse = require('../../../utils/wxParse/wxParse.js');
var app = getApp()
Page({
    data: {
        slider_list: [],
        spec_data_format:[],
        indicatorDots: false,
        autoplay: false,
        interval: 5000,
        duration: 1000,
        tab_links:[{
            title:'图文详情',
            class:'tab-link active',
        },{
            title:'累计评价',
            class:'tab-link',
        }],
        specSelected:[],
        tab_show:0,
        info:'',
        info_content:'',
        hot_list:[],
        requestUrl:'shop/index/detail',
        orderInfo: {
            amount:1
        },
        price_type:'',
        isCart:false
    },
    onLoad: function(options) {
        var that = this;
        util.ly_request({
            url: that.data.requestUrl + '/id/' + options.id,
            success: function(res) {
                var data = res.data
                var price_type = parseInt(data.data.info.price_type);
                // 处理规格参数
                var spec = data.data.info.spec_data_format;
                var spec = spec.map((elem, index) => {
                  if (elem.value[0]) {
                    return elem;
                  }
                  return null;
                })
                var info = data.data.info;
                info.spec_data_format = spec[0] ? spec : '';
                if (data.status == '1') {
                    that.setData({                     
                        info: data.data.info,
                        spec_data_format: spec,
                        hot_list:data.data.hot_list,
                        price_type: price_type,
                        comment_list:data.data.comment_list
                    });
                    WxParse.wxParse('info_content', 'html', data.data.info.content, that);
                }
            },
            error: function() {
                console.log('请求失败' + res.errMsg)
            },
            fail: function() {
                console.log('请求失败' + res.errMsg)
            }
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
    addAmount() {
        var that = this;
        var amount = that.data.orderInfo.amount;
        if(amount < that.data.info.stock) {
            amount ++;
            that.setData({"orderInfo.amount" : amount});
        }
    },
    descAmount() {
        var that = this;
        var amount = that.data.orderInfo.amount;
        if(amount > 1) {
            amount --;
            that.setData({"orderInfo.amount" : amount});
        }
    },
    selectSpec(e) {
        var that = this;
        var temp = that.data.specSelected;
        var index = e.target.dataset.spec;
        temp[index] = e.target.dataset.value;
        that.setData({specSelected:temp});
    },
    addCart() {
        var that = this;
        var spec = that.data.info.spec_data_format;
        var specSelected = that.data.specSelected;
        var price_type = parseInt(that.data.info.price_type);
        // 判断规格
        if(price_type) {
          spec.map((elem, index) => {
            if (!specSelected[index]) {
              wx.showToast({
                title: '请选择' + elem.name,
                icon: 'success',
                duration: 2000
              })
            }
            return elem;
          })
        }
        if(specSelected.length == spec.length && !specSelected.includes(null)) {
            var orderInfo = that.data.orderInfo;
            var specString = specSelected.join(',')
            Object.assign(orderInfo,{spec: specString});
            that.setData({orderInfo:orderInfo});
            util.ly_request({
                url: 'shop/cart/add/data_id/' + that.data.info.id,
                method: 'POST',
                data: that.data.orderInfo,
                success(res) {
                    var data = res.data;
                    wx.showToast({
                        title: data.info,
                        icon: 'success',
                        duration: 2000
                    })
                }
            })
        }
    },
    goodsMark() {
        var that = this;
        util.ly_request({
            url:'shop/mark/add/data_id/' + that.data.info.id,
            success(res) {
                var data = res.data;
                if(data.status) {
                    var temp = that.data.info.mark_status;
                    temp = !temp;
                    that.setData({'info.mark_status': temp});
                    wx.showToast({
                        title: data.info,
                        icon: 'success',
                        duration: 2000
                    })
                }
            }
        });
    },
    
    buy() {
        var that = this;
        var spec = that.data.info.spec_data_format;
        var specSelected = that.data.specSelected;
        var price_type = parseInt(that.data.info.price_type);
        // 判断规格
        if (price_type) {
          spec.map((elem, index) => {
            if (!specSelected[index]) {
              wx.showToast({
                title: '请选择' + elem.name,
                icon: 'success',
                duration: 2000
              })
            }
            return elem;
          })
        }
        if(specSelected.length == spec.length && !specSelected.includes(null)) {
            var orderInfo = that.data.orderInfo;
            Object.assign(orderInfo,{spec:specSelected.join(',')});
            that.setData({orderInfo:orderInfo});
            util.ly_request({
                url: 'shop/order/add/id/' + that.data.info.id,
                method: 'POST',
                data: that.data.orderInfo,
                success(res) {
                    var data = res.data;
                    var time= data.time;
                    if(data.status) {
                        wx.setStorage({
                            key: 'order_id',
                            data: data.id
                        });
                        wx.navigateTo({
                            url: "/pages/shop/order/index?time=" +time
                        });
                    } else {
                        if(data.login) {
                            wx.showModal({
                                title: '提示',
                                content: data.info,
                                success: function(res) {
                                    if (res.confirm) {
                                        wx.navigateTo({
                                            url:'/pages/user/user/login'
                                        })
                                    } else if (res.cancel) {
                                        console.log('取消');
                                    }
                                }
                            })
                        } else {
                            wx.showModal({
                                title: '提示',
                                content: data.info,
                                success: function(res) {
                                    if (res.confirm) {
                                        console.log('用户点击确定')
                                    } else if (res.cancel) {
                                        console.log('用户点击取消')
                                    }
                                }
                            })
                        }
                    }
                }
            })
        }
    }
})
