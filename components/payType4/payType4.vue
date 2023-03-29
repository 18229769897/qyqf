<template>
	<view :style="colorStyle">
		<view class="payment" :class="show ? 'on' : ''">
			<view class="title acea-row row-center-wrapper">
				<text>选择付款方式</text>
				<text class="iconfont icon-guanbi" @click="close"></text>
			</view>
			<template v-for="(item,index) in payMode">
				<view class="item acea-row row-between-wrapper" v-if="list.indexOf(item.value)>-1" :key="index" @click="_payType=item.value">
					<view class="left acea-row row-between-wrapper">
						<image :src="item.img" style="width: 40rpx;" mode="widthFix"></image>
						<view class="text">
							<view class="name">{{item.name}}</view>
							<view class="info" v-if="item.value == 'balance'">
								{{item.title}} <span class="money text-theme">{{ userInfo.now_money }}</span>
							</view>
							<view class="info" v-else>{{item.title}}</view>
						</view>
					</view>
					<view class="iconfont icon-weixuan" :class="{'text-theme icon-xuanzhong11':_payType==item.value}"></view>
				</view>
			</template>
			<view class="payMoney">支付<span class="font-color"><span class="money">{{totalPrice}}</span></span></view>
			<view class="button bg-theme acea-row row-center-wrapper" @click='goPay'>去付款</view>
		</view>
		<view class="mask" @click='close' v-if="show"></view>
	</view>
</template>

<script>
	import colors from '@/mixins/color.js';
	import { mapGetters } from "vuex";
	export default {
		props: {
			list: Array,
			payType: String,
			show: {
				type: Boolean,
				default: false,
			},
			totalPrice: {
				type: [Number, String],
				default: 0
			},
		},
		mixins: [colors],
		data() {
			return {
				formContent: '',
				active: 0,
				number: 0,
				payMode: [{
						name: "微信支付",
						value: 'weixin',
						img: "/static/images/wx_pay.png",
						title: '微信快捷支付'
					},
					{
						name: "支付宝支付",
						value: 'alipay',
						img: "/static/images/alipay.png",
						title: '支付宝支付',
					},
					{
						name: "余额钱包",
						value: 'balance',
						img: "/static/images/yue_pay.png",
						title: '余额:',
					},
					{
						name: "消费积分",
						value: 'integral',
						img: "/static/images/yue_pay.png",
						title: '余额:',
					},
					{
						name: "商品积分",
						value: 'buy_points',
						img: "/static/images/yue_pay.png",
						title: '余额:',
					},
					{
						name: "混合支付",
						value: 'buy_points_and_balance',
						img: "/static/images/yue_pay.png",
						title: '余额、商品积分混合支付',
					}
				]
			};
		},
		computed: {
			...mapGetters(["userInfo"]),
			_payType: {
				get() {
					return this.payType
				},
				set(val) {
					this.$emit("update:payType", val)
				}
			},
		},
		methods: {
			close() {
				this.$emit("update:show", false);
			},
			goPay() {
				this.$emit("finish", this._payType);
			}
		}
	}
</script>

<style scoped lang="scss">
	.bgcolor {
		background-color: var(--view-theme)
	}

	.payment {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		border-radius: 16rpx 16rpx 0 0;
		background-color: #fff;
		padding-bottom: 60rpx;
		z-index: 500;
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
		height: 130rpx;
		margin-left: 30rpx;
		padding-right: 30rpx;
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
