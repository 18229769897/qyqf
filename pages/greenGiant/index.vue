<template>
	<view class="page-box">
		<view class="header px-3">
			<view class="status-bar-24"></view>
			<view class="back-box fx-center" @click="back">
				<uni-icons type="back" size="22" color="#fff"></uni-icons>
			</view>
		</view>
		<view style="height: 712rpx;"></view>
		<view class="btns fx a-center j-center">
			<view class="btn" :class="{'active':index==1}" @click="index=1">
				<view class="fz_36 bold">小巨人特权</view>
				<view class="fz_26 mt-1 sub-title">{{index==1?"享专属特权":"点击了解特权"}}</view>
			</view>
			<view class="btn" style="margin-left: 36rpx;" :class="{'active':index==2}" @click="$msg.fail(`暂未开放`)">
				<view class="fz_36 bold">巨人家族特权</view>
				<view class="fz_26 mt-1 sub-title">{{index==2?"享专属特权":"点击了解特权"}}</view>
			</view>
		</view>

		<view class="main fx fx-end text-white">
			<view class="mini-juren-box" v-if="index==1">
				<view class="container fx a-center">
					<view class="btn1 flex_1" @click="show3 = true"></view>
					<view class="box fx fx-col fx-center" @click="selectPayType">
						<view class="fz_36 bold">立即开通</view>
						<text class="fz_27">优惠价￥980/年</text>
					</view>
				</view>
			</view>
			<view class="juren-box fx a-center" v-else>
				<view class="box fx fx-col fx-center" @click="selectPayType">
					<view class="fz_36 bold">立即开通</view>
					<text class="fz_27">优惠价￥980/年</text>
				</view>
			</view>
		</view>
		<payType4 :show.sync="show" :list="[`balance`]" :payType.sync="payType" totalPrice="980" @finish="inputPayPwd"></payType4>
		<pay2 :show.sync="show2" @finish="$emit(`finish`,$event)" @close="$off(`finish`)" ref="pay2"></pay2>

		<tui-drawer mode="bottom" :visible="show3" backgroundColor="transparent">
			<view class="drawer-box">
				<view class="px-3 text-theme fz_30" style="text-align: right;" @click="phone='';show3 = false">取消</view>
				<tui-input placeholder="输入手机号码" v-model="phone"></tui-input>
				<view class="px-3 mt-5">
					<view class="btn-theme" @click="confirm">确定</view>
				</view>
			</view>
		</tui-drawer>
	</view>
</template>

<script>
	import { buyGreenVipApi } from "@/api/user.js";
	export default {
		data() {
			return {
				index: 1,
				payType: "balance",
				show: false,
				show2: false,
				show3: false,
				type: "",
				phone: "",
			}
		},
		methods: {
			/**
			 * 选择支付方式
			 */
			selectPayType() {
				if (this.index == 1) {
					this.show = true;
					// 后续调用this.inputPayPwd
				} else {
					this.inputPayPwd("balance");
				}
			},

			/**
			 * 输入支付密码
			 */
			inputPayPwd(payType) {
				let params = {
					pay_type: payType,
					type: this.index,
					phone: this.phone
				}
				if (payType == "balance") {
					this.show = false;
					this.show2 = true;
					this.$on("finish", pwd => {
						params.pay_pwd = pwd;
						this.buyGreenVip(params);
					});
				} else {
					this.buyGreenVip(params);
				}
			},

			/**
			 * 提交
			 */
			async buyGreenVip(params) {
				try {
					let { message, data } = await buyGreenVipApi(params);
					let jsConfig = data.result.config;
					if (params.pay_type == "weixin") {
						await this.appPay(jsConfig, params.pay_type);
					}
					this.$store.dispatch("USERINFO");
					this.$msg.succ(message, () => {
						this.show = false;
						this.show2 = false;
						uni.switchTab({
							url: "/pages/user/index"
						})
					});
				} catch (e) {
					return this.$msg.fail(e);
				} finally {
					this.$refs.pay2.offLock();
				}
			},

			confirm() {
				if (!this.phone || !(/^1\d{10}$/.test(this.phone))) return this.$msg.fail("请输入正确的手机号码");
				this.show3 = false;
			},
		}
	}
</script>

<style scoped>
	.page-box {
		min-height: 100vh;
		background-image: url("./images/bg.png");
		background-size: 750rpx 1620rpx;
		background-repeat: no-repeat;
		background-color: #618e79;
	}
	
	.header{
		position: fixed;
		left:0;
		right: 0;
		z-index: 2;
	}
	
	.back-box {
		width: 60rpx;
		height: 60rpx;
		border-radius: 50%;
		background-color: rgba(0, 0, 0, 0.5);
	}
	

	.btns {
		height: 135rpx;
		margin-top: -54rpx;
	}


	.btn {
		width: 315rpx;
		height: 135rpx;
		background-image: url("./images/button.png");
		background-size: cover;
		background-repeat: no-repeat;
		color: #999999;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.btn.active {
		background-image: url("./images/button-active.png");
		color: #29493e;
	}

	.btn .sub-title {
		position: relative;
	}

	.btn .sub-title::before {
		content: "";
		display: block;
		background-color: #999999;
		height: 1px;
		width: 4px;
		position: absolute;
		top: 50%;
		left: -5px;
	}

	.btn .sub-title::after {
		content: "";
		display: block;
		background-color: #999999;
		height: 1px;
		width: 4px;
		position: absolute;
		top: 50%;
		right: -5px;
	}

	.btn.active .sub-title::before {
		content: "";
		display: block;
		background-color: #29493e;
		height: 1px;
		width: 4px;
		position: absolute;
		top: 50%;
		left: -5px;
	}

	.btn.active .sub-title::after {
		content: "";
		display: block;
		background-color: #29493e;
		height: 1px;
		width: 4px;
		position: absolute;
		top: 50%;
		right: -5px;
	}

	.main {
		margin-top: 50rpx;
	}

	.mini-juren-box,
	.juren-box {
		width: 694rpx;
		height: 720rpx;
		background-size: cover;
		background-repeat: no-repeat;
		position: relative;
	}

	.mini-juren-box {
		background-image: url("./images/mini-juren-bg.png");
	}

	.juren-box {
		background-image: url("./images/juren-bg.png");
	}


	.container {
		position: absolute;
		width: 565rpx;
		left: 37rpx;
		bottom: 50rpx;
	}

	.box {
		width: 340rpx;
		height: 104rpx;
	}

	.btn1 {
		height: 104rpx;
	}

	.drawer-box {
		padding: 30rpx 0;
		background-color: #fff;
		border-radius: 20rpx 20rpx 0 0;
	}
</style>
