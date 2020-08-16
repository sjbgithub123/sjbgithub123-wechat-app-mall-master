// page/component/list/list.js
Page({
  data:{
    cate_id:0,
  
    goodslist:[],
    brandimg:null,
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    //console.log(options.id);//1589539761
    //console.log(options);
    var that=this;
    var id1=options.id1;
    var id2=options.id2;
    that.setData({
      brandimg:options.brandimg,
    });
    wx.request({
      url: 'https://vircom.top/api/goods_list.php',
      header:{
        'Content-Type':'application/x-www-form-urlencoded'
        },
      data:{
        id1:id1,
        id2:id2,
        page:1,
      },
      method:'GET',
            success:function(res){
             // console.log(res.data);
             that.setData({
               goodslist:res.data.data,
               
             })
            }

    })
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  }
})