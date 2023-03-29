const platform = uni.getSystemInfoSync().platform;
export default {
	succ(title, fn) {
		uni.showToast({
			title,
			icon: title.length > 7 ? "none" : "success"
		})
		if (fn) {
			setTimeout(() => {
				fn()
			}, 500)
		}
	},
	fail(title) {
		uni.showToast({
			title,
			icon: "none"
		})
	},
	alert(text, title = "提示") {
		return new Promise(async (resolve) => {
			let [, _] = await uni.showModal({
				title,
				content: text,
				// #ifdef APP-PLUS
				cancelText: platform == "android" ? "确定" : "取消",
				confirmText: platform == "android" ? "取消" : "确定"
				// #endif
			})
			// #ifdef APP
			if ((platform == "android" && _.cancel) || (platform == "ios" && _.confirm)) {
				// 选择确定
				resolve(true)
			} else {
				// 选择取消
				resolve(false)
			}
			// #endif
			
			// #ifndef APP-PLUS
			if (_.confirm) {
				// 选择确定
				resolve(true)
			} else {
				// 选择取消
				resolve(false)
			}
			// #endif
		})
	}
}
