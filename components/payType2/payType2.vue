<template>
	<view>
		<template v-for="(item,index) in payMode">
			<view class='payItem acea-row row-middle' :class="{on:payType==item.value}" @tap='payItem(index)'
				v-if="list.indexOf(item.value)>-1">
				<view class='name acea-row fx j-center a-center'>
					<image :src="item.img"></image>
					<view>{{item.name}}</view>
				</view>
				<view class='tip'>
					<text>{{item.title}}</text>
					<template>
						<text v-if="item.value == 'balance'">{{userInfo.now_money}}</text>
						<text v-if="item.value == 'integral'">{{userInfo.integral}}</text>
						<text v-if="item.value == 'buy_points'">{{userInfo.buy_points}}</text>
						<text v-if="item.value == 'bean'">{{userInfo.bean}}</text>
						<text v-if="item.value == 'hi_coupon'">{{userInfo.hi_coupon}}</text>
					</template>
				</view>
			</view>
		</template>
	</view>
</template>
<script>
	import { mapGetters } from 'vuex';
	export default {
		name: "payType2",
		props: {
			payType: {
				type: String,
			},
			list: {
				type: Array
			}
		},
		data() {
			return {
				active: -1,
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
						name: "支付宝支付",
						value: 'hwalipay',
						img: "/static/images/alipay.png",
						title: '支付宝支付',
					},
					{
						name: "银行卡支付",
						value: 'sidepay',
						img: "/static/images/bank.png",
						title: '银行卡支付',
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
					},
					{
						name: "混合支付",
						value: 'balance_haiwen',
						img: "/static/images/yue_pay.png",
						title: '余额、嗨票混合支付',
					},
					{
						name: "嗨豆支付",
						value: 'bean',
						img: "/static/images/huanjidou.png",
						title: '余额:',
					},
					{
						name: "嗨券支付",
						value: 'hi_coupon',
						img: "/static/images/haiquan.png",
						title: '余额:',
					}
				]
			}
		},
		computed: {
			...mapGetters(["userInfo"])
		},
		methods: {
			payItem(index) {
				this.$emit("update:payType", this.payMode[index].value);
			},
		}
	}
</script>

<style lang="scss" scoped>
	.payment-top {
		width: 100%;
		height: 350rpx;

		.name {
			font-size: 26rpx;
			color: rgba(255, 255, 255, 0.8);
			margin-top: -38rpx;
			margin-bottom: 30rpx;
		}

		.pic {
			font-size: 32rpx;
			color: #fff;
		}

		.pic-font {
			font-size: 78rpx;
			color: #fff;
		}
	}

	.item .shipping .iconfont {
		font-size: 35rpx;
		color: #707070;
		position: absolute;
		right: 0;
		top: 50%;
		transform: translateY(-50%);
		margin-left: 30rpx;
	}

	.payItem {
		border: 1px solid #eee;
		border-radius: 6rpx;
		height: 86rpx;
		width: 100%;
		box-sizing: border-box;
		margin-top: 20rpx;
		font-size: 28rpx;
		color: #282828;
	}

	.payItem.on {
		border-color: var(--view-theme);
		color: var(--view-theme)
	}

	.payItem .name {
		width: 50%;
		text-align: center;
		border-right: 1px solid #eee;

		image {
			width: 46rpx;
			height: 46rpx;
			margin-right: 12rpx;
		}
	}

	.payItem .name .iconfont {
		width: 44rpx;
		height: 44rpx;
		border-radius: 50%;
		text-align: center;
		line-height: 44rpx;
		color: #fff;
		font-size: 30rpx;
		margin-right: 15rpx;
	}

	.payItem .tip {
		margin-left: 20rpx;
		font-size: 26rpx;
		color: #aaa;
	}
</style>
