import PubSub from 'pubsub-js'
import {getRecomend} from '../../../utils/request'
// pages/recomend/recomend.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    mounth:null,
    day:null,
    recomendLists:[],
    index:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //动态获取日期
    let date = new Date()
    this.setData({
      mounth:date.getMonth() + 1,
      day:date.getDate(),
    })
    //获取每日推荐歌曲
    getRecomend().then(data => {
      this.setData({
        recomendLists:data.data.dailySongs
      })
    });

    //订阅来自songDetails页面发来的消息
    PubSub.subscribe('switch',(msg,type) =>{
      let {index} = this.data
      if(type == 'pre') {
        (index === 0) && (index = this.data.recomendLists.length)
        index -= 1
      }else {
        (index === this.data.recomendLists.length - 1) && (index = -1)
        index += 1
      }
      this.setData({
        index
      })
      let musicId = this.data.recomendLists[index].id
      PubSub.publish('musicId',musicId)
    })
  },
  handleTap(e) {
    let {id,index} = e.target.dataset;
    this.setData({
      index
    })
    wx.navigateTo({
      url: '/songPackage/pages/songDetails/songDetails?id='+id,
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})