// pages/member/brand/brand.js
//const http = require('../../../server/request.js');
//调用公共js对象以便调用其方法
//var app = require('../../../utils/uselogn.js'); //获取应用实例
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: false,
    brands: [],
    foots: [{
      FloorName: '全部'
    }],
    types: [{
      Name: '全部'
    }],
    footId: '',
    typeId: '',
    mold: '分类',
    CodeOrName: '',
    FloorCode:'',
    ClassCode:'',
    searchValue: '',
    skinStyle: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    app.userLogin(this.authCallback);
    let skin = wx.getStorageSync("skin");
    this.setData({
      skinStyle: skin
    })
  },
  authCallback: function () {
    this.getBrandGuideInfo();
    this.getFloorListInfo();
    this.getClassInfo();
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    this.setData({
      foots: [{
        FloorName: '全部'
      }],
      types: [{
        Name: '全部'
      }],
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  // 分类
  type() {
    this.setData({
      show: true
    })
  },
  // 关闭分类
  Notype() {
    this.setData({
      show: false
    })
  },
  // 搜索信息
  searchVal(e) {
    console.log(e.detail.value)
    this.setData({
      searchValue: e.detail.value
    })
  },
  // 搜索品牌
  search() {
    this.setData({
      CodeOrName: this.data.searchValue
    })
    // 根据输入请求品牌
    this.getBrandGuideInfo();
  },
  // 切换楼层
  footTap(e) {
    console.log(e.target.dataset.f)
    if (e.target.dataset.f > 0) {
      let index = e.target.dataset.f;
      let value = this.data.foots[index].FloorId;
      this.setData({
        FloorCode: value
      })
    } else {
      this.setData({
        FloorCode: ''
      })
    }
    // 根据楼层请求数据
    this.getBrandGuideInfo();
    this.setData({
      footId: e.target.dataset.f
    })
  },
  // 切换分类
  typtTap(e) {
    if (e.target.dataset.t > 0) {
      let index = e.target.dataset.t;
      let value = this.data.types[index].Id;
      let name = this.data.types[index].Name;
      this.setData({
        mold: name,
        ClassCode: value
      })
    } else {
      this.setData({
        mold: "分类",
        ClassCode: ''
      })
    }
    // 根据类别请求数据
    this.getBrandGuideInfo();
    this.setData({
      typeId: e.target.dataset.t
    })
  },
  // 拨打电话
  tel(e) {
    console.log(e.currentTarget.dataset.tel)
    if (e.currentTarget.dataset.tel == null) {
      wx.showToast({
        title: '该商家还没有电话',
        icon: 'none'
      })
    }
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.tel
    })
  },
  // 获取品牌导视信息
  getBrandGuideInfo() {
    http.requestLoading('api/services/app/MemberIndexService/GetBrandGuideInfo', {
      CodeOrName: this.data.CodeOrName,
      FloorCode: this.data.FloorCode,
      ClassCode: this.data.ClassCode
    }, '', 'GET').then(res => {
      if (res.data.Result.Code == 0) {
        console.log(res)
        this.setData({
          brands: res.data.Result.Data
        })
      }
    })
  },
  // 获取楼层列表
  getFloorListInfo() {
    http.requestLoading('api/services/app/MemberIndexService/GetFloorListInfo', '', '', 'GET').then(res => {
      if (res.data.Result.Code == 0) {
        console.log(res)
        this.setData({
          foots: this.data.foots.concat(res.data.Result.Data)
        })
      }
    })
  },
  // 获取分类信息
  getClassInfo() {
    http.requestLoading('api/services/app/MemberIndexService/GetClassInfo', '', '', 'GET').then(res => {
      if (res.data.Result.Code == 0) {
        console.log(res)
        this.setData({
          types: this.data.types.concat(res.data.Result.Data)
        })
      }
    })
  }
})
