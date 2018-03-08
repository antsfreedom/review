var util = require('../../../utils/util.js');
Page({
    data: {
        info:'',
        new_list:[],
        hot_list:[],
        cate_list:[],
        data_list:[],
        sortopen: false,
        sortshow: false,
        recommend_list:[],
        navbar: ['全部', '新品','店铺热门'],
        currentTab:0,
        collapsible:true,
        flag:false,
        requestUrl:'shop/store/detail'
    },
    onLoad: function(options) {
        var that = this;
        util.ly_request({
            url: that.data.requestUrl + '/id/' + options.id,
            success: function(res) {
                var data = res.data;
                data.data.info.city = data.data.info.city.join(' ');
                console.log(data);
                if (data.status == '1') {
                    that.setData({
                        info: data.data.info,
                        new_list:data.data.new_list,
                        data_list:data.data.data_list,
                        hot_list:data.data.hot_list,
                        cate_list: data.data.cate_list,
                        recommend_list:data.data.recommend_list
                    });
                } else {
                    console.log(data.info)
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
        console.log(that,8888)
        var id = that.data.info.id;
        util.ly_request({
          url:that.data.requestUrl +'?id=' +id,
          data: { keyword_store: e.detail.value},
          success:function(res){
            var data = res.data;
            if(data.status==1){
              that.setData({
                data_list: data.data.data_list,
              })           
            }
          }
        })
    },

    toggleShow(e) {
      var parent = e.currentTarget.dataset.parent;
      var id = e.currentTarget.id;
      var cate_list = this.data.cate_list;
      cate_list.map((elem, index) => {
        if (elem.id == parent) {
          elem.collapsible = !elem.collapsible;
        }
        return elem;
      })
      this.setData({ cate_list: cate_list });
    },

    navbarTap: function (e) {
      this.setData({
        currentTab: e.currentTarget.dataset.index,
      })
    },

    listcate:function(e){
      this.setData({
         flag:true
      })
    },
    hidelist:function(e){
      this.setData({
        flag: false
      })
    },

    catelist:function(e){
      var that = this;
      var iid = that.data.info.id;
      console.log(that,55555)
      var id = e.currentTarget.dataset.id;
      util.ly_request({
        url: that.data.requestUrl +'?id=' +iid +'&cate=' + id,
        success:function(res){
          var data = res.data;
          if(data.status ==1){
            that.setData({
              data_list: data.data.data_list,
              flag:false,
              currentTab:0   //跳转是停留在第一个页面
            })
          }
        }
      })
    }
})
