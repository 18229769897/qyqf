<template>
	<view style="line-height: 1;">
		<u-checkbox shape="circle" v-model="checked" active-color="#0f734f" size="32">
			<view style="font-size: 26rpx;" class="flex align-center flex-wrap text-red">
				<text style="color: #333333;">{{text}}</text>
				<slot></slot>
			</view>
		</u-checkbox>
	</view>
</template>

<script>
	export default {
		props: {
			text: {
				type: String,
				default: "我已阅读并同意"
			}
		},
		data() {
			return {
				checked: false,
			};
		}
	}
</script>

<style scoped>

</style>
