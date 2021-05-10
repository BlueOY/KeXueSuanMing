//index.js
const app = getApp()

Page({
  data: {
    avatarUrl: './user-unlogin.png',
    // avatarUrl: '../../images/user/user-unlogin.png',
    userName: "点击获取头像",
  },

  onLoad: function() {
    //添加分享功能
    wx.showShareMenu({
      withShareTicket:true,
      menus:['shareAppMessage','shareTimeline']
    })
  },

  //获取用户信息
  bindGetUserInfo: function(e) {
    if (!this.data.logged && e.detail.userInfo) {
      console.log('获取用户信息：', JSON.stringify(e.detail.userInfo));
      this.setData({
        avatarUrl: e.detail.userInfo.avatarUrl,
        userName: e.detail.userInfo.nickName,
      })
    }
  },
  getUserProfile() {
    wx.getUserProfile({
      desc: '使用户得到更好的体验',
      success: (res) => {
        let user = res.userInfo
        console.log("获取用户信息成功，user=", user)
        wx.setStorageSync('user', user)
        this.setData({
          avatarUrl: user.avatarUrl,
          userName: user.nickName
        })
      },
      fail: res => {
        console.log("获取用户信息失败", res)
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // this.getUserProfile()
    var user = wx.getStorageSync('user')
    console.log("读取用户信息，user=", user)
    if (user && user.nickName) {
      this.setData({
        avatarUrl: user.avatarUrl,
        userName: user.nickName
      })
    }
  },

})
