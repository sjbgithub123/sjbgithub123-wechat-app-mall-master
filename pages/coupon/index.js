// pages/coupon/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabIndex:1,
    list:[],
  },
  tabFun(e){
   this.getList(e.currentTarget.dataset.index)
   console.log(e.currentTarget.dataset.index);
    this.setData({
      tabIndex: e.currentTarget.dataset.index
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
 
  onLoad: function (options) {
    var list0=app.globalData.coupon;
    var listtemp=[];
    for(let i=0;i<list0.length;i++){
      if(list0[i].status==0){
        listtemp.push(list0[i]);
      }
    }
   this.setData({
    list:listtemp,
   })
  },
  getList:function(e){
    
    var list0=app.globalData.coupon;
    var listtemp=[];
    console.log(e);
switch(parseInt(e)){
  case 1:{
for(let i=0;i<list0.length;i++){
  if(list0[i].status==0){
    listtemp.push(list0[i]);
  }
}
  }break;
  case 2:{
for(let i=0;i<list0.length;i++){
  if(list0[i].status==2){
    listtemp.push(list0[i]);
  }
}
  }break;
  case 3:{
for(let i=0;i<list0.length;i++){
  if(list0[i].status==1){
    listtemp.push(list0[i]);
  }
}
  }break;
}
console.log(listtemp);
this.setData({
  list:listtemp,
})

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})