//index.js
//获取应用实例
import { getBanners, getRecomentSongs, getTopList, getTopListDetail} from '../../utils/request'
const app = getApp()

Page({
   data: {
   banners:[],
   recomends:[],
   topList:[],
   details:[],
  },
  onLoad: function () {
    //获取轮播图
    getBanners().then(data => {
      this.setData({
        banners:data.banners
      })
    }).catch(err => {
      console.log(err)
    })
    //获取推荐
    getRecomentSongs().then(data => {
      this.setData({
        recomends:data.result
      })
    }).catch(err => {console.log(err)})
    //获取榜单
    getTopList().then(data => {
      this.setData({
        topList:data.list.slice(0,8)
      })
      //获取歌单详情
      let newData = []
      this.data.topList.forEach((item,index) => {
        newData[index] = []
        getTopListDetail(item.id).then(data => {
          newData[index] = data.playlist.tracks.splice(0,3);
          this.setData({
            details:newData
          })
        })
      })
    })
  },
  toRecomend() {
    wx.navigateTo({
      url: '/songPackage/pages/recomend/recomend',
    })
  }
})
