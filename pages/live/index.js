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
    tabIndex: 1,
    list: [],
    listcf:{},
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
    var that=this;
    that.setData({
      tabIndex: e.currentTarget.dataset.index
    })
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
      //console.log("test")
   // this.getList()
  },
  getList:function(callback){
    var that=this;
    
    wx.request({
      url:'https://vircom.top/api/getliverooms.php',//改成你自己的链接
      header:{
      'Content-Type':'application/x-www-form-urlencoded'
      },
      data:{
        //id:app.globalData.openid,
        
      },
      method:'GET',
      success:function(res){
        //console.log(res.data);
        that.setData({
          list:res.data.liverooms,
        });
        var list=that.data.list;
        var list1=[];
        var list2=[];
        var list3=[];
        var list4=[];
        var listcf={};
        //console.log(list.length);
        for(let i=0;i<list.length;i++){
          //console.log(list[i].live_status);
          list[i].start_YMD=util.formatTime(list[i].start_time,'Y/M/D');
          list[i].start_hms=util.formatTime(list[i].start_time,'h:m');
          list[i].end_YMD=util.formatTime(list[i].end_time,'Y/M/D');
          list[i].end_hms=util.formatTime(list[i].end_time,'h:m');
          switch(list[i].live_status){
            case "101":{
              list1.push(list[i]);
            }break;
            case "102":{
              list2.push(list[i]);
            }break;
            case "103":{
              list3.push(list[i]);
            }break;
            default:{
              list4.push(list[i]);
            }break;
          }

        }
        listcf[0]=list1;
        listcf[1]=list2;
        listcf[2]=list3;
        listcf[3]=list4;
        that.setData({
         listcf:listcf
        })
        if(callback){
          callback();
        }
       },
      fail:function(res){
      console.log(res.data)
      }
      });

 
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      tabIndex: options.type||1
    })
    this.getList();
   // let self = this;
  
    //var sjc = 1592637818;
    //console.log(util.formatTime(sjc,'Y/M/D h:m:s'));
   // console.log(util.formatTime(sjc, 'h:m'));

   
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
  upper:function(e){
    console.log(e);
   
    this.getList()
  },
  /**
   * 上滑加载更多
   */
  scrollToUpper: function(e) {
    console.info('scrollToLower', e);
    var hidden = this.data.hidden,
      loadingData = this.data.loadingData,
      that = this;
    if (hidden) {
      this.setData({
        hidden: false
      });
      console.info(this.data.hidden);
    }
    if (loadingData) {
      return;
    }
    this.setData({
      loadingData: true
    });
    // 加载数据,模拟耗时操作
 
    wx.showLoading({
      title: '数据加载中...',
    });
 
    setTimeout(function() {
      that.getList( () => {
        that.setData({
          hidden: true,
          loadingData: false
        });
        wx.hideLoading();
      });
      console.info('上拉数据加载完成.');
    }, 2000);
  },
  scrollToLower: function(e) {
    wx.showToast({
      title: '触顶了...',
    })
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
       if(tabIndex<4){
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
})