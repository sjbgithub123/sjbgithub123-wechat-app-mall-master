# 微信小程序实现移动端商城

## 说明
```

>  如果对您有帮助，您可以点右上角 "Star&fork" 支持一下 谢谢！ ^_^

>  博客地址:暂无

>  配置HTTPS：https://vircom.top/

>  服务端:https://github.com/sjbgithub123/sjbgithub123-wechat-app-mall-master

>  提示小程序大于2M可以把image文件夹删除
```

### 项目截图:
![Image text](https://vircom.top/img/screenshot/index-home.jpg)

![Image text](https://vircom.top/img/screenshot/index-classify.jpg)
<img src="https://vircom.top/img/screenshot/index-classify-animation.jpg" width="320px" style="display:inline;">
<img src="https://vircom.top/img/screenshot/details-order.jpg" width="320px" style="display:inline;">

<img src="https://vircom.top/img/screenshot/wechat-address.jpg" width="320px" style="display:inline;">
<img src="https://vircom.top/img/screenshot/add-address.jpg" width="320px" style="display:inline;">
<img src="https://vircom.top/img/screenshot/wechat-pay.jpg" width="320px" style="display:inline;">
![Image text](https://vircom.top/img/screenshot/index-cart.jpg)
<img src="https://vircom.top/img/screenshot/index-cart-full.jpg" width="320px" style="display:inline;">
![Image text](https://vircom.top/img/screenshot/Personal-Center.jpg)
<img src="https://vircom.top/img/screenshot/order-index.jpg" width="320px" style="display:inline;">
<img src="https://vircom.top/img/screenshot/live-index.png" width="320px" style="display:inline;">
<img src="https://vircom.top/img/screenshot/Broadcast in live broadcasting room.png" width="320px" style="display:inline;">


## 项目布局
```

├─common
├─dist
│  └─packages
│      └─@minui
│          ├─wxc-counter
│          │  └─dist
│          ├─wxc-icon
│          │  └─dist
│          ├─wxc-label
│          │  └─dist
│          ├─wxc-loadmore
│          │  └─dist
│          └─wxc-price
│              └─dist
├─image
├─images   // 公共图片
├─lib  // 公共文件
├─pages   // 页面
│  ├─bindPhone //暂未用上
│  ├─brand //暂未用上
│  ├─cart //暂未用上
│  ├─coupon // 优惠券
│  ├─details  //  商品详情 我的订单
│  ├─index  // 首页 //分类 // 购物车 // 个人中心    // 我的地址  // 添加地址
│  ├─list              // 商品列表
│  ├─live //小程序直播
│  ├─order 订单管理
│  ├─orderDetails //暂未用上
│  ├─pic //暂未用上
│  ├─recharge //暂未用上，充值
│  └─user //暂未用上
├─templates
│  ├─template-cart
│  └─wxParse
└─utils
|-- README.md            // 说明
```

## 开发环境：
调试基础库 2.0.4
