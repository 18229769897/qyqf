<template>
	<view class="fx a-center">
		<view class="progress-box">
			<view class="content fx fx-end a-center" :style="{width:value+'%'}">
				
			</view>
		</view>
		<text class="theme-text" style="margin-left: 14rpx;width: 40rpx;">{{value}}%</text>
	</view>
</template>

<script>
	export default {
		name: "progressBar",
		props: {
			value: [String, Number]
		},
		data() {
			return {

			};
		}
	}
</script>

<style lang="scss">
	.progress-box {
		width: 100%;
		height: 12rpx;
		background-color: #EEEEEE;
		border-radius: 30rpx;
	}

	.content {
		height: 100%;
		width: 0%;
		transition: width 0.5s;
		background: $red;
		opacity: 0.8;
		border-radius: 30rpx;
	}
</style>
