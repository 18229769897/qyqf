export default {
	token: state => state.app.token,
	isLogin: state => !!state.app.token,
	backgroundColor: state => state.app.backgroundColor,
	globalData: state => state.app.globalData,
	userInfo: state => state.app.userInfo || {},
	uid: state => state.app.uid,
	homeActive: state => state.app.homeActive,
	home: state => state.app.home,
	copyPwd: state => state.app.copyPwd,
	viewColor: state => state.app.viewColor,
	keyColor: state => state.app.keyColor,
	appConfig: state => state.app.appConfig,
	userAddress: state => state.app.userAddress,
	payTypeMap: () => ({
		0: "余额支付",
		1: "微信支付",
		2: "微信支付",
		3: "微信支付",
		4: "支付宝支付",
		5: "支付宝支付",
		6: "微信支付",
		7: "积分支付",
		8: "商品积分支付",
		9: "余额、商品积分混合支付",
		10: "嗨豆支付",
		11: "嗨券支付",
		12:"余额、嗨票混合支付"
	}),
	orderTypeMap: () => ({
		0: "团购订单",
		1: "大牌专区订单",
		3: "消费订单",
		4: "嗨购订单",
		10: "嗨券订单",
		11: "旅游专区订单"
	})
};
