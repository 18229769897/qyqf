<template>
	<view class="pay-card pay-box">
		<view style="padding: 20rpx 24rpx 12rpx 20rpx;">
			<view>选择支付方式</view>
			<u-radio-group v-model="payTypeValue" active-color="#FB3D49" :wrap="true">
				<template v-for="item in payTypeList">
					<u-radio template :name="item.name" class="pay-item" v-if="list.indexOf(item.name)>-1">
						<view class="fx a-center">
							<image :src="item.img" style="width: 46rpx;height: 46rpx;"></image>
							<view style="margin-left: 16rpx;color: #000000; font-size: 26rpx;">{{item.text}}</view>
						</view>
					</u-radio>
				</template>
			</u-radio-group>
		</view>
	</view>
</template>

<script>
	import { mapGetters } from "vuex";
	export default {
		props: {
			list: Array,
			payType: String
		},
		data() {
			return {
				payTypeList: [
					{ name: "weixin", text: "微信支付", img: "/static/images/wx_pay.png" },
					{ name: "alipay", text: "支付宝支付", img: "/static/images/alipay.png" },
					{ name: "now_money", text: "余额支付", img: "/static/images/yue_pay.png" },
				],
			};
		},
		computed: {
			...mapGetters(["userInfo"]),
			payTypeValue: {
				get() {
					return this.payType
				},
				set(val) {
					this.$emit("update:payType", val)
				}
			}
		}
	}
</script>

<style scoped>
	.pay-card {
		background-color: #FFFFFF;
		margin-left: auto;
		margin-right: auto;
		color: #000000;
	}

	.pay-box {
		margin-top: 30rpx;
	}

	.pay-item {
		height: 90rpx;
	}

	.line {
		background-color: #8f8f8f;
		height: 1px;
		width: 100%;
		margin-top: 40rpx;
	}

	/deep/ .u-radio {
		flex-direction: row-reverse !important;
	}

	/deep/ .u-radio__label {
		flex: 1 !important;
	}

	/deep/ .u-radio-group {
		width: 100%;
	}
</style>
