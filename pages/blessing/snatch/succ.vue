<template>
	<view style="padding: 40rpx 30rpx;">
		<view class="container fx-col fx fx-center">
			<image src="@/static/images/succicon.png" style="width: 140rpx;height: 140rpx;"></image>
			<view style="font-size: 32rpx; color: #333333;margin-top: 16rpx;">兑换成功</view>
			<view class="text">
				请耐心等待开奖，中奖结果将在本期夺宝页面公布，我们会第一时间通知用户领奖
			</view>
		</view>

		<view class="title">订单信息</view>

		<view class="item">
			<view>夺宝商品：</view>
			<text>{{data.product_name}}</text>
		</view>
		<view class="item">
			<view>夺宝期号： </view>
			<text>{{data.number}}</text>
		</view>
		<view class="item">
			<view>兑换时间： </view>
			<text>{{data.create_time}}</text>
		</view>
		<view class="item">
			<view>夺宝码数：</view>
			<view>{{data.num}}个</view>
		</view>
		<view style="height: 1px;background-color: #E8E8E8;margin-top: 25rpx;"></view>
		<view class="fx a-end" style="font-size: 28rpx;color: #333333;margin-top: 50rpx;">
			合计：<view style="color: #0f734f;font-size: 38rpx;">{{data.pay_price}} <text style="font-size: 28rpx;">积分</text> </view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				data: {}
			}
		},
		methods: {

		},
		onLoad(options){
			this.data = this.getParams(options.params);
		},
	}
</script>

<style>
	@import url("/static/css/common.css");

	page {
		background-color: #FFFFFF;
	}

	.container {
		height: 384rpx;
		background: #FFFFFF;
		box-shadow: 0px 2rpx 12rpx rgba(0, 0, 0, 0.06);
		border-radius: 20rpx;
	}

	.text {
		text-align: center;
		width: 617rpx;
		height: 66rpx;
		font-size: 24rpx;
		font-weight: 400;
		line-height: 33rpx;
		color: #777777;
		margin-top: 32rpx;
	}

	.title {
		color: #333333;
		font-size: 32rpx;
		padding: 32rpx 0;
	}

	.item {
		line-height: 3;
		display: flex;
	}

	.item view {
		color: #777777;
	}

	.item text {
		color: #333333;
		margin-left: 6rpx;
	}
</style>
