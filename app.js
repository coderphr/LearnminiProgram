//app.js
App({
  globalData:{
    isMusicPlay:false,
    musicId:''
  },
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    setTimeout(() => {
      wx.removeStorage({
        key: 'profile',
        success:(res) => {
          console.log('success')
        }
      })
    },3600000)
  }
})