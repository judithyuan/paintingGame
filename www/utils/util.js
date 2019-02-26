
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  // const hour = date.getHours()
  // const minute = date.getMinutes()
  // const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-')
  //  + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

/**
 * ajax封装
 * param {url,data} 接口地址，参数
 */
const httpObj = {
  // public_url: 'http://xcx.dohonge2.cc/', //本地
  public_url: 'https://color.51tui.vip/',
  version: '1.0.0',
  appkey: '8JBnywASf6QSCFdX',
}

const ajaxPost = (url, data = {}) => {
  return new Promise((resolve, reject) => {
    wx.showLoading({
      title: '加载中',
    })
    if (wx.getStorageSync('token')) {
      data.token = wx.getStorageSync('token');
    }
    data.version = httpObj.version;
    data.appkey = httpObj.appkey;

    wx.request({
      url: httpObj.public_url + url,
      data: data,
      header: { 'content-type': 'application/json' },
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: (res) => {
        wx.hideLoading();
        resolve(res.data);
      },
      fail: (res) => {
        let title = '系统异常';
        let msg = '请刷新重试或联系客服';
        wx.hideLoading();
        wx.getNetworkType({
          success: function (res) {

            // 返回网络类型, 有效值：
            // wifi/2g/3g/4g/unknown(Android下不常见的网络类型)/none(无网络)
            var networkType = res.networkType;
            if (networkType == 'none') {
              title = '网络不可用'
              msg = '请检查您的网络设置'
            }
            wx.showModal({
              title: title,
              content: msg,
              showCancel: false,
              confirmText: '确定',
              confirmColor: '#3CC51F',
              success: function (res) { },
              fail: function (res) { },
              complete: function (res) { },
            })
          }
        })

      },
      complete: (res) => {
        // console.log(res.statusCode,'res')
      },
    })
  })
}
const normalPost = (url, data = {}) => {
  return new Promise((resolve, reject) => {
    if (wx.getStorageSync('token')) {
      data.token = wx.getStorageSync('token');
    }
    data.version = httpObj.version;
    data.appkey = httpObj.appkey;

    wx.request({
      url: httpObj.public_url + url,
      data: data,
      header: { 'content-type': 'application/json' },
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: (res) => {
        wx.hideLoading();
        resolve(res.data);
        if (res.data.err_msg == '用户未登录' || res.data.err_msg == 'token过期') {//用户未登录
          getToken();
        }
      },
      fail: (res) => {
        let title = '系统异常';
        let msg = '请刷新重试或联系客服';
        wx.hideLoading();
        wx.getNetworkType({
          success: function (res) {
            // 返回网络类型, 有效值：
            // wifi/2g/3g/4g/unknown(Android下不常见的网络类型)/none(无网络)
            var networkType = res.networkType;
            if (networkType == 'none') {
              title = '网络不可用'
              msg = '请检查您的网络设置'
            }
            wx.showModal({
              title: title,
              content: msg,
              showCancel: false,
              confirmText: '确定',
              confirmColor: '#3CC51F',
              success: function (res) { },
              fail: function (res) { },
              complete: function (res) { },
            })
          }
        })

      },
      complete: (res) => {
      },
    })
  })
}

// 登录-获取token
const getToken = () => {
  return new Promise((resolve, reject) => {
    wx.login({
      success: (res) => {
        normalPost('user/login', { code: res.code }).then(res => {
          if (res.token) {
            wx.setStorageSync('token', res.token);
            resolve()
          }

        })
      }
    })
  })
}
module.exports = {
  formatTime: formatTime,
  ajaxPost: ajaxPost,
  normalPost: normalPost,
  getToken: getToken
}
