import {getSongDetails,getSongUrl} from '../../../utils/request'
import PubSub from 'pubsub-js'
import moment from 'moment'
// pages/songDetails/songDetails.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPlay:false,
    id:null,
    songDetail:[],
    currentTime:"00:00",
    durationTime:"00:00",
    currentWidth:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id:options.id
    })
    if(app.globalData.isMusicPlay && app.globalData.musicId == this.data.id) {
      this.setData({
        isPlay: true
      })
    };
    //获取歌曲详情
    this.getSongDetails(this.data.id);

    //控制背景音乐的播放
    this.musicBackground =  wx.getBackgroundAudioManager()
    this.musicBackground.onPlay(() => {
      this.chanIsPlay(true)
      app.globalData.musicId = this.data.id
    });
    this.musicBackground.onPause(() => {
      this.chanIsPlay(false)
    });
    this.musicBackground.onStop(() => {
      this.chanIsPlay(false)
    })
    //监听音乐实时播放的进度
    this.musicBackground.onTimeUpdate(() => {
      let currentTime = moment(this.musicBackground.currentTime * 1000).format('mm:ss');
      let durationTime = moment(this.musicBackground.duration * 1000).format('mm:ss');
      let currentWidth = this.musicBackground.currentTime / this.musicBackground.duration * 430
      this.setData({
        currentTime,
        currentWidth,
        durationTime
      })
    })
  },
  chanIsPlay(isPlay) {
    this.setData({
      isPlay
    })
    app.globalData.isMusicPlay = isPlay;
  },
  handlePlay() {
    let isPlay = !this.data.isPlay;
    this.setData({
      isPlay
    })
    this.musicControl(isPlay,this.data.id)
  },
  musicControl(isPlay,id) {
    if(isPlay) {
      getSongUrl(id).then(data => {
        this.musicBackground.src = data.data[0].url;
        this.musicBackground.title = this.data.songDetail.ar[0].name;
      })
    }else {
      this.musicBackground.pause()
    }
  },
  //获取歌曲详情
  getSongDetails(id) {
    getSongDetails(id).then(data => {
      this.setData({
        songDetail:data.songs[0]
      })
      wx.setNavigationBarTitle({
        title: this.data.songDetail.ar[0].name,
      })
    });
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

  },
  handleSwitch(e) {
    let type = e.currentTarget.id;
    //自动关闭上一首歌曲
    this.musicBackground.pause();
    PubSub.subscribe('musicId',(mes,musicId) =>{
      //获取歌曲详情
      this.getSongDetails(musicId);
      //自动播放当前音乐
      this.musicControl(true,musicId)
      PubSub.unsubscribe('musicId')
    })
    //发布消息
    PubSub.publish('switch',type)
  }
})