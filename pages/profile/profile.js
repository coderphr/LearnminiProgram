import {getRencently} from '../../utils/request'
// pages/profile/profile.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl:"/images/personal/missing-face.png",
    nickName:'游客',
    rencentLists:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    getRencently().then(res => {
      let details = res.data.videos;
      this.setData({
        rencentLists:details
      })
    })
  },
  onShow() {
    wx.getStorage({
      key: 'profile',
      success:res => {
        this.setData({
          nickName:res.data.nickname,
          avatarUrl:res.data.avatarUrl
        })
      }
    })
  },
  handleclick() {
   wx.navigateTo({
     url: '/views/login/login',
   })
  },

})