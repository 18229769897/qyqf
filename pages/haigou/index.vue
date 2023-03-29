<template>
	<view>
		<view class="header px-3">
			<view class="status-bar-24"></view>
			<view class="back-box fx-center" @click="back">
				<uni-icons type="back" size="22" color="#fff"></uni-icons>
			</view>
		</view>
		<view class="tabs-box ml-auto mr-auto">
			<u-tabs :list="freightList" :font-size="30" item-width="25%" :height="76" :bar-height="4" :bar-width="100" gutter="0" inactive-color="#b2c2dc" active-color="#ffffff"
				:duration="0.2" bg-color="transparent" :bar-style="{'background-color':'#C30D23'}" :current="current" @change="change">
			</u-tabs>
		</view>

		<scroll-view scroll-y class="scroll-view" @scrolltolower="scrolltolower" :scroll-top="scrollTop" @scroll="scroll">
			<view class="list">
				<template v-for="(item,index) in goodsList">
					<view class="item bg-white py-2 px-2" v-if="item.style_type==0">
						<view class="fx">
							<image :src="item.image" style="width: 200rpx;height: 200rpx;border-radius: 12rpx;"></image>
							<view class="ml-2 flex_1 fx fx-col pt-1">
								<view class="fz_28 text-black ellipsis2">{{item.store_name}}</view>
								<view class="mt-1" style="color: #fe4449;">
									<text class="fz_24">￥</text>
									<text class="fz_30 bold">{{item.price}}</text>
								</view>
								<view class="btn text-white fx fx-center fz_27 mt-auto" v-if="item.is_reserve==0" @click="subscribe(freightList[current],item,index)">立即预约</view>
							</view>
							<view class="ml-4 fx a-center fz_26" @click="toDetail(freightList[current],item)">
								<view class="fx fx-col fx-center" style="color: #808080;">
									<text>立即</text>
									<text style="text-decoration:underline;">抢购</text>
								</view>
								<uni-icons type="forward" size="18" color="#808080"></uni-icons>
							</view>
						</view>

						<view style="width: 200rpx;" class="fx a-center px-1 mt-1">
							<view class="fz-10px fx a-center" style="border-radius: 4rpx;overflow: hidden;">
								<view style="background-color: #333333;padding: 2rpx 6rpx;color: #bc9b81;">嗨购爆品</view>
								<view style="background-color: #eabd9b;padding: 2rpx 6rpx;">热 销</view>
							</view>
						</view>
					</view>

					<view class="item2" v-if="item.style_type==1" :class="{'bg1':bg1_ID.indexOf(item.product_id)>-1,'bg2':bg2_ID.indexOf(item.product_id)>-1}">
						<view class="goods fx fx-end">
							<view class="fx a-center text-black pt-2" style="font-size: 50rpx;">
								<view style="writing-mode:tb-rl" class="bold">恒大酱香白酒</view>
								<view style="writing-mode:tb-rl" class="fx a-end">
									<view class="fx a-center" style="writing-mode:initial;margin-left: 6rpx;font-size: 25rpx;" @click="toDetail(freightList[current],item)">
										<view class="fx fx-col fx-center" style="color: #C30D23;">
											<text>立即</text>
											<text style="text-decoration:underline;">抢购</text>
										</view>
										<uni-icons type="forward" size="18" color="#C30D23"></uni-icons>
									</view>
								</view>
							</view>
							<view class="ml-2" style="width: 380rpx;height: 380rpx;">
								<image :src="item.image" style="width: 380rpx;height: 380rpx;"></image>
							</view>
						</view>
						<view class="left-box fx-center">
							<view class="fz_24 fx a-center" style="border-radius: 4rpx;overflow: hidden;">
								<view style="background-color: #333333;padding: 2rpx 6rpx;color: #bc9b81;">嗨购爆品</view>
								<view style="background-color: #eabd9b;padding: 2rpx 6rpx;">热 销</view>
							</view>
						</view>
						<view class="right-box fx-center">
							<text class="fz_26">售价:</text>
							<text style="color: #fe4449;" class="fz_32">￥{{item.price}}</text>
						</view>
						<view class="btn2 fx-center fz_30" :class="{'disable':item.is_reserve==1}" @click="subscribe(freightList[current],item,index)">
							{{item.is_reserve==0?"立即预约":"已预约"}}
						</view>
					</view>
				</template>
			</view>
			<view v-if="noData">
				<emptyPage title="暂无数据" />
			</view>
		</scroll-view>

		<pay2 :show.sync="show" unit="焕际券" :money="reserve_ticket" @finish="$emit(`finish`,$event)" @close="$off(`finish`)" ref="pay2"></pay2>
	</view>
</template>

<script>
	import { getProductslist, getBlockListApi, getStageApi } from "@/api/store";
	import dayjs from "dayjs"
	import { transform } from "@/utils/util2.js"
	import paging from '@/mixins/paging.js'
	import { statusgetApi, hibuyReserveApi } from "@/api/user.js";

	import { rangeListApi, positionListApi, haigouProductListApi } from "@/api/product.js";
	let statusBarHeight = uni.getSystemInfoSync().statusBarHeight + 'px';

	export default {
		data() {
			return {
				bg1_ID: [4914, 4913], // 白酒商品id
				bg2_ID: [4911, 4912], // 威士忌商品id
				statusBarHeight,
				current: 0, // 选中仓位索引
				expectList: [], // 期数列表

				freightList: [], // 仓位列表
				goodsList: [], // 商品列表
				specialIndex: [],

				expect_index: 0, // 选中期索引
				reserve_ticket: 0, // 预约金额
				height: 0,
				offsetTop: 0,
				scrollTop: 0,
				oldScrollTop: 0,

				show: false,
				noData: false,
				time: ""
			}
		},

		mixins: [paging],

		onLoad(e) {
			this.time = e.time || 1;
			this.getExpectList()
		},

		filters: {
			formatTime(data, exp) {
				return dayjs(data).format(exp)
			}
		},

		async onReady() {
			let res = await this.$u.getRect('.scroll-view');
			this.height = res.height;
		},

		computed: {
			// 选择期id
			range_id() {
				if (!this.expectList.length) return 0;
				return this.expectList[this.expect_index].range_id
			},

			// 选中仓位id
			position_id() {
				if (!this.freightList.length) return 0;
				return this.freightList[this.current].position_id;
			}
		},
		methods: {
			change(index) {
				if (this.current != index) {
					this.current = index;
					this.getGoodsList();
					this.scrollTop = this.oldScrollTop;
					this.$nextTick(() => {
						this.scrollTop = 0;
					})
				}
			},
			/**
			 * 获取期数列表
			 */
			async getExpectList() {
				try {
					let { data: { list } } = await rangeListApi();
					this.expectList = list;
					this.noData = list.length == 0;
					if (list.length) {
						this.getFreightList();
					}

				} catch (e) {
					this.$msg.fail(e);
				}
			},

			/**
			 * 获取仓位列表
			 */
			async getFreightList() {
				try {
					let { data: { list } } = await positionListApi({ range_id: this.range_id, time: this.time }, { loading: 1 });
					this.freightList = list;
					this.specialIndex = transform(list, (item, index) => {
						if (item.background_type == 1) return index;
					})
					console.log(this.specialIndex);
					this.getGoodsList();
					console.log(list);
				} catch (e) {

				}
			},

			/**
			 * 获取商品列表
			 */
			async getGoodsList(options = {}) {
				let option = {
					loading: 0,
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
					position_id: this.position_id
				}
				try {
					let { data: { list } } = await haigouProductListApi(params, option);
					this.setList("goodsList", list, option.first);
				} catch (e) {

				} finally {
					this.lockLoad = false;
				}
			},

			scrolltolower() {
				this.getGoodsList({ first: false, loading: 0 })
			},
			scroll(e) {
				this.oldScrollTop = e.detail.scrollTop;
			},


			/**
			 * 判断用户是否已经预约指定区、指定期商品
			 */
			async statusget(item) {
				try {
					let { data } = await statusgetApi({ block_id: item.block_id, stage_id: item.stage_id });
				} catch (e) {
					//TODO handle the exception
				}
			},

			/**
			 *预约
			 */
			async subscribe(position, item, index) {
				if (item.is_reserve == 1) return;
				this.reserve_ticket = position.reserve_money;
				this.show = true;
				let params = {
					position_id: position.position_id,
					range_id: this.range_id,
					product_id: item.product_id,
					pay_type: "ticket"
				}
				this.$on("finish", async (pwd) => {
					try {
						params.pwd = pwd;
						let { message } = await hibuyReserveApi(params);
						let that = this;
						this.goodsList[index].is_reserve = 1;
						this.$msg.succ(message, () => {
							this.show = false;
						});
					} catch (e) {
						return this.$msg.fail(e);
					} finally {
						this.$refs.pay2.offLock();
					}
				})
			},

			// 选择区域
			pickArea(index) {
				if (this.expect_index == index) return;
				this.expect_index = index;

				const box = uni.createSelectorQuery().selectAll('.area-item')
				box.boundingClientRect().exec(data => {
					let el = data[0][index];
					this.offsetTop = this.scrollTop + el.top - (this.height - el.height) / 2;
				})
				this.getFreightList();
			},

			scroll(e) {
				this.scrollTop = e.detail.scrollTop;
			},


			swiperChange(e) {
				let index = e.detail.current;
				this.swiperIndex = index;
			},

			toDetail(position, item) {
				let id = item.product_id;
				let position_id = position.position_id;
				let range_id = this.range_id;
				uni.navigateTo({
					url: `/pages/goods_details/index?id=${id}&range_id=${range_id}&position_id=${position_id}`
				})
			}
		}
	}
</script>


<style>
	page {
		background-color: #b2bfd0 !important;
	}
</style>

<style scoped lang="scss">
	.fz-6px {
		font-size: 6px;
	}

	.fz-10px {
		font-size: 10px;
	}

	.header {
		width: 750rpx;
		height: 657rpx;
		background-image: url("./images/head2.png");
		background-size: 100%;
		background-repeat: no-repeat;
	}

	.back-box {
		width: 60rpx;
		height: 60rpx;
		border-radius: 50%;
		background-color: rgba(0, 0, 0, 0.5);
	}

	.time-box {
		background-image: linear-gradient(to right, #ea5d64, #f43e48);
		width: 246rpx;
		border-radius: 16rpx;
		color: #fff;
		font-size: 38rpx;
		height: 72rpx;
		border: 1rpx solid;
	}

	.scroll-view {
		padding: 20rpx 30rpx;
		/* #ifdef APP-PLUS */
		height: calc(100vh - (700rpx + var(--status-bar-height)));
		/* #endif */

		/* #ifdef H5 */
		height: calc(100vh - (700rpx + 24px));
		/* #endif */

		// background-color: #fff;
	}

	.item {
		width: calc(100% - 20rpx);
		margin-left: auto;
		margin-right: auto;
		border-radius: 10rpx;
		box-shadow: 4rpx 4rpx 14rpx rgba(0, 0, 0, 0.1);
	}

	.item+.item {
		margin-top: 30rpx;
	}

	.item2 {
		padding-top: 25rpx;
		width: 662rpx;
		height: 587rpx;
		background-image: url("./images/goods-bg1.png");
		background-size: 100%;
		margin-left: auto;
		margin-right: auto;
		position: relative;
		margin-bottom: 30rpx;

		.goods {
			padding-right: 70rpx;
		}

		.left-box {
			width: 228rpx;
			position: absolute;
			left: 0;
			bottom: 90rpx;
		}

		.right-box {
			position: absolute;
			right: 20rpx;
			bottom: 92rpx;
		}
	}

	.item2.bg1 {
		background-image: url("./images/goods-bg1.png") !important;
	}

	.item2.bg2 {
		background-image: url("./images/goods-bg2.png") !important;
	}



	.btn {
		height: 58rpx;
		margin-right: 30rpx;
		color: #fff;
		border-radius: 14rpx;
		background-color: #461b9e;
		font-size: 27rpx;
	}

	.btn2 {
		width: 164rpx;
		height: 76rpx;
		background-color: #fff;
		border-radius: 100px;
		position: absolute;
		bottom: 70rpx;
		left: 0;
		right: 0;
		margin-left: auto;
		margin-right: auto;
		color: #e30325;
	}

	.tabs-box {
		width: 710rpx;
		height: 80rpx;
		background-color: #7284a8;
		border-radius: 18rpx;
		// padding-bottom: 6rpx;
		box-sizing: content-box;
	}

	.disable {
		color: #888888 !important;
	}

	/deep/ .active {
		background-color: #173470;
	}
</style>
