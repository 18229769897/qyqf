<template>
	<view class="clear page-box">
		<div class="status-bar-24"></div>
		<view class="flex align-center justify-center type-box" style="position: relative;z-index: 1;">
			<view :class="{'active':index==0}" @click="index=0">商城</view>
			<view class="ml-2" :class="{'active':index==1}" @click="index=1">本地</view>
		</view>
		<view class="bg-box fx fx-col fx-end">
			<view class="arc-box"></view>
		</view>
		<view class="suyuan-code-box flex align-center realtive">
			<uni-icons type="search" size="20" color="#999999"></uni-icons>
			<input type="text" v-model="code" style="color: #888888;" placeholder="搜索商品" placeholder-style="font-size:28rpx;color:#999999">
		</view>
		<swiper class="swiper-box" indicator-dots autoplay :current="swiperIndex" @change="swiperChange" indicator-active-color="#0f734f" circular>
			<swiper-item v-for="(item, index) in banner" :key="index">
				<view class="swiper-item fx a-center" :class="{on: swiperIndex == index}">
					<image class="w100 h100" :src="item.pic" style="border-radius: 12rpx;"></image>
				</view>
			</swiper-item>
		</swiper>
		
		<view class="flex justify-between" style="padding: 30rpx 28rpx;">
			<image src="./images/tuangou.png" style="width: 104rpx;" mode="widthFix" @click="toPage(`/pages/groupBuy/main`)"></image>
			<image src="./images/jiankang.png" style="width: 104rpx;" mode="widthFix" @click="toPage(`/pages/jiankang/index`)"></image>
			<image src="./images/dunbao.png" style="width: 104rpx;" @click="toDuobao" mode="widthFix"></image>
			<image src="./images/juanzeng.png" style="width: 104rpx;" mode="widthFix" @click="toPage(`/pages/donate/index`)"></image>
			<image src="./images/shiti.png" style="width: 104rpx;" mode="widthFix" @click="toPage(`/pages/consumption/index`)"></image>
		</view>

		<view class="fx justify-center" @click="toPage(`/pages/agency/index`,`isLogin`,`isRealName`)">
			<image src="./images/dailis.png" style="width: 710rpx;" mode="widthFix"></image>
		</view>

		<view class="fx justify-center py-2" @click="toPage(`/pages/greenGiant/index`,`isLogin`,`isRealName`)">
			<image src="@/static/images/lvjuren.png" class="round" style="width: 710rpx;" mode="widthFix"></image>
		</view>

		<view class="tg-box px-2 py-2" @click="toPage(`/pages/jifen/index`)">
			<view class="fz_30 bold">积分兑换专区</view>
			<scroll-view scroll-x class="w100" style="margin-top: 14rpx;">
				<view class="fx a-center">
					<template v-for="item in daPaiGoodsList">
						<view class="item">
							<image :src="item.image" style="width: 120rpx;height: 120rpx;border-radius: 12rpx;"></image>
							<view style="color: #fe3661;" class="bold">
								<text class="fz_24">￥</text>
								<text class="fz_26">{{item.price}}</text>
							</view>
						</view>
					</template>
				</view>
			</scroll-view>
		</view>
		<!-- <view class="fx fx-center mb-1">
			<image src="@/static/images/jk-bg.png" @click="toPage(`/pages/jiankang/index`)" style="width: 660rpx;" mode="widthFix"></image>
		</view> -->
		<view class="main flex justify-center">
			<recommend :hostProduct="hostProduct" :indexP="true"></recommend>
			<view class="flex-sub" style="padding: 60rpx 0;" v-if="noData">
				<view class='noCommodity'>
					<view class='pictrue'>
						<image src='/static/images/noShopper.png'></image>
					</view>
				</view>
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
	import paging from '@/mixins/paging.js';
	import { getProducListApi } from '@/api/store.js';
	import { getIndexData, getArticleDetails } from "@/api/api.js";
	import recommend from '@/components/recommend';
	export default {
		data() {
			return {
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
				index: 0,
				banner: [],
				showNotice: false,
				notification: "",
			}
		},
		components: {
			recommend
		},
		mixins: [paging],
		onLoad() {
			this.get_host_product();
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
			this.getDaPaiGoodsList();
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
		methods: {
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

			toDuobao() {
				// return this.$msg.fail("暂未开放");
				this.toPage("/pages/blessing/snatch/index");
			},

			// 获取商品列表
			async getDaPaiGoodsList() {
				let params = {
					page: 1,
					limit: 10,
					product_type: 1
				}
				try {
					let { data: { list } } = await getProducListApi(params);
					this.daPaiGoodsList = list;
				} catch (e) {
					return this.$msg.fail(e);
				} finally {
					this.lockLoad = false;
				}
			},

			/**
			 * 获取首页配置数据
			 */
			async getHomeConfig() {
				let { data: { banner } } = await getIndexData();
				this.banner = banner;
			},

			buttonTap() {
				this.toPage(`/pages/user/setAddr`);
				setTimeout(() => {
					this.show = false;
				}, 100);
			},
			async get_host_product(options = {}) {
				let option = {
					loading: true,
					first: true,
					...options,
				}
				if (option.first) {
					this.page = 1;
					this.loadState = 0;
				}
				if (this.lockLoad || this.loadState == 2) return;
				this.lockLoad = true;
				try {
					let params = {
						page: this.page,
						limit: this.limit,
						block_id: 1
					}
					let { data: { list } } = await getProducListApi(params);
					this.setList("hostProduct", list, option.first);
				} catch (e) {

				} finally {
					this.lockLoad = false;
				}
			},
			swiperChange(e) {
				let index = e.detail.current;
				this.swiperIndex = index;
			},
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #fff !important;
	}

	.page-box {}

	.bg-box {
		width: 750rpx;
		height: 330rpx;
		background-image: linear-gradient(to right, #489A75, #5EBD81);
		background-size: 100%;
		background-repeat: no-repeat;
		position: absolute;
		z-index: 0;

		.arc-box {
			width: 100%;
			height: 60rpx;
			margin-bottom: -2rpx;
			background-color: #FFFFFF;
			border-top-left-radius: 40rpx 66rpx;
			border-top-right-radius: 40rpx 66rpx;
		}
	}



	.suyuan-code-box {
		margin: 0 20rpx;
		margin-bottom: 20rpx;
		background-color: #FFFFFF;
		border-radius: 100rpx;
		padding: 12rpx 30rpx;
	}

	.notify-box {
		padding: 0rpx 28rpx 20rpx;
	}

	.ver-line {
		height: 28rpx;
		background-color: #666666;
		width: 1px;
		margin: 0 30rpx 0 12rpx;
	}

	.main {
		padding-top: 20rpx;
		background-color: #fff;
	}

	.swiper-box {
		width: 710rpx;
		height: 330rpx;
		margin-left: auto;
		margin-right: auto;

		.swiper-item {
			height: 100%;
			border-radius: 14rpx;
			overflow: hidden;
			background-color: rgba(255, 255, 255, 0.5);
			transform: scale(0.92);
			transition: all 0.2s ease-in 0s;
			position: relative;

			&.on {
				transform: none;
			}
		}
	}

	.tg-box {
		width: 692rpx;
		height: 253rpx;
		background-image: url("images/tg-box-bg.png");
		background-size: cover;
		margin-left: auto;
		margin-right: auto;
		margin-top: 20rpx;
		margin-bottom: 10rpx;
	}

	.notice-box {
		padding: 24rpx;
		line-height: 1.7;
		font-size: 16px;
		height: 45vh;
	}

	.item+.item {
		margin-left: 24rpx;
	}

	.type-box {
		margin-bottom: 20rpx;
	}

	.type-box view {
		font-size: 34rpx;
		line-height: 50rpx;
		width: 120rpx;
		text-align: center;
		border-radius: 100px;
		color: #fff;
	}

	.type-box view.active {
		background-color: rgba(255, 255, 255, 0.3);
	}
</style>
