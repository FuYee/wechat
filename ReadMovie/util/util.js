// 5星好评
function starsFn (star) {
  let num = star.toString().substring(0,1)
  let Arr = []
  for(var i=0;i<=5;i++){
    if (i <= num){
      Arr.push(1)
    } else{
      Arr.push(0)
    }
  }
  return Arr
};

// 请求数据
function http (url,callBack) {
  let that = this
  wx.request({
    url: url,
    method: 'GET',
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    success: function (res) {
      callBack(res.data)
    }
  })
};

// 演员（姓名列表）数组对象转字符串处理  蔡国强/国强/赵丽颖
function castsString (casts){
  var castsjoin = "";
  for (var idx in casts) {
    castsjoin = castsjoin + casts[idx].name + "/"
  }
  return castsjoin.substring(0, castsjoin.length-2)
};

// 演员信息（图片+名字）
function castsInfo (casts) {
  var castsArr = []
  for (var idx in casts) {
    var getInfo = {
      img: casts[idx] ? casts[idx].avatars.large: "",
      name: casts[idx].name
    }
    castsArr.push(getInfo)
  }
  return castsArr
}


module.exports = {
  starsFn: starsFn,
  http: http,
  castsString,
  castsInfo
}