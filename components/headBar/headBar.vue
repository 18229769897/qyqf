<template>
	<view style="color: #FFFFFF;">
		<view class="status-bar"></view>
		<view class="head-bar flex align-center justify-between">
			<view>
				<return v-if="!noReturn" :noText="noText" :color="titleColor"></return>
			</view>
			<view :style="{'color':titleColor}" class="flex flex-center pageTitle-box">{{title}}</view>
			<slot />
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		props: {
			noText: {
				type: Boolean,
				default: false,
			},
			noReturn: {
				type: Boolean,
				default: false
			},
			title: {
				type: String,
				default: ""
			},
			titleColor: {
				type: String,
				default: "#FFFFFF"
			},
			addStyle: {
				type: Object,
				default () {
					return {}
				}
			}
		},
		methods: {

		},
		mounted() {
			
		}
	}
</script>

<style>
	.head-bar {
		height: 44px;
		width: 750rpx;
		position: relative;
		padding: 0 25rpx;
	}

	.pageTitle-box {
		position: absolute;
		width: 300rpx;
		text-align: center;
		left: 0;
		right: 0;
		margin-left: auto;
		margin-right: auto;
		font-size: 18px;
	}
</style>
