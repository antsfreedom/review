var util = require('../../../utils/util.js');
var app = getApp();
Page({
  data:{

    requestUrl: 'shopext/tuan/lists',
  },
  onLoad:function(options){
    var that = this;
    util.ly_request({
      url:that.data.requestUrl,
      success:function(res){
        var data = res.data;
        if(data.status ==1){

        }
      }
    })


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
})