let lisData = require('../../data/postData.js')
let app = getApp()
Page({
  data: {
    currentId: '',
    isMusic: false
  },

  onLoad: function (param) {
    // 列表页的每个对象的id = param.id
    this.data.currentId = param.id
    this.setData({
      lisData: lisData.postData[param.id]
    })
    // 模拟图片收藏数据
    let collectValue = {
      1: false,
      2: true,
      3: false
    }
    // 图片收藏缓存
    wx.setStorageSync('collected_status', collectValue)
    let collectedStorage = wx.getStorageSync('collected_status')
    if (collectedStorage) {
      let collectedStatus = collectedStorage[param.id]
      // 更新DOM
      this.setData({
        collected: collectedStorage
      })
    } else {
      // 设置默认状态
      let collectedStorageNull = {}
      collectedStorageNull[param.id] = false
      // 重新设置缓存
      wx.setStorageSync('collected_status', collectValue)
    }
    // 系统提供的开、关音乐与自己设置的开关音乐状态不同步bug
    // 监听音乐播放
    let that = this
    wx.onBackgroundAudioPlay(function () {
      that.setData({
        isMusic: true
      })
      // 同步到全局变量
      app.globleData.g_ismusic = true
      app.globleData.g_ismusicId = param.id
    })
    // 监听音乐暂停
    wx.onBackgroundAudioPause(function () {
      that.setData({
        isMusic: false
      })
      // 同步到全局变量
      app.globleData.g_ismusic = false
      app.globleData.g_ismusicId = null
    })
    // 监听音乐停止（否则音乐播放完成，状态并不会改变）
    wx.onBackgroundAudioStop(function () {
      that.setData({
        isMusic: false
      })
      // 同步到全局变量
      app.globleData.g_ismusic = false
      app.globleData.g_ismusicId = null
    })
    // 播放音乐=》返回到其他页面=》再回到播放音乐页面，发现播放按钮状态不同步bug
    if (app.globleData.g_ismusic && app.globleData.g_ismusicId === param.id) {
      this.setData({
        isMusic: true
      })
    }
  },

  // 图片收藏数据处理
  collectTap: function (event) {
    let collectDo = wx.getStorageSync('collected_status')
    let currentCollect = collectDo[this.data.currentId]
    // 收藏变未收藏，未收藏变收藏
    currentCollect = !currentCollect
    // 更新文章是与否的缓存值
    collectDo[this.data.currentId] = currentCollect
    // 更新数据绑定变量，从而实现图片的切换
    wx.setStorageSync('collected_status', collectDo)
    // 更新DOM
    this.setData({
      collected: currentCollect
    })
    // toast
    wx.showToast({
      title: currentCollect ? '收藏成功' : '取消收藏',
      duration: 1000
    })
  },

  // 分享
  shareTap: function () {
    let shareArr = ['分享到微信', '分享到QQ', '分享到百度云']
    wx.showActionSheet({
      itemList: shareArr,
      itemColor: '#405f80',
      success: function (res) {
        // res.cancel
        // res.tapIndex
        wx.showModal({
          title: '关于分享',
          content: "用户是否取消" + shareArr[res.tapIndex] + "?" + "微信小程序不支持分享功能，什么时候才能用呢！！！"
        })
      }
    })
  },

  // 音乐播放
  musicTap: function (event) {
    let isMusic = this.data.isMusic
    if (isMusic) {
      wx.pauseBackgroundAudio()
      this.setData({
        isMusic: false
      })
    } else {
      wx.playBackgroundAudio({
        dataUrl: lisData.postData[this.data.currentId].music.audioUrl,
        title: lisData.postData[this.data.currentId].music.title,
        coverImgUrl: lisData.postData[this.data.currentId].music.picUrl
      })
      this.setData({
        isMusic: true
      })
    }
  }
})