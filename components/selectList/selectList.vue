<template>
	<view>
		<view class="payment" :class="{'on':show}">
			<view class="title acea-row row-center-wrapper">
				<text>{{title}}</text>
				<text class="iconfont icon-guanbi" @click="close"></text>
			</view>
			<view class="list">
				<template v-for="(item,index) in list">
					<view class="fx a-center item" @click="handlerClick(item)">
						<slot :item="item" />
						<view class="iconfont ml-auto" :class="_value==item[name]?'icon-xuanzhong11 font-num':'icon-weixuan'"></view>
					</view>
				</template>
			</view>
			<view>
				<slot name="bottom" />
			</view>
		</view>
		<view class="mask" @click='close' v-if="show"></view>
	</view>
</template>

<script>
	export default {
		props: {
			title: String,
			model: {
				prop: "value",
				event: "update",
			},
			list: {
				type: Array,
				default: () => []
			},
			show: {
				type: Boolean,
				default: false,
			},
			name: {
				type: String,
				default: "value"
			}
		},
		data() {
			return {};
		},
		computed: {
			_value: {
				get() {
					return this.value;
				},
			}
		},
		methods: {
			handlerClick(item) {
				console.log(item);
				this.$emit("update", item[this.name]);
				setTimeout(() => {
					this.close();
				}, 200)
			},
			close() {
				this.$emit("update:show", false);
			},
		}
	}
</script>

<style scoped lang="scss">
	.payment {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		border-radius: 16rpx 16rpx 0 0;
		background-color: #fff;
		padding-bottom: 20rpx;
		z-index: 900;
		transition: all 0.3s cubic-bezier(0.25, 0.5, 0.5, 0.9);
		transform: translate3d(0, 100%, 0);

		.payMoney {
			font-size: 28rpx;
			color: #333333;
			text-align: center;
			margin-top: 50rpx;

			.font-color {
				margin-left: 10rpx;

				.money {
					font-size: 40rpx;
				}
			}
		}

		.button {
			width: 690rpx;
			height: 90rpx;
			border-radius: 45rpx;
			color: #FFFFFF;
			margin: 20rpx auto 0 auto;
		}
	}

	.payment.on {
		transform: translate3d(0, 0, 0);
	}

	.payment .title {
		text-align: center;
		height: 123rpx;
		font-size: 32rpx;
		color: #282828;
		font-weight: bold;
		padding-right: 30rpx;
		margin-left: 30rpx;
		position: relative;
		border-bottom: 1rpx solid #eee;
	}

	.payment .title .iconfont {
		position: absolute;
		right: 30rpx;
		top: 50%;
		transform: translateY(-50%);
		font-size: 38rpx;
		color: #8a8a8a;
		font-weight: normal;
	}

	.payment .item {
		border-bottom: 1rpx solid #eee;
		height: 110rpx;
		margin-left: 30rpx;
		padding-right: 30rpx;
	}

	.list .item:last-of-type {
		border-bottom: none;
	}

	.payment .item .left {
		width: 610rpx;
	}

	.payment .item .left .text {
		width: 540rpx;
	}

	.payment .item .left .text .name {
		font-size: 32rpx;
		color: #282828;
	}

	.payment .item .left .text .info {
		font-size: 24rpx;
		color: #999;
	}

	.payment .item .left .text .info .money {
		color: #ff9900;
	}

	.payment .item .left .iconfont {
		font-size: 45rpx;
		color: #09bb07;
	}

	.payment .item .left .iconfont.icon-zhifubao {
		color: #00aaea;
	}

	.payment .item .left .iconfont.icon-yuezhifu {
		color: #ff9900;
	}

	.payment .item .left .iconfont.icon-yuezhifu1 {
		color: #eb6623;
	}

	.payment .item .iconfont {
		font-size: 40rpx;
		color: #ccc;
	}
</style>
