<template>
	<view class="page-box">
		<view class="px-3">
			<view class="status-bar-24"></view>
			<view class="header fx a-center relative">
				<uni-icons type="back" size="24" @click="back" color="#ffffff"></uni-icons>
				<image src="./images/hgzq.png" style="width: 142rpx;" mode="widthFix" class="image"></image>
			</view>
		</view>
		<view class="fx-center fx-col mt-3">
			<image src="./images/hg.png" style="width: 430rpx;" mode="widthFix"></image>
			<image src="./images/time.png" style="width: 450rpx;" class="mt-1" mode="widthFix"></image>
			<u-divider bg-color="transparent" color="#fff" border-color="#fff" fontSize="28">每期精选 优质单品 畅享嗨购</u-divider>
			<view class="am-box mt-2">
				<view class="center fx a-center">
					<text style="font-size: 70rpx;">上午场</text>
					<view class="fx-col fx-center ml-4">
						<view class="fz_28 bold">10:31</view>
						<view class="fz_26">开场时间</view>
					</view>
					<view class="ml-auto btn-box fx-center bold" @click="toPage(`/pages/haigou/index?time=1`)">点击进入</view>
				</view>
			</view>
			<view class="pm-box mt-2">
				<view class="center fx a-center">
					<text style="font-size: 70rpx;">下午场</text>
					<view class="fx-col fx-center ml-4">
						<view class="fz_28 bold">15:31</view>
						<view class="fz_26">开场时间</view>
					</view>
					<view class="ml-auto btn-box fx-center bold" @click="toPage(`/pages/haigou/index?time=2`)">点击进入</view>
				</view>
			</view>
		</view>
		<u-modal v-model="showNotice" :title="title" confirm-text="知道了" confirm-color="#0f734f">
			<view class="notice-box">
				<scroll-view scroll-y style="height: 100%;">
					<jyf-parser :html="notification" ref="article"></jyf-parser>
				</scroll-view>
			</view>
		</u-modal>
	</view>
</template>

<script>
	import { getArticleDetails } from "@/api/api.js";
	export default {
		data() {
			return {
				notification: "",
				showNotice: false,
				title:""
			}
		},
		onLoad() {
			this.getNotif();
		},
		methods: {
			async getNotif() {
				try {
					let { data } = await getArticleDetails(163);
					this.showNotice = true,
					this.notification = data.content.content;
					this.title = data.title;
				} catch (e) {
					//TODO handle the exception
				}
			}
		}
	}
</script>

<style scoped>
	.page-box {
		height: 100vh;
		background-image: url("./images/bg.jpg");
		background-size: 100% 100%;
		background-repeat: no-repeat;
	}

	.image {
		position: absolute;
		z-index: 2;
		left: 0;
		right: 0;
		margin: 0 auto;
	}

	.header {
		height: 44px;
	}

	.am-box,
	.pm-box {
		width: 710rpx;
		height: 319rpx;
		background-image: url("./images/bg2.png");
		background-repeat: no-repeat;
		background-size: 100%;
		margin-left: auto;
		margin-right: auto;
		padding-top: 100rpx;
	}

	.center {
		height: 88rpx;
		padding: 0 44rpx 0 46rpx;
		color: #fff;
	}

	.btn-box {
		width: 196rpx;
		height: 60rpx;
		color: #000;
	}

	.notice-box {
		padding: 24rpx;
		line-height: 1.7;
		font-size: 16px;
		height: 50vh;
	}
</style>
