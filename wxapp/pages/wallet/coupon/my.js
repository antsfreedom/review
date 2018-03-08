//获取应用实例
var util = require('../../../utils/util.js')
var app = getApp()
Page({
    data: {
        table_data_list:[],
        info:[],
        selected:true,
        redbag:'',
        requestUrl: 'wallet/coupon/my'
    },
    onLoad: function(options) {
        var that = this;
        var time=options.time
        util.ly_request({
          url: 'shop/order/index/time/' + time,
            success: function(res) {
               var data = res.data
               var info = data.data.info;
               for (var i in info) {
                 var coupon = info[i].store_redbag;
                 for(var k in coupon){
                   coupon[k].checked = true
                 }
               } 
                if(data.status==1){
                  that.setData({
                    info: data.data.info
                  })
                }
            }
        });
    },

    radioChange: function (e) {
      var that = this;
      var info = that.data.info;  
      for(var i in info) {
        var coupon = info[i].store_redbag;
      }  
      for (var i = 0, len = coupon.length; i < len; ++i) {
        coupon[i].checked = coupon[i].id == e.detail.value
      }
      util.ly_request({
        url:that.data.requestUrl +'?id=' +e.detail.value,
        success:function(res){
          var data = res.data;
          console.log(res.data,9999999)        
          if(data.status ==1){
            var pages = getCurrentPages();
            var time = pages[pages.length - 2].options.time;
            wx.navigateTo({
                url:'../../shop/order/index?time=' +time
            })
          }
        }
      })

      this.setData({
        info: info,
      });
    },
});







          