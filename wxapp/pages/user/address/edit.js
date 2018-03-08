var util = require('../../../utils/util.js');
let area = require('../../../utils/areaPicker.js');
Page({
    data: {
        requestUrl:'user/address/edit', 
        gender:[
            {name: '先生',value: 1,checked: false},
            {name: '女士',value: -1,checked: true}
        ],
        genderIndex: 0,
        province: area.province,
        city: area.city['110000'],
        area: area.area['110100'],
        areaShow: false,
        formData: {
            id:'',
            title:'',
            mobile:'',
            gender: 1,
            city:'',
            address:'',
            post_code:'',
            default:0
        },
        // info:''
    },
    onLoad:function(options){
      console.log(options,5555555)
      var that = this;
      util.ly_request({
        url: that.data.requestUrl + '?id=' +options.id,
        success:function(res){
          var data = res.data
          console.log(data,999999)
          if(data.status ==1){
            that.setData({
              formData:data.data.form_data
            })
          }
        }

      })
    },



    // onLoad:function(options) {
    //     var that = this;
    //     let id,uid;
    //     wx.getStorage({
    //         key: 'userInfo',
    //         success: function(res) {
    //             uid = res.data.id;
    //         }
    //     })
    //     that.setData({"requestUrl":that.data.requestUrl  + '/id/' + options.id})
    //     util.ly_request({
    //         url: that.data.requestUrl,
    //         data: {uid: uid, id: options.id},
    //         method:'GET',
    //         success: function(res) {
    //             that.setData({"formData":res.data.data.form_data});
    //             let temp = that.data.gender;
    //             temp.map((ele,index) => {
    //                 if(ele.value == res.data.data.form_data.gender){
    //                     that.setData({"genderIndex":index});
    //                 }
    //             })
    //         }
    //     })
    // },
    bindGenderChange: function(e) {
        this.setData({"genderIndex":e.detail.value});
        this.setData({"formData.gender":this.data.gender[e.detail.value].value});
    },
    setValue:function(e) {
        let formData = this.data.formData;
        formData[e.currentTarget.id] = e.detail.value;
        this.setData({"formData":formData});
    },
    switchChange:function(e) {
        if(e.detail.value) {
            this.setData({"formData.default": 1});
        } else {
            this.setData({"formData.default": 0});
        }
    },
    formSubmit: function(e) {
        var that = this;
        console.log(that.data.formData,46464564)
        util.ly_request({
            url: that.data.requestUrl,
            data: that.data.formData,
            method: 'POST',
            success: function(res) {
                if (!res.data.status) {
                    wx.showModal({
                        title: '提示',
                        content: res.data.info,
                        success: function(res) {
                            if (res.confirm) {
                                console.log('用户点击确定')
                            } else if (res.cancel) {
                                console.log('用户点击取消')
                            }
                        }
                    })
                } else {
                    wx.showToast({
                        title: '修改成功！',
                        icon: 'success',
                        duration: 2000
                    });
                    wx.navigateBack({
                        delta: 1
                    });
                }
            }
        })
    },
    toggleArea: function() {
        this.setData({areaShow: !this.data.areaShow});
    },
    bindAreaChange:function(e) {
        let city = area.city[area.province[e.detail.value[0]].id];
        console.log(city,555555555555)
        this.setData({
            city: city
        });
        if(city.length < 2) {
            this.setData({
                area: area.area[area.city[area.province[e.detail.value[0]].id][0].id],
            })
        } else {
            this.setData({
                area: area.area[area.city[area.province[e.detail.value[0]].id][e.detail.value[1]].id],
            })
        }
        let form_city = this.data.province[e.detail.value[0]].name + ',' + this.data.city[e.detail.value[1]].name + ',' + this.data.area[e.detail.value[2]].name;
        this.setData({"formData.city": form_city});
    }
})
