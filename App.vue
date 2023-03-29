<script>
	import {
		checkLogin
	} from "./libs/login";
	import {
		HTTP_REQUEST_URL
	} from './config/app';
	import {
		getconfig,
		history
	} from '@/api/public.js'
	import store from "@/store"
	import appUpdate from "@/js_sdk/APPUpdate/src/index.js";
	export default {
		globalData: {
			spid: 0,
			code: 0,
			isLogin: false,
			userInfo: {},
			MyMenus: [],
			balance_func_status: 0, //余额开关
			recharge_switch: 0, // 充值开关
			store_user_min_recharge: 0, //最小充值
			yue_pay_status: 0, //余额支付开关
			alipay_open: 0, //支付宝支付开关
			routine_logo: '', //首页logo
			site_logo: '',
			site_name: '', //名称
			fid: '', //一级分类id
			uid: '',
			hide_mer_status: 0,
			member_status: 0,
			copy_command_status: 0, //是否开启自动获取剪切板内容
			arrival_notice: 0, //是否开启到货通知
			is_phone_login: 0,
			auto_arrival: 0,
			mer_location: 0,
			statusBarHeight: 0,
			mer_location: 0,
			store_street_theme: 1,
			imgColor: '',
			...uni.getStorageSync('GLOBAL_DATA') || {}
		},

		onLaunch(option) {
			// #ifdef APP-PLUS
			appUpdate();

			// 获取用户位置信息
			// uni.getLocation({
			// 	type: "gcj02",      
			// 	geocode: true,
			// 	success(data) {
			// 		store.commit("setUserAddress", {
			// 			longitude: data.longitude,
			// 			latitude: data.latitude,
			// 			province: data.address.province,
			// 			city: data.address.city,
			// 			region: data.address.district,
			// 			detail: data.address.poiName,
			// 		});
			// 	},
			// });

			// #endif
			if (store.getters.isLogin) {
				store.dispatch("USERINFO");
				store.dispatch("config")
			}
			this.globalData.statusBarHeight = uni.getSystemInfoSync().statusBarHeight + 'px';
			this.globalData.uid = this.$store.state.app.uid
			let that = this;
			// #ifdef MP
			if (HTTP_REQUEST_URL == '') {

				console.error(
					"请配置根目录下的config.js文件中的 'HTTP_REQUEST_URL'\n\n请修改开发者工具中【详情】->【AppID】改为自己的Appid\n\n请前往后台【小程序】->【小程序配置】填写自己的 appId and AppSecret"
				);
				return false;
			}
			if (option.query.hasOwnProperty('scene')) {
				switch (option.scene) {
					//扫描小程序码
					case 1047:
						console.log(option, 'val')
						let val = that.$util.getUrlParams(decodeURIComponent(option.query.scene));
						that.globalData.code = val;
						that.globalData.uid = val
						break;
						//长按图片识别小程序码
					case 1048:
						that.globalData.code = option.query.scene;
						break;
						//手机相册选取小程序码
					case 1049:
						that.globalData.code = option.query.scene;
						break;
						//直接进入小程序
					case 1001:
						that.globalData.spid = option.query.scene;
						break;
				}
			}
			// #endif
			// 获取导航高度；
			uni.getSystemInfo({
				success: function(res) {
					that.globalData.navHeight = res.statusBarHeight * (750 / res.windowWidth) + 91;
				}
			});

			// 获取配置
			getconfig().then(res => {
				uni.$emit('update', res.data)
				this.$store.commit('GLOBAL_DATA', res.data);
				this.globalData.balance_func_status = res.data.balance_func_status
				this.globalData.recharge_switch = res.data.recharge_switch
				this.globalData.routine_logo = res.data.routine_logo
				this.globalData.site_logo = res.data.site_logo
				this.globalData.login_logo = res.data.login_logo
				this.globalData.site_name = res.data.site_name
				this.globalData.store_user_min_recharge = res.data.store_user_min_recharge
				this.globalData.yue_pay_status = res.data.yue_pay_status
				this.globalData.sys_intention_agree = res.data.sys_intention_agree
				this.globalData.mer_intention_open = res.data.mer_intention_open
				this.globalData.alipay_open = res.data.alipay_open
				this.globalData.hide_mer_status = res.data.hide_mer_status
				this.globalData.mer_location = res.data.mer_location
				this.globalData.arrival_notice = res.data.procudt_increase_status
				this.globalData.auto_arrival = res.data.sys_extension_type
				this.globalData.member_status = res.data.member_status
				this.globalData.copy_command_status = res.data.copy_command_status
				this.globalData.is_phone_login = res.data.is_phone_login
				this.globalData.mer_location = res.data.mer_location
				this.globalData.store_street_theme = res.data.store_street_theme
				this.$store.commit("VIEW_COLOR", res.data.global_theme.theme)
				this.$store.commit("KEY_COLOR", '_' + res.data.global_theme.type)
				try {
					uni.setStorageSync('SUBSCRIBE_MESSAGE', res.data.tempid);
				} catch (e) {
					// error
				}
				// #ifdef H5
				this.setOpenShare(res.data);
				// #endif
			}).catch(err => {});
		},
		onShow() {
			let that = this
			// 记录H5和公众号
			if (this.$store.state.app.token) {
				// 浏览记录
				// #ifdef H5
				history({
					page: location.pathname + location.search,
				}).then(() => {});
				//#endif
			};
			// #ifndef H5
			setTimeout(() => {
				if (that.globalData.copy_command_status == 1) {
					uni.getClipboardData({
						success: function(res) {
							if (/^(\/@[1-9]{1}).*\*\//.test(res.data)) {
								that.$store.commit("PARSE_PWD", res.data)
							}
						}
					})
				}
			}, 1500)
			// #endif	
		},
		methods: {
			// 微信分享；
			setOpenShare: function(data) {
				let that = this;
				let href = location.href;
				href = href.indexOf("?") === -1 ? href + "?spid=" + this.globalData.uid : href + "&spid=" + this
					.globalData.uid;
				if (that.$wechat.isWeixin()) {
					let configAppMessage = {
						desc: data.share_info,
						title: data.share_title,
						link: href,
						imgUrl: data.share_pic
					};
					that.$wechat.wechatEvevt(["updateAppMessageShareData", "updateTimelineShareData"],
						configAppMessage);
				}
			}
		},
		onHide: function() {

		},
		watch: {
			// 记录H5和公众号
			$route(n) {
				if (this.$store.state.app.token) {
					// 浏览记录
					history({
						page: location.pathname + location.search,
					}).then(() => {});
				}
			},
		}
	}
</script>
<style lang="scss">
	@import url("/static/css/common.css");
	@import url("/static/css/common2.css");
	@import 'static/css/global.scss';
	@import "uview-ui/index.scss";
	@import "@/plugin/animate/animate.min.css";
	@import 'static/css/base.css';
	@import 'static/iconfont/iconfont.css';
	@import 'static/css/style.scss';

	view {
		box-sizing: border-box;
	}

	.bg-color-red {
		background-color: #e93323 !important;
	}

	.syspadding {
		padding-top: var(--status-bar-height);
	}

	.flex {
		display: flex;
	}

	.uni-scroll-view::-webkit-scrollbar {
		/* 隐藏滚动条，但依旧具备可以滚动的功能 */
		display: none
	}

	::-webkit-scrollbar {
		width: 0;
		height: 0;
		color: transparent;
	}

	::-moz-scrollbar {
		width: 0;
		height: 0;
		color: transparent;
	}

	.empty-txt {
		line-height: 100rpx;
		font-size: 22rpx;
		color: #999;
		text-align: center;
	}

	.product-con .conter img {
		display: block;
	}

	.open-location {
		height: 100vh;
	}

	uni-tabbar {
		bottom: 0;
	}
</style>
