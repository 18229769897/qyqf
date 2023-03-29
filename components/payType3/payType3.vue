<template>
	<view>
		<template v-for="(item,index) in payMode">
			<view class='payItem acea-row row-middle' :class="{on:active==index}" @tap='payItem(index)' :key='index' v-if="list.indexOf(item.value)>-1">
				<view class='name acea-row'>
					<view class='iconfont animated margin-left-xs' :class="[item.icon,item.bgColor,{bounceIn:active==index}]"></view>
					{{item.name}}
				</view>
				<view class='tip'>
					<text>{{item.title}}</text>
					<text v-if="item.field">{{userInfo[item.field]}}</text>
				</view>
			</view>
		</template>
	</view>
</template>
<script>
	import {
		mapGetters
	} from 'vuex';
	import {
		spreadInfo
	} from '@/api/user.js'
	export default {
		name: "payType",
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
				brokerage_price: "",
				payMode: [{
						name: "微信支付",
						title: "微信快捷支付",
						icon: "icon-weixin",
						bgColor: "bg-green",
						value: 'weixin',
					},
					{
						name: "支付宝支付",
						title: "支付宝快捷支付",
						icon: "icon-zhifubao",
						bgColor: "bg-blue",
						value: 'alipay',
					},
					{
						name: "现金钱包",
						title: "可用余额",
						icon: "icon-icon-test",
						bgColor: "bg-orange",
						value: 'now_money',
						field: "now_money",
					},
					{
						name: "红包积分",
						title: "可用余额",
						icon: "icon-icon-test",
						bgColor: "bg-orange",
						value: 'wait_released',
						field: "wait_released",
					},
				]
			}
		},
		computed: {
			...mapGetters(['userInfo']),
		},
		methods: {
			payItem(index) {
				this.active = index;
				let payType = this.payMode[index].value;
				this.$emit("update:payType", payType);
			},
			updateBrokerage() {
				spreadInfo({
					type: 1
				}).then(res => {
					this.brokerage_price = res.data.total_brokerage_price
				});
			}
		},
		mounted() {
			if (this.list.indexOf("brokerage_price") > -1) {
				this.updateBrokerage();
			}
			this.active = this.payMode.findIndex(item => item.value == this.payType);
		},
		watch: {
			payType(val) {
				this.active = this.payMode.findIndex(item => item.value == this.payType);
			}
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
		border-color: #fc5445;
		color: #0f734f;
	}

	.payItem .name {
		width: 50%;
		text-align: center;
		border-right: 1px solid #eee;
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
