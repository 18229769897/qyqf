<template>
	<view class='loadingicon acea-row row-center-wrapper'>
		<text class='loading loading2 iconfont icon-jiazai' v-if="state==1"></text>
		<text class="text">{{text}}</text>
	</view>
</template>

<script>
	export default {
		name: "foot",
		props: {
			state: {
				type: [String, Number],
				default: 0
			},
			text: {
				type: [String, Number],
				default: ""
			}
		},
	}
</script>

<style>
	.loading2 {
		width: auto;
	}
	
	.text{
		color: #606266;
	}
</style>
