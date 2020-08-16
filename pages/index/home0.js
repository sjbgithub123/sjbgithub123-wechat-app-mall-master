// index/gun/jsSwiper2/jsSwiper2.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    
      //图片
      hdimg: ["/image/test.jpg"],
      //是否采用衔接滑动
      circular: true,
      //是否显示画板指示点
      indicatorDots:true,
      //选中点的颜色
      indicatorcolor: "#000",
      //是否竖直
      vertical: false,
      //是否自动切换
      autoplay: true,
      //滑动动画时长毫秒
      duration: 100,
      //所有图片的高度
      imgheights: [],
      //图片宽度
      imgwidth: 750,
      //默认
      current:0  ,
      show:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.__set__();
    this.move();
  },
  anniu: function (e) {
    if(!this.data.show){
      let that = this;
      this.setData({
        show: 1
      })
      setTimeout(function () {
        that.setData({
          show: 0
        })
      },10000)
    }
  }

,
navigate:function(e){
 /* wx.scanCode({
    success: (res) => {
      console.log("扫码结果");
      console.log(res);
      this.setData({
        img: res.result
      })
    },
    fail: (res) => {
      console.log(res);
    }
  })
*/
wx.navigateToMiniProgram({
  appId: 'wx059cd327295ab444',
  
  success(res){
    console.log(res)
  },
  fail(err){
console.log(err)
  }
})
},
delete:function(e){
  let that=this;
this.setData({
  show:0
})
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

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },
  previewImage(e){
    var cur=e.target.dataset.src;//获取本地一张图片链接
    console.log(cur)
		wx.previewImage({
			current: cur, //字符串，默认显示urls的第一张
  			urls: [cur] // 数组，需要预览的图片链接列表
		})
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

  }, move: function() {
    var datas = this.data.datas;
    /*图片分布*/
    for (var i = 0; i < datas.length; i++) {
      var data = datas[i];
      var animation = wx.createAnimation({
        duration:200
      });
      animation.translateX(data.left).step();
      this.setData({
        ["datas[" + i + "].animation"]: animation.export(),
        ["datas[" + i + "].zIndex"]: data.zIndex,
        ["datas[" + i + "].opacity"]: data.opacity,
      })
    }
  },
  /**左箭头 */
  left: function() {
    //
    var last = this.data.datas.pop(); //获取数组的最后一个
    this.data.datas.unshift(last);//放到数组的第一个
    var orderFirst = this.data.order.shift();
    this.data.order.push(orderFirst);
    this.move();
  },
  /** */
  right: function() {
    var first = this.data.datas.shift(); //获取数组的第一个
    this.data.datas.push(first);//放到数组的最后一个位置
    var orderLast = this.data.order.pop();
    this.data.order.unshift(orderLast);
    this.move();
  },
  /**点击某项 */
  choose: function(e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    var order = that.data.order;
    var index = 0;
    for(var i = 0; i<order.length;i++){
      if(id == order[i]){
        index = i;
        break;
      }
    }
    if (index < that.data.iCenter) {
      for (var i = 0; i < that.data.iCenter - index; i++){  
        this.data.datas.push(this.data.datas.shift()); //获取第一个放到最后一个
        this.data.order.unshift(this.data.order.pop());   
        // this.right()  
      } 
    } else if (index > that.data.iCenter) {
      for (var i = 0; i < index - that.data.iCenter; i++) {
        this.data.datas.unshift(this.data.datas.pop()); //获取最后一个放到第一个
        this.data.order.push(this.data.order.shift());
        // this.left();
      }
    }
    this.move();
  },
  /**新的排列复制到新的数组中 */
  __set__: function() {
    var that = this;
    var order = that.data.order;
    var datas = that.data.datas;
    for(var i = 0;i<datas.length;i++){
      that.setData({
        ["order["+i+"]"]:datas[i].id
      })
    }
  },
  //手指触发开始移动
  moveStart: function (e) {
    console.log(e);
    var startX = e.changedTouches[0].pageX;
    this.setData({
      startX: startX
    });
  },
  //手指触摸后移动完成触发事件
  moveItem: function (e) {
    console.log(e);
    var that = this;
    var endX = e.changedTouches[0].pageX;
    this.setData({
      endX: endX
    });
    //计算手指触摸偏移剧距离
    var moveX = this.data.startX - this.data.endX;
    //向左移动
    if (moveX > 20) {
      this.left();
    }
    if (moveX < -20) {
      this.right();
    }
  },
  imageLoad: function (e) {
    //获取图片真实宽度
    var imgwidth = e.detail.width,
      imgheight = e.detail.height,
      //宽高比
      ratio = imgwidth / imgheight;
    console.log(imgwidth, imgheight)
    //计算的高度值
    var viewHeight = 750 / ratio;
    var imgheight = viewHeight
    var imgheights = this.data.imgheights
    //把每一张图片的高度记录到数组里
    imgheights.push(imgheight)
    this.setData({
      imgheights: imgheights,
    })
  },
  bindchange: function (e) {
    console.log(e.detail.current)
    this.setData({ current: e.detail.current})
  },

})

