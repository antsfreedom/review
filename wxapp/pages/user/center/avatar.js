var util = require('../../../utils/util.js');

const canvas = {
    id: 'crop',
}
const ctx = wx.createCanvasContext(canvas.id);
var point = new Array(); //拖动的点的序列
var offset = [[0,0]]; //每次移动图片记录图片位置
var distance = 1,scale = 1; //zoom距离及缩放倍数
var clipType = 'drag';//图片剪切方式，拖动（drag）或者缩放（zoom）
var avatar = new Array();
avatar['x'] = 1;
avatar['y'] = 1;

Page({
    data: {
        uploadUrl: 'https://www.lingyun.net/upload/upload',
        requestUrl:'user/center/avatar',
        canvas: {
            imgWidth:'',  //图片的长度
            imgHeight:'', //图片的高度
            boxSize: 600, //裁剪框的边长
            xToy: 1,      //图片的宽高比
        },
        avatar:{
            'x':1,
            'y':1,
            'w':'',
            'h':'',
            'src':'',
        }
    },
    onLoad: function() {
        var that = this;
        var canvas = that.data.canvas;
        wx.getSystemInfo({
            success: function(res) {
                var window_width = res.windowWidth;
                that.setData({
                    "canvas.boxSize": window_width - 20,
                    "avatar.w": window_width - 20,
                    "avatar.h": window_width - 20
                });
                avatar['w'] = avatar['h'] = window_width - 20;
            }
        });
    },
    chooseImage: function() {
        var that = this;
        var canvas = that.data.canvas;
        var standardWidth = canvas.boxSize;
        wx.chooseImage({
            count: 1, // 默认9
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function(res) {
                var tempFilePaths = res.tempFilePaths;
                wx.getImageInfo({
                    src: tempFilePaths[0],
                    success: function (r) {
                        that.setData({
                            'canvas.xToy':r.height/r.width,
                            'canvas.src':tempFilePaths[0],
                            'canvas.imgWidth': r.width,
                            'canvas.imgHeight': r.height
                        });

                        // 图片预览
                        if(canvas.xToy < 1) {
                            that.setData({
                                'canvas.imgWidth': standardWidth / canvas.xToy,
                                'canvas.imgHeight': standardWidth
                            })
                        } else {
                            that.setData({
                                'canvas.imgWidth': standardWidth,
                                'canvas.imgHeight': standardWidth * canvas.xToy
                            })
                        }
                        ctx.drawImage(tempFilePaths[0], 0, 0, canvas.imgWidth, canvas.imgHeight);
                        ctx.draw()
                    }
                })
                return;
                // 图片上传
                wx.uploadFile({
                    url: 'https://www.lingyun.net/home/upload/upload/dir/image',
                    filePath: tempFilePaths[0],
                    name:'a',
                    success: function(res) {
                        var data = res.data;
                        console.log(res);
                    },
                    fail:function(err) {
                        console.log(err);
                    }
                })
            },
            fail:function(error) {
                console.log('error:'+error);
            }
        })
    },
    touchStart(e) {
        if(e.touches.length == 1){
            clipType = 'drag';
            //拖动
            let x = e.touches[0].x;
            let y = e.touches[0].y;
            point = new Array();
            point.push([x,y]);
        } else {
            clipType = 'zoom';
            let x1 = e.touches[0].x;
            let y1 = e.touches[0].y;
            let x2 = e.touches[1].x;
            let y2 = e.touches[1].y;
            //缩放
            distance = Math.sqrt(Math.pow((x2-x1),2) + Math.pow((y2-y1),2));
        }
    },
    touchMove(e) {
        var that = this;
        var canvas = that.data.canvas;
        var width = canvas.boxSize;
        if(clipType == 'drag' && e.touches.length == 1) {
            let x = e.touches[0].x;
            let y = e.touches[0].y;
            var origin_x = Math.max(x - point[0][0] + offset[offset.length-1][0],-Math.abs(width - canvas.imgWidth * scale));
            origin_x = Math.min(origin_x,0);
            var origin_y = Math.max(y - point[0][1] + offset[offset.length-1][1], -Math.abs(width - canvas.imgHeight * scale));
            origin_y = Math.min(origin_y,0);
            ctx.drawImage(canvas.src, origin_x , origin_y, canvas.imgWidth * scale , canvas.imgHeight * scale);
            ctx.draw();
        } else {
            let x1 = e.touches[0].x;
            let y1 = e.touches[0].y;
            let x2 = e.touches[1].x;
            let y2 = e.touches[1].y;
            var temp_scale = Math.sqrt(Math.pow((x2-x1),2) + Math.pow((y2-y1),2)) / distance / 1.4;
            if(temp_scale * scale >= 1) {
                ctx.drawImage(canvas.src, offset[offset.length-1][0], offset[offset.length-1][1], canvas.imgWidth * temp_scale * scale, canvas.imgHeight * temp_scale * scale);
                ctx.draw();
                scale = temp_scale * scale;
            }
        }
    },
    touchEnd(e) {
        if(clipType == 'drag') {
            let x = e.changedTouches[0].x;
            let y = e.changedTouches[0].y;
            point.push([x,y]);
            var that = this;
            var canvas = that.data.canvas;
            var width = canvas.boxSize;
            var origin_x = Math.max(x - point[0][0] + offset[offset.length-1][0],-Math.abs(width - canvas.imgWidth * scale));
            origin_x = Math.min(origin_x,0);
            var origin_y = Math.max(y - point[0][1] + offset[offset.length-1][1], -Math.abs(width - canvas.imgHeight * scale));
            origin_y = Math.min(origin_y,0);
            ctx.drawImage(canvas.src,origin_x , origin_y, canvas.imgWidth * scale, canvas.imgHeight * scale);
            ctx.draw();
            offset.push([origin_x,origin_y]);
        }
    },
    uploadImg() {
        var that = this;
        var session_id = wx.getStorageSync('PHPSESSID');
        wx.canvasToTempFilePath({
            canvasId: 'crop',
            success: function(res) {
                wx.uploadFile({
                    url: that.data.uploadUrl,
                    filePath: res.tempFilePath,
                    name: 'avatar',
                    formData:{
                        'session_id': encodeURI(session_id)
                    },
                    success: function(res){
                        var data = JSON.parse(res.data);
                        that.setData({"avatar.src": data.path});
                        avatar['src'] = data.path;
                        console.log(that.data.avatar);
                        util.ly_request({
                            url:that.data.requestUrl,
                            data:{
                                'avatar[x]': that.data.avatar['x'],
                                'avatar[y]': that.data.avatar['y'],
                                'avatar[w]': that.data.avatar['w'],
                                'avatar[h]': that.data.avatar['h'],
                                'avatar[src]': data.path
                            },
                            method: 'POST',
                            success(res) {
                                console.log(res);
                            }
                        })
                    },
                    fail(err) {
                        console.log('Error:',err);
                    }
                });
            }
        })
    }
})

