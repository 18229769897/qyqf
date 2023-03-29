const cache = {
	get(key) {
		let storage = uni.getStorageSync(key);
		if (!storage) return null;
		if (!storage.expires) {
			return storage.value;
		} else {
			if (Date.now() <= storage.expires) {
				return storage.value;
			} else {
				this.remove(key);
				return null;
			}
		}
	},
	set(key, value, options = {}) {
		if (!options.expires) {
			return uni.setStorageSync(key, { value });
		} else {
			let expires;
			options.expires = options.expires.toString();
			if (Number(options.expires) <= 360) {
				expires = Date.now() + Number(options.expires) * 24 * 3600 * 1000;
			} else if (options.expires.length >= 10 && options.expires.length < 13) {
				expires = Number(options.expires) * 1000; // 秒时间戳
			} else if (options.expires.length >= 13) {
				expires = Number(options.expires);
			}
			return uni.setStorageSync(key, { value, expires });
		}
	},
	has(key) {
		return !!uni.getStorageSync(key);
	},
	remove(key) {
		return uni.removeStorageSync(key);
	}
}
export default cache;