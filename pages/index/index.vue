<template>
	<view>
		<view class="header">
			<view class="status-bar-24"></view>
			<view class="header-box fx a-center">
				<image src="./images/haigou.png" style="width: 96rpx;" mode="widthFix" @click="toPage(`/pages/haigou/main`,`isLogin`)"></image>
				<view class="search-box flex_1 fx a-center ml-2">
					<u-icon name="search" color="#f7343e" size="36"></u-icon>
					<input type="text" class="flex_1 fz_28 ml-2" style="color: #888;" placeholder="搜索">
				</view>
				<image src="./images/kefu.png" class="ml-2" style="width: 40rpx;" mode="widthFix" @click="toPage(`/pages/service/index`)"></image>
				<image src="./images/msg.png" style="width: 40rpx;" mode="widthFix" class="ml-2"></image>
			</view>
		</view>
		<view class="fill-box"></view>
		<swiper indicator-dots autoplay circular :current="swiperIndex" @change="swiperChange" indicator-active-color="#fff" class="banner-box mt-1">
			<swiper-item v-for="(item, index) in banner" :key="index">
				<view class="swiper-item" :class="{'active': swiperIndex == index}">
					<image :src="item.pic"></image>
				</view>
			</swiper-item>
		</swiper>

		<view class="menu-list mt-3">
			<swiper indicator-active-color="#fff" :current="swiperIndex2"  @change="swiperChange2" class="w100">
				<swiper-item v-for="item in menuList" class="fx fx-warp">
					<view class="menu-item" v-for="item2 in item" @click="skip(item2)">
						<image :src="item2.image" mode="widthFix"></image>
						<text>{{item2.text}}</text>
					</view>
				</swiper-item>
			</swiper>

			<view class="fx j-center pb-2 pt-1">
				<!-- <view class="scroll-bar-box">
					<view class="center" :style="{'transform': `translate3d(${swiperIndex2*100}%,0,0)`}"></view>
				</view> -->
			</view>

		</view>

		<!-- <view class="fx a-center mt-1" style="padding-left: 60rpx;">
			<view class="fz_32 bold">
				<image src="./images/toutiao.png" style="width: 74rpx;" mode="widthFix"></image>
			</view>
			<view class="ver-line2"></view>
			<view class="ml-2" style="color: #a6a6a6;">
				11月25日内测正式上线，抢不到也赚钱！
			</view>
		</view> -->

		<view class="floor mt-2 fx">
			<image src="./images/hgzq2.jpg" style="width: 348rpx;" mode="widthFix" @click="toPage(`/pages/haigou/main`,`isLogin`)"></image>
			<view style="margin-left: 15rpx;" class="fx fx-col flex_1">
				<image src="./images/haiquan.png" class="w100" mode="widthFix" @click="toPage(`/pages/haiquan-shop/index`,`isLogin`)"></image>
				<image src="./images/yuancdi.png" class="w100 mt-auto" mode="widthFix" @click="unopen">
				</image>
			</view>
		</view>

		<tui-dialog :buttons="buttons" :show="show" title="提示" :maskClosable="false" @close="show = false" @click="buttonTap">
			<template v-slot:content>
				检测到您未设置个人常住地址，请前往设置
			</template>
		</tui-dialog>

		<!-- APP通知 -->
		<u-modal v-model="showNotice" title="通知" confirm-text="知道了" confirm-color="#0f734f">
			<view class="notice-box">
				<scroll-view scroll-y style="height: 100%;">
					<jyf-parser :html="notification" ref="article"></jyf-parser>
				</scroll-view>
			</view>
		</u-modal>

		<!-- 登录提示 -->
		<u-modal v-model="loginTips.show" :title="loginTips.title" confirm-text="确定" confirm-color="#0f734f">
			<view class="notice-box">
				<scroll-view scroll-y style="height: 100%;">
					<jyf-parser :html="loginTips.content" ref="article"></jyf-parser>
				</scroll-view>
			</view>
		</u-modal>
	</view>
</template>

<script>
	let menuList = [
		[
			{ text: "嗨购专区", url: "/pages/haigou/main", image: require("./images/hgzq.png") },
			{ text: "拼团专区", url: "/pages/groupBuy/main", image: require("./images/ptzq.png") },
			// { text: "拼团专区", url: "", image: require("./images/ptzq.png") },
			{ text: "夺宝专区", url: "/pages/blessing/snatch/index", image: require("./images/dbzq.png") },
			{ text: "积分商城", url: "/pages/jifen/index", image: require("./images/jfsc.png") },
			// { text: "疯狂秒杀", url: "", image: require("./images/fkms.png") },
			{ text: "推荐有奖", url: "", image: require("./images/tjyj.png") },
			{ text: "绿巨人", url: "/pages/greenGiant/index", image: require("./images/ljr.png") },
			{ text: "海免GO", url: "", image: require("./images/hmzq.png") },
			{ text: "旅游", url: "/pages/lvyou/index", image: require("./images/lvyou.png") },
			{ text: "打卡", url: "/pages/users/user_sgin/index", image: require("./images/daka.png") },
			{ text: "用户必看", url: "/pages/hj-viode/index", image: require("./images/yhbk.png") },
		]
	]
	import { mapGetters } from "vuex";
	import { getProducListApi } from '@/api/store.js';
	import { getIndexData, getArticleDetails } from "@/api/api.js";
	export default {
		data() {
			return {
				menuList,
				swiperIndex2:0,
				loginTips: {
					show: false,
					title: "",
					content: ""
				},
				daPaiGoodsList: [],
				productList: [],
				hostProduct: [],
				code: "",
				notice: {},
				show: false,
				swiperIndex: 0,
				buttons: [{
					text: '确定', //按钮显示文本
					color: '#EB0909' //字体颜色
				}],
				banner: [],
				showNotice: false,
				notification: "",
				searchBoxIsFixed: false,
				statusBarHeight: 0,
				height: uni.upx2px(442),
			}
		},

		onPageScroll(e) {
			this.$u.throttle(this.handlerPageScroll(e.scrollTop), 60)
		},

		onLoad() {
			this.statusBarHeight = uni.getSystemInfoSync().statusBarHeight;
			this.getHomeConfig();
			setTimeout(async () => {
				// 获取登录提示
				if (this.$store.getters.isLogin) {
					try {
						let { data } = await getArticleDetails(155);
						this.loginTips = {
							show: this.$env.isProd,
							title: data.title,
							content: data.content.content
						}
					} catch (e) {
						//TODO handle the exception
					}
				}
			}, 600)
		},
		onShow() {
			setTimeout(async () => {
				if (this.$store.getters.isLogin) {
					if (this.$store.getters.userInfo.uid) {
						this.isSetPayPwd()
						if (!this.$store.getters.userInfo.province) {
							this.show = true;
						}
					} else {
						(async () => {
							await this.delay_user();
							this.isSetPayPwd()
							if (!this.$store.getters.userInfo.province) {
								this.show = true;
							}
						})()
					}
				}
				if (!this.$Cache.has("isUpdateHuanJiApp") || !Number(this.$Cache.get("isUpdateHuanJiApp"))) {
					this.getAppNotice();
				}
			}, 1000)
		},


		computed: {
			...mapGetters(["userAddress"])
		},
		methods: {
			skip(item) {
				if (item.url) {
					this.toPage(item.url, `isLogin`)
				} else {
					return this.$msg.fail("暂未开放");
				}
			},
			handlerPageScroll(scrollTop) {
				if (scrollTop > this.height + this.statusBarHeight - 40) {
					this.searchBoxIsFixed = true;
				} else {
					this.searchBoxIsFixed = false;
				}
			},


			unopen() {
				return this.$msg.fail("暂未开放");
			},

			/**
			 * 获取首页配置数据
			 */
			async getHomeConfig() {
				let { data: { banner } } = await getIndexData();
				this.banner = banner;
			},

			/**
			 * 获取App公告
			 */
			async getAppNotice() {
				try {
					let { data } = await getArticleDetails(154);
					let content = data.content.content;
					let flag = data.synopsis;
					console.log(this.$Cache.get("huanji_showModule"));
					if (!this.$Cache.has("huanji_showModule") || this.$Cache.get("huanji_showModule") != flag) {
						this.showNotice = true;
						this.notification = content;
						this.$Cache.set("huanji_showModule", flag);
					}
				} catch (e) {
					console.log(e);
				}
			},

			buttonTap() {
				this.toPage(`/pages/user/setAddr`);
				setTimeout(() => {
					this.show = false;
				}, 100);
			},

			swiperChange(e) {
				this.swiperIndex = e.detail.current;
			},
			swiperChange2(e) {
				this.swiperIndex2 = e.detail.current;
			},
		}
	}
</script>

<style>
	page {
		background-color: #f5f5f5 !important;
		padding-bottom: 30rpx;
	}
</style>
<style scoped lang="scss">
	.header {
		width: 750rpx;
		height: 224rpx;
		position: absolute;

		.header-box {
			width: 750rpx;
			height: 80rpx;
			padding: 0 24rpx;

			.search-box {
				height: 58rpx;
				background-color: #fff;
				border-radius: 18rpx;
				padding: 0 26rpx;
			}
		}
	}

	.fill-box {
		/* #ifdef APP-PLUS */
		height: calc(80rpx + var(--status-bar-height));
		/* #endif */

		/* #ifdef H5 */
		height: calc(80rpx + 24px);
		/* #endif */
	}

	.banner-box {
		width: 702rpx;
		height: 702rpx;
		margin-left: auto;
		margin-right: auto;

		.swiper-item {
			height: 100%;
			overflow: hidden;
			transform: scale(0.94);
			transition: all 0.2s ease-in 0s;
			position: relative;

			&.active {
				transform: none;
			}

			image {
				width: 100%;
				height: 100%;
				border-radius: 14rpx;
			}
		}
	}

	.text-green {
		color: #39b54a;
	}

	.ver-line2 {
		width: 2rpx;
		background-color: #afe1b6;
		height: 60rpx;
		margin-bottom: 6rpx;
		margin-left: 6rpx;
	}

	.tips {
		height: 50rpx;
		background-image: linear-gradient(to right, #f8f8f8, #fefefe, #f8f8f8);
		padding: 0 70rpx;

		.tips-item {
			display: flex;
			align-items: center;

			view {
				width: 40rpx;
				height: 40rpx;
				text-align: center;
				line-height: 37rpx;
				color: #39b54a;
				font-size: 27rpx;
				font-weight: bold;
				border: 1rpx solid;
				border-radius: 50%;
			}

			text {
				margin-left: 12rpx;
				font-size: 26rpx;
				color: #9c9c9c;
			}
		}
	}

	.floor {
		padding: 0 24rpx;
	}

	.menu-list {
		background-color: #fff;
		border-radius: 20rpx;
		width: 703rpx;
		margin-left: auto;
		margin-right: auto;
		padding: 30rpx 0 0rpx 0;
	}

	.menu-item {
		width: 20%;
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-bottom: 36rpx;

		image {
			width: 50%;
		}

		text {
			font-size: 26rpx;
			font-family: "Microsoft YaHei", 微软雅黑;
			color: #222222;
			margin-top: 14rpx;
		}
	}

	.notice-box {
		padding: 24rpx;
		line-height: 1.7;
		font-size: 16px;
		height: 50vh;
	}

	.scroll-bar-box {
		width: 80rpx;
		border-radius: 100px;
		background-color: #e4e4e4;
		height: 12rpx;

		.center {
			width: 50%;
			height: 100%;
			border-radius: 100px;
			background-color: #a27e66;
			transition: all 0.2s ease-in 0s;
		}
	}
</style>
