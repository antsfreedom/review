var util = require('../../../utils/util.js');
let area = require('../../../utils/areaPicker.js');

Page({
    data: {
        requestUrl:'user/address/add',
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
            title:'',
            mobile:'',
            gender: 1,
            city:'北京市，市辖区，东城区',
            address:'',
            post_code:'',
            default:0
        }
    },
    onLoad:function(options) {
        var that = this;
        console.log(that,5555)
        // 获取用户地址
    },
    bindGenderChange: function(e) {
        this.setData({"genderIndex":e.detail.value});
        this.setData({"formData.gender":this.data.gender[e.detail.value].value});
    },
    setValue:function(e) {
      let formData = this.data.formData;
      formData[e.currentTarget.id] = e.detail.value;
      this.setData({ "formData": formData});
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
        console.log(that.data.formData,8888)
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
                        title: '添加成功！',
                        icon: 'success',
                        duration: 2000
                    });
                    wx.navigateBack({
                       delta:2                                                                            
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
