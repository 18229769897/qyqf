export const appPay = (orderInfo, type) => {
	return new Promise((resolve, reject) => {
		uni.requestPayment({
			orderInfo: orderInfo,
			provider: typeMap[type],
			success: resolve,
			fail: reject
		});
	})
}
let typeMap = {
	"weixin": "wxpay",
	"wxpay": "wxpay",
	"alipay": "alipay"
}