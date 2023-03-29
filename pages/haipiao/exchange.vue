<template>
	<view>
		<view class="header">
			<view class="status-bar-24"></view>
			<view class="fx a-center header-title">
				<uni-icons type="back" size="24" color="#524e4d" @click="back"></uni-icons>
				<view class="title fx fx-center fz_32 bold">嗨票兑换</view>
			</view>
		</view>
		<view class="fill-box"></view>
		<view class="floor"></view>
		<view class="main">
			<view class="fx a-center form-item">
				<text>账　　号</text>
				<view class="ml-auto input-box">
					<input type="number" v-model="phone" placeholder="请填写您的手机号">
				</view>
			</view>
			<view class="fx a-center form-item">
				<text>姓　　名</text>
				<view class="ml-auto input-box">
					<input type="text" v-model="name" placeholder="请填写您的姓名">
				</view>
			</view>
			<view class="fx a-center form-item">
				<text>兑换数量</text>
				<view class="ml-auto input-box">
					<input type="number" v-model="number" placeholder="请填写兑换数量">
				</view>
			</view>
			<view class="fz_28 mt-2">当前账号嗨票余额：{{userInfo.haiwen}}</view>

			<view class="btn" @click="commit">确认提交</view>
			<pay2 :show.sync="show" @finish="$emit(`finish`,$event)" @close="$off(`finish`)" ref="pay2"></pay2>
		</view>
	</view>
</template>

<script>
	import { mapGetters } from "vuex";
	import { hiCouponExchangeApi } from "@/api/user.js";
	export default {
		data() {
			return {
				phone: "",
				name: "",
				number: "",
				show: false
			}
		},
		computed: {
			...mapGetters(["userInfo"])
		},
		methods: {
			commit() {
				if (!/^1\d{10}$/.test(this.phone)) return this.$msg.fail("请输入正确的手机号码");
				if (!this.name) return this.$msg.fail("请输入姓名");
				if (!this.number) return this.$msg.fail("请输入兑换数量");

				if (Number(this.number) > Number(this.userInfo.haiwen)) return this.$msg.fail("嗨票余额不足");

				this.show = true;
				this.$on("finish", async (pwd) => {
					let params = {
						phone: this.phone,
						name: this.name,
						number: this.number,
						pwd
					}

					try {
						let { message } = await hiCouponExchangeApi(params);
						this.$store.dispatch("USERINFO");
						this.$msg.succ(message, () => {
							this.show = false;
						});
					} catch (e) {
						return this.$msg.fail(e);
					} finally {
						this.$refs.pay2.offLock();
					}

				})
			}
		}
	}
</script>

<style>
	page {
		background-color: #fff8f8 !important;
	}
</style>

<style scoped lang="scss">
	.header {
		width: 750rpx;
		position: fixed;
		z-index: 10;
		background-color: #fff8f8;

		.header-title {
			height: 50px;
			padding: 0 30rpx;
			position: relative;

			.title {
				position: absolute;
				width: 200rpx;
				left: 0;
				right: 0;
				margin: 0 auto;
				color: #595758;
			}
		}
	}

	.fill-box {
		/* #ifdef APP-PLUS */
		height: calc(50px + var(--status-bar-height));
		/* #endif */

		/* #ifdef H5 */
		height: calc(50px + 24px);
		/* #endif */
	}

	.floor {
		width: 750rpx;
		height: 588rpx;
		background-image: url("/static/images/hpdh-banner.png");
		background-size: 100%;
		background-repeat: no-repeat;
		position: relative;
	}

	.main {
		padding: 100rpx 72rpx 30rpx 72rpx;

		.form-item+.form-item {
			margin-top: 40rpx;
		}

		.input-box {
			flex: 1;
			height: 82rpx;
			border-radius: 100px;
			border: 1rpx solid #eeeeee;
			background-color: #fff;
			display: flex;
			align-items: center;
			padding-left: 30rpx;
			margin-left: 32rpx;
		}

		.btn {
			width: 380rpx;
			height: 72rpx;
			background-image: linear-gradient(to right, #c30d23, #ea5414);
			color: #fff;
			font-size: 40rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			border-radius: 100px;
			margin-left: auto;
			margin-right: auto;
			margin-top: 80rpx;
			letter-spacing: 10rpx;
		}
	}
</style>
