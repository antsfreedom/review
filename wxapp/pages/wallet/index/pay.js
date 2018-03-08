//获取应用实例
var util = require('../../../utils/util.js');
Page({
    data: {
        title: '支付',
        flag:false,
        requestUrl: 'wallet/index/pay',
        title:'',
        money:'',
        user_money:'',
        original_money:'',
        out_trade_no:''
    },
    onLoad: function(options) {
        var that = this;
        var out_trade_no = options.out_trade_no;
        util.ly_request({
          url: that.data.requestUrl + '?out_trade_no=' + out_trade_no,
            success: function(res) {
                var data = res.data;
                if(data.status==1){
                  that.setData({
                    title:data.data.pay_data.title,
                    money: data.data.pay_data.money,
                    original_money: data.data.pay_data.original_money,
                    user_money: data.data.user_info.money,
                    out_trade_no: data.data.pay_data.out_trade_no
                  })
                }
            }
        });
    },
    paylist(){
      var that = this;
      var out_trade_no = that.data.out_trade_no;
      that.setData({
        flag:true,
        out_trade_no: out_trade_no

      })
    },

    formSubmit:function(e){
      var that = this;
      var out_trade_no = that.data.out_trade_no;
      var redbag_id = that.data.redbag_id;
      var coupon_id = that.data.coupon_id
      var password = e.detail.value.password;
      util.ly_request({
        url:'wallet/index/dopay',
        data: { out_trade_no: out_trade_no, allow_money: 1, password: password},
        method:'post',
        success:function(res){
          var data = res.data;
          if(data.status ==1){
            wx.redirectTo({
              url: '/pages/shop/order/my',
            })
          }         
          wx.showToast({
            title: data.info,
            icon: 'success',
            duration: 2000
          })
        }
      })
    }

});
