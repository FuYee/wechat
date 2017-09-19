let postList = require('../data/postData.js')

Page({

  // 页面的初始数据
  data: {
    // 轮播图图片
    swiperImg: [
      '../image/post/bl.png',
      '../image/post/sls.jpg',
      '../image/post/vr.png'
    ],
    // 轮播图的相关设置
    indicatorDots: true,
    indicatorColor: 'rgba(198, 21, 47, 1)',
    indicatorActiveColor: '#fff',
    autoplay: true,
    interval: 3000
  },

  // 生命周期函数--监听页面加载
  onLoad: function (options) {
    // 从服务器获取数据的操作
    this.setData({
      // 把获取到的数据通过赋值给getPostData从而渲染到页面
      getPostData: postList.postData
    })

    // 利用缓存做阅览人数的计数功能

  },

  // 跳转至详情页
  toPostDetail: function (event) {
    let postId = event.currentTarget.dataset.postid
    // 将列表的id传到对应的详情页
    wx.navigateTo({
      url: 'postsDetail/postDetail?id=' + postId
    })
  },

  // swiper跳转
  swiperTap: function (event) {
    let postId = event.target.dataset.postid
    wx.navigateTo({
      url: 'postsDetail/postDetail?id=' + postId
    })
  }

})