<template>
	<view class="page-box">
		<template>
			<view class="head">
				<!-- 620rpx + statusBarHeight -->
				<view class="expect-box flex flex-col justify-end align-center">
					<!-- #ifdef H5 -->
					<view style="height: 24px;"></view>
					<!-- #endif -->
					<view class="w100 mb-auto">
						<headBar3 title="团购专区" white>
							<view slot="center" class="text-white fz_32">{{pageTitle}}</view>
							<view slot="right" class="record-icon" @click="toPage(`/pages/groupBuy/order-list`)"></view>
						</headBar3>
					</view>

					<view class="w100" style="height: 70rpx; padding: 0 30rpx;margin-bottom: 10rpx;">
						<u-search :show-action="false" clearabled v-model="keyword" @search="getGoodsList" @clear="getGoodsList"></u-search>
					</view>

					<view class="suspend-box" v-if="expectList.length">
						<view class="flex justify-between align-center suspend-content h_100">
							<view class="start-box flex flex-col align-center justify-between" :class="{'active':activeExpectStatus=='进行中'}">
								<text>{{activeExpect.start_time | formatTime('HH:mm') }}</text>
								<text>{{activeExpect.start_time | formatTime('MM月DD日') }}</text>
								<text>开启时间</text>
							</view>
							<u-circle-progress v-if="activeExpectStatus!='进行中'" active-color="#0f734f" width="170" :percent="parseInt(Number(activeExpect.rate)*100)" duration="300">
								<view class="flex-col flex-center" style="color: #0f734f;">
									<view>{{activeExpectStatus}}</view>
								</view>
							</u-circle-progress>
							<view class="rotate-box" v-else>
								<view class="box"></view>
								<text class="fz_26">进行中</text>
							</view>
							<view class="end-box flex flex-col align-center justify-between">
								<text>{{activeExpect.end_time | formatTime('HH:mm')}}</text>
								<text>{{activeExpect.end_time | formatTime('MM月DD日')}}</text>
								<text>结束时间</text>
							</view>
						</view>
					</view>
					<view class="expect-list flex" :style="{'transform':`translate3d(${scrollLeft}rpx, 0, 0)`}" style="margin-bottom: 70rpx;width: 600rpx;width: 750rpx;">
						<template v-for="(item,index) in expectList">
							<view class="expect-item" @click="roll(index)">{{item.name}}</view>
						</template>
					</view>
				</view>

				<!-- 50px -->
				<view class="time-box flex justify-center" style="height: 50px;" v-if="expectList.length">
					<view class="flex align-center" style="margin-top: -14rpx;" v-if="activeExpectStatus=='未开始'">
						<text style="color: #949494;font-size: 30rpx;">剩余</text>
						<view style="padding: 0 12rpx;">
							<u-count-down :timestamp="parseInt((Date.parse(activeExpect.start_time)-Date.now()) / 1000)" separator-color="#0f734f" bg-color="#0f734f" color="#fff" />
						</view>
						<text style="color: #949494;font-size: 30rpx;">开始</text>
					</view>

					<view class="flex align-center" style="margin-top: -14rpx;" v-else-if="activeExpectStatus=='进行中'">
						<text style="color: #949494;font-size: 30rpx;">剩余</text>
						<view style="padding: 0 12rpx;">
							<u-count-down :timestamp="parseInt((Date.parse(activeExpect.end_time)-Date.now()) / 1000)" separator-color="#0f734f" bg-color="#0f734f" color="#fff" />
						</view>
						<text style="color: #949494;font-size: 30rpx;">结束</text>
					</view>

					<view class="flex align-center" style="margin-top: -14rpx;" v-else>
						<view class="fz_32" style="color: #888;">已结束</view>
					</view>
				</view>
			</view>
			<view class="fill-box"></view>
		</template>

		<view v-show="false">
			<view class="head2">
				<!-- 44px + statusBarHeight -->
				<headBar3 isFixed title="团购专区" white>
					<view slot="center" class="text-white fz_32">{{pageTitle}}</view>
					<view slot="right" class="record-icon" @click="toPage(`/pages/groupBuy/order-list`)"></view>
				</headBar3>
				<!-- 100rpx -->
				<view style="height: 100rpx;padding: 0 30rpx;" class="bg-white flex align-center">
					<u-search :show-action="false" clearabled v-model="keyword" @search="getGoodsList" @clear="getGoodsList"></u-search>
				</view>
			</view>
			<view class="fill-box2"></view>
		</view>

		<view class="container">
			<view class="list flex justify-between flex-wrap">
				<template v-for="item in goodsList">
					<view class="goods_item flex flex-col" @click="toDetail(item.product_id)">
						<image :src="item.image" class="w_100" mode="widthFix"></image>
						<view style="margin-top: 14rpx;">
							<view style="font-size: 28rpx;font-weight: bold;">{{item.store_name}}</view>
							<view class="fx a-end mt16">
								<view style="color:#0f734f;">
									<text style="font-size: 26rpx;padding-bottom: 4rpx;">￥</text>
									<text style="font-size: 32rpx;font-weight: bold;">{{ parseFloat(item.price).toFixed(1) }}</text>
								</view>
							</view>
						</view>
					</view>
				</template>
			</view>
			<loadMore :state="loadState" :text="loadText" color="#333" />
			<view class="flex-sub" v-if="noData">
				<view class='noCommodity'>
					<view class='pictrue'>
						<image src='/static/images/noShopper.png'></image>
					</view>
				</view>
			</view>
		</view>

		<u-modal v-model="showNotice" title="认购须知" async-close confirm-color="#0f734f" :title-style="{color: '#0f734f','font-weight': 'bold'}">
			<view class="notice-box">
				<scroll-view scroll-y style="height: 100%;">
					<jyf-parser :html="html"></jyf-parser>
				</scroll-view>
			</view>
			<view slot="confirm-button" style="height: auto;padding: 20rpx 0;">
				<u-checkbox shape="circle" active-color="#0f734f" label-size="26" size="30" v-model="checked">我已阅读并同意</u-checkbox>
				<view style="margin-top: 20rpx;" @click="close">关闭</view>
			</view>
		</u-modal>
	</view>
</template>

<script>
	import { getProductslist, getBlockListApi, getStageApi } from "@/api/store";
	import { getArticleDetails } from "@/api/api.js";
	import { mapGetters } from "vuex";
	import paging from "@/mixins/paging.js"
	import dayjs from "dayjs"

	export default {
		data() {
			return {
				checked: false,
				areaList: [],
				expectList: [],
				goodsList: [],
				area_index: 0, // 选中区索引
				expect_index: 0, // 选中期索引
				scrollLeft: 0,
				currLeft: 0, // 当前已滚动距离
				html: "",
				showNotice: false,
				keyword: "",
				limit: 16,
				pageTitle: ""
			}
		},
		mixins: [paging],
		onLoad(e) {
			this.pageTitle = e.title;
			this.area_index = e.area_index || 0;
			this.expect_index = e.expect_index || 0;
			this.getBlockList(true);
		},
		onPullDownRefresh() {
			this.getBlockList(true);
			setTimeout(() => {
				uni.stopPullDownRefresh()
			}, 600)
		},

		filters: {
			formatTime(data, exp) {
				return dayjs(data).format(exp)
			}
		},
		computed: {
			...mapGetters(['isLogin', "userInfo"]),

			// 选中期
			activeExpect() {
				return this.expectList[this.expect_index];
			},

			// 选中期状态
			activeExpectStatus() {
				let res = "";
				let activeExpect = this.expectList[this.expect_index];
				if (activeExpect.start_time.indexOf("+08") == -1) {
					activeExpect.start_time = activeExpect.start_time.replace(" ", "T") + "+08:00";
					activeExpect.end_time = activeExpect.end_time.replace(" ", "T") + "+08:00";
				}
				let startTime = Date.parse(activeExpect.start_time);
				let endTime = Date.parse(activeExpect.end_time);
				let currentTime = Date.now();

				if (currentTime < startTime) {
					res = "未开始"
				} else if (currentTime >= startTime && currentTime <= endTime) {
					res = "进行中"
				} else {
					res = "已结束"
				}
				return res;
			},
		},
		onReady() {
			setTimeout(() => {
				this.$env.isProd && this.getInform();
			}, 800)
		},
		onReachBottom() {
			this.getGoodsList({ first: false });
		},
		methods: {
			close() {
				if (!this.checked) return;
				this.showNotice = false;
			},
			async getInform() {
				try {
					let { data } = await getArticleDetails(153);
					this.html = data.content.content;
					this.showNotice = true;
				} catch (e) {
					console.log(e);
				}
			},
			// 选择区域
			// pickArea(index) {
			// 	if (this.area_index == index) return;
			// 	this.area_index = index;
			// 	uni.pageScrollTo({
			// 		scrollTop: 0,
			// 		duration: 0
			// 	})
			// 	this.getBlockList();
			// },

			/**
			 * 获取区列表、期列表
			 */
			async getBlockList(first = false) {
				try {
					var { data } = await getBlockListApi();
					this.areaList = data.filter(i => i.block_id > 1);;
					var { data } = await getStageApi({ block_id: this.areaList[this.area_index].block_id });
					this.expectList = data;
					this.roll(this.expect_index);
					this.getGoodsList();

					// this.selectActiveExpect();
				} catch (e) {
					this.$msg.fail(e);
				}
			},

			/**
			 * 选择活动中的期数，如果没有活动中的期就选中最后一期
			 */
			selectActiveExpect() {
				let time = Date.now();
				let i = 0;
				let len = this.expectList.length;
				for (; i < len; i++) {
					let item = this.expectList[i];
					if (time >= Date.parse(item.start_time) && time <= Date.parse(item.end_time)) {
						this.expect_index = i;
						break
					}
				}
				if (i >= len) {
					this.expect_index = len - 1
				}
				this.roll(this.expect_index);
				this.getGoodsList();
			},

			// 获取商品列表
			async getGoodsList(options = {}) {
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
				let params = {
					page: this.page,
					limit: this.limit,
					stage_id: this.expectList[this.expect_index].stage_id,
					block_id: this.areaList[this.area_index].block_id,
					keyword: this.keyword
				}
				try {
					let { data: { list } } = await getProductslist(params, option);
					this.setList("goodsList", list, option.first);
				} catch (e) {

				} finally {
					this.lockLoad = false;
				}
			},

			toDetail(product_id) {
				let stage_id = this.expectList[this.expect_index].stage_id;
				let block_id = this.areaList[this.area_index].block_id;
				if (!stage_id) return;
				this.toPage(`/pages/goods_details/index?id=${product_id}&stage_id=${stage_id}&block_id=${block_id}`)
			},

			roll(index) {
				// 当前被点击元素的前一个元素距屏幕左边界距离
				let left = (index - 1) * 250 + this.currLeft;

				this.currLeft = this.scrollLeft = this.currLeft - left;
				this.expect_index = index;
			}
		},
	}
</script>

<style scoped lang="scss">
	.head {
		background-color: #FFFFFF;
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 10;
		box-shadow: 0 16rpx 10rpx -10rpx rgba(0, 0, 0, 0.06);
	}

	.head2 {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 10;
		box-shadow: 0 16rpx 10rpx -10rpx rgba(0, 0, 0, 0.06);
	}

	.expect-box {
		width: 750rpx;
		height: 620rpx;
		background-image: url(/static/images/groupBuyBg2.png);
		background-size: 100%;
		background-repeat: no-repeat;
	}

	.expect-list {
		transition: all 0.2s;
	}

	.expect-item.active {}

	.expect-item {
		color: #FFFFFF;
		font-size: 34rpx;
		width: 250rpx;
		text-align: center;
		flex: none;
	}

	.expect-item+.expect-item {}

	.container {
		padding: 0 16rpx 0;
		margin-top: 10px;
	}

	.goods_item {
		width: 49%;
		background-color: #FFFFFF;
		border-radius: 14rpx;
		padding: 14rpx;
		position: relative;
		margin-bottom: 24rpx;
	}

	.goods_item image {
		border-radius: 14rpx;
	}

	.discount_label {
		position: absolute;
		top: 0;
		left: 0;
		width: 76rpx;
		height: 40rpx;
		text-align: center;
		line-height: 40rpx;
		font-size: 27rpx;
		color: #FFFFFF;
		background: linear-gradient(134deg, #FF3131 0%, #FF6767 46%, #FF9C9C 100%);
		border-radius: 14rpx 0rpx 14rpx 0rpx;
	}

	.btn {
		width: 148rpx;
		height: 60rpx;
		text-align: center;
		line-height: 60rpx;
		border-radius: 60rpx;
		color: #FFFFFF;
		background: #0f734f;
		position: absolute;
		bottom: 20rpx;
		right: 20rpx;
	}

	.mt16 {
		margin-top: 16rpx;
	}

	.fz26 {
		font-size: 26rpx;
	}

	.seckill_gray_color {
		color: #777777;
	}

	.fill-box {
		height: calc(620rpx + 50px);
	}

	.fill-box2 {
		height: calc(var(--status-bar-height) + 44px + 100rpx);
	}

	.suspend-box {
		width: 694rpx;
		height: 204rpx;
		background-color: #fff;
		border-radius: 16rpx;
		margin-bottom: 70rpx;
		position: relative;
		// opacity: 0.8;
	}

	.suspend-box::after {
		content: "";
		display: block;
		position: absolute;
		width: 0;
		height: 0;
		border-left: 42rpx solid transparent;
		border-right: 42rpx solid transparent;
		border-top: 44rpx solid #fff;
		top: 100%;
		left: 0;
		right: 0;
		margin: 0 auto;
	}

	.suspend-content {
		opacity: 1;
		padding: 0 26rpx;
	}

	.start-box,
	.end-box {
		width: 176rpx;
		height: 136rpx;
		border-radius: 20rpx;
		background-color: #b3b3b3;
		opacity: 1;
		color: #fff;
		padding: 4rpx 0;
		font-size: 30rpx;
	}

	.start-box.active {
		background-color: #0f734f;
	}


	.red-btn {
		width: 140rpx;
		height: 56rpx;
		color: $red;
		border: 1rpx solid;
		text-align: center;
		line-height: 56rpx;
		border-radius: 8rpx;
	}

	.notice-box {
		padding: 24rpx;
		line-height: 1.7;
		font-size: 16px;
		height: 55vh;
	}

	@keyframes rotates {
		from {
			transform: rotate(0deg);
		}

		to {
			transform: rotate(360deg);
		}
	}

	.box {
		width: 150rpx;
		height: 150rpx;
		border: 5px solid #ddd;
		border-top-color: #0f734f;
		border-radius: 50%;
		animation: rotates 1.5s linear infinite;
		position: absolute;
	}

	.rotate-box {
		color: #0f734f;
		position: relative;
		display: inline-flex;
		justify-content: center;
		align-items: center;
	}
</style>

<style scoped>
	/deep/ .u-countdown-item {
		padding: 6rpx;
	}

	/deep/ .u-model__footer__button {
		line-height: 1.7 !important;
	}

	/deep/ .u-model__footer__button {
		height: auto;
	}

	/deep/ .head2 .head-fixed {
		background-color: #FF8FAF !important;
	}
</style>
