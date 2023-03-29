<template>
	<view class="page-box">
		<view class="head">
			<headBar3 isFixed title="团购专区" white>
				<view style="width: 520rpx;" slot="center" class="flex justify-center">
					<v-tabs v-model="area_index" pills bold pillsColor="#0f734f" activeColor="#fff" fontSize="28rpx" color="rgba(255,255,255,0.9)" height="64rpx"
						paddingItem="0 18rpx" lineHeight="0" bgColor="transparent" :line-animation="false" :tabs="areaList" field="name" @change="pickArea" />
				</view>
				<view slot="right" class="record-icon" @click="toPage(`/pages/groupBuy/order-list`)"></view>
			</headBar3>
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
				<u-checkbox shape="circle" active-color="#0f734f" label-size="26" size="30" v-model="checked">我已同意并阅读</u-checkbox>
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
				isogenesis: 0,
				areaList: [],
				expectList: [],
				goodsList: [],
				area_index: 0, // 选中区索引
				expect_index: 0, // 选中期索引
				scrollLeft: 0,
				currLeft: 0, // 当前已滚动距离
				html: "",
				showNotice: false,
				limit: 20
			}
		},
		onLoad(options) {
			this.isogenesis = options.isogenesis || 0;
			this.getBlockList();
		},
		onReady() {
			if (!this.isogenesis) {
				setTimeout(() => {
					// this.$env.isProd && this.getInform();
					this.getInform();
				}, 800)
			}
		},
		mixins: [paging],
		onPullDownRefresh() {
			this.getBlockList();
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

				activeExpect.start_time = activeExpect.start_time.replace(" ", "T");
				activeExpect.end_time = activeExpect.end_time.replace(" ", "T");

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
			pickArea(index) {
				if (this.area_index == index) return;
				if (index > 0) {
					this.toPage(`./index?area_index=${index}`)
				}
			},

			/**
			 * 获取区列表、期列表
			 */
			async getBlockList() {
				try {
					var { data } = await getBlockListApi();
					this.areaList = data;
					var { data } = await getStageApi({ block_id: this.areaList[this.area_index].block_id });
					this.expectList = data;
					this.selectActiveExpect();
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
					uni.showLoading()
				}
				if (this.lockLoad || this.loadState == 2) return;
				this.lockLoad = true;
				let params = {
					page: this.page,
					limit: this.limit,
					stage_id: this.expectList[this.expect_index].stage_id,
					block_id: this.areaList[this.area_index].block_id
				}
				try {
					let { data: { list } } = await getProductslist(params, option);
					this.setList("goodsList", list, option.first);
				} catch (e) {

				} finally {
					this.lockLoad = false;
					if(option.first){
						uni.hideLoading()
					}
				}
			},
			toDetail(product_id) {
				let stage_id = this.expectList[this.expect_index].stage_id;
				let block_id = this.expectList[this.area_index].block_id;
				if (!stage_id) return;
				this.toPage(`/pages/goods_details/index?id=${product_id}&stage_id=${stage_id}&block_id=${block_id}`)
			},

			roll(index) {
				this.expect_index = index;
				// 当前被点击元素距屏幕左边界距离
				let left = index * 250 + this.currLeft;

				// 当前被点击元素跳到之间需要滚动的距离
				let left2 = 250 - left;

				this.currLeft = this.scrollLeft = this.currLeft + left2;
			}
		},
	}
</script>

<style scoped lang="scss">
	/deep/ .head-fixed {
		background-color: #FF8FAF !important;
	}

	.expect-box {
		width: 750rpx;
		height: 565rpx;
		background-image: url(/static/images/groupBuyBg.png);
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
		padding: 30rpx 16rpx 0;
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
		height: calc(565rpx + 50px);
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
</style>
