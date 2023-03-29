<template>
	<view class="w100">
		<view class="realtive" :class="{'head-fixed':isFixed}">
			<view class="status-bar"></view>
			<view class="flex flex-center head-box">
				<view @click="back" class="left">
					<template v-if="!isNotReturn">
						<image v-if="!white" src="./returntag.png" style="width: 34rpx;margin-top: 6rpx;" mode="widthFix"></image>
						<image v-else src="./returntag2.png" style="width: 34rpx;margin-top: 6rpx;" mode="widthFix"></image>
					</template>
				</view>
				<slot name="center">
				</slot>
				<view class="right">
					<slot name="right"></slot>
				</view>
			</view>
		</view>
		<view v-if="isFixed" class="gasket"></view>
	</view>
</template>

<script>
	export default {
		props: {
			white: {
				type: Boolean,
				default: false
			},
			title: String,
			isNotReturn: {
				type: Boolean,
				default: false
			},
			isFixed: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {

			};
		},
		methods: {

		}
	}
</script>

<style>
	.head-box {
		height: 44px;
	}

	.page-title {
		color: #000000;
		font-size: 18px;
		position: relative;
		z-index: 5;
	}

	.left {
		position: absolute;
		left: 36rpx
	}

	.right {
		position: absolute;
		right: 36rpx;
	}

	.gasket {
		height: calc(44px + var(--status-bar-height));
	}

	.head-fixed {
		position: fixed !important;
		top: 0;
		left: 0;
		right: 0;
		z-index: 4;
	}
</style>
