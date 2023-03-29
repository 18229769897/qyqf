<template>
	<view>
		<view class="header">
			<view class="status-bar-24"></view>
			<view class="fx a-center header-title">
				<uni-icons type="back" size="24" color="#524e4d" @click="back"></uni-icons>
				<view class="title fx fx-center fz_32 bold">夺宝专区</view>
			</view>
		</view>
		<view class="fill-box"></view>
		<view class="floor fx j-center a-end">
			<view class="guize-box fx fx-center fz_24" @click="show = true">夺宝规则</view>
			<view class="center text fx fz_30">
				<view class="left-box h100 fx fx-col j-center">
					<view class="fz_28">累计参与</view>
					<view class="fz_36">￥{{grand_total}}</view>
				</view>
				<view class="right-box flex_1 h100 fx a-center j-between" style="padding: 0 40rpx 0 30rpx;">
					<view class="fx-col fx-center" @click="toPage(`/pages/blessing/snatch/record`)">
						<image src="@/static/images/jlicon.png" style="width: 70rpx;" mode="widthFix"></image>
						<text class="mt-1">夺宝记录</text>
					</view>
					<view class="fx-col fx-center" @click="toPage(`/pages/blessing/snatch/lottery`)">
						<image src="@/static/images/kjicon.png" style="width: 70rpx;" mode="widthFix"></image>
						<text class="mt-1">开奖历史</text>
					</view>
					<view class="fx-col fx-center" @click="toPage(`/pages/blessing/snatch/myOrder`)">
						<image src="@/static/images/cjicon.png" style="width: 70rpx;" mode="widthFix"></image>
						<text class="mt-1">夺宝订单</text>
					</view>
				</view>
			</view>
		</view>

		<view class="main mt-1 fx j-between flex-wrap">
			<template v-for="item in list">
				<view class="item fx fx-col" :key="item.product_id">
					<view class="fx fx-center">
						<image :src="item.img" style="width: 100%;height: 300rpx;"></image>
					</view>
					<view style="padding: 12rpx 0 20rpx 12rpx;">
						<view class="ellipsis" style="max-width: 90%;">{{item.name}}</view>
						<view style="margin-top: 10rpx;" class="text-red2">
							<text style="font-size: 32rpx;padding-right: 8rpx;">￥{{item.now_period.integral}}</text>
						</view>
						<view class="schedule-box fx a-end">
							<view>
								<view style="color: #AAAAAA;font-size: 24rpx;margin-bottom: 8rpx;">开奖进度{{item.now_period.schedule}}%</view>
								<view class="schedule" :style="{background: `linear-gradient(90deg, #ff3e44 ${item.now_period.schedule}%, #E5E5E5 0)`}"></view>
							</view>
							<image src="@/static/images/to-duobao.png"
								@click="toPage(`/pages/blessing/snatch/info?period_id=${item.now_period.period_id}&product_id=${item.product_id}`)" class="ml-3"
								style="width: 64rpx;" mode="widthFix"></image>
						</view>
					</view>
				</view>
			</template>
		</view>
		<foot :text="loadText" :state="loadState"></foot>
		<view v-if="noData">
			<emptyPage title="暂无数据"></emptyPage>
		</view>
		<u-modal v-model="show" title="夺宝规则说明" :title-style="{color:'#dd524d'}" :confirm-style="{color:'#dd524d','font-size':'28rpx'}" confirm-text="关闭" :mask-close-able="true">
			<view class="slot-content" style="padding:24rpx;line-height: 1.6;">
				<jyf-parser :html="content" ref="article"></jyf-parser>
			</view>
		</u-modal>
	</view>
</template>


<script>
	let statusBarHeight = uni.getSystemInfoSync().statusBarHeight;
	import { getSnatchListApi, myParamsApi } from "@/api/snatch.js"
	import paging from '@/mixins/paging.js'
	export default {
		data() {
			return {
				aaa: "66%",
				content: "在夺宝首页选择一个商品，点击去夺宝进入夺宝页面。点击夺宝页面下方的\"参与夺宝\"使用现金兑换夺宝码参与夺宝，当一个夺宝商品的夺宝进度达到100%，该夺宝商品将关闭参与入口，系统将随机抽取一个夺宝码且判定该夺宝码为中奖夺宝码，买中这个夺宝码的用户即为中奖用户，用户可通过夺宝首页中的夺宝记录按钮，查看自己每期夺宝是否中奖。",
				show: false,
				statusBarHeight,
				list: [],
				grand_total: "",
				number_of_draw: ""
			}
		},

		onShow() {
			this.getList();
			this.getMyParams();
		},
		mixins: [paging],
		methods: {
			back() {
				uni.navigateBack()
			},

			// 获取商品列表
			async getList(options = {}) {
				let opt = {
					first: true,
					...options,
				}
				let params = {
					page: this.page,
					limit: this.limit,
					type: 1
				}
				let { data: { count, list } } = await getSnatchListApi(params)
				if (opt.first) {
					this.list = list;
					this.noData = count == 0;
					this.count = count;
				} else {
					this.list = this.list.concat(list);
				}
			},
			// 获取我的参数
			async getMyParams() {
				let { data: { grand_total, number_of_draw } } = await myParamsApi();
				this.grand_total = grand_total;
				this.number_of_draw = number_of_draw;
			},
		},
		onReachBottom() {
			if (this.list.length >= this.count) {
				this.loadState = 2;
				return
			}
			this.loadState = 1;
			this.page++;
			this.getList({ first: false });
		}

	}
</script>

<style>
	page {
		background-color: #fff3f3 !important;
	}
</style>

<style lang="scss">
	.header {
		width: 750rpx;
		position: fixed;
		z-index: 10;
		background-color: #fff3f3;

		.header-title {
			height: 50px;
			padding: 0 30rpx;
			position: relative;

			.title {
				position: absolute;
				width: 200rpx;
				left: 0;
				right: 0;
				margin: 0 auto;
				color: #595758;
			}
		}
	}

	.fill-box {
		/* #ifdef APP-PLUS */
		height: calc(50px + var(--status-bar-height));
		/* #endif */

		/* #ifdef H5 */
		height: calc(50px + 24px);
		/* #endif */
	}

	.floor {
		width: 750rpx;
		height: 409rpx;
		background-image: url("/static/images/db-bg.png");
		background-size: 100%;
		background-repeat: no-repeat;
		position: relative;
		padding-bottom: 40rpx;

		.center {
			width: 626rpx;
			height: 168rpx;
			background-image: url("/static/images/db-bg2.png");
			background-size: 100%;
			background-repeat: no-repeat;

			.left-box {
				width: 200rpx;
				padding-left: 34rpx;
			}
		}
		
		
		.guize-box{
			width: 130rpx;
			height: 46rpx;
			background-color: rgba(0, 0, 0, 0.4);
			border-radius: 100px;
			position: absolute;
			top:26rpx;
			right: 58rpx;
			color: #FFFFFF;
		}
	}
	
	.text{
		color: #878787;
	}

	.main {
		padding: 0 30rpx;
	}

	.item {
		width: 336rpx;
		overflow: hidden;
		border-radius: 20rpx;
		background-color: #FFFFFF;
		margin-top: 20rpx;
		box-shadow: 0 0 12rpx rgba(0, 0, 0, 0.1);
	}

	.schedule {
		width: 192rpx;
		height: 8rpx;
		border-radius: 10rpx;
	}

	.ml85 {
		margin-left: 54rpx;
	}

	.text {
		font-size: 24rpx;
		margin-top: 10rpx;
	}

	.db_btn {
		background-color: $red2;
		width: 100rpx;
		height: 48rpx;
		border-radius: 48rpx;
		line-height: 48rpx;
		text-align: center;
		color: #FFFFFF;
		font-size: 26rpx;
		margin-left: 8rpx;
	}

	.rule_btn {
		width: 140rpx;
		height: 40rpx;
		border: 2rpx solid #FFFFFF;
		border-radius: 20rpx;
		position: absolute;
		bottom: 110rpx;
		right: 34rpx;
		opacity: 0.9;
		color: #FFFFFF;
		text-align: center;
		line-height: 40rpx;
		font-size: 24rpx;
	}

	.my-order {
		padding: 0 30rpx;
		z-index: 2;
	}

	.text-box {
		padding-left: 40rpx;
		margin-top: 150rpx;
		text-shadow: 0 0 10rpx rgba(0, 0, 0, 0.08);
		font-size: 80rpx;
	}
</style>
