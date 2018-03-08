var util = require('../../../utils/util.js') 
var app = getApp();
var store_id = getApp().globalData.store_id; 
console.log(store_id,444444)
Page({
    data: {
        inputShowed: false,
        inputVal: "",
        slider_list: [],
        indicatorDots: false,
        autoplay: false,
        interval: 5000,
        duration: 1000,
        goods_list: [],
        topic_list:[],
        topic:"",
        shop:"",
        shop_list:[],
        adv:[]
    },

    onLoad: function () {
      this.onShow();
    },

    //这是为了第二次点击tabbar依然能请求接口
    onShow:function(){
      var that = this;
      // 请求幻灯片数据
      util.ly_request({
        url: 'shop/slider/index',
        success: function (res) {
          var data = res.data
          if (data.status == '1') {
            that.setData({
              slider_list: data.data
            })
          } else {
            console.log(data.info)
          }
        },
        error: function () {
          console.log('请求失败' + res.errMsg)
        },
        fail: function () {
          console.log('请求失败' + res.errMsg)
        }
      });

      // 请求商品数据
      util.ly_request({
        url: 'shop/index/index?store_id=' + store_id,
        success: function (res) {
          var data = res.data
          if (data.status == '1') {
            that.setData({
              goods_list: data.data.category_list,
            })
          } else {
            console.log(data.info)
          }
        },
        error: function (res) {
          console.log('请求失败' + res.errMsg)
        },
        fail: function (res) {
          console.log('请求失败' + res.errMsg)
        }
      });
    },

    showInput: function () {
        this.setData({
            inputShowed: true
        });
    },
    hideInput: function () {
        this.setData({
            inputVal: "",
            inputShowed: false
        });
    },
    clearInput: function () {
        this.setData({
            inputVal: ""
        });
    },
    inputTyping: function (e) {
        this.setData({
            inputVal: e.detail.value
        });
    },
    search(e){
        var that = this;
        wx.navigateTo({
          url: '/pages/shop/index/lists?keyword=' + e.detail.value,
        })
    }
})
