let app = getApp()
let util = require('../../../util/util.js')
Page({
  data: {
    catogeryTitle: "", // 记录电影分类名称
    requestUrl: "", // 电影类型的url
    totalCount: "0", // url加载的开始值
    isEmpty: true, // 判断上拉加载是否只有20条数据
    movieArr: {}
  },
  onLoad: function (options) {
    let catogery = options.catogery
    this.data.catogeryTitle = catogery
    // 判断加载哪类更多的电影
    let dataUrl = ""
    switch (catogery) {
      case '即将上映':
        dataUrl = app.globleData.douban_pre + '/v2/movie/coming_soon';
      case '正在热映':
        dataUrl = app.globleData.douban_pre + '/v2/movie/in_theaters';
      case '豆瓣TOP250':
        dataUrl = app.globleData.douban_pre + '/v2/movie/top250';
    }
    this.data.requestUrl = dataUrl
    util.http(dataUrl, this.getMoreData)
  },

  // 更多的数据回调
  getMoreData: function (res) {
    let movieArr = []
    for (let idx in res.subjects) {
      let obj = res.subjects[idx]
      let movieData = {
        title: obj.title,
        average: obj.rating.average,
        coverageUrl: obj.images.large,
        movieId: obj.id,
        stars: util.starsFn(obj.rating.stars) // 5星好评
      }
      movieArr.push(movieData)
    }
    // 上拉加载消除替换效果
    let totalMovies = {}
    if (!this.data.isEmpty) {
      totalMovies = this.data.movieArr.concat(movieArr)
    } else {
      totalMovies = movieArr
      this.data.isEmpty = false
    }
    this.setData({
      movieArr: totalMovies
    })
    this.data.totalCount += 20
    //  隐藏loading
    wx.hideNavigationBarLoading()
    wx.stopPullDownRefresh()
  },

  // 动态显示导航栏标题
  onReady: function () {
    wx.setNavigationBarTitle({
      title: this.data.catogeryTitle
    })
  },

  // 上拉刷新
  onPullDownRefresh: function () {
    let refreshUrl = this.data.requestUrl + "?start=0&count=20"
    // 清空以防越刷新越产生累加的数据
    this.data.movieArr = {}
    this.data.totalCount = 0
    this.data.isEmpty = true

    util.http(refreshUrl, this.getMoreData)
    wx.showNavigationBarLoading()
  },

  // 下拉加载
  loadingMore: function (e) {
    let moreUrl = this.data.requestUrl + "?start=" + this.data.totalCount + "&count=20";
    util.http(moreUrl, this.getMoreData)
    // 显示loading
    wx.showNavigationBarLoading()
  }
})