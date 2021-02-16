const BASEURL = "http://8.129.22.213:3000";
const MOBELURL = "https://penghuarui123123.cn.utools.club"

function request(url,data = {}) {
  return  new Promise((resolve,reject) => {
    wx.request({
      url:BASEURL + url,
      data,
      header:{
        cookie:wx.getStorageSync('cookies')
      },
      success:(res) => {
        console.log()
        if(data.isLogin) {
          res.cookies.forEach(item => {
            if(item[0] == 'M') {
              wx.setStorage({
                data: item,
                key: 'cookies',
              })
            }
          })
          
          resolve(res.data)
        }
        resolve(res.data)
      },
      fail:(err) => {
        reject(err)
      }
    })
  })
}
//登录请求
export function login(phone,password) {
  return request('/login/cellphone',{phone,password,isLogin:true})
}
//获取轮播图
export function getBanners() {
  return request('/banner')
}
//获取推荐歌曲
export function getRecomentSongs() {
  return request('/personalized',{limit:10})
}
//获取榜单信息
export function getTopList() {
  return request('/topList')
}
//获取歌单详情
export function getTopListDetail(id) {
  return request('/playlist/detail',{id})
}

//获取视频列表
export function getVideoGroups() {
  return request('/video/group/list')
}

//获取视频地址
export function getGroupsVideo(id) {
  return request('/video/group',{id})
}
export function getVideoUrl(id) {
  return request('/video/url',{id})
}
//获取最近播放记录
export function getRencently() {
  return request('/playlist/video/recent')
}

//获取每日推荐歌曲
export function getRecomend() {
  return request('/recommend/songs')
}

//获取每日推荐歌曲详情
export function getSongDetails(ids) {
  return request('/song/detail',{ids})
}

//获取歌曲路径
export function getSongUrl(id) {
  return request('/song/url',{id})
}