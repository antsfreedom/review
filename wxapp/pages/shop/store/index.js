var util = require('../../../utils/util.js');
var cityData = require('../../../utils/city.js');
var array = new Object();
var cityele = new Object();
var app = getApp()
Page({
    data: {
        list:[],
        requestUrl: 'shop/store/index',
        requestData: {
            p: 1,
        },
        content: [],
        sort: [],
        select:true,
        areaopen: false,
        areashow: false,
        sortopen: false,
        sortshow: false,
        isfull: false,
        sortNormal:true,
        sortasc:false,
        sortdesc:false,
        cityleft: cityData.getCity(),
        citycenter: {},
        cityright: {},
        select1: '',
        select2: '',
        select2: '',
        shownavindex: '',
        loading: false
    },
    onLoad: function() {
        var that = this;
        loadList(that,false);
        that.setData({
            'requestData.p': that.data.requestData.p + 1,
        })
        loadList(that,true);
    },
    onPullDownRefresh() {
        var that = this;
        that.setData({'requestData.p': 1})
        loadList(that,false,function(){
            wx.stopPullDownRefresh();
        })
    },
    listarea: function (e) {
      if (this.data.areaopen) {
        this.setData({
          areaopen: false,
          sortopen: false,
          sortshow: true,
          areashow: false,
          isfull: false,
          shownavindex: 0
        })
      } else {
        this.setData({
          areaopen: true,
          sortopen: false,
          sortshow: true,
          areashow: false,
          isfull: true,
          shownavindex: e.currentTarget.dataset.nav
        })
      }

    },
    selectleft: function (e) {
      cityele.pro = e.target.dataset.city
      this.setData({
        cityright: {},
        citycenter: this.data.cityleft[e.currentTarget.dataset.city],
        select1: e.target.dataset.city,
        select2: ''
      });
    },
    selectcenter: function (e) {
      cityele.city = e.target.dataset.city
      console.log(cityele, 88888)
      this.setData({
        cityright: this.data.citycenter[e.currentTarget.dataset.city],
        select2: e.target.dataset.city
      });
    },

    selectright:function(e){
      var right = this.data.cityright[e.currentTarget.dataset.city];
      cityele.right = right;
      var that = this;
      var newpram = cityele.pro + ',' + cityele.city + ',' + cityele.right;
      array.city = newpram     
      util.ly_request({
        url: that.data.requestUrl,
        data: array,
        success:function(res){
          var data = res.data;
          if(data.status ==1){
            that.setData({
              list: data.data.data_list,
              areaopen: 'slidup',
              areashow: true,
            })
             
          }
        }
      })
    },

    listsort:function(e){
      var that = this;
       array.asc = 1
        util.ly_request({
          url: that.data.requestUrl,
          data:array,
          success: function (res) {
            var data = res.data
            if (data.status == 1) {
              that.setData({
                list: data.data.data_list,
                sortasc:true,
                sortNormal:false,
              })
            }
          }
        })
    },
    listdesc:function(e){
      var that = this;
      delete array.asc
      array.desc =1
      util.ly_request({
        url: that.data.requestUrl,
        data:array,
        success: function (res) {
          var data = res.data
          if (data.status == 1) {
            that.setData({
              list: data.data.data_list,
              sortasc: false,
              sortNormal: false,
              sortdesc:true
            })
          }
        }
      })
    },

    listasc:function(e){
      var that = this;
      delete array.desc;
      array.asc = 1;
      util.ly_request({
        url: that.data.requestUrl,
        data:array,
        success: function (res) {
          var data = res.data
          if (data.status == 1) {
            that.setData({
              list: data.data.data_list,
              sortasc: true,
              sortNormal: false,
              sortdesc: false
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
              ready_text: '加载完成'
            });
          } else {
            that.setData({
              list: '',
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
                var list = data.data.data_list;
                list.map((elem) => {
                    elem.city = elem.city.join(' ');
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
