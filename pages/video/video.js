// pages/video/video.js
import {getVideoGroups,getGroupsVideo, getVideoUrl} from '../../utils/request';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inpValue:"搜索音乐",
    groupLists:[],
    currentIndex:0,
    navId:null,
    vid:null,
    videoLists:[],
    videoUpdateTime:[],
    isRefresh:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    getVideoGroups().then(data => {
      let lists = data.data.slice(0,11);
      this.setData({
        groupLists:lists
      });
      this.getGroupsVideos(this.data.groupLists[0].id)
    })
  },
  handleTap(e) {
    this.setData({
      navId:e.target.dataset.navid,
      currentIndex:e.target.dataset.index
    })
    this.getGroupsVideos(this.data.navId)
  },
  getGroupsVideos(id) {
    this.setData({
      navId:id
    })
    getGroupsVideo(id).then(data => {
      let videoLists = data.datas;
      let urls = [];
      videoLists.forEach((item,index) =>{
        let creator = {};
        creator.vid = item.data.vid;
        creator.coverUrl = item.data.coverUrl;
        creator.nickname = item.data.creator.nickname;
        creator.description = item.data.description;
        creator.avatarUrl = item.data.creator.avatarUrl;
        creator.praisedCount = item.data.praisedCount;
        creator.commentCount = item.data.commentCount;
        urls.push(creator)
        // vid.push(item.data.vid)
        getVideoUrl(item.data.vid).then(res => {
          urls[index].url = res.urls[0].url;
          this.setData({
            videoLists:urls
          })
        })
      })
      this.setData({
        isRefresh:false
      })
    });
  },
  //视频播放暂停的回调
  handleplay(event) {
    let vid = event.currentTarget.id;
    this.setData({
      vid: vid
    })
    // 创建控制video标签的实例对象
    this.videoContext = wx.createVideoContext(vid);
    // 判断当前的视频之前是否播放过，是否有播放记录, 如果有，跳转至指定的播放位置
    let {videoUpdateTime} = this.data;
    let videoItem = videoUpdateTime.find(item => item.vid === vid);
    if(videoItem){
      this.videoContext.seek(videoItem.currentTime);
    }
    this.videoContext.play();
  },
  //视频记录时间的回调
  handleTimeUpdate(event) {
    let videoTimeObj = {vid: event.currentTarget.id, currentTime: event.detail.currentTime};
    let {videoUpdateTime} = this.data;
    /*
    * 思路： 判断记录播放时长的videoUpdateTime数组中是否有当前视频的播放记录
    *   1. 如果有，在原有的播放记录中修改播放时间为当前的播放时间
    *   2. 如果没有，需要在数组中添加当前视频的播放对象
    *
    * */
    let videoItem = videoUpdateTime.find(item => item.vid === videoTimeObj.vid);
    if(videoItem){ // 之前有
      videoItem.currentTime = event.detail.currentTime;
    }else { // 之前没有
      videoUpdateTime.push(videoTimeObj);
    }
    // 更新videoUpdateTime的状态
    this.setData({
      videoUpdateTime
    })
  },
  //自定义下拉事件
  handleRefresh() {
    this.getGroupsVideos(this.data.navId);
  },
  //触底事件
  handleLower() {
   wx.showToast({
     title: '暂无更多数据',
   })
  }
})