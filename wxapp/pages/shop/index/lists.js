var util = require('../../../utils/util.js')
var app = getApp();
var array = new Object()
Page({
    data: {
        list:[],
        brand:'品牌',
        brand_list:[],
        price:'价格',
        pro_type:"品类",
        flag:false,
        info:[],
        attr_list:[],
        price_list:[],
        brandopen: false,
        brandshow: false,
        priceopen: false,
        priceshow: false,
        isfull: false,
        shownavindex: '',
        requestUrl: 'shop/index/lists',
        requestData: {
            p: 1,
        }, 
        loading: false
    },
    onLoad: function(options) {
        var that = this;
        var searchValue = options.keyword;
        var list_url = options.cid ? that.data.requestUrl + '?cid=' + options.cid : that.data.requestUrl +'?keyword=' +options.keyword  //判断从哪个入口进来调用接口传参
        util.ly_request({
          url: list_url,
          data: { keyword: searchValue ? searchValue : '' }, //搜索传值
          success:function(res){
            var data = res.data;
            var attr_list = data.data.attr_list;
            var sarray = [];
            var newLists = [];
            var newAttr = [];
            var str = {};
            for (var i in attr_list) {
              for (var j in attr_list[i].options) {
                var options = attr_list[i].options;
                var svalue = options[j];
                //这个name换成活的，用param
                var params = attr_list[i].name; 
                str[params] = svalue;
                sarray.push(str) 
                str = {};
              }
              // 重新组装成attr_list
              newLists = {
                'title': attr_list[i].title,
                'id': attr_list[i].id,
                'type_id': attr_list[i].type_id,
                'prarm': attr_list[i].name,
                'data':sarray,
              }
              newAttr.push(newLists)
              var sarray = [];
            }
            if(data.status ==1){
              that.setData({
                info: data.data.attr_list,
                inputVal: searchValue,
                inputShowed: searchValue ? true : false,
                list:data.data.data_list,
                attr_list: newAttr
              })
            }else{
              that.setData({
                inputVal: searchValue,
                inputShowed: searchValue ? true : false,
              })
            }
          }          
        })
    },

    // 品牌接口
    brandlist:function(e){
      var that = this
      var list_url = that.options.cid ? that.data.requestUrl + '?cid=' + that.options.cid : that.data.requestUrl + '?keyword=' + that.options.keyword  //搜索入口、更多入口
      util.ly_request({
        url: list_url,
        success: function (res) {
          var data = res.data
          if (data.status == "1") {
            that.setData({
              brand_list: data.data.brand_list,
            })
          }
        }
      })
      if (this.data.qyopen) {
        this.setData({
          brandopen: true,   //false
          brandshow: false,
          priceopen: false,
          priceshow: true,
          isfull: false,
          shownavindex: 0
        })
      } else {
        this.setData({
          brandopen: true,
          priceopen: false,
          priceshow: true,
          brandshow: false,
          isfull: true,
          shownavindex: e.currentTarget.dataset.nav
        })
      }
    },

    // 品牌筛选
    chooseAll: function (e) {
      var that = this
      var list_url = that.options.cid ? that.data.requestUrl + '?cid=' + that.options.cid : that.data.requestUrl + '?keyword=' + that.options.keyword
      delete array.brand
      console.log(array,111)
      util.ly_request({
        url: list_url,
        data: array,
        success: function (res) {
          var data = res.data
        if(data.status==1){
            that.setData({
              list: data.data.data_list,
              brandopen: 'slidup',
              brandshow: true,
              isfull: 0
          })
        }
        }
      })
    },
    chooseBrand: function (e) {
      var that = this
      var list_url = that.options.cid ? that.data.requestUrl + '?cid=' + that.options.cid : that.data.requestUrl + '?keyword=' + that.options.keyword
      var title = e.currentTarget.dataset.title
      array.brand = title
      console.log(array,89898988)
      util.ly_request({
        url: list_url,
        data: array,
        success: function (res) {
          var data = res.data
          if(data.status ==1){
            that.setData({
              list: data.data.data_list,
              brandopen:'slidup',
              brandshow: true,
              isfull: 0
            })
          }
        }

      })
    },
    // 价格获取数据接口
    pricelist: function (e) {
      var that = this
      var list_url = that.options.cid ? that.data.requestUrl + '?cid=' + that.options.cid : that.data.requestUrl + '?keyword=' + that.options.keyword
      util.ly_request({
        url: list_url,
        success: function (res) {
          var data = res.data
          var info = data.data.price_list
          var parray = [];
          for(var i in info ){
            var pkey = i;
            var pvalue = info[i];
            parray.push({id:pkey,name:pvalue})
          }
          console.log(parray,89898989898)
          if (data.status == 1) {
            that.setData({
              price_list: parray
            })
          }
        }
      })
      if (this.data.nzopen) {
        this.setData({
          priceopen: true,   //false
          brandopen: false,
          priceshow: false,
          brandshow: true,
          isfull: false,
          shownavindex: 0
        })
      } else {
        this.setData({
          content: this.data.nv,
          priceopen: true,
          brandopen: false,
          priceshow: false,
          brandshow: true,
          isfull: true,
          shownavindex: e.currentTarget.dataset.nav
        })
      }
    },


    priceAll: function (e) {
      var that = this
      var list_url = that.options.cid ? that.data.requestUrl + '?cid=' + that.options.cid : that.data.requestUrl + '?keyword=' + that.options.keyword
      delete array.price
      util.ly_request({
        url: list_url,
        data: array,
        success: function (res) {
          var data = res.data
          if (data.status == 1) {
            that.setData({
              list: data.data.data_list,
              brandopen: 'slidup',
              brandshow: true,
              isfull: 0
            })
          }
        }

      })
    },

    choosePrice: function (e) {
      var that = this
      var list_url = that.options.cid ? that.data.requestUrl + '?cid=' + that.options.cid : that.data.requestUrl + '?keyword=' + that.options.keyword
      var id = e.currentTarget.dataset.id
      array.price = id
      console.log(array,898989989889)
      util.ly_request({
        url: list_url,
        data: array,
        success: function (res) {
          var data = res.data
          if (data.status == 1) {
            that.setData({
              list: data.data.data_list,
              brandopen: 'slidup',
              brandshow: true,
              isfull: 0
            })
          }
        }

      })
    },

    hidebg: function (e) {
      this.setData({
        brandopen: false,
        nzopen: false,
        priceshow: true,
        brandshow: true,
        isfull: false,
        shownavindex: 0
      })
    },


    typelist:function(e){
      var that = this;
      that.setData({
        flag:true
      })
    },

    leftlist:function(e){
      var that = this;
      that.setData({
        flag: false
      })
    },

    chooseSize:function(e){
      var that = this;
      var name = e.currentTarget.dataset.name;
      var attr_value = e.currentTarget.dataset.value
      array[name] = attr_value;
      util.ly_request({
        url:that.data.requestUrl +'?cid=' +that.options.cid,
        data:array,
        success:function(res){
          var data = res.data;
          if(data.status ==1){
            that.setData({
              list: data.data.data_list,
              flag:false
            })
          }
        }
      })
    },

    //搜索
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

    search(e) {
      var that = this;
      util.ly_request({
        url: that.data.requestUrl,
        data: { keyword: e.detail.value },
        success: function (res) {
          var data = res.data;
          if (data.status == "1") {
            that.setData({
              list: data.data.data_list,
            });
          } else {
            that.setData({
              data_list: '',
              ready_text: data.info
            })
          }
        }
      })
    },



})
function loadList (that,concat,callback) {
    if(!that.data.loading) {
        that.setData({loading: !that.data.loading})
        util.ly_request({
            url:that.data.requestUrl,
            data: that.data.requestData,
            success(res) {
                var data = res.data;
                that.setData({loading: !that.data.loading});
                console.log(data);
                var list = data.data.data_list;
                list.map((elem) => {
                    elem.store_info.city = elem.store_info.city.join(' ');
                    return elem;
                })
                if(data.status) {
                    if(concat) {
                        that.setData({'list': that.data.list.concat(list)});
                    } else {
                        that.setData({'list': list});
                    }
                    if(callback){
                        callback();
                    }
                }
            }
        })
    }
}
