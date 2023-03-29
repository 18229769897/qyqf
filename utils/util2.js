function forEach(array, iteratee) {
	let index = -1;
	const length = array.length;
	while (++index < length) {
		iteratee(array[index], index);
	}
	return array;
}

/**
 * 深拷贝
 */
export const deepClone = (target, map = new WeakMap()) => {
	if (typeof target === "object" && target !== null) {
		const isArray = Array.isArray(target);
		let cloneTarget = isArray ? [] : {};

		if (map.get(target)) {
			return map.get(target);
		}
		map.set(target, cloneTarget);
		const keys = isArray ? undefined : Object.keys(target);
		forEach(keys || target, (value, key) => {
			if (keys) {
				key = value;
			}
			cloneTarget[key] = deepClone(target[key], map);
		});
		return cloneTarget;
	} else {
		return target;
	}
}

/**
 * 将图片下载至相册
 */
export const downLoadImage = async (url) => {
	try {
		if (/^https?/.test(url)) {
			let [, { tempFilePath }] = await uni.downloadFile({ url });
			url = tempFilePath;
		}
		let [, res] = await uni.saveImageToPhotosAlbum({
			filePath: url
		})
		uni.showToast({
			title: "图片下载成功",
		})
	} catch (e) {
		uni.showToast({
			title: e,
			icon: "none"
		})
		console.log(e);
	}
}


/**
 * 检查app版本是否有更新
 */
export const versionCheck = (web, local) => {
	let isUpdate = false;
	let webVer = web.split(".").map(item => Number(item)); // 线上版本数组形式
	let localVer = local.split(".").map(item => Number(item)); // 本地版本数组形式
	if (webVer[0] > localVer[0]) {
		isUpdate = true;
	} else if (webVer[0] == localVer[0]) {
		if (webVer[1] > localVer[1]) {
			isUpdate = true;
		} else if (webVer[1] == localVer[1]) {
			if (webVer[2] > localVer[2]) {
				isUpdate = true;
			}
		}
	}
	return isUpdate;
}

export const uploadFile = (options) => {
	let { url, filePath, name, header = {}, formData = {} } = options;
	if (typeof filePath == "string") {
		return new Promise((resolve, reject) => {
			uni.uploadFile({
				url,
				filePath,
				name,
				header,
				formData,
				success(res) {
					let data = JSON.parse(res.data)
					if (data.status == 200) {
						resolve(data)
					} else {
						return uni.showToast({
							title: data.message || data.msg,
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
					name,
					header,
					formData,
					success(res) {
						let data = JSON.parse(res.data)
						if (data.status == 200) {
							resolve(data)
						} else {
							return uni.showToast({
								title: data.message || data.msg,
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


/**
 * 生成随机码
 */
export const createRandomCode = (len) => {
	let result = "";
	const chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ+-";
	for (var i = len; i > 0; --i) {
		result += chars[Math.floor(Math.random() * chars.length)];
	}
	return result;
}


/**
 * 返回对象子集，传入不需要的属性
 */
export const pickObj = function(obj, ...attrs) {
	const newObj = {};
	const arr = Object.keys(obj).filter((item) => !attrs.includes(item));
	for (let key of arr) {
		newObj[key] = obj[key];
	}
	return newObj;
};


/**
 * 生成a~b之间的随机数
 */
export const createRandomNum = (a, b) => {
	let res = Math.floor(Math.random() * (b - a) + a);
	return res;
}

/**
 *复制文本
 */
export function setClipboardData(data) {
	return new Promise((success, fail) => {
		// #ifndef H5
		uni.setClipboardData({ data, success, fail })
		// #endif

		// #ifdef H5
		const textarea = document.createElement("textarea");
		data = data.toString();
		textarea.value = data;
		textarea.readOnly = true;
		document.body.appendChild(textarea);
		textarea.select();
		textarea.setSelectionRange(0, data.length);
		document.execCommand("copy");
		textarea.remove();
		success(data);
		// #endif
	});
}


/**
 * 查询字符串转对象
 */
export const searchToObj = (queryString) => {
	var obj = {};
	queryString.replace(/([^?&=]+)=([^&]+)/g, (_, k, v) => {
		obj[k] = v;
	});
	return obj;
};


/**
 * 对象序列化
 */
export const objStringify = (obj) => {
	if (Object.keys(obj).length == 0) {
		return ""
	}
	let arr = [];
	for (const key in obj) {
		arr.push(`${key}=${obj[key]}`);
	}
	return arr.join("&");
};


/**
 * 迭代数组，并返回一个新数组，fn函数返回的值将作为总返回值的每一项
 */
export const transform = (arr, fn) => {
	return arr.reduce((ininVal, item, index) => {
		let res = fn(item, index);
		if (res !== undefined) {
			ininVal.push(res)
		}
		return ininVal;
	}, [])
}
