import Vue from 'vue'
import store from "@/store/index.js"
import { appPay } from './pay.js'
import cache from "./cache2"
import { interce, delay_user, isSetPayPwd } from "./auth.js"

const platform = uni.getSystemInfoSync().platform;

let statusBarHeight = uni.getSystemInfoSync().statusBarHeight;
Vue.prototype.statusBarHeight = statusBarHeight;

// app支付
Vue.prototype.appPay = appPay;

// 快捷消息方法
import messages from '@/utils/message.js'
Vue.prototype.$msg = messages;

// 挂载全局缓存对象
Vue.prototype.$C = cache;

// 挂载拦截器
Vue.prototype.interce = interce;
Vue.prototype.delay_user = delay_user;
Vue.prototype.isSetPayPwd = isSetPayPwd;

// 页面跳转
Vue.prototype.toPage = async (url, ...checkType) => {
	checkType = checkType.filter(item => item !== undefined);
	if (checkType.length == 0) {
		uni.navigateTo({
			url,
		})
	} else {
		try {
			await interce(...checkType);
			uni.navigateTo({
				url,
			})
		} catch (e) {

		}
	}
}

Vue.prototype.toTabPage = (url) => {
	uni.switchTab({
		url,
	})
}

Vue.prototype.back = (_, n = 1) => {
	uni.navigateBack({
		delta: n
	})
}


// 设置查询参数，用法：http://url?params=${setParams(obj)} 
Vue.prototype.setParams = (queryObj) => {
	return encodeURIComponent(JSON.stringify(queryObj))
}

// 获取查询参数，用法：let query = this.getParams(options.params)
Vue.prototype.getParams = (target) => {
	return JSON.parse(decodeURIComponent(target));
}


// 文件上传
Vue.prototype.uploadFile = (options) => {
	let url = filePath.url;
	let field = options.field;
	if (typeof filePath == "string") {
		return new Promise((resolve, reject) => {
			uni.uploadFile({
				url,
				filePath,
				name: field,
				success(res) {
					let data = JSON.parse(res.data)
					if (data.status == 200) {
						resolve(data)
					} else {
						return uni.showToast({
							title: data.message || data || data.msg,
							icon: "none"
						})
					}
				},
				fail(err) {
					console.log(err);
					return reject(err)
				}
			});
		})
	} else if (Array.isArray(filePath)) {
		let promises = [];
		filePath.forEach((item) => {
			let promise = new Promise((resolve, reject) => {
				uni.uploadFile({
					url,
					filePath: item,
					name: field,
					success(res) {
						let data = JSON.parse(res.data)
						if (data.status == 200) {
							resolve(data)
						} else {
							return uni.showToast({
								title: data.message || data || data.msg,
								icon: "none"
							})
						}
					},
					fail(err) {
						console.log(err);
						return reject(err)
					}
				});
			})
			promises.push(promise);
		})
		return Promise.all(promises)
	}
}


// 获取当前页面路径
Vue.prototype.getPagePath = (isIncludeQs = true) => {
	const objStringify = (obj) => {
		if (Object.keys(obj).length == 0) {
			return ""
		}
		let arr = [];
		for (const key in obj) {
			arr.push(`${key}=${obj[key]}`);
		}
		return "?" + arr.join("&");
	};
	let pages = getCurrentPages();
	let page = pages[pages.length - 1];
	let url = isIncludeQs ? ('/' + page.route + objStringify(page.options)) : ('/' + page.route);
	return url;
}


// 环境变量
uni.$env = Vue.prototype.$env = {
	isDev: process.env.NODE_ENV == "development",
	isProd: process.env.NODE_ENV == "production",
	isIos: platform == "ios",
	isAndroid: platform == "android",
}
