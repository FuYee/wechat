let app = getApp()
let util = require('../../util/util.js')
Page({
  data: {
    // 区分是哪类电影
    comingSoon: {},
    inTheaters: {},
    top250: {},
    searchResult: {},
    searchShowBox: false // 搜索页面
  },
  onLoad: function () {
    // 即将上映
    let comingSoonUrl = app.globleData.douban_pre + "/v2/movie/coming_soon?start=0&count=3"
    // 正在热映
    let inTheatersUrl = app.globleData.douban_pre + "/v2/movie/in_theaters?start=0&count=3"
    // top250
    let top250Url = app.globleData.douban_pre + "/v2/movie/top250?start=0&count=3"

    this.getMovieRequest(comingSoonUrl, 'comingSoon', '即将上映')
    this.getMovieRequest(inTheatersUrl, 'inTheaters', '正在热映')
    this.getMovieRequest(top250Url, 'top250', '豆瓣TOP250')

  },

  // 点击更多
  moreMovieTap: function (event) {
    // 获取自定义的电影分类名称
    let catogery = event.currentTarget.dataset.catogery
    // 向子页面更多的列表页传递电影分类名称
    wx.navigateTo({
      url: "moreMovie/moreMovie?catogery=" + catogery
    })
  },

  // 请求电影数据封装
  getMovieRequest: function (url, settedKey, catogeryTitle) {
    let that = this
    wx.request({
      url: url,
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        that.getMovieData(res.data, settedKey, catogeryTitle)
      }
    })
  },

  // 请求成功的回调
  getMovieData: function (data, settedKey, catogeryTitle) {
    let movieArr = []
    for (let idx in data.subjects) {
      let obj = data.subjects[idx]
      let movieData = {
        title: obj.title,
        average: obj.rating.average,
        coverageUrl: obj.images.large,
        movieId: obj.id,
        stars: util.starsFn(obj.rating.stars) // 5星好评
      }
      movieArr.push(movieData)
    }
    // 动态赋值给对应的电影类型
    let readyData = {}
    readyData[settedKey] = {
      catogeryTitle: catogeryTitle, // 电影分类名称
      movieArr: movieArr //  每个模板渲染不同的值
    }
    this.setData(readyData)
  },

  // 搜索电影
  //聚焦
  searchMovieTap: function () {
    this.setData({
      searchShowBox: true
    })
  },
  // change事件
  searchChangeTap: function (e) {
    let text = e.detail.value
    let searchUrl = app.globleData.douban_pre + "/v2/movie/search?q =" + text
    this.getMovieRequest(searchUrl, "searchResult", "")
  },
  // 关闭搜索
  closeSearchTap: function () {
    this.setData({
      searchShowBox: false
    })
  },

  // 跳转到电影详情
  toMovieDetail: function (e) {
    // 获取电影id
    let movieId = e.currentTarget.dataset.movieid
    wx.navigateTo({
      url: "movieDetail/movieDetail?id=" + movieId
    })
  }
})