<template>
	<view class="page-box">
		<view class="fill-bg"></view>
		<headBar2 title="总裁中心" white noText />

		<view class="main">
			<view class="card-box fx a-center">
				<image src="@/static/images/qyyj.png" style="width: 70rpx; height: 70rpx;"></image>
				<view style="margin-left: 18rpx;">每日流水</view>
				<view class="money_number">{{item.day }}</view>
			</view>

			<view class="card-box fx a-center">
				<image src="@/static/images/qyyj.png" style="width: 70rpx; height: 70rpx;"></image>
				<view style="margin-left: 18rpx;">当月流水</view>
				<view class="money_number">{{item.month}}</view>
			</view>
		</view>
	</view>
</template>
<script>
	import { ceoStatApi } from '@/api/user.js';
	export default {
		data() {
			return {
				isApply: false, // 是否申请过代理商,
				number: "", // 代理商收益
				item: {
					
				}
			};
		},
		onShow() {
			this.getDetail()
		},
		methods: {
			async getDetail() {
				try {
					uni.showLoading()
					let { data } = await ceoStatApi({}, { loading: 1 });
					console.log(data);
					this.item = data;
				} catch (e) {
					console.log(e);
				} finally {
					uni.hideLoading()
				}
			}
		}
	}
</script>

<style scoped>
	@import url("/static/css/common.css");

	page {
		background-color: #f5f5f5 !important;
	}

	.page-box {
		padding: 30rpx 24rpx;
	}

	.header {
		background-image: url(@/static/images/dls_bg.png);
		height: 308rpx;
		background-size: cover;
		position: relative;
		color: #FFFFFF;
	}

	.btn {
		width: 132rpx;
		height: 38rpx;
		font-size: 27rpx;
		text-align: center;
		line-height: 39rpx;
		color: #555555;
		background-color: rgba(255, 255, 255, 0.9);
		border-radius: 50rpx;
	}

	.money_data {
		position: absolute;
		right: 40rpx;
		left: 40rpx;
		bottom: 0;
		height: 68rpx;
		font-size: 28rpx;
	}

	.main {
		margin-top: 30rpx;
		position: relative;
		z-index: 2;
	}

	.card-box {
		height: 140rpx;
		background-color: #FFFFFF;
		border-radius: 14rpx;
		box-shadow: 0 0 8px rgba(0, 0, 0, 0.06);
		padding: 0 26rpx 0 40rpx;
	}

	.card-box+.card-box {
		margin-top: 30rpx;
	}

	.money_number {
		color: #e0534c;
		font-size: 30rpx;
		font-weight: 500;
		padding-right: 20rpx;
		margin-left: auto;
	}

	.fill-bg {
		position: fixed;
		z-index: 0;
		background-image: linear-gradient(to bottom, rgba(90, 184, 127, 0.9), rgba(90, 184, 127, 0.2));
		left: 0;
		right: 0;
		bottom: 0;
		top: 0;
	}
</style>
