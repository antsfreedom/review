function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

// 封装微信的wx.request主要每次请求自动加上session_id
// 这里有一个全局的API接口域名配置，如果需要更改找到url='http://127.0.0.1'修改即可
function ly_request({url, data, success, fail, complete, method = "GET"}) {
    // 开始请求
  url = 'https://lyshop.test.lyunweb.com/' + url;
    console.log('ly_request:' + 'start:' + url);

    // 获取本地保存的session_id加入到每次请求中
    var session_id = wx.getStorageSync('PHPSESSID');//本地取存储的sessionID
    if (session_id != "" && session_id != null) {
        var header = {'X-Requested-With': 'xmlhttprequest', 'Lingyun-Api': 'Lingyun-Api', 'content-type': 'application/x-www-form-urlencoded', 'Cookie': 'PHPSESSID=' + session_id }
    } else {
        var header = { 'X-Requested-With': 'xmlhttprequest', 'Lingyun-Api': 'Lingyun-Api', 'content-type': 'application/x-www-form-urlencoded' }
    }


    // 发起请求
    console.log('session_id:' + session_id);
    wx.request({
        url: url,
        method: method,
        data: data,
        header: header,
        dataType: 'json',
        success: res => {
            console.log('ly_request:' + 'success:' + url);
            if (session_id == "" || session_id == null) {
                // 如果本地没有就说明第一次请求 把返回的session id 存入本地
                wx.setStorageSync('PHPSESSID', res.data.session_id)
            }
            console.log(res)

            // 全局登陆提示
            if (res.data.login == '1') {
              wx.showModal({
                  title: '提示',
                  content: res.data.info,
                  success: function(res) {
                      if (res.confirm) {
                          wx.navigateTo({
                              url: '/pages/user/user/login'
                          })
                          console.log('用户点击确定')
                      } else if (res.cancel) {
                          if (method == "GET") {
                            wx.navigateBack({
                              delta: 1
                            });
                          }
                      }
                  }
              });
              return;
            }

            success(res); // 调用用户success方法
        },
        fail: fail,
        complete: complete
    })
}

// 发送验证码倒计时
function time(that,second) {
    if(second > 0) {
        let sendVerify = {};
        sendVerify['timerText'] = second + 's后重发送';
        sendVerify['hasSend'] = true;
        that.setData({'sendVerify':sendVerify});
        second --;
        setTimeout(function(){
            time(that, second);
        }, 1000);
    } else {
        let sendVerify = {};
        sendVerify['timerText'] = '发送验证码';
        sendVerify['hasSend'] = false;
        that.setData({'sendVerify':sendVerify});
    }
}

module.exports = {
  formatTime: formatTime,
  ly_request: ly_request,
  time:time
}
