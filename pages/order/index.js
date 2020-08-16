// pages/coupon/index.js
const app = getApp();
var util = require("../../utils/util.js");
var touchDot = 0;//触摸时的原点
var time = 0;// 时间记录，用于滑动时且时间小于1s则执行左右滑动
var interval = "";// 记录/清理时间记录

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tablist:[{"name":"全部","index":1},{"name":"待付款","index":2},{"name":"待发货","index":3},{"name":"待收货","index":4},{"name":"待评价","index":5}],
    tabIndex: 1,
    list: [],
     /**
     * 用于控制当 scroll-view 滚动到底部时，显示 “数据加载中...” 的提示
     */
    hidden: true,
    /**
     * 用于显示文章的数组
     */
    articles: [],
    /**
     * 数据是否正在加载中，避免用户瞬间多次下滑到底部，发生多次数据加载事件
     */
    loadingData: false,
    switchtab:false,
    //是否触发下拉刷新
    isTop: true,//是否在顶部
    touchStartY: 0,//刚触碰屏幕时 距离顶部的距离
    touchMoveHeight: 0, //触碰屏幕时 手指移动的距离
    scrolltoupper: false,//判断是否正在下拉刷新
    scrolltolower: false,//判断是否正在上拉加载
    maxtouchMoveHeight:120,
    refreshtext:"下拉刷新",
    show:false,
    alpha: [1,1,1,1,1],
    timer:'',
    Isdraged:false,
    Isvibrate:false,
  },
  tabFun(e) {
    this.setData({
      tabIndex: e.currentTarget.dataset.index
    })
    this.getList()
  },
  getList(callback){
   var that=this;
   var paystatus=0;
   switch(that.data.tabIndex){
     case 1:paystatus=0;//全部订单
     break;
     case 2:paystatus=102;//待付款
     break;
     case 3:paystatus=103;//已付款，待发货
     break;
     case 4:paystatus=104;//已发货,待收货
     break;
     case 5:paystatus=105;//已收货,待评价
     break;
       
   }
wx.login({
  success (res) {
    if (res.code) {
     // console.log(res.code);
      //发起网络请求
      
      wx.request({
        url: 'https://vircom.top/api/onLogin.php',
        data: {
          code: res.code
        },
        success: function(res) {
          //console.log(res);
          //"mYiCY/CQuXjn+V+2ME4/fA=="
          app.globalData.session_key=res.data.session_key;
          //app.globalData.openid=res.data.openid;
          //console.log(app.globalData.openid);

          wx.request({
            url:'https://vircom.top/api/getorders.php',//改成你自己的链接
            header:{
            'Content-Type':'application/x-www-form-urlencoded'
            },
            data:{
              //id:app.globalData.openid,
              token:app.globalData.session_key,
             // fee:0.01,
             paystatus:paystatus,
            },
            method:'GET',
            success:function(res){
         // console.log(res.data)
          var orders=res.data.orders;
          for(let i=0;i<orders.length;i++){
          let jsonStr=orders[i].goodsdetail;
          orders[i].goodsdetail=JSON.parse(jsonStr);
        }
          //console.log(JSON.parse(jsonStr))

          that.setData({
            list:res.data.orders,
          });
          if(callback){
            callback();
          }
            },
            fail:function(res){
            console.log(res.data)
            }
            });
 
        }//success
       
      })
    } else {
      console.log('登录失败！' + res.errMsg)
    }
  }
})

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      tabIndex: options.type||1
    })
    this.getList();
    
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

  },
  bindscroll: function (e) {
    //console.log(e)
    let self = this;
    self.setData({
      isTop: false
    })
  },
    // 触摸开始事件
    touchStart: function (e) {
    
    let self = this;
    self.setData({
      touchStartY: e.changedTouches[0].pageY,
      isTop: true
    });
    touchDot = e.touches[0].pageX; // 获取触摸时的原点
      // 使用js计时器记录时间  
   /*   interval = setInterval(function () {
        time++;
      }, 100);*/
      //console.log(e)
    },
    // 触摸移动事件
    touchMove: function (e) {
      var that=this;
      let touchStartY = that.data.touchStartY;
      let touchMoveY = e.changedTouches[0].pageY;
      let touchMoveHeight=touchMoveY - touchStartY;
   
      that.setData({
        touchMoveHeight: touchMoveY - touchStartY
      })
      if ((touchMoveHeight>20)&& that.data.isTop&&(!that.data.Isdraged)){
        that.anniu();
        that.setData({
          show:true,
        })
      }
      if(touchMoveHeight<that.data.maxtouchMoveHeight){
        that.setData({
          Isvibrate:false
        })
      }
      if ((touchMoveHeight>=that.data.maxtouchMoveHeight)&& that.data.isTop&&(!that.data.Isvibrate)) {
wx.vibrateShort({
  complete: (res) => {
    that.setData({
      Isvibrate:true,
    })
  },
})
      }
      var touchMove = e.touches[0].pageX;
     // console.log("touchMove:" + touchMove + " touchDot:" + touchDot + " diff:" + (touchMove - touchDot));
      // 向左滑动  
      if (((touchMove - touchDot) <= -80) &&(!that.data.switchtab)) {
that.setData({
  switchtab:true,
});
        var tabIndex=that.data.tabIndex;
       if(tabIndex<that.data.tablist.length){
         tabIndex++;
         that.setData({
           tabIndex:tabIndex
         })
       }
       wx.showLoading({
        title: '加载中'
      });
      that.getList(() => {
        that.setData({
          scrolltoupper: false,
          scrolltolower: false,
          touchMoveHeight: 0,
        })
        wx.hideLoading();});
      }
      // 向右滑动
      if (((touchMove - touchDot )>= 80)&& (!that.data.switchtab)) {
        console.log('向右滑动');
        that.setData({
          switchtab:true
        })
       var tabIndex=that.data.tabIndex;
       if(tabIndex>1){
         tabIndex--;
         that.setData({
           tabIndex:tabIndex
         })
       }
       wx.showLoading({
        title: '加载中'
      });
      that.getList(() => {
        that.setData({
          scrolltoupper: false,
          scrolltolower: false,
          touchMoveHeight: 0,
        })
        wx.hideLoading();});

      }
    },
    // 触摸结束事件
    touchEnd: function (e) {
    
      let self = this;
      self.setData({
        show:false,
        Isdraged:false,
        Isvibrate:false,
      })
      clearInterval(self.data.timer);
      let isTop = self.data.isTop;
      let touchStartY = self.data.touchStartY;
      let touchEndY = e.changedTouches[0].pageY;
      //console.log(isTop)
      //console.log(touchStartY)
      //console.log(touchEndY)
      if (touchEndY > touchStartY && isTop&&(self.data.touchMoveHeight>=self.data.maxtouchMoveHeight)) {
        self.setData({
          scrolltoupper: true,
          scrolltolower: true,
          touchMoveHeight: 120
        })
        self.myPullDownRefresh();
      }else{
        self.setData({
          touchMoveHeight:0
        })
      }
     // clearInterval(interval); // 清除setInterval
      time = 0;
      self.setData(
        {
          switchtab:false,
        }
      )
    },
    myPullDownRefresh: function () {
      let self = this;
      //console.log("begin")
      
      var scrolltoupper = self.data.scrolltoupper;
      if (scrolltoupper){
        
        
        wx.showLoading({
          title: '加载中'
        });
        self.getList(() => {
          self.setData({
            scrolltoupper: false,
            scrolltolower: false,
            touchMoveHeight: 0,
            

          })
          wx.hideLoading();
         
          /*wx.showToast({
            title: '刷新成功',
            icon:'success',
            duration:2000
          })*/
        });
        
        //定时器为了模仿实际开发中请求数据过程  使加载效果看起来好一些，
  
      }
    },
    anniu: function (e) {
      var self = this;
      var _index = 0;
      var _alpha = self.data.alpha;
      var _speed = 500;
      self.setData({
        timer:setInterval(function () {
          var an_show = wx.createAnimation({});
          var an_hide = wx.createAnimation({});
          an_show.opacity(1).step({ duration: _speed });
          an_hide.opacity(0).step({ duration: _speed });
          _alpha[_index] = an_show;
          _alpha[_index == 0 ? 4 : _index - 1] = an_hide;
          self.setData({
            alpha: _alpha
          })
          _index = _index == 4 ? 0 : _index + 1;
        }, _speed)
      })
      /*var timer = setInterval(function () {
        var an_show = wx.createAnimation({});
        var an_hide = wx.createAnimation({});
        an_show.opacity(1).step({ duration: _speed });
        an_hide.opacity(0).step({ duration: _speed });
        _alpha[_index] = an_show;
        _alpha[_index == 0 ? 4 : _index - 1] = an_hide;
        self.setData({
          alpha: _alpha
        })
        _index = _index == 4 ? 0 : _index + 1;
      }, _speed);*/
    },
    bindCancel: function () {
     // wx.navigateBack({})
     console.log("cancelorder")
    },
    bindPay: function (e) {
      console.log(e.currentTarget.dataset.index)
      var index=e.currentTarget.dataset.index;
      var paydata=this.data.list[index];
      wx.requestPayment({
        'timeStamp':paydata.timeStamp,
        'nonceStr': paydata.nonceStr,
        'package':paydata.package,
        'signType':'MD5',
        'paySign': paydata.paySign,
        'success':function(res){
        console.log('success');
        wx.showToast({
        title:'支付成功',
        icon:'success',
        duration:3000
        });
       wx.redirectTo({
         url: '/pages/order/index?type=3',
       })
        },
        'fail':function(res){
        console.log('fail');
        wx.redirectTo({
         url: '/pages/order/index?type=2',
       })
        },
        'complete':function(res){
        console.log('complete');
        
        }
        });
    }

})