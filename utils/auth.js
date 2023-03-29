import Cache from "./cache.js";
import store from "@/store"
const commPages = {
	"login": "/pages/users/login/index",
	"realName": "/pages/user/autonyms"
}

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
export const toLogin = () => {
	let pages = getCurrentPages();
	let page = pages[pages.length - 1];
	let url = '/' + page.route + objStringify(page.options);
	Cache.set("LOGIN_BACK_URL", url);
	uni.navigateTo({
		url: commPages.login
	})
}


/**
 * 拦截器，用于对登录、实名等状态进行鉴权
 */
export const interce = (...checkType) => {
	return new Promise(async (resolve, reject) => {
		let promises = checkType.map(item => eval(item + '()'));
		try {
			await Promise.all(promises);
			resolve();
		} catch (e) {
			reject()
		}
	})
}

/**
 * 验证用户是否实名认证
 */
export const isRealName = () => {
	return new Promise(async (resolve, reject) => {
		// #ifdef H5
		await delay_user();
		// #endif
		if (!store.getters.userInfo.is_reals) {
			let [_, a] = await uni.showModal({
				title: '提示',
				content: "您未实名，请前往前往实名认证",
				showCancel: false
			})
			if (a.confirm) {
				uni.navigateTo({
					url: commPages.realName
				})
				reject();
			}
		} else {
			resolve();
		}
	})
}

/**
 * 验证用户是否登录
 */
export const isLogin = () => {
	return new Promise(async (resolve, reject) => {
		if (store.getters.isLogin) {
			resolve();
		} else {
			reject();
			return uni.reLaunch({
				url: "/pages/users/login/index"
			})
		}
	})
}

/**
 * 等待userInfo初始化
 */
export const delay_user = () => {
	return new Promise((resovle, reject) => {
		let timer = null;
		var start = Date.now();

		function fun() {
			if (store.getters.userInfo.uid) {
				timer && clearTimeout(timer);
				resovle();
			} else {
				// 最多等待30s，30s后若userInfo如果还没有值，则认为程序出现异常
				if (Date.now() - start < 1000 * 30) {
					timer = setTimeout(() => {
						fun()
					}, 200)
				} else {
					timer && clearTimeout(timer);
					reject();
				}
			}
		}
		fun();
	})
}

/**
 * 判断用户是否设置交易密码
 */
export const isSetPayPwd = () => {
	return new Promise(async (resolve, reject) => {
		if (!store.getters.userInfo.pay_pwd) {
			let [_, a] = await uni.showModal({
				title: '提示',
				content: "您未设置交易密码，请前往前往设置",
				showCancel: false
			})
			if (a.confirm) {
				uni.navigateTo({
					url: "/pages/user/setPayPwd"
				})
				reject();
			}
		} else {
			resolve();
		}
	})
}
