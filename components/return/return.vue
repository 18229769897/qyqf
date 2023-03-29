<template>
	<view class="return-box flex align-center" @click="back" :style="{color:color}">
		<uni-icons type="back" size="24" :color="color"></uni-icons>
		<view style="font-size: 17px;margin: 0 0 3rpx -4rpx;" v-if="!noText">返回</view>
	</view>
</template>

<script>
	export default {
		name: "return",
		props: {
			noText: {
				type: Boolean,
				default: false
			},
			color: {
				type: String,
				default: "#FFFFFF"
			}
		},
		methods: {
			back() {
				uni.navigateBack({})
			}
		}
	}
</script>

<style>
	.return-box {
		line-height: 1;
	}
</style>
