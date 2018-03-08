//index.js
//获取应用实例
var util = require('../../../utils/util.js')

var app = getApp()
Page({
    data: {
        selected: true,
        address_list:[],
    },

    onShow:function(){
      var that = this;
      console.log(that.options.time,898989)
      util.ly_request({
        url: 'shop/order/index/time/' + that.options.time,
        success: function (res) {
          var data = res.data
          var address_list = data.data.address_list;
          for (var i = 0; i < address_list.length; i++) {
            if (address_list[i].default == 1) {
              address_list[i].selected = true
            }
          }
          if (data.status == 1) {
            that.setData({
              address_list: address_list
            })
          }
        }
      })
    },


    onLoad(options) {
      var that = this;
      var time = options.time;
      util.ly_request({
        url: 'shop/order/index/time/' + time,
        success:function(res){
          var data = res.data
          var address_list = data.data.address_list;
          for (var i = 0; i < address_list.length; i++) {
            if (address_list[i].default == 1) {
              address_list[i].selected = true
            }
          }
            if(data.status==1){
              that.setData({
                address_list: address_list
              })
            }
        }
      })
    },
    //  当前地址选中事件
    selectList(e) {
      const index = e.currentTarget.dataset.index;
      let address_list = this.data.address_list;
      var id = address_list[index].id
      const selected = address_list[index].selected;
      address_list[index].selected = !selected;
      util.ly_request({
        url: 'user/address/set_default?id='+id,
        success:function(res){
          var data = res.data
          if(data.status==1){
            var pages = getCurrentPages();
            var time = pages[pages.length - 2].options.time;
            wx.redirectTo({
             url: 'index?time=' + time
             
           })
          }
        }

      })
      this.setData({
        address_list: address_list
      });
    },

    delbtn(e){
      var that = this;
      var index = e.currentTarget.dataset.index;
      var address_list = this.data.address_list;
      console.log(address_list,777)
      var address_id = address_list[index].id;
      wx.showModal({
        title: '提示',
        content: '是否删除？',
        success: function (res) {
          if (res.confirm) {
            // 删除
            address_list.splice(index, 1);
            util.ly_request({
              url: 'user/address/del',
              data: { id: address_id },
              success: function (res) {
                var data = res.data
              }
            })
            //更新地址列表的状态
            that.setData({
              address_list: address_list
            });
          }
         
        }
      })       
    }
})
