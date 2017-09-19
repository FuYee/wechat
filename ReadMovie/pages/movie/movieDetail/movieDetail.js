let app = getApp();
let util = require('../../../util/util.js')
Page({
  data: {
    movie: {}
  },
  onLoad: function (param) {
    let movieId = param.id
    let movieDeUrl = app.globleData.douban_pre + "/v2/movie/subject/" + movieId
    util.http(movieDeUrl, this.getMovieDetail)
  },
  getMovieDetail: function (data) {
    console.log(data)
    // 处理数据为空的情况--容错处理（一般为二级数据,这里只处理director）
    let director = {
      avatar: "",
      name: "",
      id: ""
    };
    if (data.directors[0] != null) {
      if (data.directors[0].avatars != null) {
        data.directors[0].avatars = data.directors[0].avatars.large
      };
      director.name = data.directors[0].name
      director.id = data.directors[0].id
    };
    // 获取页面所需数据
    let movie = {
      movieImg: data.images ? data.images.large : "",
      country: data.countries[0],
      title: data.title,
      original_title: data.original_title,
      comment_count: data.comments_count,
      wish_count: data.wish_count,
      year: data.year,
      genres: data.genres.join("、"), // 将数组["记录片"，"爱情片"]拼接成"记录片"、"爱情片"
      stars: util.starsFn(data.rating.stars),
      score: data.rating.average,
      director: director,
      cast: util.castsString(data.casts),
      castsInfo: util.castsInfo(data.casts), // 演员信息拼接
      summary: data.summary
    }
    console.log(movie)
    this.setData({
      movieArr: movie
    })
  }
})