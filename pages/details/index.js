Page({
  data: {
    isLike: true,
   

    sizecategory:{},
    firrebate:0.05,
    secrebate:0.03,
    firrebateamount:0.00,
    secrebateamount:0.00,

    idx:1,
    idx2:"",
currentnum:0,

propertyChildIds:'',

    applyList:{},
    currentname:null,
    color:null,
    colorid:null,
    size:null,
    sizeid:null,
    price:null,
    saleprice:null,
    storesnum:null,
    salesvolume:null,
    postage:null,
    desc:'',
    buynum:1,
    currentgoodsid:'',
    shopNum:0,
    shopCarInfo:{},
    // 商品详情介绍
    detailImg: [
      "http://7xnmrr.com1.z0.glb.clouddn.com/detail_1.jpg",
      "http://7xnmrr.com1.z0.glb.clouddn.com/detail_2.jpg",
      "http://7xnmrr.com1.z0.glb.clouddn.com/detail_3.jpg",
      "http://7xnmrr.com1.z0.glb.clouddn.com/detail_4.jpg",
      "http://7xnmrr.com1.z0.glb.clouddn.com/detail_5.jpg",
      "http://7xnmrr.com1.z0.glb.clouddn.com/detail_6.jpg",
    ],

    //图片
    hdimg: [],
    //是否采用衔接滑动
    circular: true,
    //是否显示画板指示点
    indicatorDots:true,
    //选中点的颜色
    indicatorcolor: "#000",
    //是否竖直
    vertical: false,
    //是否自动切换
    autoplay: false,
    //滑动动画时长毫秒
    duration: 100,
    //所有图片的高度
    imgheights: [],
    //图片宽度
    imgwidth: 750,
    //默认
    current:0,
  },
  //预览图片
  previewImage: function (e) {
    var current = e.target.dataset.src;

    wx.previewImage({
      current: current, // 当前显示图片的http链接  
      urls: this.data.hdimg // 需要预览的图片http链接列表  
    })
  },
  // 收藏
  addLike() {
    this.setData({
      isLike: !this.data.isLike
    });
  },
  explain:function(e){
wx.showModal({
  title:"直接返利说明",
  content:'分销员A将分销商品分享给好友B,好友B购买后,分销员A可获得的直接返利',
  cancelColor: 'cancelColor',
})
  },
  explain2:function(e){
    wx.showModal({
      title:"直接返利说明",
      content:'分销员A将商品分享给好友B,好友B将商品分享给好友C,好友C购买了该商品,分销员A即可获得间接返利',
      cancelColor: 'cancelColor',
    })
      },
  // 跳到购物车
  toCar() {
    wx.switchTab({
      url: '/pages/index/cart'
    })
  },
  // 立即购买
  immeBuy() {
    wx.showToast({
      title: '购买成功',
      icon: 'success',
      duration: 2000
    });
  },
  onLoad:function(options){
    //console.log(options.id)
    var that=this;
    wx.showLoading({
      title: 'NowLoading...',
      icon:'loading',
      duration:1000
    });
    wx.request({
      url: 'https://vircom.top/api/goods_one.php',
      method:'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
       id:options.id,
       
      },
      success: (res) => {
       // console.log(res.data);
    
        that.setData({
         
           //currentnum:res.data.num,
           //currentname:res.data.name,
           size:null,
           price:res.data.price,
          // saleprice:res.data.saleprice,
           storesnum:res.data.num,
           salesvolume:res.data.salesvolume,
           postage:res.data.postage,
           desc:res.data.intro,
           //imgUrls:res.data.imgs,
           hdimg:res.data.imgs,
           detailImg:res.data.detailimgs,
           currentgoodsid:res.data.id,
           sizecategory:res.data.sizecategory,
          firrebate:res.data.firrebate,
          secrebate:res.data.secrebate,

    })
   
//console.log(res.data);
var sizecategory=res.data.sizecategory;
var applyList=sizecategory[0].size;
    that.setData({
      sizecategory:sizecategory,
      applyList:applyList,
      // currentnum:res.data.num,
       currentname:res.data.name,
       //size:null,
});
var shopCarInfo=wx.getStorageSync("shopCarInfo");

var id=1;
  that.setData({
  idx: id,
  applyList:that.data.sizecategory[id-1],
 shopNum:shopCarInfo.shopNum,
  propertyChildIds:id-1,
})
let storenum=0;
var applyList=that.data.applyList;

for(let i=0;i<applyList.size.length;i++){
  //console.log(applyList.size[i]);
 storenum+=parseInt(applyList.size[i].Item_num);
}

let minprice=applyList.size[0].Item_saleprice;
    for(let i=0;i<applyList.size.length;i++){
      //console.log(applyList.size[i]);
     if(parseFloat(applyList.size[i].Item_saleprice)<=parseFloat(minprice)){
       minprice=applyList.size[i].Item_saleprice;
     }
   }
that.setData({
 currentnum:storenum,
 idx2:"",
 saleprice:minprice,
})
that.countrebate();

wx.hideLoading({
  complete: (res) => {},
})
   // console.log(res)
    },})

   
  },
  countrebate:function(){
    var firrebateamount=parseFloat(this.data.firrebate)*parseFloat(this.data.saleprice);
    var secrebateamount=parseFloat(this.data.secrebate)*parseFloat(this.data.saleprice);
    firrebateamount=firrebateamount.toFixed(2);
    secrebateamount=secrebateamount.toFixed(2);
this.setData({
  firrebateamount:firrebateamount,
  secrebateamount:secrebateamount,
})
  },
  selectApply:function(e){
    let id = e.target.dataset.id;
     if(this.data.sizecategory[id-1].size==null){

     }else{
       this.setData({
       idx: id,
       applyList:this.data.sizecategory[id-1],
      
       propertyChildIds:id-1,
     })
     let storenum=0;
     var applyList=this.data.applyList;

     for(let i=0;i<applyList.size.length;i++){
       //console.log(applyList.size[i]);
      storenum+=parseInt(applyList.size[i].Item_num);
    }
    let minprice=applyList.size[0].Item_saleprice;
    for(let i=0;i<applyList.size.length;i++){
      //console.log(applyList.size[i]);
     if(parseFloat(applyList.size[i].Item_saleprice)<=parseFloat(minprice)){
       minprice=applyList.size[i].Item_saleprice;
     }
   }
    this.setData({
      currentnum:storenum,
      idx2:"",
      saleprice:minprice,
      size:null,
     price:9999,
    })
    this.countrebate();
     }
 },
 
 selectApply2:function(e){
  let id = e.target.dataset.id
   if(this.data.applyList.size[id-1].Item_num==0){

   }else{
     this.setData({
     idx2: id,
     currentnum:this.data.applyList.size[id-1].Item_num,
     buynum:1,
     color:this.data.applyList.color,
     colorid:this.data.applyList.id,
     size:this.data.applyList.size[id-1].Item_Name,
     sizeid:this.data.applyList.size[id-1].id,
     propertyChildIds:id-1,
     saleprice:this.data.applyList.size[id-1].Item_saleprice,
     price:this.data.applyList.size[id-1].Item_price,
     
   })
   this.countrebate();
   }
},
 decrease:function(e){
  if(this.data.buynum<=1){
    wx.showToast({
      title: '不能再减了~',
      icon:'none'
    })
    return;
  }
 var Num=this.data.buynum-1;
 this.setData({
  buynum:Num
 })
  },
  increase:function(e){
    if(this.data.buynum<this.data.currentnum){
    var Num=this.data.buynum+1;
    this.setData({
      buynum:Num
    })}else{
      wx.showToast({
        title: '库存不够了~',
        icon:'none',
      })
    }
  },
  setNumberInput:function(e){
    if(e.detail.value!=null){
 if(parseInt(e.detail.value)>=1&&(parseInt(e.detail.value)<=this.data.currentnum)){
   this.setData({
     buynum:parseInt(e.detail.value),
   })                                       
 }else{
   //console.log(e.detail.value)
   this.setData({
     buynum:this.data.currentnum,
   })
 }}else{  this.setData({
  buynum:this.data.currentnum,
 })}
 
 //console.log(e.detail.value)
  },
  addShopCar: function () {
    //if (this.data.size) {
      if (this.data.size==null||this.data.idx2=="") {
        wx.showModal({
          title: '提示',
          content: '请选择商品规格！',
          showCancel: false
        })
        return;
      }
      
   // }
    if (this.data.buynum< 1) {
      wx.showModal({
        title: '提示',
        content: '购买数量不能为0！',
        showCancel: false
      })
      return;
    }
    //组建购物车
    var shopCarInfo = this.bulidShopCarInfo();
  
    this.setData({
      shopCarInfo: shopCarInfo,
      shopNum: shopCarInfo.shopNum
    });
  console.log(this.data.shopCarInfo)
    // 写入本地存储
    //要求shopCarInfo为{}而不是[]
    wx.setStorage({
      key: "shopCarInfo",
      data: shopCarInfo
    })
  // console.log(wx.getStorageSync('shopCarInfo'))
   // this.hideModal();
    wx.showToast({
      title: '加入购物车成功',
      icon: 'success',
      duration: 2000
    })
    //console.log(shopCarInfo);
  
    //shopCarInfo = {shopNum:12,shopList:[]}
  },
  bulidShopCarInfo: function () {
    // 加入购物车
    var shopCarMap = {};
    shopCarMap.goodsId = this.data.currentgoodsid;
    shopCarMap.pic = this.data.hdimg[0];
    shopCarMap.name = this.data.currentname;
    // shopCarMap.label=this.data.goodsDetail.basicInfo.id; 规格尺寸 
    shopCarMap.color=this.data.color;
    shopCarMap.sizeid=this.data.sizeid;
    shopCarMap.colorid=this.data.colorid;
    shopCarMap.size =this.data.size;
    shopCarMap.propertyChildIds = this.data.propertyChildIds;
    shopCarMap.price =parseFloat( this.data.saleprice);
    shopCarMap.left = "";
    shopCarMap.active = true;
    shopCarMap.number =parseInt(this.data.buynum);
    shopCarMap.storesnum=parseInt(this.data.currentnum);
    var shopCarInfo =wx.getStorageSync('shopCarInfo');
    if(!shopCarInfo){
      shopCarInfo={};
    }
    if (!shopCarInfo.shopNum) {
      shopCarInfo.shopNum = 0;
    }
    if (!shopCarInfo.shopList) {
      shopCarInfo.shopList = [];
    }
    var hasSameGoodsIndex = -1;
    for (var i = 0; i < shopCarInfo.shopList.length; i++) {
      var tmpShopCarMap = shopCarInfo.shopList[i];
      if (tmpShopCarMap.goodsId == shopCarMap.goodsId && tmpShopCarMap.propertyChildIds == shopCarMap.propertyChildIds) {
        hasSameGoodsIndex = i;
        shopCarMap.number = shopCarMap.number + tmpShopCarMap.number;
        if(shopCarMap.number>shopCarMap.storesnum){
          shopCarMap.number=shopCarMap.storesnum;
        }
        break;
      }
    }
  
   shopCarInfo.shopNum = parseInt(shopCarInfo.shopNum)+ parseInt(this.data.buynum);
    if (hasSameGoodsIndex > -1) {
      shopCarInfo.shopList.splice(hasSameGoodsIndex, 1, shopCarMap);//在hasSameGoodsIndex的位置删除1项后插入shopCarMap
      
    } else {
      shopCarInfo.shopList.push(shopCarMap);
    }
   // shopCarInfo.kjId = this.data.kjId;
    return shopCarInfo;
  },
    /**
      * 立即购买
      */
     buyNow: function () {
      //if (this.data.size) {
        if (this.data.size==null||this.data.idx2=="") {
          wx.showModal({
            title: '提示',
            content: '请选择商品规格！',
            showCancel: false
          })
          return;
        }
        
     // }
      if (this.data.num < 1) {
        wx.showModal({
          title: '提示',
          content: '购买数量不能为0！',
          showCancel: false
        })
        return;
      }
      if (this.data.saleprice * this.data.buynum <=0) {
        wx.showModal({
          title: '未达到起送价',
          content: '请您再选一些吧！',
          showCancel: false,
        })
      } else {
        //组建立即购买信息
        var buyNowInfo = this.buliduBuyNowInfo();
        // 写入本地存储
        wx.setStorage({
          key: "buyNowInfo",
          data: buyNowInfo
        })
        //this.hideModal();
  
        wx.navigateTo({
          url: "/pages/details/order?orderType=buyNow"
        })
      }
    },
  /**
     * 组建立即购买信息
     */
    buliduBuyNowInfo: function () {
      var shopCarMap = {};
    shopCarMap.goodsId = this.data.currentgoodsid;
    shopCarMap.pic = this.data.hdimg[0];
    shopCarMap.name = this.data.currentname;
    // shopCarMap.label=this.data.goodsDetail.basicInfo.id; 规格尺寸 
    shopCarMap.color=this.data.color;
    shopCarMap.sizeid=this.data.sizeid;
    shopCarMap.colorid=this.data.colorid;
    shopCarMap.size =this.data.size;
    shopCarMap.propertyChildIds = this.data.propertyChildIds;
    shopCarMap.price = this.data.saleprice;
    shopCarMap.left = "";
    shopCarMap.active = true;
    shopCarMap.number = this.data.buynum;
    shopCarMap.storesnum=this.data.currentnum;
  
      var buyNowInfo = {};
      if (!buyNowInfo.shopNum) {
        buyNowInfo.shopNum = 0;
      }
      if (!buyNowInfo.shopList) {
        buyNowInfo.shopList = [];
      }
     
      buyNowInfo.shopList.push(shopCarMap);
     // buyNowInfo.kjId = this.data.kjId;
      return buyNowInfo;
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