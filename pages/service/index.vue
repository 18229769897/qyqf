<template>
	<view class="page-box">
		<view class="fx j-center a-end" style="font-size: 32rpx;padding: 24rpx;">
			工作时间 <view style="margin-left: 8rpx;">{{morning_time}} / {{night_time}}</view>
		</view>
		<view class="main">
			<view class="card">
				<template v-for="item in kefuList">
					<view style="margin-top: 26rpx;">{{item.name}}</view>
					<view v-for="item2 in item.phones">{{item2.label}}： <text @click="copy(item2.phone)">{{item2.phone}}</text></view>
				</template>
				
				<view class="text-center" style="margin-top: 40rpx;">上述号码均可点击复制</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { setClipboardData } from "@/utils/util2.js"
	import { getKeFuApi } from "@/api/public.js";
	export default {
		data() {
			return {
				kefuList: [],
				morning_time: "",
				night_time: ""
			}
		},

		async onLoad() {
			let { data: { list, morning_time, night_time } } = await getKeFuApi();
			this.morning_time = morning_time;
			this.night_time = night_time;
			this.kefuList = Object.values(list);
		},
		methods: {
			copy(val) {
				setClipboardData(val).then(() => {
					this.$msg.succ("复制成功");
				})
			}
		}
	}
</script>

<style>
	page {
		height: 100vh;
		background-image: url(@/static/images/kf_bg.jpg);
		background-size: 750rpx 1532rpx;
		background-repeat: no-repeat;
		background-color: #FFFFFF !important;
	}

	.page-box {
		padding-top: 590rpx;
	}

	.main {
		padding: 40rpx 30rpx 30rpx;
	}

	.card {
		width: 690rpx;
		background-color: #FFFFFF;
		box-shadow: 0 0 14rpx rgba(0, 0, 0, 0.08);
		border-radius: 12rpx;
		padding: 10rpx 30rpx 30rpx;
		line-height: 2;
		font-size: 32rpx;
	}

	.serial {
		width: 180rpx;
		line-height: 180rpx;
		font-size: 56rpx;
		padding-left: 30rpx;
		color: #0067ca;
	}

	.content {
		padding: 16rpx 0;
		font-size: 30rpx;
	}

	.color {
		color: #00aeef;
		font-weight: 600;
		font-size: 32rpx;
	}
</style>
