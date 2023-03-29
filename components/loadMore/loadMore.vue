<template>
	<view class='loadingicon' :style="{'color':color}">
		<text class='loading iconfont icon-jiazai' v-if="state==1"></text>
		<text>{{text}}</text>
	</view>
</template>

<script>
	export default {
		props: {
			state: {
				type: [String, Number],
				default: 0
			},
			text: {
				type: [String, Number],
				default: ""
			},
			color: {
				type: String,
				default: "#FFFFFF"
			}
		},
	}
</script>

<style>
	@import './iconfont.css';

	@keyframes load {
		from {
			transform: rotate(0)
		}

		to {
			transform: rotate(360deg)
		}
	}

	.loadingicon {
		width: 100%;
		height: 30px;
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: center;
		overflow: hidden;
	}

	.loadingicon .loading {
		animation: load linear 1s infinite;
		font-size: 22px;
	}
</style>
