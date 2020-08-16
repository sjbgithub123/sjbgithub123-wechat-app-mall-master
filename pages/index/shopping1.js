// page/component/new-pages/cart/cart.js
//var cars=new Cars(); //实例化 购物车
Page({
  data: {
    carts:[],               // 购物车列表
    hasList:false,          // 列表是否有数据
    totalPrice:0,           // 总价，初始为0
    selectAllStatus:true,    // 全选状态，默认全选
    obj:{
        name:"hello"
    }
  },
  onShareAppMessage: function (res) {
    var a = wx.getStorageSync("id")
    var b = wx.getStorageSync("name")
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {

      title: '名片500张仅19元 全国包邮 货到付款，转发可享受更多优惠价',


      path: '/pages/mine/mine?id=' + a + '&sub=' + b,
      success: function (res) {
        // 转发成功
        wx.showModal({
          title: '提示',
          content: '转发成功',

        })

      },
      fail: function (res) {
        // 转发失败
      }
    }
  },

  // 分割线
  onShow() {

     var that = this;
     var id1 = wx.getStorageSync('cart1') || [];
      var id2 = wx.getStorageSync('cart2') || [];
       var id3 = wx.getStorageSync('cart3') || [];
       var id4 = wx.getStorageSync('cart4') || [];
       var id5 = wx.getStorageSync('cart5') || [];//名片类，安格纸
       var id6 = wx.getStorageSync('cart6') || [];
       var id7 = wx.getStorageSync('cart7') || [];
       var id8 = wx.getStorageSync('cart8') || [];
       var id9 = wx.getStorageSync('cart9') || [];
       var id10 = wx.getStorageSync('cart10') || [];
       var id11 = wx.getStorageSync('cart11') || [];
       var id12 = wx.getStorageSync('cart12') || [];
       var id13 = wx.getStorageSync('cart13') || [];
       var id14 = wx.getStorageSync('cart14') || [];//哑面
       var id15 = wx.getStorageSync('cart15') || [];
       var id16 = wx.getStorageSync('cart16') || [];
       var id17 = wx.getStorageSync('cart17') || [];
       var id18 = wx.getStorageSync('cart18') || [];
     console.log(id1);
     console.log(id2);
     var sub1 = id1.concat(id2).concat(id3).concat(id4).concat(id5).concat(id6).concat(id7).concat(id8).concat(id9).concat(id10).concat(id11).concat(id12).concat(id13).concat(id14).concat(id15).concat(id16).concat(id17).concat(id18);
    

that.setData({ 
   hasList: true,
  carts: sub1,
  

});
this.getTotalPrice();
  },

   /*提交订单*/
    submitOrder:function(flag){
       var res = this.data.carts;
      
        if(!res){
            res=[];
        }
        //在下单的时候过滤不下单的商品，
        if(flag){
            var newRes=[];
            for(let i=0;i<res.length;i++){
                if(res[i].selected){
                    newRes.push(res[i]);
                }
            }
            res=newRes;
             console.log(res);
             wx.setStorageSync('res', res);
        }

       
        wx.navigateTo({
            url:'../orders/orders?account='+this.data.account+'&from=cars'
        });
    },
  /**
   * 当前商品选中事件
   */
  selectList(e) {
    console.log(e);
    const index = e.currentTarget.dataset.index;
    let carts = this.data.carts;
    const selected = carts[index].selected;
    console.log(selected);
    var id=carts[index].id;
    console.log(id);
    carts[index].selected = !selected;
    this.setData({
      carts: carts
    });
    this.getTotalPrice();
  },


  

  /**
   * 删除购物车当前商品
   */
  deleteList(e) {
    const index = e.currentTarget.dataset.index;
    
    
    let carts = this.data.carts;
    console.log(e);
    console.log(carts);
    var id=carts[index].id;
    console.log(id);
    carts.splice(index,1);

    if(id==1){
    wx.removeStorageSync('cart1');
   
   
    }
    // 分割线
    if (id == 2) {
      wx.removeStorageSync('cart2');
    }
    // 分割线
    if (id == 3) {
      wx.removeStorageSync('cart3');
    }
    // 分割线
    if (id == 4) {
      wx.removeStorageSync('cart4');
    }
    // 分割线
    if (id == 5) {
      wx.removeStorageSync('cart5');
    }
    // 分割线
    if (id == 6) {
      wx.removeStorageSync('cart6');
    }
    // 分割线
    if (id == 7) {
      wx.removeStorageSync('cart7');
    }
    // 分割线
    if (id == 8) {
      wx.removeStorageSync('cart8');
     
    }
    // 分割线
    if (id == 9) {
      wx.removeStorageSync('cart9');

    }
    // 分割线
    if (id == 10) {
      wx.removeStorageSync('cart10');

    }
    // 分割线
    if (id == 11) {
      wx.removeStorageSync('cart11');

    }
    // 分割线
    if (id == 12) {
      wx.removeStorageSync('cart12');

    }
    // 分割线
    if (id == 13) {
      wx.removeStorageSync('cart13');

    }
    // 分割线
    if (id == 14) {
      wx.removeStorageSync('cart14');

    }
    // 分割线
    if (id == 15) {
      wx.removeStorageSync('cart15');

    }
    // 分割线
    if (id == 16) {
      wx.removeStorageSync('cart16');

    }
    // 分割线
    if (id == 17) {
      wx.removeStorageSync('cart17');

    }
    // 分割线
    if (id == 18) {
      wx.removeStorageSync('cart18');

    }
    // 分割线

    this.setData({
      carts: carts
    });
    if(!carts.length){
      this.setData({
        hasList: false
      });
    }else{
      this.getTotalPrice();
    }
  },

  /**
   * 购物车全选事件
   */
  selectAll(e) {
    //console.log(e)
    let selectAllStatus = this.data.selectAllStatus;
    selectAllStatus = !selectAllStatus;
    let carts = this.data.carts;

    for (let i = 0; i < carts.length; i++) {
      carts[i].selected = selectAllStatus;
    }
    this.setData({
      selectAllStatus: selectAllStatus,
      carts: carts
    });
    this.getTotalPrice();
  },

  /**
   * 绑定加数量事件
   */
  addCount(e) {
    const index = e.currentTarget.dataset.index;
    let carts = this.data.carts;
    let num = carts[index].num;
    num = num + 1;
    carts[index].num = num;
    this.setData({
      carts: carts
    });
    this.getTotalPrice();
  },

  /**
   * 绑定减数量事件
   */
  minusCount(e) {
    const index = e.currentTarget.dataset.index;
    const obj = e.currentTarget.dataset.obj;
    let carts = this.data.carts;
    let num = carts[index].num;
    if(num <= 1){
      return false;
    }
    num = num - 1;
    carts[index].num = num;
    this.setData({
      carts: carts
    });
    this.getTotalPrice();
  },

  /**
   * 计算总价
   */
  getTotalPrice() {
    let carts = this.data.carts;                  // 获取购物车列表
    let total = 0;
    for(let i = 0; i<carts.length; i++) {         // 循环列表得到每个数据
      if(carts[i].selected) {                     // 判断选中才会计算价格
        total += carts[i].num * carts[i].price;   // 所有价格加起来
      }
    }
    this.setData({                                // 最后赋值到data中渲染到页面
      carts: carts,
      totalPrice: total.toFixed(2)
    });
  }

})

