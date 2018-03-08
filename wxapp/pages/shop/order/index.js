//index.js
//获取应用实例
var util = require('../../../utils/util.js')
let area = require('../../../utils/areaPicker.js');
var store_id = getApp().globalData.store_id
var array = new Object();
var app = getApp()
var str = new Object;
Page({
    data: {
        info:'',
        time:'',
        all_fee:'',
        all_price:'',
        fee_list:'未使用',
        total_price:'',
        order_info:[],
        redbag:[],
        default_address:'',
        cityadress:'',
        address_list:[],  
        form_data:{},
        province: area.province,
        city: area.city['110000'], 
        area: area.area['110100'],
        areaShow: false,
        selected:true,
        checked:true,

    },

    onLoad(options){
      var that = this;
      var time = options.time;
      str.time = time;
      util.ly_request({
        url: 'shop/order/index/' + '?time=' + time,
        success:function(res){
          var data = res.data 
          var info = data.data.info;
          var fee = data.data.all_fee;
          var price = data.data.all_price;
          var total_price = parseInt(fee) + parseInt(price);
          var adres = data.data.default_address ? data.data.default_address.city:'';
          var a1 = adres[0];
          var a2 = adres[1];
          var a3 = adres[2];
          var address = a1 + a2 + a3 + data.data.default_address ? data.data.default_address.address:'';
          if(data.status ==1){
            that.setData({
              info:data.data.info,
              all_fee: data.data.all_fee,
              default_address:data.data.default_address,
              address_list:data.data.address_list,
              cityadress: address,
              time:data.data.time,
              total_price: total_price,
              redbag:data.data.info[store_id].store_redbag
            })
          }
        }
      })
    },
    onShow: function () {
      var that = this;
      var time = str.time;
      util.ly_request({
        url: 'shop/order/index/time/' +time,
        success: function (res) {
          var data = res.data
          var info = data.data.info;
          var fee = data.data.all_fee;
          var price = data.data.all_price;
          var total_price = parseInt(fee) + parseInt(price);
          var adres = data.data.default_address ? data.data.default_address.city : '';
          var a1 = adres[0];
          var a2 = adres[1];
          var a3 = adres[2];
          var address = a1 + a2 + a3 + data.data.default_address ? data.data.default_address.address : '';
          for (var i in info) {
            var redbag = info[i].store_redbag
          }
          if (data.status == 1) {
            that.setData({
              info: data.data.info,
              all_fee: data.data.all_fee,
              default_address: data.data.default_address,
              address_list: data.data.address_list,
              cityadress: address,
              time: data.data.time,
              total_price: total_price,
              redbag: '未使用'
            })
          }
        }
      })
    },

    formSubmit() {
        var that = this;
        var adres = that.data.default_address.city;
        console.log(adres,9999999)
        var a1 = adres[0];
        var a2 = adres[1];
        var a3 = adres[2];
        var city = a1+a2+a3;
        var id = that.data.default_address.id;
        var time = that.data.time;
        var address = that.data.default_address.address;
        var title = that.data.default_address.title;
        var post_code = that.data.default_address.post_code;
        var mobile = that.data.default_address.mobile;
        util.ly_request({
          url: 'shop/order/index',
          data: { time:time, address_id:id, mobile:mobile, title:title, address:address, post_code:post_code,city:city},
          method:'post',
          success(res) {
            var data = res.data;
            var out_trade_no = data.out_trade_no
            if(data.status) {
              wx.redirectTo({
                url: '/pages/wallet/index/pay?out_trade_no=' + out_trade_no
              })
            }
          }
        })
    }
})
