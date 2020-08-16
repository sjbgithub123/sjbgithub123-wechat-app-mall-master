//index.js
//获取应用实例
var app = getApp()
//var fileData = require('../../utils/data.js')

Page({
  // 页面初始数据
  data: {
      colors:['red','orange','yellow','green','purple'],
      // banner 初始化
      //banner_url: fileData.getBannerData(),
      banner_url:[],
      fircategory:[],
      indicatorDots: true,
      vertical: false,
      autoplay: true,
      interval: 3000,
      duration: 1000,
      // nav 初始化
     // navTopItems: fileData.getIndexNavData(),
     navTopItems:[
      {
          id:1,
          icon:"/images/clothing.png",
          title:"服装"
      },
      {
          id:2,
          icon:"/images/baby.png",
          title:"母婴"
      },
      {
          id:3,
          icon:"/images/toy.png",
          title:"玩具"
      },
      {
          id:4,
          icon:"/images/food.png",
          title:"食品"
      },
      {
          id:5,
          icon:"/images/nurse.png",
          title:"个护"
      }],
      seccategory:[],
      //navSectionItems: fileData.getIndexNavSectionData(),
      curNavId: 1,
      curIndex: 0,
      newlist1:[{"name":"瓜子 100g","saleprice":0.01},{"id":'002',"img":"/image/s4.png","name":"芹菜 半斤","saleprice":0.02},{"id":'003',"img":"/image/s4.png","name":"素米 375g","saleprice":0.03}],
      selecttoplist1:[{"id":"001","img":"/image/s1.jpg"},{"id":"02","img":"/image/s2.png"}],

  },
   
  onLoad:function(){
    var that = this
    /*that.setData({
      list: that.data.navSectionItems
    })*/

   // console.log(getApp().globalData.session_key);
    wx.request({
      url: 'https://vircom.top/api/gethomedata.php',
      data: {
        key: 'homedata'
      },
      success: function(res) {
       
       console.log(res.data)
       that.setData({
         banner_url:res.data.banner_url,
         fircategory:res.data.fircategory,
         seccategory:res.data.fircategory[0].seccategory,
       })
      }
    })
    
  },
  //标签切换
  switchTab: function(e) {
      let id = e.currentTarget.dataset.id,
      index = parseInt(e.currentTarget.dataset.index)
      this.curIndex = parseInt(e.currentTarget.dataset.index)
      //console.log(e)
      var seccategory=this.data.fircategory[parseInt(index)].seccategory;
      var that = this
      this.setData({
        curNavId: id,
        curIndex: index,
        seccategory:seccategory,
      })
      
  },
  // 跳转至详情页
  navigateDetail: function(e){
    wx.navigateTo({
      url:'../detail/detail?artype=' + e.currentTarget.dataset.artype
    })
  },
  // 加载更多
  loadMore: function (e) {
    console.log('加载更多')
    var curid = this.data.curIndex

    if (this.data.navSectionItems[curid].length === 0) return
    
    var that = this
    that.data.navSectionItems[curid] = that.data.navSectionItems[curid].concat(that.data.navSectionItems[curid])
    that.setData({
      list: that.data.navSectionItems,
    }) 
  },
  // book
  bookTap: function(e){
    wx.navigateTo({
      url:'../book/book?aid='+e.currentTarget.dataset.aid
    })
  }
  
})
