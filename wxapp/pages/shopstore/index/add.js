var util = require('../../../utils/util.js')
let area = require('../../../utils/areaPicker.js');

Page({
    data: {
        list:[],
        upload_url: 'https://www.lingyun.net/upload/upload',
        request_url: 'shopstore/index/add',
        province: area.province,
        city: area.city['110000'],
        area: area.area['110100'],
        areaShow: false,
        form_data:{
            title: '',
            abstract:'',
            cover: '',
            city:''
        }

    },
    onLoad: function() {
        var that = this;
    },
    toggleArea: function() {
        this.setData({areaShow: !this.data.areaShow});
    },
    setValue:function(e) {
        let form_data = this.data.form_data;
        form_data[e.currentTarget.id] = e.detail.value;
        this.setData({"form_data":form_data});
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
        this.setData({"form_data.city": form_city});
    },
    chooseImage: function() {
        var that = this;
        wx.chooseImage({
            count: 1, // 默认9
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function(res) {
                var tempFilePaths = res.tempFilePaths;
                var session_id = wx.getStorageSync('PHPSESSID');
                wx.uploadFile({
                    url: that.data.upload_url,
                    filePath: tempFilePaths[0],
                    name: 'cover',
                    formData:{
                        'session_id': encodeURI(session_id)
                    },
                    success: function(res){
                        console.log(res.data);
                        var data = JSON.parse(res.data);
                        that.setData({"form_data.cover": data.path});
                    },
                    fail(err) {
                        console.log('Error:',err);
                    }
                });
            },
            fail:function(error) {
                console.log('error:'+error);
            }
        })
    },
    formSubmit() {

    }

})
