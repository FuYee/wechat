// welcom.js
Page({
  // 跳转到tabBar页面
  toPost: function (event) {
    wx.switchTab({
      url: '../posts/posts'
    })
  }
})