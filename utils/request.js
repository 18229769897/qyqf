import {
	HTTP_REQUEST_URL,
	HEADER,
	TOKENNAME
} from '@/config/app';
import {
	checkLogin
} from '../libs/login';
import store from '../store';

import Cache from "./cache"

import Message from "./message"

function toLogin() {
	store.commit("LOGOUT");
	uni.showToast({
		title: '请登录',
		icon: 'none',
		duration: 1000
	});
}

/**
 * 发送请求
 */
function baseRequest(url, method, data = {}, opt = { noAuth: false, noVerify: false }) {

	let Url = HTTP_REQUEST_URL,
		header = HEADER;

	if (!opt.noAuth) {
		//登录过期自动登录
		if (!store.state.app.token && !checkLogin()) {
			toLogin();
			return Promise.reject({
				msg: '未登录'
			});
		}
	}

	if (store.state.app.token) {
		if (url.indexOf("javaproxy") > -1) {
			// java服务器
			data.uid = Cache.get("UID");
		} else {
			// php服务器
			header[TOKENNAME] = 'Bearer ' + store.state.app.token;
		}
	}

	if (Object.keys(data).length) {
		let arr = Object.values(data);
		let str = "";
		let flag = arr.some(item => {
			if (typeof item == "string") {
				if (item.toLowerCase().indexOf("script") > -1) {
					str = "script"
					return true
				}
				if (item.toLowerCase().indexOf("<") > -1) {
					str = "<"
					return true
				}
				if (item.toLowerCase().indexOf(">") > -1) {
					str = ">"
					return true
				}
			} else {
				return false
			}
		})
		if (flag) {
			Message.fail("提交数据包含非法内容:" + str);
			return Promise.reject();
		}
	}


	if (opt.loading) {
		uni.showLoading({
			title: opt.text || "加载中...",
			mask: true
		});
		var start = Date.now();
	}
	return new Promise((reslove, reject) => {
		uni.request({
			url: url.indexOf("javaproxy") > -1 ? url : Url + '/api/' + url,
			method: method || 'GET',
			header: header,
			data: data || {},
			success: (res) => {
				if (opt.noVerify)
					reslove(res.data, res);
				else if (res.data.status == 200)
					reslove(res.data, res);
				else if (res.data.status == 40000) {
					setTimeout(() => {
						store.commit("LOGOUT");
						uni.reLaunch({
							url: "/pages/users/login/index"
						})
					}, 200)
					reject("登录已过期");
				} else if ([410000, 410001, 410002, 40000].indexOf(res.data.status) !== -1) {
					toLogin();
					reject(res.data);
				} else if (res.data.status == 501) {
					uni.reLaunch({
						url: '/pages/error/index'
					})
					reject(res.data);
				} else
					reject(res.data.message || '系统错误');
			},
			fail: (message) => {
				reject('请求失败');
			},

			complete() {
				if (opt.loading) {
					if (Date.now() - start >= 300) {
						uni.hideLoading();
					} else {
						setTimeout(() => {
							uni.hideLoading();
						}, 300);
					}
				}
				if (opt.refresh) {
					setTimeout(() => {
						uni.stopPullDownRefresh();
					}, 300)
				}
			}
		})
	});
}

const request = {};

['options', 'get', 'post', 'put', 'head', 'delete', 'trace', 'connect'].forEach((method) => {
	request[method] = (api, data, opt) => baseRequest(api, method, data, opt || {})
});



export default request;
