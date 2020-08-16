//index.js
//获取应用实例
var app = getApp()

Page({
  data: {
    goodsList: [],
    isNeedLogistics: 0, // 是否需要物流信息
    allGoodsPrice: 0,
    freight: 0.00,
    //allGoodsAndYunPrice: 0,
    allpayamount:0.00,
    goodsJsonStr: "",
    orderType: "", //订单类型，购物车下单或立即支付下单，默认是购物车，
userName:'',
provinceName:'',
cityName:'',
countyName:'',
detailInfo:'',
nationalCode:"",
telNumber:'',
curAddressData:null,

disabled:true,

    hasNoCoupons: true,
    coupons: [],
    couponminus: 0, //优惠券金额
    curCoupon:null, // 当前选择使用的优惠券
  },
 
  onShow: function () {

    var that = this;
    var shopList = [];
    //立即购买下单
    console.log( that.data.orderType);
    if ("buyNow" === that.data.orderType) {
      //console.log('buyNow!!')
      var buyNowInfoMem = wx.getStorageSync('buyNowInfo');
    //  that.data.kjId =buyNowInfoMem.kjId;
      if (buyNowInfoMem && buyNowInfoMem.shopList) {
        shopList = buyNowInfoMem.shopList
      }
    } else {
      //购物车下单
      var shopCarInfoMem = wx.getStorageSync('shopCarInfo');
      //that.data.kjId = shopCarInfoMem.kjId;
      if (shopCarInfoMem && shopCarInfoMem.shopList) {
        // shopList = shopCarInfoMem.shopList
        shopList = shopCarInfoMem.shopList.filter(entity => {
          return entity.active;
        });
      }
    }
    that.setData({
      goodsList: shopList,
    });
    //that.initShippingAddress();
  },

  onLoad: function (e) {
    var that = this;
    //显示收货地址标识
    wx.showLoading({
      title: 'NowLoading...',
    })
    that.initShippingAddress();
    that.setData({
      isNeedLogistics: 1,
      orderType:e.orderType,
        disabled:false,
    });
    
    that.getMyCoupons();
   // this.processYunfei();
   // console.log(e.orderType);
   wx.hideLoading({
     complete: (res) => {
       console.log(that.data.disabled)
     },
   })
  },

  getDistrictId: function (obj, aaa) {
    if (!obj) {
      return "";
    }
    if (!aaa) {
      return "";
    }
    return aaa;
  },

  createOrder: function (e) {
    var that = this;
    that.setData({
      disabled:true,
    });
    wx.showLoading();
   // var loginToken = wx.getStorageSync('token') // 用户登录 token
    var remark = ""; // 备注信息
    if (e) {
      remark = e.detail.value.remark; // 备注信息
    }

   
   // if (that.data.kjId) {
   //   postData.kjid = that.data.kjId;
   // }
    if (that.data.isNeedLogistics > 0) {
      if (!that.data.curAddressData) {
        wx.hideLoading();
        wx.showModal({
          title: '错误',
          content: '请先设置您的收货地址！',
          showCancel: false
        })
        that.setData({
          disabled:false,
        })
        return;
      }

      //var app=this;
      //   console.log("begin")
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
               app.globalData.session_key=res.data.session_key;
               //app.globalData.openid=res.data.openid;
               //console.log(app.globalData.openid);
     
               wx.request({
                 url:'https://vircom.top/wxpay/payfee.php',//改成你自己的链接
                 header:{
                 'Content-Type':'application/x-www-form-urlencoded;charset=utf-8'
                 },
                 data:{
                   //id:app.globalData.openid,
                   session_key:app.globalData.session_key,
                   goodslist:JSON.stringify(that.data.goodsList),
                   coupon:JSON.stringify(that.data.curCoupon),
                   fee:that.data.allpayamount,
                   remark:remark,
                  // fee:0.01,
                 },
                 method:'POST',
                 success:function(res){
                 //console.log(res);
                 if(res.data.result==0){

                
                 wx.hideLoading({
                   complete: (res) => {},
                 })
                 console.log('调起支付');
                 wx.requestPayment({
                 'timeStamp': res.data.timeStamp,
                 'nonceStr': res.data.nonceStr,
                 'package': res.data.package,
                 'signType':'MD5',
                 'paySign': res.data.paySign,
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
                 wx.clearStorageSync('shopCarInfo');
                 
                 }
                 });
                }else{
                  wx.showModal({
                    title: '提示',
                    content: '系统繁忙，请稍后再试!',
                    showCancel: false
                  })
                }
                 },
                 fail:function(res){
                 //console.log(res.data)
                 }
                 });
      
             }//success
            
           })
         } else {
           console.log('登录失败！' + res.errMsg)
         }
       }
     });
     
      
    }
    
    

  },
  initShippingAddress: function () {
    var that = this;

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
            //  console.log(res);
            //  app.globalData.session_key=res.data.session_key;
            wx.setStorage({
              data: res.data.session_key,
              key: 'token',
            })
              //app.globalData.openid=res.data.openid;
              //console.log(app.globalData.openid);
    console.log(wx.getStorageSync('token'));
              wx.request({
                url:'https://vircom.top/api/getaddress.php',//改成你自己的链接
                header:{
                'Content-Type':'application/x-www-form-urlencoded'
                },
                data:{
                  //id:app.globalData.openid,
                  token:wx.getStorageSync('token'),
                //  fee:0.01,
                },
                method:'GET',
                success:function(res){
                  console.log(res);
                  var curAddressDataTemp={};
                  curAddressDataTemp.linkMan=res.data.userName;
                  curAddressDataTemp.mobile=res.data.telNumber;
                  curAddressDataTemp.address=res.data.provinceName.toString().concat(res.data.cityName.toString(),res.data.countyName.toString(),res.data.detailInfo.toString(),res.data.nationalCode.toString());
                  that.setData({
                    userName:res.data.userName,
                    provinceName:res.data.provinceName,
                    cityName:res.data.cityName,
                    countyName:res.data.countyName,
                    detailInfo:res.data.detailInfo,
                    nationalCode:res.data.nationalCode,
                    telNumber:res.data.telNumber,
                    curAddressData:curAddressDataTemp,
                  })

               that.processYunfei();
               
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
  processYunfei: function () {
    var that = this;
    wx.login({
      success (res) {
        // var that1=that;
        if (res.code) {
         // console.log(res.code);
          //发起网络请求
        
          wx.request({
            url: 'https://vircom.top/api/onLogin.php',
            data: {
              code: res.code
            },
            success: function(res) {
            //  console.log(res);
            //  app.globalData.session_key=res.data.session_key;
            wx.setStorage({
              data: res.data.session_key,
              key: 'token',
            })
              //app.globalData.openid=res.data.openid;
              //console.log(app.globalData.openid);
    //console.log(wx.getStorageSync('token'));
    //var that2=that1;
              wx.request({
                url:'https://vircom.top/api/getfreight.php',//改成你自己的链接
                header:{
                'Content-Type':'application/x-www-form-urlencoded'
                },
                data:{
                  //id:app.globalData.openid,
                  token:wx.getStorageSync('token'),
                  provinceName:that.data.provinceName,
                //  fee:0.01,
                },
                method:'GET',
                success:function(res){
               //console.log(res);
                 that.setData({
freight:parseFloat(res.data.fee),
                 });
console.log(that.data.freight);
//that2.countAllgoodsrice();that.processYunfei();
that.countAllgoodsrice();
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
countAllgoodsrice:function(){
  var that=this;
  let price=0.00;
  let allgoodsprice=0.00;
  var goodslist=that.data.goodsList;
  for(let i=0;i<goodslist.length;i++){
    price+=parseFloat(goodslist[i].price)*parseInt(goodslist[i].number);
  }
  allgoodsprice=price;
  price=(price+parseFloat(that.data.freight)-parseFloat(that.data.couponminus)).toFixed(2);
that.setData({
  allpayamount:price,
  allGoodsPrice:allgoodsprice,
})},
 readFromWx:function(e){
   var that=this;
    wx.getSetting({
      success(res) {
        console.log("vres.authSetting['scope.address']：",res.authSetting['scope.address'])
        if (res.authSetting['scope.address']) {
        //  console.log("111")
          wx.chooseAddress({
            success(res) {
           /*   console.log(res.userName)
              console.log(res.postalCode)
              console.log(res.provinceName)
              console.log(res.cityName)
              console.log(res.countyName)
              console.log(res.detailInfo)
              console.log(res.nationalCode)
              console.log(res.telNumber)
              */
             var curAddressDataTemp={};
             curAddressDataTemp.linkMan=res.userName;
             curAddressDataTemp.mobile=res.telNumber;
             curAddressDataTemp.address=res.provinceName.toString().concat(res.cityName.toString(),res.countyName.toString(),res.detailInfo.toString(),res.nationalCode.toString());
             that.setData({
               userName:res.userName,
               provinceName:res.provinceName,
               cityName:res.cityName,
               countyName:res.countyName,
               detailInfo:res.detailInfo,
               nationalCode:res.nationalCode,
               telNumber:res.telNumber,
               curAddressData:curAddressDataTemp,
             })
             that.updateaddress();
             that.processYunfei();
            // that.countAllgoodsrice();
            }
          })
              // 用户已经同意小程序使用录音功能，后续调用 wx.startRecord 接口不会弹窗询问
              
        } else {
          if (res.authSetting['scope.address'] == false) {
           // console.log("222")
            wx.openSetting({
              success(res) {
             //   console.log(res.authSetting)
              
              }
            })
          } else {
           // console.log("eee")
            wx.chooseAddress({
              success(res) {
                that.setData({
                  userName:res.userName,
                  provinceName:res.provinceName,
                  cityName:res.cityName,
                  countyName:res.countyName,
                  detailInfo:res.detailInfo,
                  nationalCode:res.nationalCode,
                  telNumber:res.telNumber,
                })
                that.updateaddress();
                that.processYunfei();
               /// that.countAllgoodsrice();
              }
            })
          }
        }
      }
  
})
 },
 
  getMyCoupons: function () {
    var that = this;
    var coupons = app.globalData.coupon;
    console.log(coupons);
    var effectivecoupons=[];
    for(let i=0;i<coupons.length;i++){
if(coupons[i].status==0){
  effectivecoupons.push(coupons[i]);
}
    }
    if (effectivecoupons.length > 0) {
      that.setData({
        hasNoCoupons: false,
        coupons: effectivecoupons,
      });
    }
  },
  bindChangeCoupon: function (e) {
    const selIndex = e.detail.value[0] - 1;
   // var that=this;
    if (selIndex === -1) {
      this.setData({
        couponminus: 0,
        curCoupon: null
      });
     this.countAllgoodsrice();
      return;
    }
    //console.log("selIndex:" + selIndex);
    this.setData({
      couponminus: this.data.coupons[selIndex].minus,
      curCoupon: this.data.coupons[selIndex]
    });
    this.countAllgoodsrice();
  },

  updateaddress:function(){
    var that=this;
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
            //  console.log(res);
            //  app.globalData.session_key=res.data.session_key;
            wx.setStorage({
              data: res.data.session_key,
              key: 'token',
            })
              //app.globalData.openid=res.data.openid;
              //console.log(app.globalData.openid);
    console.log(wx.getStorageSync('token'));
              wx.request({
                url:'https://vircom.top/api/updateaddress.php',//改成你自己的链接
                header:{
                'Content-Type':'application/x-www-form-urlencoded'
                },
                data:{
                  //id:app.globalData.openid,
                  token:wx.getStorageSync('token'),
                  userName:that.data.userName,
                  provinceName:that.data.provinceName,
                  cityName:that.data.cityName,
                  countyName:that.data.countyName,
                  detailInfo:that.data.detailInfo,
                  nationalCode:that.data.nationalCode,
                  telNumber:that.data.telNumber,
                //  fee:0.01,
                },
                method:'POST',
                success:function(res){
                //  console.log(res.data);
                  
             //  that.processYunfei();
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
  }

})
