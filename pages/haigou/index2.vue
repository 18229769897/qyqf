<template>
	<view class="page-box">
		<!-- <view class="head-box">
			<view class="status-bar-24"></view>
			<u-icon name="play-left-fill" color="rgba(15,115,79,0.8)" size="42" @click="back"></u-icon>
		</view> -->

		<view class="head-wrapper" :style="'top:'+statusBarHeight">
			<view class="head-menu">
				<view class='iconfont icon-xiangzuo' @click="back"></view>
				<view class="iconfont icon-shouye4" @click="toTabPage(`/pages/index/index`)"></view>
			</view>
		</view>
		<image src="./images/banner.png" style="width: 750rpx;" mode="widthFix"></image>

		<view style="height: 20rpx;"></view>

		<view class="main fx">
			<view class="left-box h100">
				<scroll-view scroll-y class="scroll-view h100" :scroll-top="offsetTop" @scroll="scroll">
					<view class="area-list">
						<template v-for="(areaItem,index) in expectList">
							<view class="area-item" :class="{'active':expect_index==index}" @click="pickArea(index)">
								<text>{{areaItem.name}}</text>
							</view>
						</template>
					</view>
				</scroll-view>
			</view>
			<view class="right-box f1">
				<view class="px-3">
					<image src="./images/yuyue.png" class="w100" mode="widthFix" v-if="!noData"></image>
				</view>
				<scroll-view scroll-y class="scroll-view2">
					<view class="area-list fx fx-col">
						<template v-for="(item,index) in freightList">
							<view class="expect-item py-3" :class="{'mt-2':index==0}" @click="toDetail(item)">
								<view class="title-box px-2 fx j-between a-center">
									<view class="title">{{item.name}}</view>
									<view>{{item.start_time}}开始</view>
								</view>
								<template v-for="item2 in item.product_list">
									<view class="fx py-1 px-1" @click="toDetail(item,item2)">
										<image :src="item2.image" style="width: 200rpx;height: 200rpx;border-radius: 12rpx;"></image>
										<view class="ml-2 flex_1">
											<view class="fz_28 text-black">{{item2.store_name}}</view>
											<view class="fx a-center mt-1">
												<view class="bg-theme text-white fz_24" style="padding: 2rpx 6rpx;border-radius: 6rpx;">店铺自营</view>
												<view class="fz_24 ml-1" style="border-radius: 6rpx;color: #ebbb7d;background-color: #fff6e8;padding: 2rpx 6rpx;">包邮</view>
											</view>
											<view class="text-theme mt-1">
												<text class="fz_24">￥</text>
												<text class="fz_30 bold">{{item2.price}}</text>
											</view>
											<view class="btn2 text-theme fx fx-center fz_27 mt-1" @click="toDetail(item,item2)">查看详情</view>
										</view>
									</view>
								</template>
								<view style="padding: 0 14rpx;">
									<view v-if="item.is_reserve==0" class="btn text-white fx fx-center fz_27 mt-1" @click.stop="subscribe(item)">立即预约</view>
								</view>
							</view>
						</template>
						<emptyPage v-if="noData" title="暂无数据~" />
					</view>
				</scroll-view>
			</view>
		</view>
		<pay2 :show.sync="show" unit="焕际券" :money="reserve_ticket" @finish="$emit(`finish`,$event)" @close="$off(`finish`)" ref="pay2"></pay2>
	</view>
</template>

<script>
	import { getProductslist, getBlockListApi, getStageApi } from "@/api/store";
	import dayjs from "dayjs"
	import { statusgetApi, hibuyReserveApi } from "@/api/user.js";


	import { rangeListApi, positionListApi } from "@/api/product.js";

	let statusBarHeight = uni.getSystemInfoSync().statusBarHeight + 'px';

	export default {
		data() {
			return {
				statusBarHeight,
				expectList: [], // 期数列表
				freightList: [], // 仓位列表
				expect_index: 0, // 选中期索引
				reserve_ticket: 0,
				height: 0,
				offsetTop: 0,
				scrollTop: 0,
				show: false,
				image: "https://hjtradeoss.oss-cn-shenzhen.aliyuncs.com/def/c833620221026213655281.jpg?x-oss-process=image/resize%2Cp_90",
				noData: false,

				expect_index: 0, // 选中区索引
			}
		},

		onLoad() {
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
			}
		},
		methods: {

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
					let { data: { list } } = await positionListApi({ range_id: this.range_id }, { loading: 1 });
					this.freightList = list;
					this.noData = list.length == 0;
					console.log(list);
				} catch (e) {

				}
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
			async subscribe(item) {
				this.reserve_ticket = item.reserve_money;
				this.show = true;
				let params = {
					position_id: item.position_id,
					range_id: this.range_id,
					pay_type: "ticket"
				}
				this.$on("finish", async (pwd) => {
					try {
						params.pwd = pwd;
						let { message } = await hibuyReserveApi(params);
						let that = this;
						this.freightList.forEach(v => {
							if (v.position_id == item.position_id) {
								v.is_reserve = 1; // is_reserve：0可以预约, 1：不能预约
							}
						})
						// this.$msg.succ(message, () => {
						// 	uni.navigateTo({
						// 		url: "/pages/success/index",
						// 		complete() {
						// 			that.show = false;
						// 		}
						// 	})
						// });
						this.$msg.succ(message);
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

			toTuanGou(item, index) {
				let title = this.areaList[this.expect_index].name;
				console.log(index);
				uni.navigateTo({
					url: `/pages/groupBuy/index?title=${title}&expect_index=${index}&expect_index=${this.expect_index}`
				})
			},

			toDetail(item, product) {
				let id = product.product_id;
				let position_id = item.position_id;
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
		background-color: #fff !important;
	}
</style>

<style scoped lang="scss">
	.swiper-box {
		width: 730rpx;
		height: 208rpx;
		margin-left: auto;
		margin-right: auto;

		image {
			border-radius: 20rpx;
		}
	}

	.main {
		/* #ifdef APP-PLUS */
		height: calc(100vh - 400rpx - 20rpx);
		/* #endif */

		/* #ifdef H5 */
		height: calc(100vh - 400rpx - 20rpx);
		/* #endif */
	}

	.scroll-view {
		width: 180rpx;
		background-color: #f6f6f6;
		transition: all 0.2s;
	}

	.scroll-view2 {
		height: calc(100% - 146rpx);
	}

	.area-item {
		width: 100%;
		height: 80rpx;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.area-item.active {
		background-color: #fff;
		color: $red;
		font-weight: bold;
		border-left: 2rpx solid;
	}

	.right-box {
		padding-bottom: 30rpx;
	}

	.expect-item {
		width: calc(100% - 60rpx);
		margin-left: auto;
		margin-right: auto;
		background-color: #fff;
		border-radius: 20rpx;
		box-shadow: 0 0 12rpx rgba(0, 0, 0, 0.1);
	}

	.expect-item+.expect-item {
		margin-top: 40rpx;
	}

	.title-box {
		padding-bottom: 20rpx;
		border-bottom: 1rpx dashed #AAA;
	}

	.title {
		color: $red;
		padding: 0rpx 0 0rpx 20rpx;
		border-left: 2px solid;
		line-height: 1;
		font-size: 30rpx;
	}

	.text {
		color: $red;
	}

	.btn {
		height: 70rpx;
		color: #fff;
		border-radius: 14rpx;
		background-color: $red;
		font-size: 28rpx;
		margin-top: 20rpx;
	}

	.btn.disabled {
		background-color: #bbb !important;
	}

	.btn:active {
		box-shadow: inset 0 0 0 999px rgba(0, 0, 0, 0.05);
	}

	.btn2 {
		width: 180rpx;
		padding: 4rpx 0;
		border: 4rpx solid;
		border-radius: 14rpx;
	}

	.head-box {
		position: fixed;
		z-index: 10;
		left: 0;
		right: 0;
		top: 0;
		padding-left: 24rpx;
	}

	.head-wrapper {
		z-index: 999;
		display: flex;
		align-items: center;
		position: fixed;
		left: 30rpx;
		top: 0;
		/* #ifdef MP */
		height: 43px;
		/* #endif */
		/* #ifdef H5 */
		height: 114rpx;
		/* #endif */
	}

	.head-menu {
		display: flex;
		align-items: center;
		height: 54rpx;
		width: 140rpx;
		background: rgba(0, 0, 0, .25);
		border-radius: 27rpx;

		.iconfont {
			flex: 1;
			text-align: center;
			color: #fff;
			box-sizing: border-box;

			&.icon-xiangzuo {
				border-right: 1px solid #fff;
			}
		}
	}
</style>
