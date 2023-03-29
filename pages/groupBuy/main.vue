<template>
	<view class="page-box">
		<swiper class="swiper-box" indicator-dots autoplay :current="swiperIndex" @change="swiperChange" indicator-active-color="#0f734f" circular>
			<swiper-item v-for="(item, index) in banner" :key="index">
				<view class="swiper-item fx a-center">
					<image :src="item.pic" style="width: 730rpx;height: 208rpx;"></image>
				</view>
			</swiper-item>
		</swiper>

		<view style="height: 20rpx;"></view>

		<view class="main fx">
			<view class="left-box h100">
				<scroll-view scroll-y class="scroll-view h100" :scroll-top="offsetTop" @scroll="scroll">
					<view class="area-list">
						<template v-for="(areaItem,index) in areaList">
							<view class="area-item" :class="{'active':area_index==index}" @click="pickArea(index)">
								<text>{{areaItem.name}}</text>
							</view>
						</template>
					</view>
				</scroll-view>
			</view>
			<view class="right-box f1">
				<scroll-view scroll-y class="scroll-view2 h100">
					<view class="area-list fx fx-col" style="flex-direction: column-reverse;">
						<template v-for="(item,index) in expectList">
							<view class="expect-item px-3 py-3" :class="{'mt-2':index==0}">
								<view class="title-box fx j-between a-center">
									<view class="title">{{item.name}}</view>
									<view class="fz_30" :style="{'color':expectStatus(item).color}">{{expectStatus(item).text}}</view>
								</view>
								<view class="text fz_30 mt-2">
									<text>{{item.start_time|formatTime('YYYY-MM-DD HH:mm') }} 开始</text>
								</view>
								<view class="fx j-between">
									<view class="btn flex-center" @click="toTuanGou(item,index)">立即进入</view>
									<view class="btn flex-center" :class="{'disabled':isDisableSubscribe}" @click="subscribe(item)" v-if="index==expectList.length-1">立即预约
									</view>
								</view>
							</view>
						</template>
					</view>
				</scroll-view>
			</view>
		</view>
		<pay2 :show.sync="show" unit="红包积分" :money="10.0" @finish="$emit(`finish`,$event)" @close="$off(`finish`)" ref="pay2"></pay2>
	</view>
</template>

<script>
	import { getProductslist, getBlockListApi, getStageApi } from "@/api/store";
	import dayjs from "dayjs"
	import { statusgetApi, userSubscribeApi } from "@/api/user.js";
	export default {
		data() {
			return {
				banner: [{ pic: require("./images/banner.png") }],
				swiperIndex: 0,
				areaList: [], // 区列表
				expectList: [], // 期列表
				area_index: 0, // 选中区索引
				expect_index: 0, // 选中期索引
				height: 0,
				offsetTop: 0,
				scrollTop: 0,
				isDisableSubscribe: false, // 是否禁止用户预约
				show: false,
			}
		},

		onLoad() {
			this.getBlockList();
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

		},
		methods: {

			/**
			 * 判断用户是否已经预约指定区、指定期商品
			 */
			async statusget(item) {
				try {
					let { data } = await statusgetApi({ block_id: item.block_id, stage_id: item.stage_id });
					this.isDisableSubscribe = data.status == 1;
					console.log(data);
				} catch (e) {
					//TODO handle the exception
				}
			},

			/**
			 *预约
			 */
			async subscribe(item) {
				if (this.isDisableSubscribe) return;
				this.show = true;
				let params = {
					block_id: item.block_id,
					stage_id: item.stage_id,
					pay_type: "wait_released"
				}
				this.$on("finish", async (pwd) => {
					try {
						params.pay_pwd = pwd;
						let { message } = await userSubscribeApi(params);
						this.isDisableSubscribe = true;
						let that = this;
						this.$msg.succ(message, () => {
							uni.navigateTo({
								url: "/pages/success/index",
								complete() {
									that.show = false;
								}
							})
						});
					} catch (e) {
						return this.$msg.fail(e);
					} finally {
						this.$refs.pay2.offLock();
					}
				})
			},

			/**
			 * 获取区列表、期列表
			 */
			async getBlockList() {
				try {
					var { data } = await getBlockListApi();
					this.areaList = data.filter(i => i.block_id > 1);;
					var { data } = await getStageApi({ block_id: this.areaList[this.area_index].block_id });
					this.expectList = data;
					this.statusget(this.expectList[this.expectList.length - 1])
				} catch (e) {
					this.$msg.fail(e);
				}
			},

			// 计算每期状态
			expectStatus(item) {
				let text = "";
				let color = "";
				if (item.start_time.indexOf("+08") == -1) {
					item.start_time = item.start_time.replace(" ", "T") + "+08:00";
					item.end_time = item.end_time.replace(" ", "T") + "+08:00";
				}
				let startTime = Date.parse(item.start_time);
				let endTime = Date.parse(item.end_time);
				let currentTime = Date.now();

				if (currentTime < startTime) {
					text = "未开始"
					color = "#33A465";
				} else if (currentTime >= startTime && currentTime <= endTime) {
					text = "进行中";
					color = "#33A465"
				} else {
					text = "已结束";
					color = "#888"
				}
				return {
					text,
					color
				};
			},

			// 选择区域
			pickArea(index) {
				if (this.area_index == index) return;
				this.area_index = index;

				const box = uni.createSelectorQuery().selectAll('.area-item')
				box.boundingClientRect().exec(data => {
					let el = data[0][index];
					this.offsetTop = this.scrollTop + el.top - (this.height - el.height) / 2;
				})


				this.getBlockList();
			},

			scroll(e) {
				this.scrollTop = e.detail.scrollTop;
			},


			swiperChange(e) {
				let index = e.detail.current;
				this.swiperIndex = index;
			},

			toTuanGou(item, index) {
				let title = this.areaList[this.area_index].name;
				console.log(index);
				uni.navigateTo({
					url: `/pages/groupBuy/index?title=${title}&expect_index=${index}&area_index=${this.area_index}`
				})
			},
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
		height: calc(100vh - 208rpx - 20rpx);
		/* #endif */

		/* #ifdef H5 */
		height: calc(100vh - 208rpx - 20rpx - 44px);
		/* #endif */

	}

	.scroll-view {
		width: 180rpx;
		background-color: #f6f6f6;
		transition: all 0.2s;
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
		box-shadow: 0 0 18rpx rgba(0, 0, 0, 0.08);
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
		width: 200rpx;
		height: 68rpx;
		color: #fff;
		border-radius: 14rpx;
		background-color: $red;
		font-size: 28rpx;
		margin-top: 20rpx;
	}
	
	.btn.disabled{
		background-color: #bbb !important;
	}

	.btn:active {
		box-shadow: inset 0 0 0 999px rgba(0, 0, 0, 0.05);
	}
</style>
