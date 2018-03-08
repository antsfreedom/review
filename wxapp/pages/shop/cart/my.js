//获取应用实例
var util = require('../../../utils/util.js')
var app = getApp();
var store_id = getApp().globalData.store_id; 
Page({
    data: {
        info: '',
        time:'',
        selected:true,
        amount: '',
        data_list: [],
        selectAllStatus: false,
        selectAll:false,
        requestUrl: 'shop/cart/my',
    },

    onLoad(options) {
      this.onShow();
    },

    onShow:function(){
      var that = this;
      util.ly_request({
        url: that.data.requestUrl + '?store_id=' + store_id,
        success:function(res){
          var data = res.data;
          if(data.status ==1){
            that.setData({
              data_list: data.data.data_list
            })
          }
        }
      })
    },
    // 购物车全选
    selectAll(e) {
      var that = this;
        var selectAllStatus = this.data.selectAllStatus;
        selectAllStatus = !selectAllStatus;
        var data_list = that.data.data_list;
        for (let i = 0; i < data_list.length; i++) {
          data_list[i].selected = selectAllStatus;
        }
        that.setData({
            selectAllStatus: selectAllStatus,
            data_list: data_list
        });
    },

    //  当前商品选中事件
    selectList(e) {
      var that = this;
      const index = e.currentTarget.dataset.index;   //当前选择的索引值 
      let data_list = that.data.data_list;
      var selected = data_list[index].selected;
      data_list[index].selected = !selected;
      that.setData({
        data_list: data_list
      });
    },

    //删除购物车当前商品   
    deleteList(e) {
        var that = this;
        var data_list = that.data.data_list;
        var index = e.currentTarget.dataset.index;
        var del_product_id = data_list[index].id;
        wx.showModal({
            title: '提示',
            content: '是否删除？',
            success: function(res) {
                if (res.confirm) {                 
                    // 删除
                  data_list.splice(index, 1);    
                  util.ly_request({
                    url: 'cart/del',
                    data: { id: del_product_id },
                    success: function (res) {
                      var data = res.data
                    }
                  })
                  //更新列表的状态
                  that.setData({
                    data_list: data_list
                  });
                }
            }
        })
    },

    //綁定增加數量事件
    addCount(e) {
        var that = this;
        var index = e.currentTarget.dataset.index; 
        var data_list = that.data.data_list;
        var num = parseInt(data_list[index].amount);  //字符串转数字型
        num = num+ 1;
        data_list[index].amount = num;       
        that.setData({
          data_list: data_list
        });
    },

    //绑定减数量事件
    minusCount(e) {
        var that = this
        var index = e.currentTarget.dataset.index;
        var data_list = that.data.data_list;
        var num = parseInt(data_list[index].amount);
        if (num <= 1) {
          return false;
        }
        num = num - 1;
        data_list[index].amount = num;
        this.setData({
            data_list: data_list
        });
    },

    formSubmit() {
        var that = this;
        var data_list = that.data.data_list;
        var param = new Array();
        for(var i in data_list){
          if (data_list[i].selected = true){
            var num = data_list[i].amount;
            var good_id = data_list[i].id;
          }
        }
        param['order[' + i + '][id]'] = good_id;
        param['order[' + i + '][amount]'] = num;

        util.ly_request({
            url: that.data.requestUrl,
            data: param,
            method: 'post',
            success: function(res) {
                var data = res.data
                var time = data.time
                if (data.status == 1) {
                  wx.navigateTo({
                    url: '/pages/shop/order/index?time=' +time,
                  })
                }
            }
        })

    }
});