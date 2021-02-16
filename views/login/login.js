// views/login/login.js
import {login} from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone:'',
    pwd:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  handleinp(e) {
    let value = e.detail.value;
    let type = e.target.dataset.type;
    this.setData({
      [type]:value
    })
  },
  login() {
    let {phone,pwd} = this.data;
    let reg = /^1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$/;
    if(!phone) {
      wx.showToast({
        title: '手机号不能为空',
        icon:'none'
      })
      return;
    }else if(!pwd) {
      wx.showToast({
        title:'密码不能为空',
        icon:'none'
      })
      return;
    }else if(!(reg.test(phone))) {
      wx.showToast({
        title: '手机号格式错误',
        icon:'none'
      })
      return;
    }else if(reg.test(phone)) {
      login(phone,pwd).then(data => {
        if(data.code == 502) {
          wx.showToast({
            title: '密码错误',
            icon:'none'
          })
        }else if(data.code == 501) {
          wx.showToast({
            title: '账号不存在',
            icon:'none'
          })
        }else if(data.code == 200) {
          wx.showToast({
            title: '登录成功',
            icon:'none'
          });
         wx.navigateBack({
           delta: 1,
         })
          wx.setStorageSync('profile',data.profile)
        }else if(data.code == 509) {
          wx.showToast({
            title: '请等会再输入',
            icon:'none'
          })
        }
      })
    }
  }
})